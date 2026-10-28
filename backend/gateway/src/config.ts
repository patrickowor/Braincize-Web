import "dotenv/config";
import { z } from "zod";

const flag = z
  .string()
  .default("true")
  .transform((value) => value.toLowerCase() === "true");

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  FRONTEND_ORIGIN: z.string().default("http://localhost:3000"),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  JWT_SECRET: z.string().min(32, "must be at least 32 characters"),
  JWT_TTL_HOURS: z.coerce.number().positive().default(168),
  ADMIN_EMAILS: z.string().default(""),
  SQLITE_PATH: z.string().default("./data/braincize.db"),
  UPLOAD_DIR: z.string().default("./data/uploads"),
  REDIS_URL: z.string().default("redis://127.0.0.1:6379"),
  RABBITMQ_URL: z.string().default("amqp://guest:guest@127.0.0.1:5672"),
  JOB_TTL_HOURS: z.coerce.number().positive().default(48),
  MAX_FILES_PER_BATCH: z.coerce.number().int().positive().default(100),
  MAX_FILE_MB: z.coerce.number().positive().default(10),
  JOB_MAX_ATTEMPTS: z.coerce.number().int().positive().default(3),
  PYTHON_BRAIN_URL: z.string().url().default("https://127.0.0.1:4000"),
  PYTHON_BRAINCIZE_URL: z.string().url().default("http://127.0.0.1:8002"),
  PYTHON_INSECURE_TLS: flag,
  PYTHON_TIMEOUT_MS: z.coerce.number().int().positive().default(120_000),
  PYTHON_CONCURRENCY: z.coerce.number().int().positive().default(4),
});

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `  ${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`Invalid environment:\n${problems.join("\n")}`);
  }
  const e = parsed.data;
  return {
    nodeEnv: e.NODE_ENV,
    port: e.PORT,
    corsOrigins: e.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean),
    trustProxy: e.TRUST_PROXY,
    jwt: { secret: e.JWT_SECRET, ttlSeconds: Math.round(e.JWT_TTL_HOURS * 3600) },
    adminEmails: e.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
    sqlitePath: e.SQLITE_PATH,
    uploadDir: e.UPLOAD_DIR,
    redisUrl: e.REDIS_URL,
    rabbitUrl: e.RABBITMQ_URL,
    jobTtlSeconds: Math.round(e.JOB_TTL_HOURS * 3600),
    maxFiles: e.MAX_FILES_PER_BATCH,
    maxFileBytes: Math.round(e.MAX_FILE_MB * 1024 * 1024),
    maxAttempts: e.JOB_MAX_ATTEMPTS,
    python: {
      brainUrl: e.PYTHON_BRAIN_URL,
      braincizeUrl: e.PYTHON_BRAINCIZE_URL,
      insecureTls: e.PYTHON_INSECURE_TLS,
      timeoutMs: e.PYTHON_TIMEOUT_MS,
      concurrency: e.PYTHON_CONCURRENCY,
    },
  };
}

export type Config = ReturnType<typeof loadConfig>;
