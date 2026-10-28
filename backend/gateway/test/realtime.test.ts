import http from "node:http";
import type { AddressInfo } from "node:net";
import { io as connect, type Socket } from "socket.io-client";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { attachRealtime } from "../src/realtime/socket";
import { processScanJob } from "../src/worker/processor";
import { createHarness, JPEG } from "./helpers";

const cleanup: (() => Promise<void> | void)[] = [];
afterEach(async () => {
  while (cleanup.length) await cleanup.pop()!();
});

const next = <T,>(socket: Socket, event: string) => new Promise<T>((resolve) => socket.once(event, resolve));

async function start() {
  const h = await createHarness({ predict: async () => ({ message: "image received. Small autrophy detected with value 40mm²", value: 40 }) });
  const server = http.createServer(h.app);
  const realtime = await attachRealtime(server, { corsOrigins: ["*"], authenticate: h.authenticate, events: h.events });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  cleanup.push(async () => { await realtime.close(); });

  const signup = async (email: string) => {
    const { body } = await request(h.app).post("/auth/signup").send({ firstName: "A", lastName: "B", email, password: "password123" });
    return body.token as string;
  };
  const open = (token?: string) => {
    const socket = connect(url, { auth: { token }, transports: ["websocket"], reconnection: false });
    cleanup.push(() => { socket.close(); });
    return socket;
  };
  return { h, url, signup, open };
}

describe("websocket", () => {
  it("rejects a missing or invalid token", async () => {
    const { open } = await start();
    for (const token of [undefined, "garbage"]) {
      const error = await next<Error>(open(token), "connect_error");
      expect(error.message).toBe("unauthorized");
    }
  });

  it("pushes each result to the owner as it completes, and nothing to anyone else", async () => {
    const { h, signup, open } = await start();
    const ownerToken = await signup("owner@example.com");
    const strangerToken = await signup("stranger@example.com");

    const owner = open(ownerToken);
    const stranger = open(strangerToken);
    await Promise.all([next(owner, "connect"), next(stranger, "connect")]);

    const strangerEvents: unknown[] = [];
    stranger.onAny((event) => strangerEvents.push(event));
    const items: { item: { status: string; result?: { value: number } } }[] = [];
    owner.on("scan:item", (payload) => items.push(payload));
    const batchDone = next<{ batchId: string; status: string; done: number; total: number }>(owner, "scan:batch");

    const res = await request(h.app).post("/scans").set("Authorization", `Bearer ${ownerToken}`).field("model", "detect-atrophy").attach("images", JPEG, "a.jpg").attach("images", JPEG, "b.jpg");
    for (const job of h.queued) await processScanJob(h.processor, job);

    const finished = await batchDone;
    expect(finished).toMatchObject({ batchId: res.body.id, status: "complete", done: 2, total: 2 });
    expect(items.filter((e) => e.item.status === "complete").map((e) => e.item.result?.value)).toEqual([40, 40]);
    expect(strangerEvents).toEqual([]);
  });
});
