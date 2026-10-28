"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/dashboard";
import { env } from "@/config/env";
import { useRemote } from "@/hooks/useRemote";
import { api, ApiError } from "@/lib/api";
import { ScanError, interpretScan } from "@/lib/api/services/scan.service";
import type { CategoryDetail, RemoteScanItem, ScanModelId } from "@/lib/api/types";
import { createScanTracker } from "@/lib/realtime/scanTracker";
import { extractFrames } from "@/lib/video/extractFrames";
import { describeTypes, MediaUploader } from "./MediaUploader";
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

const chunk = <T,>(list: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));

/** Video frames are cut as JPEG, so a model must take JPEG for video to be usable. */
const takesVideoFrames = (accepts: string[]) => accepts.includes("image/jpeg");

/**
 * A scan project (a category from the backend): lists its models, takes images or a video, and
 * shows each result as it comes back. Models, accepted file types and results all come from the API.
 */
export function ScanProject({ categoryId }: { categoryId: string }) {
  const { data: category, loading, status, error } = useRemote(() => api.catalog.category(categoryId), categoryId);

  if (loading) {
    return (
      <p role="status" className="font-poppins text-sm text-dash-muted-fg">
        Loading...
      </p>
    );
  }
  if (!category) {
    return (
      <Card className="max-w-xl p-6">
        <p role="alert" className="font-poppins text-sm text-dash-muted-fg">
          {status === 404 ? "This project doesn't exist." : error}
        </p>
      </Card>
    );
  }
  return <ScanWorkspace category={category} />;
}

function ScanWorkspace({ category }: { category: CategoryDetail }) {
  const [modelId, setModelId] = useState<ScanModelId | null>(null);
  const [mode, setMode] = useState<InputMode>("images");
  const [items, setItems] = useState<ScanItem[]>([]);
  const [frameInterval, setFrameInterval] = useState<number>(env.defaultFrameInterval);
  const [extracting, setExtracting] = useState<{ done: number; total: number } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const latest = useRef(items);
  latest.current = items;
  const run = useRef<AbortController | null>(null);

  // Release thumbnail URLs and stop following a scan when leaving the page.
  useEffect(
    () => () => {
      revokeAll(latest.current);
      run.current?.abort();
    },
    [],
  );

  const replaceItems = useCallback((next: ScanItem[]) => {
    revokeAll(latest.current);
    setItems(next);
    setProgress(0);
  }, []);

  const model = category.models.find((m) => m.id === modelId);
  // Until a model is chosen, accept anything one of the project's models takes.
  const accepts = useMemo(
    () => model?.accepts ?? [...new Set(category.models.flatMap((m) => m.accepts))],
    [model, category.models],
  );

  function selectModel(id: ScanModelId) {
    const chosen = category.models.find((m) => m.id === id);
    if (!chosen) return;
    setModelId(id);
    if (mode === "video" && !takesVideoFrames(chosen.accepts)) changeMode("images");
    toast.success(`${chosen.name}${chosen.version ? ` (${chosen.version})` : ""} selected`);
  }

  function addImages(files: File[]) {
    if (!files.length) {
      toast.error(`Only ${describeTypes(accepts)} images can be analyzed.`);
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
        maxFrames: env.maxFrames,
        maxWidth: env.maxFrameWidth,
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
    if (!model) return toast.error("Please select a model first");
    if (!items.length) return toast.error("Please upload images first");
    const unsupported = items.filter((item) => !model.accepts.includes(item.file.type));
    if (unsupported.length) {
      return toast.error(
        `${model.name} takes ${describeTypes(model.accepts)} only. Remove ${unsupported.length} file(s) or pick another model.`,
      );
    }

    const batchItems = items;
    const finished = new Set<string>();
    const patch = (id: string, change: Partial<ScanItem>) =>
      setItems((current) => current.map((item) => (item.id === id ? { ...item, ...change } : item)));
    const finish = (item: ScanItem, change: Partial<ScanItem>) => {
      if (finished.has(item.id)) return;
      finished.add(item.id);
      patch(item.id, change);
      setProgress((finished.size / batchItems.length) * 100);
    };
    const apply = (local: ScanItem, remote: RemoteScanItem) => {
      if (remote.status === "complete" && remote.result) {
        try {
          finish(local, { status: "complete", outcome: interpretScan(remote.result) });
        } catch (error) {
          finish(local, { status: "error", error: error instanceof ScanError ? error.message : "The result could not be read." });
        }
      } else if (remote.status === "error") {
        finish(local, { status: "error", error: remote.error ?? "The image could not be analyzed." });
      }
    };

    const controller = new AbortController();
    run.current = controller;
    const tracker = createScanTracker();

    setAnalyzing(true);
    setProgress(0);
    setItems((current) => current.map((item) => ({ ...item, status: "analyzing", outcome: undefined, error: undefined })));

    try {
      // Upload one group at a time; each group's results are followed in parallel with the next upload.
      const following: Promise<void>[] = [];
      for (const group of chunk(batchItems, env.uploadBatchSize)) {
        if (controller.signal.aborted) break;
        try {
          const batch = await api.scan.submit(model.id, group.map((item) => item.file));
          following.push(
            tracker.watch(
              batch,
              (remote) => {
                const local = group[remote.index];
                if (local) apply(local, remote);
              },
              controller.signal,
            ),
          );
        } catch (error) {
          const message = error instanceof ApiError ? error.message : "The analysis service is unreachable.";
          group.forEach((item) => finish(item, { status: "error", error: message }));
        }
      }
      await Promise.all(following);
      if (controller.signal.aborted) return;
      // A batch that expired before it could be read leaves items without an answer.
      batchItems.forEach((item) => finish(item, { status: "error", error: "The result is no longer available." }));
      toast.success("Analysis complete!");
    } finally {
      tracker.close();
      if (run.current === controller) run.current = null;
      if (!controller.signal.aborted) setAnalyzing(false);
    }
  }

  const blockedReason = !modelId ? "Select an analysis model above to start." : undefined;

  if (!category.models.length) {
    return (
      <Card className="max-w-xl p-6">
        <p className="font-poppins text-sm text-dash-muted-fg">No analysis models are available for {category.name} yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <ModelPicker models={category.models} selected={modelId} onSelect={selectModel} />
      <MediaUploader
        subject={category.name}
        accepts={accepts}
        videoEnabled={takesVideoFrames(accepts)}
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
