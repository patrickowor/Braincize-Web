import { randomUUID } from "node:crypto";
import { Router } from "express";
import multer from "multer";
import { requireAuth, type Authenticator } from "../auth/authenticate";
import type { Config } from "../config";
import type { Database } from "../db/types";
import { HttpError } from "../errors";
import type { JobStore } from "../jobs/store";
import type { ScanQueue } from "../queue/queue";
import { sniffImageType, type FileStorage } from "../storage/files";
import type { ScanJobMessage } from "../types";

interface Deps {
  config: Pick<Config, "maxFiles" | "maxFileBytes">;
  db: Pick<Database, "models">;
  jobs: JobStore;
  storage: FileStorage;
  queue: Pick<ScanQueue, "publish">;
  authenticate: Authenticator;
}

/**
 * POST /scans            multipart: `model` + one or more `images`. Answers 202 with the batch;
 *                        results then arrive over the websocket (`scan:item`, `scan:batch`).
 * GET  /scans            the caller's batches that are still within the job TTL.
 * GET  /scans/:id        one batch with every item and result (also the polling fallback).
 */
export function scansRouter({ config, db, jobs, storage, queue, authenticate }: Deps) {
  const router = Router();
  router.use(requireAuth(authenticate));

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { files: config.maxFiles, fileSize: config.maxFileBytes },
  });

  router.post("/", upload.array("images"), async (request, response) => {
    const modelId = typeof request.body?.model === "string" ? request.body.model.trim() : "";
    const model = modelId ? await db.models.find(modelId) : null;
    // Internal and disabled models answer exactly like unknown ones.
    if (!model || model.internal || !model.enabled) throw new HttpError(400, "Choose an available analysis model.");
    const files = (request.files as Express.Multer.File[] | undefined) ?? [];
    if (!files.length) throw new HttpError(400, "Upload at least one image in the `images` field.");

    const types = files.map((file) => sniffImageType(file.buffer));
    const rejected = files
      .filter((_file, position) => !types[position] || !model.accepts.includes(types[position]))
      .map((file) => file.originalname);
    if (rejected.length) {
      throw new HttpError(400, `${model.name} accepts ${model.accepts.join(", ")} only.`, { rejected, accepts: model.accepts });
    }

    const batchId = randomUUID();
    const userId = request.auth!.userId;
    const items = files.map((file) => ({ id: randomUUID(), name: file.originalname }));
    const jobsToQueue: ScanJobMessage[] = items.map((item, position) => ({
      batchId, itemId: item.id, model: model.id, fileKey: `${batchId}/${item.id}`, contentType: types[position]!,
    }));

    await Promise.all(jobsToQueue.map((job, position) => storage.save(job.fileKey, files[position]!.buffer)));
    const batch = await jobs.createBatch({ id: batchId, userId, model: model.id, items });
    try {
      await Promise.all(jobsToQueue.map((job) => queue.publish(job)));
    } catch (error) {
      // Nothing will ever process this batch, so don't leave it (or the images) behind.
      console.error("[scans] could not enqueue batch", batchId, error);
      await jobs.deleteBatch(batchId);
      await Promise.all(jobsToQueue.map((job) => storage.remove(job.fileKey)));
      throw new HttpError(503, "The analysis queue is unavailable. Please try again shortly.");
    }

    response.status(202).json(batch);
  });

  router.get("/", async (request, response) => {
    response.json(await jobs.listBatches(request.auth!.userId, 50));
  });

  router.get("/:id", async (request, response) => {
    const batch = await jobs.getBatch(String(request.params.id));
    // Same answer for "missing" and "someone else's", so ids can't be probed.
    if (!batch || batch.userId !== request.auth!.userId) throw new HttpError(404, "Scan not found.");
    response.json(batch);
  });

  return router;
}
