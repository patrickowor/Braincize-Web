import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import multer from "multer";
import { ZodError } from "zod";
import type { Authenticator } from "./auth/authenticate";
import type { Revocations } from "./auth/revocations";
import type { TokenService } from "./auth/tokens";
import type { Config } from "./config";
import type { Database } from "./db/types";
import { HttpError } from "./errors";
import type { JobStore } from "./jobs/store";
import type { ScanQueue } from "./queue/queue";
import { authRouter } from "./routes/auth";
import { contentRouter } from "./routes/content";
import { registryRouter } from "./routes/registry";
import { scansRouter } from "./routes/scans";
import type { FileStorage } from "./storage/files";

export interface AppDeps {
  config: Pick<Config, "corsOrigins" | "trustProxy" | "maxFiles" | "maxFileBytes" | "adminEmails">;
  db: Database;
  jobs: JobStore;
  storage: FileStorage;
  queue: Pick<ScanQueue, "publish">;
  tokens: TokenService;
  revocations: Revocations;
  authenticate: Authenticator;
}

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({ message: error.message, details: error.details });
  } else if (error instanceof ZodError) {
    response.status(400).json({ message: error.issues[0]?.message ?? "Invalid request.", details: error.issues });
  } else if (error instanceof multer.MulterError) {
    const tooBig = error.code === "LIMIT_FILE_SIZE";
    const message = tooBig ? "An image is larger than the upload limit." : `Upload rejected: ${error.message}`;
    response.status(tooBig ? 413 : 400).json({ message });
  } else if ((error as { type?: string }).type === "entity.parse.failed") {
    response.status(400).json({ message: "Request body is not valid JSON." });
  } else {
    console.error("[http] unhandled error", error);
    response.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

export function createApp(deps: AppDeps) {
  const app = express();
  app.set("trust proxy", deps.config.trustProxy);
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: deps.config.corsOrigins, credentials: true }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_request, response) => {
    response.json({ ok: true });
  });
  app.use("/auth", authRouter(deps));
  app.use("/scans", scansRouter(deps));
  app.use("/", registryRouter(deps));
  app.use("/", contentRouter(deps.db));

  app.use((_request, response) => {
    response.status(404).json({ message: "Not found." });
  });
  app.use(errorHandler);
  return app;
}
