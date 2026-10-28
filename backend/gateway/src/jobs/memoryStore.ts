import type { ScanBatch, ScanBatchSummary } from "../types";
import type { FinishedItem, JobStore } from "./store";

/** Same behaviour as the Redis store, for tests and for running without Redis. */
export function createMemoryJobStore(ttlSeconds: number): JobStore {
  const batches = new Map<string, ScanBatch>();
  const ttlMs = ttlSeconds * 1000;

  const live = (id: string) => {
    const batch = batches.get(id);
    if (batch && batch.expiresAt <= Date.now()) {
      batches.delete(id);
      return undefined;
    }
    return batch;
  };
  const summarize = ({ items: _items, ...summary }: ScanBatch): ScanBatchSummary => summary;

  return {
    async createBatch({ id, userId, model, items }) {
      const createdAt = Date.now();
      const batch: ScanBatch = {
        id, userId, model, status: "processing", total: items.length, done: 0, createdAt, expiresAt: createdAt + ttlMs,
        items: items.map((item, index) => ({ id: item.id, index, name: item.name, status: "pending" })),
      };
      batches.set(id, batch);
      return structuredClone(batch);
    },
    async getBatch(id) {
      const batch = live(id);
      return batch ? structuredClone(batch) : null;
    },
    async listBatches(userId, limit) {
      return [...batches.keys()]
        .map(live)
        .filter((batch): batch is ScanBatch => batch?.userId === userId)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit)
        .map(summarize);
    },
    async deleteBatch(id) {
      batches.delete(id);
    },
    async markProcessing(batchId, itemId) {
      const item = live(batchId)?.items.find((candidate) => candidate.id === itemId);
      if (!item || item.status === "complete" || item.status === "error") return null;
      item.status = "processing";
      return { ...item };
    },
    async finishItem(batchId, itemId, outcome): Promise<FinishedItem | null> {
      const batch = live(batchId);
      const item = batch?.items.find((candidate) => candidate.id === itemId);
      if (!batch || !item || item.status === "complete" || item.status === "error") return null;
      if ("result" in outcome) {
        item.status = "complete";
        item.result = outcome.result;
      } else {
        item.status = "error";
        item.error = outcome.error;
      }
      batch.done += 1;
      if (batch.done >= batch.total) batch.status = "complete";
      return { item: { ...item }, batch: summarize(batch) };
    },
  };
}
