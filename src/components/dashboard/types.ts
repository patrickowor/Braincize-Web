import type { ScanOutcome } from "@/lib/api/types";

export type ScanItemStatus = "pending" | "analyzing" | "complete" | "error";

/** One image sent to a model: an uploaded picture or a frame cut from a video. */
export interface ScanItem {
  id: string;
  file: File;
  /** Object URL for the thumbnail; created with the item and released when it is cleared. */
  previewUrl: string;
  source: "image" | "video-frame";
  status: ScanItemStatus;
  outcome?: ScanOutcome;
  error?: string;
}

export type InputMode = "images" | "video";
