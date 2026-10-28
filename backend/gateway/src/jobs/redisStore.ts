import type { Redis } from "ioredis";
import type { ScanBatch, ScanBatchSummary, ScanItem } from "../types";
import type { FinishedItem, JobStore } from "./store";

/**
 * Layout (every key carries the job TTL, set when the batch is created):
 *   scan:batch:<id>          hash   userId, model, status, total, done, createdAt
 *   scan:batch:<id>:items    hash   itemId -> JSON ScanItem
 *   scan:user:<id>:batches   zset   batch ids scored by createdAt
 */
const batchKey = (id: string) => `scan:batch:${id}`;
const itemsKey = (id: string) => `scan:batch:${id}:items`;
const userKey = (userId: string) => `scan:user:${userId}:batches`;

function toSummary(id: string, hash: Record<string, string>, ttlMs: number): ScanBatchSummary | null {
  if (!hash.userId) return null;
  const createdAt = Number(hash.createdAt);
  return {
    id,
    userId: hash.userId,
    model: hash.model as string,
    status: hash.status === "complete" ? "complete" : "processing",
    total: Number(hash.total),
    done: Number(hash.done),
    createdAt,
    expiresAt: createdAt + ttlMs,
  };
}

export function createRedisJobStore(redis: Redis, ttlSeconds: number): JobStore {
  const ttlMs = ttlSeconds * 1000;

  return {
    async createBatch({ id, userId, model, items }) {
      const createdAt = Date.now();
      const stored: ScanItem[] = items.map((item, index) => ({ id: item.id, index, name: item.name, status: "pending" }));

      await redis
        .multi()
        .hset(batchKey(id), { userId, model, status: "processing", total: stored.length, done: 0, createdAt })
        .expire(batchKey(id), ttlSeconds)
        .hset(itemsKey(id), Object.fromEntries(stored.map((item) => [item.id, JSON.stringify(item)])))
        .expire(itemsKey(id), ttlSeconds)
        .zremrangebyscore(userKey(userId), "-inf", createdAt - ttlMs)
        .zadd(userKey(userId), createdAt, id)
        .expire(userKey(userId), ttlSeconds)
        .exec();

      return { id, userId, model, status: "processing", total: stored.length, done: 0, createdAt, expiresAt: createdAt + ttlMs, items: stored };
    },

    async getBatch(id) {
      const [[, hash], [, rawItems]] = (await redis.multi().hgetall(batchKey(id)).hgetall(itemsKey(id)).exec()) as [
        [unknown, Record<string, string>],
        [unknown, Record<string, string>],
      ];
      const summary = toSummary(id, hash, ttlMs);
      if (!summary) return null;
      const items = Object.values(rawItems)
        .map((raw) => JSON.parse(raw) as ScanItem)
        .sort((a, b) => a.index - b.index);
      return { ...summary, items };
    },

    async listBatches(userId, limit) {
      await redis.zremrangebyscore(userKey(userId), "-inf", Date.now() - ttlMs);
      const ids = await redis.zrevrange(userKey(userId), 0, limit - 1);
      if (!ids.length) return [];
      const pipeline = redis.pipeline();
      ids.forEach((id) => pipeline.hgetall(batchKey(id)));
      const rows = (await pipeline.exec()) ?? [];
      return rows.flatMap(([, hash], position) => {
        const summary = toSummary(ids[position]!, hash as Record<string, string>, ttlMs);
        return summary ? [summary] : [];
      });
    },

    async deleteBatch(id) {
      const userId = await redis.hget(batchKey(id), "userId");
      const multi = redis.multi().del(batchKey(id), itemsKey(id));
      if (userId) multi.zrem(userKey(userId), id);
      await multi.exec();
    },

    async markProcessing(batchId, itemId) {
      const raw = await redis.hget(itemsKey(batchId), itemId);
      if (!raw) return null;
      const item = JSON.parse(raw) as ScanItem;
      if (item.status === "complete" || item.status === "error") return null;
      const updated: ScanItem = { ...item, status: "processing" };
      await redis.hset(itemsKey(batchId), itemId, JSON.stringify(updated));
      return updated;
    },

    async finishItem(batchId, itemId, outcome): Promise<FinishedItem | null> {
      const raw = await redis.hget(itemsKey(batchId), itemId);
      if (!raw) return null;
      const current = JSON.parse(raw) as ScanItem;
      if (current.status === "complete" || current.status === "error") return null;

      const { result, error, ...rest } = current;
      const item: ScanItem = "result" in outcome
        ? { ...rest, status: "complete", result: outcome.result }
        : { ...rest, status: "error", error: outcome.error };

      const done = await redis.hincrby(batchKey(batchId), "done", 1);
      await redis.hset(itemsKey(batchId), itemId, JSON.stringify(item));
      const hash = await redis.hgetall(batchKey(batchId));
      if (done >= Number(hash.total)) {
        await redis.hset(batchKey(batchId), "status", "complete");
        hash.status = "complete";
      }
      const batch = toSummary(batchId, { ...hash, done: String(done) }, ttlMs);
      return batch ? { item, batch } : null;
    },
  };
}
