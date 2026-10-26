"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { brainScanModels, scanSettings } from "@/content/scanModels";
import { api } from "@/lib/api";
import { ScanError } from "@/lib/api/services/scan.service";
import type { ScanModelId } from "@/lib/api/types";
import { runPool } from "@/lib/async/pool";
import { extractFrames } from "@/lib/video/extractFrames";
import { MediaUploader } from "./MediaUploader";
import { ModelPicker } from "./ModelPicker";
import { ScanResults } from "./ScanResults";
import type { InputMode, ScanItem } from "./types";

let counter = 0;
const makeItem = (file: File, source: ScanItem["source"]): ScanItem => ({
  id: `scan-${Date.now()}-${counter++}`,
  file,
  source,
  previewUrl: URL.createObjectURL(file),
  status: "pending",
});

const revokeAll = (items: ScanItem[]) => items.forEach((item) => URL.revokeObjectURL(item.previewUrl));

/**
 * Brain Scan project: pick a model, upload images (or a video, which is split into frames first),
 * then send every image to the model and show the results. All network access goes through `api.scan`.
 */
export function BrainScan() {
  const [modelId, setModelId] = useState<ScanModelId | null>(null);
  const [mode, setMode] = useState<InputMode>("images");
  const [items, setItems] = useState<ScanItem[]>([]);
  const [frameInterval, setFrameInterval] = useState<number>(scanSettings.defaultFrameInterval);
  const [extracting, setExtracting] = useState<{ done: number; total: number } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const latest = useRef(items);
  latest.current = items;

  // Release thumbnail URLs when leaving the page.
  useEffect(() => () => revokeAll(latest.current), []);

  const replaceItems = useCallback((next: ScanItem[]) => {
    revokeAll(latest.current);
    setItems(next);
    setProgress(0);
  }, []);

  const model = brainScanModels.find((m) => m.id === modelId);

  function selectModel(id: ScanModelId) {
    setModelId(id);
    toast.success(`${brainScanModels.find((m) => m.id === id)?.name} (${brainScanModels.find((m) => m.id === id)?.version}) selected`);
  }

  function addImages(files: File[]) {
    if (!files.length) {
      toast.error("Only JPEG and PNG images can be analyzed.");
      return;
    }
    setItems((current) => [...current, ...files.map((file) => makeItem(file, "image"))]);
    toast.success(`${files.length} image(s) uploaded`);
  }

  async function addVideo(file: File) {
    replaceItems([]);
    setExtracting({ done: 0, total: 1 });
    try {
      const frames = await extractFrames(file, {
        intervalSeconds: frameInterval,
        maxFrames: scanSettings.maxFrames,
        maxWidth: scanSettings.maxFrameWidth,
        onProgress: (done, total) => setExtracting({ done, total }),
      });
      setItems(frames.map((frame) => makeItem(frame, "video-frame")));
      toast.success(`${frames.length} frames extracted`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read this video.");
    } finally {
      setExtracting(null);
    }
  }

  function changeMode(next: InputMode) {
    if (next === mode) return;
    setMode(next);
    replaceItems([]);
  }

  async function analyze() {
    if (!modelId) return toast.error("Please select a model first");
    if (!items.length) return toast.error("Please upload images first");

    const patch = (id: string, change: Partial<ScanItem>) =>
      setItems((current) => current.map((item) => (item.id === id ? { ...item, ...change } : item)));

    setAnalyzing(true);
    setProgress(0);
    setItems((current) => current.map((item) => ({ ...item, status: "analyzing", outcome: undefined, error: undefined })));

    let finished = 0;
    await runPool(items, scanSettings.concurrency, async (item) => {
      try {
        const outcome = await api.scan.analyze(modelId, item.file);
        patch(item.id, { status: "complete", outcome });
      } catch (error) {
        const message = error instanceof ScanError ? error.message : "The analysis service is unreachable.";
        patch(item.id, { status: "error", error: message });
      } finally {
        setProgress((++finished / items.length) * 100);
      }
    });

    setAnalyzing(false);
    toast.success("Analysis complete!");
  }

  const blockedReason = !modelId ? "Select an analysis model above to start." : undefined;

  return (
    <div className="space-y-8">
      <ModelPicker models={brainScanModels} selected={modelId} onSelect={selectModel} />
      <MediaUploader
        mode={mode}
        onModeChange={changeMode}
        onImages={addImages}
        onVideo={addVideo}
        frameInterval={frameInterval}
        onFrameIntervalChange={setFrameInterval}
        extracting={extracting}
        itemCount={items.length}
        analyzing={analyzing}
        progress={progress}
        canAnalyze={Boolean(modelId) && items.length > 0}
        blockedReason={blockedReason}
        onAnalyze={analyze}
        onClear={() => replaceItems([])}
      />
      <ScanResults items={items} model={model} />
    </div>
  );
}
