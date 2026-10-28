import { Agent, FormData, fetch } from "undici";
import type { ModelRecord } from "../db/types";
import type { RawScanResponse } from "../types";

/** The prediction service could not give an answer. `retryable` means trying again may help. */
export class UpstreamError extends Error {
  constructor(
    message: string,
    public retryable: boolean,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

export interface Inference {
  predict(model: ModelRecord, image: Buffer, contentType: string): Promise<RawScanResponse>;
}

const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png" };

/**
 * Calls whatever endpoint a registry model describes. For the Python scripts that is a POST with the raw
 * image bytes as the body and a JSON `{message, value}` back, exactly as the frontend used to call them.
 */
export function createModelInference({ timeoutMs }: { timeoutMs: number }): Inference {
  // Scoped to calls that opt in; nothing else in the process stops verifying certificates.
  const strict = new Agent();
  const lenient = new Agent({ connect: { rejectUnauthorized: false } });

  return {
    async predict(model, image, contentType) {
      const headers: Record<string, string> = { ...model.headers };
      let body: Buffer | FormData;
      if (model.bodyMode === "multipart") {
        body = new FormData();
        const extension = EXTENSIONS[contentType] ?? "bin";
        body.append(model.fileField ?? "file", new Blob([new Uint8Array(image)], { type: contentType }), `image.${extension}`);
      } else {
        body = image;
        headers["content-type"] = contentType;
      }

      let response;
      try {
        response = await fetch(model.url, {
          method: "POST",
          headers,
          body,
          dispatcher: model.insecureTls ? lenient : strict,
          signal: AbortSignal.timeout(model.timeoutMs ?? timeoutMs),
        });
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new UpstreamError(`The analysis service is unreachable (${reason}).`, true);
      }

      if (!response.ok) {
        throw new UpstreamError(`The analysis service answered ${response.status}.`, response.status >= 500);
      }

      const answer: unknown = await response.json().catch(() => undefined);
      if (!answer || typeof answer !== "object" || typeof (answer as RawScanResponse).message !== "string") {
        throw new UpstreamError("The analysis service sent an unreadable response.", false);
      }
      return answer as RawScanResponse;
    },
  };
}
