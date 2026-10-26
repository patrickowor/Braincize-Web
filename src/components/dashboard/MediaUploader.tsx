"use client";

import { Film, Upload } from "lucide-react";
import { useId, useState } from "react";
import { Card, DashButton, ProgressBar } from "@/components/ui/dashboard";
import { scanSettings } from "@/content/scanModels";
import { cn } from "@/lib/cn";
import type { InputMode } from "./types";

interface MediaUploaderProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  onImages: (files: File[]) => void;
  onVideo: (file: File) => void;
  frameInterval: number;
  onFrameIntervalChange: (seconds: number) => void;
  /** Set while a video is being cut into frames. */
  extracting: { done: number; total: number } | null;
  itemCount: number;
  analyzing: boolean;
  progress: number;
  canAnalyze: boolean;
  blockedReason?: string;
  onAnalyze: () => void;
  onClear: () => void;
}

const tabs: { mode: InputMode; label: string }[] = [
  { mode: "images", label: "Images" },
  { mode: "video", label: "Video" },
];

/** Upload many MRI images directly, or a video that is split into frames first. */
export function MediaUploader(props: MediaUploaderProps) {
  const { mode, onModeChange, onImages, onVideo, frameInterval, onFrameIntervalChange, extracting, itemCount } = props;
  const { analyzing, progress, canAnalyze, blockedReason, onAnalyze, onClear } = props;
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const busy = analyzing || extracting !== null;

  const handleFiles = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    if (mode === "images") onImages(files.filter((f) => f.type.startsWith("image/")));
    else if (files[0].type.startsWith("video/")) onVideo(files[0]);
  };

  return (
    <section aria-labelledby="upload-heading">
      <h2 id="upload-heading" className="mb-4 font-poppins text-xl font-semibold text-dash-fg">
        Upload Brain MRI {mode === "images" ? "Images" : "Video"}
      </h2>
      <Card className="p-8">
        <div role="tablist" aria-label="Upload type" className="mb-6 inline-flex bg-dash-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.mode}
              type="button"
              role="tab"
              aria-selected={mode === tab.mode}
              disabled={busy}
              onClick={() => onModeChange(tab.mode)}
              className={cn(
                "cursor-pointer px-5 py-1.5 font-poppins text-sm font-medium transition-colors disabled:cursor-not-allowed",
                mode === tab.mode ? "bg-surface text-dash-primary shadow-sm" : "text-dash-muted-fg",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mode === "video" && (
          <div className="mb-4 flex flex-wrap items-center gap-3 font-poppins text-sm text-dash-muted-fg">
            <label htmlFor={`${inputId}-interval`}>Capture a frame every</label>
            <select
              id={`${inputId}-interval`}
              value={frameInterval}
              disabled={busy}
              onChange={(e) => onFrameIntervalChange(Number(e.target.value))}
              className=" border border-dash-border bg-surface px-2 py-1 text-dash-fg"
            >
              {scanSettings.frameIntervals.map((seconds) => (
                <option key={seconds} value={seconds}>
                  {seconds} s
                </option>
              ))}
            </select>
            <span>(up to {scanSettings.maxFrames} frames)</span>
          </div>
        )}

        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (!busy) handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-dash-muted/20 p-12 text-center transition-colors hover:border-dash-primary",
            dragging ? "border-dash-primary" : "border-dash-border",
            busy && "pointer-events-none opacity-60",
          )}
        >
          {mode === "images" ? (
            <Upload className="mb-4 h-12 w-12 text-dash-muted-fg" aria-hidden />
          ) : (
            <Film className="mb-4 h-12 w-12 text-dash-muted-fg" aria-hidden />
          )}
          <span className="mb-2 font-poppins text-lg font-medium text-dash-fg">
            {mode === "images" ? "Drop files here or click to browse" : "Drop a video here or click to browse"}
          </span>
          <span className="font-poppins text-sm text-dash-muted-fg">
            {mode === "images" ? "Supports JPEG and PNG images" : "Supports MP4 and WebM video"}
          </span>
          <input
            id={inputId}
            key={mode}
            type="file"
            multiple={mode === "images"}
            accept={mode === "images" ? "image/jpeg,image/png" : "video/mp4,video/webm,video/*"}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
            className="sr-only"
          />
        </label>

        {extracting && (
          <div className="mt-6 space-y-2" role="status">
            <ProgressBar value={(extracting.done / extracting.total) * 100} />
            <p className="text-center font-poppins text-sm text-dash-muted-fg">
              Extracting frames: {extracting.done} of {extracting.total}
            </p>
          </div>
        )}

        {itemCount > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-poppins font-medium text-dash-fg">
                {mode === "video" ? "Extracted Frames" : "Uploaded Images"} ({itemCount})
              </h3>
              <div className="flex gap-2">
                <DashButton variant="outline" onClick={onClear} disabled={busy}>
                  Clear
                </DashButton>
                <DashButton onClick={onAnalyze} disabled={busy || !canAnalyze}>
                  {analyzing ? "Analyzing..." : "Start Analysis"}
                </DashButton>
              </div>
            </div>
            {!canAnalyze && blockedReason && !busy && (
              <p className="font-poppins text-sm text-dash-muted-fg">{blockedReason}</p>
            )}
            {analyzing && (
              <div className="space-y-2" role="status">
                <ProgressBar value={progress} />
                <p className="text-center font-poppins text-sm text-dash-muted-fg">Analyzing: {Math.round(progress)}% complete</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}
