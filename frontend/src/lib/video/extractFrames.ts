export interface ExtractOptions {
  /** Seconds between frames. */
  intervalSeconds: number;
  maxFrames: number;
  maxWidth: number;
  onProgress?: (done: number, total: number) => void;
  signal?: AbortSignal;
}

const once = <K extends keyof HTMLMediaElementEventMap>(video: HTMLVideoElement, event: K) =>
  new Promise<void>((resolve, reject) => {
    const ok = () => {
      video.removeEventListener("error", fail);
      resolve();
    };
    const fail = () => {
      video.removeEventListener(event, ok);
      reject(new Error("This video could not be read. Try an MP4 (H.264) or WebM file."));
    };
    video.addEventListener(event, ok, { once: true });
    video.addEventListener("error", fail, { once: true });
  });

/** Evenly spaced timestamps, thinned out when the clip would exceed `maxFrames`. */
export function frameTimes(duration: number, intervalSeconds: number, maxFrames: number): number[] {
  const wanted = Math.max(1, Math.floor(duration / intervalSeconds));
  const count = Math.min(wanted, maxFrames);
  const step = duration / count;
  // Sample the middle of each slice so the first frame isn't a black fade-in.
  return Array.from({ length: count }, (_, i) => Math.min(duration - 0.05, step * i + step / 2));
}

/**
 * Splits a video file into JPEG stills in the browser, one per sampled timestamp.
 * The stills are ordinary `File`s so they go through the same upload path as picture uploads.
 */
export async function extractFrames(file: File, options: ExtractOptions): Promise<File[]> {
  const { intervalSeconds, maxFrames, maxWidth, onProgress, signal } = options;
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = url;

  try {
    await once(video, "loadedmetadata");
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      throw new Error("This video has no readable duration.");
    }

    const scale = Math.min(1, maxWidth / video.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser can't process video frames.");

    const times = frameTimes(video.duration, intervalSeconds, maxFrames);
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const frames: File[] = [];

    for (const [index, time] of times.entries()) {
      if (signal?.aborted) throw new DOMException("Frame extraction cancelled", "AbortError");
      const seeked = once(video, "seeked");
      video.currentTime = time;
      await seeked;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
      if (!blob) throw new Error("A frame could not be encoded.");
      const number = String(index + 1).padStart(3, "0");
      frames.push(new File([blob], `${baseName}-frame-${number}.jpg`, { type: "image/jpeg" }));
      onProgress?.(index + 1, times.length);
    }
    return frames;
  } finally {
    URL.revokeObjectURL(url);
    video.removeAttribute("src");
    video.load();
  }
}
