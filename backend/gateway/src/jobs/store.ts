import type { RawScanResponse, ScanBatch, ScanBatchSummary, ScanItem } from "../types";

export interface NewBatch {
  id: string;
  userId: string;
  model: string;
  items: { id: string; name: string }[];
}

export interface FinishedItem {
  item: ScanItem;
  batch: ScanBatchSummary;
}

/**
 * Where batches and results live. Everything it holds expires after the job TTL, so no record
 * outlives `JOB_TTL_HOURS`. Redis in production (`redisStore.ts`), memory in tests.
 */
export interface JobStore {
  createBatch(batch: NewBatch): Promise<ScanBatch>;
  getBatch(id: string): Promise<ScanBatch | null>;
  listBatches(userId: string, limit: number): Promise<ScanBatchSummary[]>;
  deleteBatch(id: string): Promise<void>;
  /** Null when the batch has expired or the item already finished (e.g. a redelivered message). */
  markProcessing(batchId: string, itemId: string): Promise<ScanItem | null>;
  /** Null under the same conditions as `markProcessing`; otherwise the updated item and batch. */
  finishItem(
    batchId: string,
    itemId: string,
    outcome: { result: RawScanResponse } | { error: string },
  ): Promise<FinishedItem | null>;
}
