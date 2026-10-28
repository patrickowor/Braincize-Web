import { createApp } from "../src/app";
import { createAuthenticator } from "../src/auth/authenticate";
import { createMemoryRevocations } from "../src/auth/revocations";
import { createTokenService } from "../src/auth/tokens";
import { openSqlite } from "../src/db/sqlite";
import { createMemoryEventBus, type ScanEvent } from "../src/events/bus";
import type { Inference } from "../src/inference/models";
import { createMemoryJobStore } from "../src/jobs/memoryStore";
import { applyRegistrySeed } from "../src/registry/apply";
import { pythonRegistrySeed } from "../src/registry/pythonModels";
import { createMemoryStorage } from "../src/storage/files";
import type { ProcessorDeps } from "../src/worker/processor";
import type { ScanJobMessage } from "../src/types";

export const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46]);
export const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);

export const ADMIN_EMAIL = "admin@example.com";

export async function createHarness(inference: Inference) {
  const config = { corsOrigins: ["http://localhost:3000"], trustProxy: 0, maxFiles: 5, maxFileBytes: 1024, adminEmails: [ADMIN_EMAIL] };
  const db = openSqlite(":memory:");
  await applyRegistrySeed(db, pythonRegistrySeed({ brainUrl: "https://brain.test:4000", braincizeUrl: "http://yolo.test:8002", insecureTls: true }));
  const jobs = createMemoryJobStore(48 * 3600);
  const storage = createMemoryStorage();
  const events = createMemoryEventBus();
  const revocations = createMemoryRevocations();
  const tokens = createTokenService("test-secret-test-secret-test-secret-123", 3600);
  const authenticate = createAuthenticator(tokens, revocations);

  const queued: ScanJobMessage[] = [];
  const queue = {
    publish: async (job: ScanJobMessage) => {
      queued.push(job);
    },
  };
  const published: ScanEvent[] = [];
  void events.subscribe((event) => published.push(event));

  const app = createApp({ config, db, jobs, storage, queue, tokens, revocations, authenticate });
  const processor: ProcessorDeps = { db, jobs, events, storage, inference, maxAttempts: 3, retryBaseMs: 1 };

  return { app, db, jobs, storage, events, queue, queued, published, processor, authenticate };
}
