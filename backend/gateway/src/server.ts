import http from "node:http";
import { Redis } from "ioredis";
import { createApp } from "./app";
import { createAuthenticator } from "./auth/authenticate";
import { createRedisRevocations } from "./auth/revocations";
import { createTokenService } from "./auth/tokens";
import { loadConfig } from "./config";
import { openDatabase } from "./db";
import { createRedisEventBus } from "./events/bus";
import { createRedisJobStore } from "./jobs/redisStore";
import { createRabbitQueue } from "./queue/queue";
import { attachRealtime } from "./realtime/socket";
import { createDiskStorage } from "./storage/files";

async function main() {
  const config = loadConfig();
  const db = openDatabase(config);
  if (!(await db.models.list()).length) {
    console.warn("[api] no models are registered yet. Run `npm run seed:models` or add some through POST /models.");
  }
  const redis = new Redis(config.redisUrl);
  redis.on("error", (error) => console.error("[redis]", error.message));
  await redis.ping();

  const tokens = createTokenService(config.jwt.secret, config.jwt.ttlSeconds);
  const revocations = createRedisRevocations(redis);
  const authenticate = createAuthenticator(tokens, revocations);
  const queue = createRabbitQueue(config.rabbitUrl, config.jobTtlSeconds * 1000);
  const events = createRedisEventBus(redis);

  const app = createApp({
    config, db, tokens, revocations, authenticate, queue,
    jobs: createRedisJobStore(redis, config.jobTtlSeconds),
    storage: createDiskStorage(config.uploadDir),
  });
  const server = http.createServer(app);
  const realtime = await attachRealtime(server, { corsOrigins: config.corsOrigins, authenticate, events });

  server.listen(config.port, () => console.log(`[api] listening on :${config.port}`));

  const shutdown = async () => {
    console.log("[api] shutting down");
    server.close();
    await realtime.close();
    await queue.close();
    redis.disconnect();
    db.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error("[api] failed to start:", error);
  process.exit(1);
});
