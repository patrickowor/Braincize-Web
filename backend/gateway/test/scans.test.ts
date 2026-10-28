import request from "supertest";
import { describe, expect, it } from "vitest";
import { UpstreamError, type Inference } from "../src/inference/models";
import { processScanJob } from "../src/worker/processor";
import { createHarness, JPEG, PNG } from "./helpers";

const ok: Inference = { predict: async () => ({ message: "image received. Medium autrophy detected with value 80mm²", value: 80 }) };

async function setup(inference: Inference = ok, email = "ada@example.com") {
  const h = await createHarness(inference);
  const { body } = await request(h.app).post("/auth/signup").send({ firstName: "A", lastName: "B", email, password: "password123" });
  const auth = { Authorization: `Bearer ${body.token}` };
  const upload = (model: string, files: [string, Buffer][]) => {
    const req = request(h.app).post("/scans").set(auth).field("model", model);
    files.forEach(([name, data]) => req.attach("images", data, name));
    return req;
  };
  return { h, auth, upload };
}

describe("POST /scans", () => {
  it("requires sign-in, a known model, and real JPEG/PNG bytes", async () => {
    const { h, upload } = await setup();
    await request(h.app).post("/scans").expect(401);
    await upload("made-up", [["a.jpg", JPEG]]).expect(400);
    await upload("detect-atrophy", []).expect(400);
    const bad = await upload("detect-atrophy", [["a.jpg", JPEG], ["notes.jpg", Buffer.from("hello world")]]).expect(400);
    expect(bad.body.details.rejected).toEqual(["notes.jpg"]);
    expect(h.queued).toHaveLength(0);
    expect(h.storage.size()).toBe(0);
  });

  it("enforces the file count and size limits", async () => {
    const { upload } = await setup();
    const six = Array.from({ length: 6 }, (_, i): [string, Buffer] => [`${i}.png`, PNG]);
    await upload("detect-atrophy", six).expect(400);
    await upload("detect-atrophy", [["big.png", Buffer.concat([PNG, Buffer.alloc(2048)])]]).expect(413);
  });

  it("queues one job per image and answers 202 with the batch in upload order", async () => {
    const { h, upload } = await setup();
    const res = await upload("measure-atrophy-yolo", [["one.jpg", JPEG], ["two.png", PNG]]).expect(202);
    expect(res.body).toMatchObject({ model: "measure-atrophy-yolo", status: "processing", total: 2, done: 0 });
    expect(res.body.items.map((i: { name: string; status: string }) => [i.name, i.status])).toEqual([["one.jpg", "pending"], ["two.png", "pending"]]);
    expect(h.queued.map((j) => j.contentType)).toEqual(["image/jpeg", "image/png"]);
    expect(h.storage.size()).toBe(2);
  });
});

describe("processing", () => {
  it("analyses every image, streams events, deletes the files and completes the batch", async () => {
    const { h, auth, upload } = await setup();
    const { body: batch } = await upload("measure-atrophy-v1", [["a.jpg", JPEG], ["b.png", PNG]]).expect(202);

    for (const job of h.queued) await processScanJob(h.processor, job);

    const done = await request(h.app).get(`/scans/${batch.id}`).set(auth).expect(200);
    expect(done.body).toMatchObject({ status: "complete", done: 2, total: 2 });
    expect(done.body.items.every((i: { status: string; result: { value: number } }) => i.status === "complete" && i.result.value === 80)).toBe(true);
    expect(h.storage.size()).toBe(0);

    const kinds = h.published.map((e) => (e.type === "scan:item" ? `item:${e.item.status}` : "batch"));
    expect(kinds).toEqual(["item:processing", "item:complete", "item:processing", "item:complete", "batch"]);
    expect(h.published.every((e) => e.userId === done.body.userId)).toBe(true);
  });

  it("passes Python's own 'not an MRI' style answers through as results", async () => {
    const { h, auth, upload } = await setup({ predict: async () => ({ message: "image received. image is not a brain mri" }) });
    const { body: batch } = await upload("detect-atrophy", [["a.jpg", JPEG]]).expect(202);
    await processScanJob(h.processor, h.queued[0]!);
    const res = await request(h.app).get(`/scans/${batch.id}`).set(auth);
    expect(res.body.items[0]).toMatchObject({ status: "complete", result: { message: "image received. image is not a brain mri" } });
  });

  it("retries an unreachable service and then succeeds", async () => {
    let calls = 0;
    const flaky: Inference = {
      predict: async () => {
        if (++calls < 3) throw new UpstreamError("down", true);
        return { message: "fine", value: 1 };
      },
    };
    const { h, auth, upload } = await setup(flaky);
    const { body: batch } = await upload("detect-atrophy", [["a.jpg", JPEG]]).expect(202);
    await processScanJob(h.processor, h.queued[0]!);
    expect(calls).toBe(3);
    expect((await request(h.app).get(`/scans/${batch.id}`).set(auth)).body.items[0].status).toBe("complete");
  });

  it("records an error after the attempts run out, without retrying non-retryable failures", async () => {
    let calls = 0;
    const dead: Inference = { predict: async () => { calls++; throw new UpstreamError("service is down", true); } };
    const { h, auth, upload } = await setup(dead);
    const { body: batch } = await upload("detect-atrophy", [["a.jpg", JPEG]]).expect(202);
    await processScanJob(h.processor, h.queued[0]!);
    expect(calls).toBe(3);
    const res = await request(h.app).get(`/scans/${batch.id}`).set(auth);
    expect(res.body).toMatchObject({ status: "complete", items: [{ status: "error", error: "service is down" }] });

    calls = 0;
    const bad: Inference = { predict: async () => { calls++; throw new UpstreamError("garbled", false); } };
    const second = await setup(bad);
    await second.upload("detect-atrophy", [["a.jpg", JPEG]]).expect(202);
    await processScanJob(second.h.processor, second.h.queued[0]!);
    expect(calls).toBe(1);
  });

  it("ignores a redelivered job and a job whose batch has expired", async () => {
    const { h, upload } = await setup();
    const { body: batch } = await upload("detect-atrophy", [["a.jpg", JPEG]]).expect(202);
    const job = h.queued[0]!;
    await processScanJob(h.processor, job);
    const before = h.published.length;
    await processScanJob(h.processor, job);
    expect(h.published).toHaveLength(before);

    await h.jobs.deleteBatch(batch.id);
    await h.storage.save("ghost/file", Buffer.from("x"));
    await processScanJob(h.processor, { ...job, fileKey: "ghost/file" });
    expect(h.storage.size()).toBe(0);
  });
});

describe("batch access", () => {
  it("lists only the caller's batches and hides other users' batches", async () => {
    const mine = await setup(ok, "me@example.com");
    const { body: batch } = await mine.upload("detect-atrophy", [["a.jpg", JPEG]]).expect(202);

    const { body: other } = await request(mine.h.app).post("/auth/signup").send({ firstName: "O", lastName: "T", email: "other@example.com", password: "password123" });
    const otherAuth = { Authorization: `Bearer ${other.token}` };

    await request(mine.h.app).get(`/scans/${batch.id}`).set(otherAuth).expect(404);
    expect((await request(mine.h.app).get("/scans").set(otherAuth)).body).toEqual([]);
    const list = await request(mine.h.app).get("/scans").set(mine.auth).expect(200);
    expect(list.body.map((b: { id: string }) => b.id)).toEqual([batch.id]);
    expect(list.body[0].items).toBeUndefined();
  });

  it("cleans up and answers 503 when the queue is down", async () => {
    const { h } = await setup();
    h.queue.publish = async () => { throw new Error("broker offline"); };
    const { body } = await request(h.app).post("/auth/login").send({ username: "ada@example.com", password: "password123" });
    const res = await request(h.app).post("/scans").set("Authorization", `Bearer ${body.token}`).field("model", "detect-atrophy").attach("images", JPEG, "a.jpg");
    expect(res.status).toBe(503);
    expect(h.storage.size()).toBe(0);
    expect(await h.jobs.listBatches((await h.db.users.findByEmail("ada@example.com"))!.id, 10)).toEqual([]);
  });
});
