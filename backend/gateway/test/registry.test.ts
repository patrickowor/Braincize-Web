import request from "supertest";
import { describe, expect, it } from "vitest";
import { applyRegistrySeed } from "../src/registry/apply";
import { pythonRegistrySeed } from "../src/registry/pythonModels";
import { ADMIN_EMAIL, createHarness, JPEG } from "./helpers";

const noInference = { predict: async () => ({ message: "unused" }) };

async function setup() {
  const h = await createHarness(noInference);
  const join = async (email: string) => {
    const { body } = await request(h.app).post("/auth/signup").send({ firstName: "A", lastName: "B", email, password: "password123" });
    return { Authorization: `Bearer ${body.token}` };
  };
  return { h, admin: await join(ADMIN_EMAIL), user: await join("user@example.com") };
}

const newModel = { id: "lung-ct", name: "Lung CT", url: "http://lung.test/predict", categoryId: "lungscan" };

describe("reading the registry", () => {
  it("requires sign-in", async () => {
    const { h } = await setup();
    for (const path of ["/categories", "/categories/brainscan", "/models", "/models/detect-atrophy"]) {
      await request(h.app).get(path).expect(401);
    }
  });

  it("lists categories with how many models a user can use", async () => {
    const { h, user } = await setup();
    const { body } = await request(h.app).get("/categories").set(user).expect(200);
    expect(body.map((c: { id: string; modelCount: number }) => [c.id, c.modelCount])).toEqual([["brainscan", 3], ["lungscan", 0]]);
    expect(body[0]).toMatchObject({ name: "Brain Scan", icon: "brain", inputLabel: "Image & Video Analysis" });
  });

  it("gives users only the fields they need, in order, and hides internal models", async () => {
    const { h, user } = await setup();
    const { body } = await request(h.app).get("/categories/brainscan").set(user).expect(200);
    expect(body.models.map((m: { id: string }) => m.id)).toEqual(["detect-atrophy", "measure-atrophy-v1", "measure-atrophy-yolo"]);
    expect(body.models[2]).toEqual({
      id: "measure-atrophy-yolo", name: "Detect & Measure Atrophy Size", version: "Version 2", type: "Yolo",
      description: expect.any(String), categoryId: "brainscan", accepts: ["image/jpeg", "image/png"], position: 2,
    });

    const all = await request(h.app).get("/models").set(user).expect(200);
    expect(all.body).toHaveLength(3);
    expect((await request(h.app).get("/models?category=lungscan").set(user)).body).toEqual([]);
    await request(h.app).get("/models/is-mri").set(user).expect(404);
    await request(h.app).get("/categories/nope").set(user).expect(404);
  });

  it("shows admins everything, including urls, internal and disabled models", async () => {
    const { h, admin } = await setup();
    const all = await request(h.app).get("/models").set(admin).expect(200);
    expect(all.body.map((m: { id: string }) => m.id)).toContain("is-mri");
    const one = await request(h.app).get("/models/detect-atrophy").set(admin).expect(200);
    expect(one.body).toMatchObject({ url: "https://brain.test:4000/predictmid/", bodyMode: "raw", insecureTls: true });
    expect(one.body.responses.length).toBeGreaterThan(0);
    expect((await request(h.app).get("/auth/me").set(admin)).body.isAdmin).toBe(true);
  });
});

describe("changing the registry", () => {
  it("is for admins only", async () => {
    const { h, user } = await setup();
    await request(h.app).post("/models").set(user).send(newModel).expect(403);
    await request(h.app).patch("/models/detect-atrophy").set(user).send({ enabled: false }).expect(403);
    await request(h.app).delete("/models/detect-atrophy").set(user).expect(403);
    await request(h.app).post("/categories").set(user).send({ id: "x", name: "X" }).expect(403);
    await request(h.app).put("/categories/brainscan/models").set(user).send({ modelIds: [] }).expect(403);
    await request(h.app).post("/models").send(newModel).expect(401);
  });

  it("creates a category, adds a model to it with defaults, and users then see it", async () => {
    const { h, admin, user } = await setup();
    const created = await request(h.app).post("/categories").set(admin).send({ id: "Kidney-Scan", name: "Kidney Scan", icon: "kidney" }).expect(201);
    expect(created.body).toMatchObject({ id: "kidney-scan", description: "", inputLabel: null, modelCount: 0 });
    await request(h.app).post("/categories").set(admin).send({ id: "kidney-scan", name: "Again" }).expect(409);

    const model = await request(h.app).post("/models").set(admin).send({ id: "kidney-ai", name: "Kidney AI", url: "http://k.test/p", categoryId: "kidney-scan" }).expect(201);
    expect(model.body).toMatchObject({ bodyMode: "raw", fileField: null, accepts: ["image/jpeg", "image/png"], enabled: true, internal: false, headers: {}, version: null });
    await request(h.app).post("/models").set(admin).send({ id: "kidney-ai", name: "Dup", url: "http://k.test/p" }).expect(409);

    const list = await request(h.app).get("/categories/kidney-scan/models").set(user).expect(200);
    expect(list.body.map((m: { id: string }) => m.id)).toEqual(["kidney-ai"]);
    expect(list.body[0].url).toBeUndefined();
  });

  it("defaults a multipart field name and validates what it is given", async () => {
    const { h, admin } = await setup();
    const ok = await request(h.app).post("/models").set(admin).send({ ...newModel, bodyMode: "multipart" }).expect(201);
    expect(ok.body.fileField).toBe("file");

    const bad = (patch: object) => request(h.app).post("/models").set(admin).send({ ...newModel, id: "bad", ...patch });
    await bad({ url: "ftp://x.test/p" }).expect(400);
    await bad({ url: "not a url" }).expect(400);
    await bad({ id: "Not A Slug!" }).expect(400);
    await bad({ accepts: ["video/mp4"] }).expect(400);
    await bad({ accepts: [] }).expect(400);
    await bad({ headers: { "Content-Type": "x" } }).expect(400);
    await bad({ categoryId: "nope" }).expect(400);
    await bad({ timeoutMs: 5 }).expect(400);
  });

  it("patches only the fields given", async () => {
    const { h, admin } = await setup();
    const patched = await request(h.app).patch("/models/detect-atrophy").set(admin).send({ name: "Renamed", headers: { "X-Api-Key": "k" } }).expect(200);
    expect(patched.body).toMatchObject({ name: "Renamed", headers: { "X-Api-Key": "k" }, url: "https://brain.test:4000/predictmid/", insecureTls: true, position: 0, categoryId: "brainscan" });

    const toMultipart = await request(h.app).patch("/models/detect-atrophy").set(admin).send({ bodyMode: "multipart" }).expect(200);
    expect(toMultipart.body.fileField).toBe("file");
    const back = await request(h.app).patch("/models/detect-atrophy").set(admin).send({ bodyMode: "raw" }).expect(200);
    expect(back.body.fileField).toBeNull();

    await request(h.app).patch("/models/detect-atrophy").set(admin).send({ url: "nope" }).expect(400);
    await request(h.app).patch("/models/detect-atrophy").set(admin).send({ categoryId: "nope" }).expect(400);
    await request(h.app).patch("/models/ghost").set(admin).send({ name: "x" }).expect(404);

    const cat = await request(h.app).patch("/categories/lungscan").set(admin).send({ inputLabel: "Image Analysis" }).expect(200);
    expect(cat.body).toMatchObject({ name: "Lung Scan", icon: "lungs", inputLabel: "Image Analysis" });
  });

  it("disabling a model hides it from users but not from admins", async () => {
    const { h, admin, user } = await setup();
    await request(h.app).patch("/models/measure-atrophy-v1").set(admin).send({ enabled: false }).expect(200);
    expect((await request(h.app).get("/models").set(user)).body.map((m: { id: string }) => m.id)).toEqual(["detect-atrophy", "measure-atrophy-yolo"]);
    await request(h.app).get("/models/measure-atrophy-v1").set(user).expect(404);
    expect((await request(h.app).get("/categories").set(user)).body[0].modelCount).toBe(2);
    await request(h.app).get("/models/measure-atrophy-v1").set(admin).expect(200);
  });

  it("replaces a category's model list, in order, detaching the rest", async () => {
    const { h, admin, user } = await setup();
    await request(h.app).post("/models").set(admin).send(newModel).expect(201);

    const res = await request(h.app).put("/categories/brainscan/models").set(admin).send({ modelIds: ["measure-atrophy-yolo", "lung-ct", "detect-atrophy"] }).expect(200);
    expect(res.body.models.map((m: { id: string }) => m.id)).toEqual(["measure-atrophy-yolo", "lung-ct", "detect-atrophy"]);

    const brain = await request(h.app).get("/categories/brainscan/models").set(user);
    expect(brain.body.map((m: { id: string }) => m.id)).toEqual(["measure-atrophy-yolo", "lung-ct", "detect-atrophy"]);
    expect((await request(h.app).get("/categories/lungscan/models").set(user)).body).toEqual([]);
    const left = await request(h.app).get("/models/measure-atrophy-v1").set(admin);
    expect(left.body.categoryId).toBeNull();

    await request(h.app).put("/categories/brainscan/models").set(admin).send({ modelIds: ["ghost"] }).expect(400);
    await request(h.app).put("/categories/brainscan/models").set(admin).send({ modelIds: ["detect-atrophy", "detect-atrophy"] }).expect(400);
    await request(h.app).put("/categories/ghost/models").set(admin).send({ modelIds: [] }).expect(404);
  });

  it("moves a model between categories with PATCH", async () => {
    const { h, admin, user } = await setup();
    await request(h.app).patch("/models/detect-atrophy").set(admin).send({ categoryId: "lungscan" }).expect(200);
    expect((await request(h.app).get("/categories/lungscan/models").set(user)).body.map((m: { id: string }) => m.id)).toEqual(["detect-atrophy"]);
  });

  it("refuses to delete a category that still has models, then deletes it once empty", async () => {
    const { h, admin } = await setup();
    await request(h.app).delete("/categories/brainscan").set(admin).expect(409);
    await request(h.app).delete("/categories/lungscan").set(admin).expect(204);
    await request(h.app).delete("/categories/lungscan").set(admin).expect(404);
    await request(h.app).delete("/models/detect-atrophy").set(admin).expect(204);
    await request(h.app).delete("/models/detect-atrophy").set(admin).expect(404);
  });
});

describe("scans use the registry", () => {
  const upload = (h: Awaited<ReturnType<typeof setup>>["h"], auth: Record<string, string>, model: string, name = "a.jpg") =>
    request(h.app).post("/scans").set(auth).field("model", model).attach("images", JPEG, name);

  it("rejects unknown, internal and disabled models alike", async () => {
    const { h, admin, user } = await setup();
    await upload(h, user, "ghost").expect(400);
    await upload(h, admin, "is-mri").expect(400);
    await request(h.app).patch("/models/detect-atrophy").set(admin).send({ enabled: false });
    await upload(h, user, "detect-atrophy").expect(400);
    expect(h.queued).toHaveLength(0);
  });

  it("checks files against what the model accepts", async () => {
    const { h, admin, user } = await setup();
    await request(h.app).patch("/models/detect-atrophy").set(admin).send({ accepts: ["image/png"] }).expect(200);
    const res = await upload(h, user, "detect-atrophy").expect(400);
    expect(res.body.details).toEqual({ rejected: ["a.jpg"], accepts: ["image/png"] });
    await upload(h, user, "measure-atrophy-v1").expect(202);
  });

  it("runs a newly registered model through the queue and the worker", async () => {
    const { h, admin, user } = await setup();
    await request(h.app).post("/models").set(admin).send(newModel).expect(201);
    const { body: batch } = await upload(h, user, "lung-ct").expect(202);
    expect(batch.model).toBe("lung-ct");
    expect(h.queued[0]!.model).toBe("lung-ct");
  });
});

describe("seeding", () => {
  const seed = pythonRegistrySeed({ brainUrl: "https://b.test:4000", braincizeUrl: "http://y.test:8002", insecureTls: true });

  it("is safe to repeat and never undoes edits, unless forced", async () => {
    const { h, admin } = await setup();
    await request(h.app).patch("/models/detect-atrophy").set(admin).send({ name: "Edited" });

    const again = await applyRegistrySeed(h.db, seed);
    expect(again.created).toEqual([]);
    expect(again.skipped).toHaveLength(6);
    expect((await h.db.models.find("detect-atrophy"))!.name).toBe("Edited");

    const forced = await applyRegistrySeed(h.db, seed, { overwrite: true });
    expect(forced.updated).toHaveLength(6);
    expect((await h.db.models.find("detect-atrophy"))!.name).toBe("Detect Atrophy");
  });
});
