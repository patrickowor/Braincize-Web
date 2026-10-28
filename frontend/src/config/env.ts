/**
 * Every environment-driven setting, read once. Change values in `.env.local` (see `.env.example`),
 * never in components.
 *
 * Next only inlines `process.env.NEXT_PUBLIC_*` when it is written out in full, so each variable is
 * named literally below. Bad or missing values fall back to the defaults.
 */

const positiveNumber = (raw: string | undefined, fallback: number) => {
  const value = Number(raw);
  return raw !== undefined && raw.trim() !== "" && Number.isFinite(value) && value > 0 ? value : fallback;
};

const positiveInteger = (raw: string | undefined, fallback: number) => Math.floor(positiveNumber(raw, fallback));

const numberList = (raw: string | undefined, fallback: number[]) => {
  const values = (raw ?? "")
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);
  return values.length ? values : fallback;
};

const trimSlash = (url: string) => url.replace(/\/+$/, "");

const apiBaseUrl = trimSlash(process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:3001");
const frameIntervals = numberList(process.env.NEXT_PUBLIC_FRAME_INTERVALS, [0.5, 1, 2, 5]);
const defaultFrameInterval = positiveNumber(process.env.NEXT_PUBLIC_DEFAULT_FRAME_INTERVAL, 1);

export const env = {
  /** Backend origin, no trailing slash. */
  apiBaseUrl,
  /** Websocket origin. Same server as the API unless it is split out. */
  socketUrl: trimSlash(process.env.NEXT_PUBLIC_SOCKET_URL?.trim() || apiBaseUrl),
  /** Serve responses from the in-memory mock instead of the backend. Opt-in. */
  useMock: process.env.NEXT_PUBLIC_API_MOCK === "true",
  /** Per request, in milliseconds. Applies to uploads too. */
  apiTimeoutMs: positiveInteger(process.env.NEXT_PUBLIC_API_TIMEOUT_MS, 30_000),

  /** Files sent in one upload request. Larger sets are split across several requests. */
  uploadBatchSize: positiveInteger(process.env.NEXT_PUBLIC_UPLOAD_BATCH_SIZE, 10),
  /** How often a running batch is re-read as a safety net while the websocket does the real work. */
  scanPollMs: positiveInteger(process.env.NEXT_PUBLIC_SCAN_POLL_MS, 5_000),

  /** Video is sampled into stills at one of these intervals (seconds). */
  frameIntervals,
  defaultFrameInterval: frameIntervals.includes(defaultFrameInterval) ? defaultFrameInterval : frameIntervals[0]!,
  /** Upper bound on frames taken from one video; longer clips are sampled more sparsely. */
  maxFrames: positiveInteger(process.env.NEXT_PUBLIC_MAX_FRAMES, 60),
  /** Frames wider than this are scaled down before upload. */
  maxFrameWidth: positiveInteger(process.env.NEXT_PUBLIC_MAX_FRAME_WIDTH, 1280),
} as const;
