import { http } from "../http";
import { endpoints } from "../endpoints";
import type { RawScanResponse, ScanModelId, ScanOutcome, Severity } from "../types";

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

/**
 * The prediction endpoints answer `{ message, value }`. The first word of `message` names the
 * atrophy size ("small …", "medium …", "large …"); any other message with a value is a normal
 * scan, and a message without a value is an error from the model.
 */
export function interpretScan(response: RawScanResponse): ScanOutcome {
  const size = response.message.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const score = Number(response.value);

  if (size in SEVERITY_BY_SIZE) {
    return { severity: SEVERITY_BY_SIZE[size], atrophyScore: Number.isFinite(score) ? score : 0, message: response.message };
  }
  if (response.value === null || response.value === undefined || !Number.isFinite(score)) {
    throw new ScanError(response.message);
  }
  return { severity: "Normal", atrophyScore: score, message: response.message };
}

export const scanService = {
  /** Sends one image to the chosen model and returns the interpreted prediction. */
  analyze: async (modelId: ScanModelId, image: Blob): Promise<ScanOutcome> => {
    const response = await http.post<RawScanResponse>(endpoints.scan.predict[modelId], image);
    return interpretScan(response);
  },
};
