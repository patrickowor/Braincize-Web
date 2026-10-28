/**
 * What a prediction endpoint answers, passed through untouched. The only requirement is a string
 * `message`; the Python scripts add `value` (and `ismri` adds `success`), other services may add more.
 */
export interface RawScanResponse {
  message: string;
  value?: number | string | null;
  [field: string]: unknown;
}

export type ItemStatus = "pending" | "processing" | "complete" | "error";
export type BatchStatus = "processing" | "complete";

export interface ScanItem {
  id: string;
  /** Position in the upload, so clients can match results to the files they sent. */
  index: number;
  name: string;
  status: ItemStatus;
  /** Set when the Python service answered. Interpreting it is the client's job, as before. */
  result?: RawScanResponse;
  /** Set when the image could not be analysed at all (service down, image gone, ...). */
  error?: string;
}

export interface ScanBatchSummary {
  id: string;
  userId: string;
  /** Id of the model in the registry. */
  model: string;
  status: BatchStatus;
  total: number;
  done: number;
  createdAt: number;
  expiresAt: number;
}

export interface ScanBatch extends ScanBatchSummary {
  items: ScanItem[];
}

/** One queue message per image. */
export interface ScanJobMessage {
  batchId: string;
  itemId: string;
  /** Id of the model in the registry; the worker looks it up when the job runs. */
  model: string;
  /** Key in the file storage. */
  fileKey: string;
  contentType: string;
}
