import { Redis } from "ioredis";
import { loadConfig } from "./config";
import { createRedisEventBus } from "./events/bus";
import { openDatabase } from "./db";
import { createModelInference } from "./inference/models";
import { createRedisJobStore } from "./jobs/redisStore";
import { createRabbitQueue } from "./queue/queue";
import { createDiskStorage } from "./storage/files";
import { processScanJob } from "./worker/processor";

const SWEEP_EVERY_MS = 15 * 60_000;

async function main() {
  const config = loadConfig();
  const redis = new Redis(config.redisUrl);
  redis.on("error", (error) => console.error("[redis]", error.message));
  await redis.ping();

  const storage = createDiskStorage(config.uploadDir);
  const queue = createRabbitQueue(config.rabbitUrl, config.jobTtlSeconds * 1000);
  const db = openDatabase(config);
  const deps = {
    db,
    jobs: createRedisJobStore(redis, config.jobTtlSeconds),
    events: createRedisEventBus(redis),
    storage,
    inference: createModelInference({ timeoutMs: config.python.timeoutMs }),
    maxAttempts: config.maxAttempts,
    retryBaseMs: 1000,
  };

  await queue.consume((job) => processScanJob(deps, job), config.python.concurrency);
  console.log(`[worker] consuming, ${config.python.concurrency} image(s) at a time`);

  // Images are deleted as soon as they are analysed; this only catches ones orphaned by a crash.
  const sweep = () =>
    storage
      .removeOlderThan(config.jobTtlSeconds * 1000)
      .then((removed) => removed && console.log(`[worker] removed ${removed} expired upload folder(s)`))
      .catch((error) => console.error("[worker] sweep failed", error));
  void sweep();
  const timer = setInterval(sweep, SWEEP_EVERY_MS);

  const shutdown = async () => {
    console.log("[worker] shutting down");
    clearInterval(timer);
    await queue.close();
    redis.disconnect();
    db.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error("[worker] failed to start:", error);
  process.exit(1);
});
