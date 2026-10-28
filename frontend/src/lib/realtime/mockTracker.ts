import { mockScanResult } from "@/lib/api/mock";
import type { ScanTracker } from "./scanTracker";

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => (clearTimeout(timer), resolve()), { once: true });
  });

/** Stands in for the websocket when NEXT_PUBLIC_API_MOCK=true: finishes the items one by one. */
export function createMockScanTracker(): ScanTracker {
  return {
    async watch(batch, onItem, signal) {
      for (const item of batch.items) {
        if (signal?.aborted) return;
        onItem({ ...item, status: "processing" });
        await delay(400 + Math.random() * 500, signal);
        if (signal?.aborted) return;
        onItem({ ...item, status: "complete", result: mockScanResult() });
      }
    },
    close() {},
  };
}
