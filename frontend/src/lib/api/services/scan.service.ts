import { http } from "../http";
import { endpoints } from "../endpoints";
import type { RawScanResponse, RemoteScanBatch, ScanModelId, ScanOutcome, Severity } from "../types";

/** Raised when the model answered, but with something that is not a measurement. */
export class ScanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScanError";
  }
}

const SEVERITY_BY_SIZE: Record<string, Severity> = {
  small: "Mild",
  medium: "Moderate",
  large: "Severe",
};

/** Every answer from the Python scripts starts with this. */
const ANSWER_PREFIX = /^image received\.\s*/i;

/**
 * The prediction endpoints answer `{ message, value }`, e.g.
 *   "image received. Small autrophy detected with value 42mm²"  value 42    → size word picks the severity
 *   "image received. prediction completed no sizable shrinkage found"  value 0  → normal
 *   "image received. Shrinkage detected with a probability of 90%"  (no value) → detected
 * Anything else without a value (not an MRI, processing error, ...) is an error from the model.
 */
export function interpretScan(response: RawScanResponse): ScanOutcome {
  const message = response.message.replace(ANSWER_PREFIX, "").trim();
  const size = message.split(/\s+/)[0]?.toLowerCase() ?? "";
  const hasValue = response.value !== null && response.value !== undefined && response.value !== "";
  const score = hasValue ? Number(response.value) : NaN;

  if (Object.hasOwn(SEVERITY_BY_SIZE, size)) {
    return { severity: SEVERITY_BY_SIZE[size], atrophyScore: Number.isFinite(score) ? score : 0, message };
  }
  if (Number.isFinite(score)) {
    return { severity: "Normal", atrophyScore: score, message };
  }

  // Answers without a value: the detect-only model.
  const detected = /shrinkage detected with a probability of (\d+(?:\.\d+)?)%/i.exec(message);
  if (detected) return { severity: "Detected", atrophyScore: Number(detected[1]), message };
  if (/^no shrinkage/i.test(message)) return { severity: "Normal", atrophyScore: null, message };

  throw new ScanError(message);
}

export const scanService = {
  /**
   * Uploads images to be analysed by one model. Answers as soon as they are queued; the results come
   * back through `createScanTracker` (websocket), item by item.
   */
  submit: (modelId: ScanModelId, files: File[]): Promise<RemoteScanBatch> => {
    const form = new FormData();
    form.append("model", modelId);
    files.forEach((file) => form.append("images", file, file.name));
    return http.post<RemoteScanBatch>(endpoints.scan.submit, form);
  },
  /** Current state of a batch, including every result so far. */
  batch: (id: string) => http.get<RemoteScanBatch>(endpoints.scan.batch(id)),
};
