import http from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import type { ModelRecord } from "../src/db/types";
import { createModelInference, UpstreamError } from "../src/inference/models";
import { pythonRegistrySeed } from "../src/registry/pythonModels";
import { JPEG } from "./helpers";

interface Seen { url?: string; type?: string; auth?: string; body?: Buffer }
const servers: http.Server[] = [];
afterEach(() => { servers.splice(0).forEach((s) => s.close()); });

/** Stands in for a Flask service: records the request, then answers with `reply`. */
async function fakeService(reply: (res: http.ServerResponse) => void) {
  const seen: Seen = {};
  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      Object.assign(seen, { url: req.url, type: req.headers["content-type"], auth: req.headers["x-api-key"], body: Buffer.concat(chunks) });
      reply(res);
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  servers.push(server);
  return { seen, url: `http://127.0.0.1:${(server.address() as AddressInfo).port}` };
}

const json = (body: unknown, status = 200) => (res: http.ServerResponse) => {
  res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(body));
};

const client = createModelInference({ timeoutMs: 2000 });

/** A registry model pointing at `url`, starting from one of the seeded Python models. */
function model(url: string, overrides: Partial<ModelRecord> = {}): ModelRecord {
  const base = pythonRegistrySeed({ brainUrl: url, braincizeUrl: url, insecureTls: false }).models[1]!;
  return { ...base, url, createdAt: 0, updatedAt: 0, ...overrides } as ModelRecord;
}

describe("model client", () => {
  it("posts the raw image bytes as the whole body, like the Python scripts expect", async () => {
    const svc = await fakeService(json({ message: "m", value: 7 }));
    expect(await client.predict(model(`${svc.url}/predictsz/`), JPEG, "image/jpeg")).toEqual({ message: "m", value: 7 });
    expect(svc.seen.url).toBe("/predictsz/");
    expect(svc.seen.type).toBe("image/jpeg");
    expect(svc.seen.body?.equals(JPEG)).toBe(true);
  });

  it("sends the stored headers, and posts a form with the file under the configured field in multipart mode", async () => {
    const svc = await fakeService(json({ message: "ok" }));
    await client.predict(model(`${svc.url}/analyse`, { bodyMode: "multipart", fileField: "scan", headers: { "X-Api-Key": "secret" } }), JPEG, "image/jpeg");
    expect(svc.seen.auth).toBe("secret");
    expect(svc.seen.type).toMatch(/^multipart\/form-data; boundary=/);
    const body = svc.seen.body!.toString("latin1");
    expect(body).toContain('name="scan"; filename="image.jpg"');
    expect(body).toContain("Content-Type: image/jpeg");
    expect(svc.seen.body!.includes(JPEG)).toBe(true);
  });

  it("passes every field of the answer through, and works when there is no value (as /predictmid)", async () => {
    const svc = await fakeService(json({ success: true, message: "random", extra: [1] }));
    expect(await client.predict(model(svc.url), JPEG, "image/png")).toEqual({ success: true, message: "random", extra: [1] });
    const bare = await fakeService(json({ message: "image received. Shrinkage detected with a probability of 90%" }));
    expect(await client.predict(model(bare.url), JPEG, "image/png")).toEqual({ message: "image received. Shrinkage detected with a probability of 90%" });
  });

  it("marks 5xx and unreachable as retryable, and 4xx and garbage as final", async () => {
    const down = await fakeService(json({}, 500));
    await expect(client.predict(model(down.url), JPEG, "image/png")).rejects.toMatchObject({ retryable: true });
    await expect(client.predict(model("http://127.0.0.1:1"), JPEG, "image/png")).rejects.toMatchObject({ retryable: true });

    const bad = await fakeService(json({}, 400));
    await expect(client.predict(model(bad.url), JPEG, "image/png")).rejects.toMatchObject({ retryable: false });

    const garbage = await fakeService((res) => { res.writeHead(200).end("<html>not json</html>"); });
    const error = await client.predict(model(garbage.url), JPEG, "image/png").catch((e) => e);
    expect(error).toBeInstanceOf(UpstreamError);
    expect(error.retryable).toBe(false);

    const noMessage = await fakeService(json({ value: 1 }));
    await expect(client.predict(model(noMessage.url), JPEG, "image/png")).rejects.toMatchObject({ retryable: false });
  });

  it("honours a per-model timeout", async () => {
    const slow = await fakeService(() => { /* never answers */ });
    const error = await client.predict(model(slow.url, { timeoutMs: 1000 }), JPEG, "image/png").catch((e) => e);
    expect(error).toMatchObject({ retryable: true });
  });
});

describe("Python seed", () => {
  it("points each model at the route the scripts serve, and keeps /ismri internal", () => {
    const { models, categories } = pythonRegistrySeed({ brainUrl: "https://127.0.0.1:4000", braincizeUrl: "http://127.0.0.1:8002", insecureTls: true });
    expect(Object.fromEntries(models.map((m) => [m.id, m.url]))).toEqual({
      "detect-atrophy": "https://127.0.0.1:4000/predictmid/",
      "measure-atrophy-v1": "https://127.0.0.1:4000/predictsz/",
      "measure-atrophy-yolo": "http://127.0.0.1:8002/predictyolo",
      "is-mri": "http://127.0.0.1:8002/ismri",
    });
    expect(models.filter((m) => m.internal).map((m) => m.id)).toEqual(["is-mri"]);
    expect(models.filter((m) => m.insecureTls).map((m) => m.id)).toEqual(["detect-atrophy", "measure-atrophy-v1"]);
    expect(models.every((m) => m.responses.length > 0)).toBe(true);
    expect(categories.map((c) => c.id)).toEqual(["brainscan", "lungscan"]);
  });
});
