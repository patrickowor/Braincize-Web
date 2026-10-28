import request from "supertest";
import { describe, expect, it } from "vitest";
import { createHarness } from "./helpers";

const noInference = { predict: async () => ({ message: "unused" }) };
const account = { firstName: "Ada", lastName: "Obi", email: "Ada@Example.com", password: "correct horse" };

async function signedUp() {
  const h = await createHarness(noInference);
  const { body } = await request(h.app).post("/auth/signup").send(account).expect(201);
  return { h, token: body.token as string };
}

describe("auth", () => {
  it("signs up, then logs in with the email as username, case-insensitively", async () => {
    const { h, token } = await signedUp();
    expect(token).toBeTruthy();

    const login = await request(h.app).post("/auth/login").send({ username: "ada@example.com", password: account.password }).expect(200);
    expect(login.body.user).toMatchObject({ name: "Ada Obi", email: "ada@example.com" });
    expect(login.body.user.passwordHash).toBeUndefined();
  });

  it("rejects duplicates, bad passwords and unknown users", async () => {
    const { h } = await signedUp();
    await request(h.app).post("/auth/signup").send(account).expect(409);
    await request(h.app).post("/auth/login").send({ username: account.email, password: "nope" }).expect(401);
    await request(h.app).post("/auth/login").send({ username: "ghost@example.com", password: "nope" }).expect(401);
    await request(h.app).post("/auth/signup").send({ ...account, email: "x@y.com", password: "short" }).expect(400);
  });

  it("serves /me with a token only, and logout revokes the token", async () => {
    const { h, token } = await signedUp();
    await request(h.app).get("/auth/me").expect(401);
    await request(h.app).get("/auth/me").set("Authorization", "Bearer garbage").expect(401);
    const me = await request(h.app).get("/auth/me").set("Authorization", `Bearer ${token}`).expect(200);
    expect(me.body.email).toBe("ada@example.com");

    await request(h.app).post("/auth/logout").set("Authorization", `Bearer ${token}`).expect(204);
    await request(h.app).get("/auth/me").set("Authorization", `Bearer ${token}`).expect(401);
  });
});

describe("content routes", () => {
  it("serves the seeded FAQ and research lists", async () => {
    const h = await createHarness(noInference);
    const faq = await request(h.app).get("/faq").expect(200);
    expect(faq.body).toHaveLength(4);
    expect(faq.body[0]).toHaveProperty("question");
    const research = await request(h.app).get("/research").expect(200);
    expect(research.body).toHaveLength(5);
    await request(h.app).get("/research/skull-base-lesions").expect(200);
    await request(h.app).get("/research/nope").expect(404);
  });

  it("accepts contact messages (optional fields empty) and repeated newsletter sign-ups", async () => {
    const h = await createHarness(noInference);
    await request(h.app).post("/contact").send({ name: "A", email: "a@b.co", address: "", phone: "", message: "hi" }).expect(200, { ok: true });
    await request(h.app).post("/contact").send({ name: "A", email: "bad", message: "hi" }).expect(400);
    await request(h.app).post("/newsletter/subscribe").send({ email: "a@b.co" }).expect(200, { ok: true });
    await request(h.app).post("/newsletter/subscribe").send({ email: "A@B.co" }).expect(200, { ok: true });
  });
});
