import type { Database, ModelRecord } from "../db/types";
import type { EventBus } from "../events/bus";
import { UpstreamError, type Inference } from "../inference/models";
import type { JobStore } from "../jobs/store";
import type { FileStorage } from "../storage/files";
import type { RawScanResponse, ScanJobMessage } from "../types";

export interface ProcessorDeps {
  /** Models are looked up when the job runs, so edits in the registry apply to queued work. */
  db: Pick<Database, "models">;
  jobs: JobStore;
  events: EventBus;
  storage: FileStorage;
  inference: Inference;
  maxAttempts: number;
  /** Wait before retry n is `retryBaseMs * 2^(n-1)`. */
  retryBaseMs: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Calls Python, retrying only when the service itself was unreachable or failed (5xx). */
async function predictWithRetry(deps: ProcessorDeps, model: ModelRecord, job: ScanJobMessage, image: Buffer): Promise<RawScanResponse> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await deps.inference.predict(model, image, job.contentType);
    } catch (error) {
      const retryable = error instanceof UpstreamError && error.retryable;
      if (!retryable || attempt >= deps.maxAttempts) throw error;
      await sleep(deps.retryBaseMs * 2 ** (attempt - 1));
    }
  }
}

/**
 * Handles one queued image: run it through the chosen model, record the outcome, tell the
 * owner, and delete the file. Resolves once the outcome is recorded; throws only for
 * infrastructure problems (Redis down, ...) so the queue redelivers the message.
 */
export async function processScanJob(deps: ProcessorDeps, job: ScanJobMessage): Promise<void> {
  const batch = await deps.jobs.getBatch(job.batchId);
  const started = await deps.jobs.markProcessing(job.batchId, job.itemId);
  if (!batch || !started) {
    // Batch expired, or this is a redelivery of an image that is already finished.
    await deps.storage.remove(job.fileKey);
    return;
  }

  await deps.events.publish({
    type: "scan:item", userId: batch.userId, batchId: batch.id, item: started, done: batch.done, total: batch.total,
  });

  let outcome: { result: RawScanResponse } | { error: string };
  try {
    const model = await deps.db.models.find(job.model);
    const image = model?.enabled ? await deps.storage.read(job.fileKey).catch(() => null) : null;
    if (!model?.enabled) outcome = { error: "This model is no longer available." };
    else if (!image) outcome = { error: "The uploaded image is no longer available." };
    else outcome = { result: await predictWithRetry(deps, model, job, image) };
  } catch (error) {
    outcome = { error: error instanceof Error ? error.message : "The image could not be analysed." };
  }

  const finished = await deps.jobs.finishItem(job.batchId, job.itemId, outcome);
  await deps.storage.remove(job.fileKey);
  if (!finished) return;

  const { item, batch: summary } = finished;
  await deps.events.publish({
    type: "scan:item", userId: summary.userId, batchId: summary.id, item, done: summary.done, total: summary.total,
  });
  if (summary.status === "complete") {
    await deps.events.publish({
      type: "scan:batch", userId: summary.userId, batchId: summary.id, status: summary.status, done: summary.done, total: summary.total,
    });
  }
}
