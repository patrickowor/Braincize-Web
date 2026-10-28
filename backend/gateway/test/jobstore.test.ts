import RedisMock from "ioredis-mock";
import type { Redis } from "ioredis";
import { describe, expect, it } from "vitest";
import { createMemoryEventBus } from "../src/events/bus";
import { createRedisEventBus } from "../src/events/bus";
import { createMemoryJobStore } from "../src/jobs/memoryStore";
import { createRedisJobStore } from "../src/jobs/redisStore";
import type { JobStore } from "../src/jobs/store";
import { createRedisRevocations } from "../src/auth/revocations";

const TTL = 48 * 3600;
/**
 * ioredis-mock crashes on every sorted-set read under ioredis 6 (its reply transformer), so the
 * per-user index is tracked on the side and `zrevrange` answers from that. Writes, hashes, TTLs,
 * transactions and pub/sub all run through the mock. A dangling id (batch deleted or expired) is
 * left in the index on purpose: `listBatches` has to skip those anyway.
 */
const redis = () => {
  const mock = new RedisMock() as unknown as Redis;
  const index = new Map<string, Map<string, number>>();
  const zadd = mock.zadd.bind(mock) as (...args: unknown[]) => Promise<number>;
  const track = (key: string, score: number, id: string) => index.set(key, (index.get(key) ?? new Map()).set(id, score));

  mock.zadd = ((key: string, score: number, id: string) => (track(key, score, id), zadd(key, score, id))) as unknown as Redis["zadd"];
  const multi = mock.multi.bind(mock);
  mock.multi = ((...args: unknown[]) => {
    const chain = (multi as (...a: unknown[]) => any)(...args);
    const original = chain.zadd.bind(chain);
    chain.zadd = (key: string, score: number, id: string) => (track(key, score, id), original(key, score, id));
    return chain;
  }) as unknown as Redis["multi"];
  mock.zrevrange = (async (key: string, start: number, stop: number) =>
    [...(index.get(key) ?? [])].sort((a, b) => b[1] - a[1]).map(([id]) => id).slice(start, stop + 1)) as unknown as Redis["zrevrange"];
  return mock;
};

const stores: [string, () => JobStore][] = [
  ["memory", () => createMemoryJobStore(TTL)],
  ["redis", () => createRedisJobStore(redis(), TTL)],
];

describe.each(stores)("JobStore (%s)", (_name, make) => {
  const batch = { id: "b1", userId: "u1", model: "detect-atrophy" as const, items: [{ id: "i1", name: "a.jpg" }, { id: "i2", name: "b.jpg" }, { id: "i3", name: "c.jpg" }] };

  it("creates a batch and reads it back in upload order", async () => {
    const jobs = make();
    const created = await jobs.createBatch(batch);
    expect(created.expiresAt - created.createdAt).toBe(TTL * 1000);
    const read = await jobs.getBatch("b1");
    expect(read).toMatchObject({ id: "b1", userId: "u1", model: "detect-atrophy", status: "processing", total: 3, done: 0 });
    expect(read!.items.map((i) => [i.index, i.name, i.status])).toEqual([[0, "a.jpg", "pending"], [1, "b.jpg", "pending"], [2, "c.jpg", "pending"]]);
    expect(await jobs.getBatch("missing")).toBeNull();
  });

  it("tracks progress and completes on the last item, once per item", async () => {
    const jobs = make();
    await jobs.createBatch(batch);
    expect((await jobs.markProcessing("b1", "i1"))?.status).toBe("processing");

    const first = await jobs.finishItem("b1", "i1", { result: { message: "ok", value: 5 } });
    expect(first?.batch).toMatchObject({ done: 1, status: "processing" });
    expect(first?.item).toMatchObject({ status: "complete", result: { message: "ok", value: 5 } });

    expect(await jobs.finishItem("b1", "i1", { error: "again" })).toBeNull();
    expect(await jobs.markProcessing("b1", "i1")).toBeNull();

    await jobs.finishItem("b1", "i2", { error: "boom" });
    const last = await jobs.finishItem("b1", "i3", { result: { message: "ok" } });
    expect(last?.batch).toMatchObject({ done: 3, status: "complete" });

    const read = await jobs.getBatch("b1");
    expect(read?.status).toBe("complete");
    expect(read?.items.map((i) => i.status)).toEqual(["complete", "error", "complete"]);
    expect(read?.items[1]).toMatchObject({ error: "boom" });
    expect(read?.items[1]).not.toHaveProperty("result");
  });

  it("lists newest first per user, and deleteBatch removes everything", async () => {
    const jobs = make();
    await jobs.createBatch({ ...batch, id: "old" });
    await new Promise((r) => setTimeout(r, 5));
    await jobs.createBatch({ ...batch, id: "new" });
    await jobs.createBatch({ ...batch, id: "theirs", userId: "u2" });

    expect((await jobs.listBatches("u1", 10)).map((b) => b.id)).toEqual(["new", "old"]);
    expect(await jobs.listBatches("u1", 1)).toHaveLength(1);

    await jobs.deleteBatch("new");
    expect(await jobs.getBatch("new")).toBeNull();
    expect((await jobs.listBatches("u1", 10)).map((b) => b.id)).toEqual(["old"]);
    expect(await jobs.markProcessing("new", "i1")).toBeNull();
  });
});

describe("redis expiry", () => {
  it("puts the job TTL on every key it creates", async () => {
    const client = redis();
    await createRedisJobStore(client, TTL).createBatch({ id: "b1", userId: "u1", model: "detect-atrophy", items: [{ id: "i1", name: "a" }] });
    for (const key of ["scan:batch:b1", "scan:batch:b1:items", "scan:user:u1:batches"]) {
      expect(await client.ttl(key)).toBeGreaterThan(TTL - 5);
      expect(await client.ttl(key)).toBeLessThanOrEqual(TTL);
    }
  });

  it("revocations expire with the token", async () => {
    const client = redis();
    const revocations = createRedisRevocations(client);
    await revocations.revoke("jti", Date.now() / 1000 + 60);
    expect(await revocations.isRevoked("jti")).toBe(true);
    expect(await client.ttl("auth:revoked:jti")).toBeLessThanOrEqual(60);
    await revocations.revoke("old", Date.now() / 1000 - 10);
    expect(await revocations.isRevoked("old")).toBe(false);
  });
});

describe("redis event bus", () => {
  it("delivers events published by another connection", async () => {
    const publisher = redis();
    const received: unknown[] = [];
    const unsubscribe = await createRedisEventBus(redis()).subscribe((e) => received.push(e));
    // ioredis-mock shares data between instances, so a second client publishes to the first one's subscription.
    await createRedisEventBus(publisher).publish({ type: "scan:batch", userId: "u1", batchId: "b1", status: "complete", done: 1, total: 1 });
    await new Promise((r) => setTimeout(r, 20));
    expect(received).toHaveLength(1);
    await unsubscribe();
    void createMemoryEventBus;
  });
});
