import type { ScanModelId } from "@/lib/api/types";

export interface ScanModel {
  id: ScanModelId;
  name: string;
  version: string;
  type: string;
  description: string;
}

/** Models offered for the Brain Scan project. Their endpoints live in `lib/api/endpoints.ts`. */
export const brainScanModels: ScanModel[] = [
  {
    id: "detect-atrophy",
    name: "Detect Atrophy",
    version: "Version 1",
    type: "Mask RCNN",
    description: "Deep residual network optimized for brain MRI analysis",
  },
  {
    id: "measure-atrophy-v1",
    name: "Detect & Measure Atrophy Size",
    version: "Version 1",
    type: "Mask RCNN",
    description: "Efficiently detect the size of an atrophy with state-of-the-art performance",
  },
  {
    id: "measure-atrophy-yolo",
    name: "Detect & Measure Atrophy Size",
    version: "Version 2",
    type: "Yolo",
    description: "Efficiently detect the size of an atrophy with state-of-the-art performance and blazing speed",
  },
];

/** How uploads are prepared and sent. Tune here. */
export const scanSettings = {
  /** Images sent to the model at the same time. */
  concurrency: 4,
  /** Video is sampled into stills at one of these intervals (seconds). */
  frameIntervals: [0.5, 1, 2, 5],
  defaultFrameInterval: 1,
  /** Upper bound on frames taken from one video; longer clips are sampled more sparsely. */
  maxFrames: 60,
  /** Frames wider than this are scaled down before upload. */
  maxFrameWidth: 1280,
};
