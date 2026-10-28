import { io } from "socket.io-client";
import { env } from "@/config/env";
import { api } from "@/lib/api";
import type { RemoteScanBatch, RemoteScanItem } from "@/lib/api/types";
import { readToken } from "@/lib/auth/session";
import { createMockScanTracker } from "./mockTracker";

/**
 * Follows uploaded batches until their results are in.
 *
 * The backend pushes `scan:item` and `scan:batch` events over a websocket. Because events can arrive
 * before the upload response has been read, or be missed while the socket reconnects, every watched
 * batch is also read from `GET /scans/:id` once up front, again when the batch finishes, and every
 * `NEXT_PUBLIC_SCAN_POLL_MS` in between. `onItem` may therefore be called more than once for the same
 * item with the same state; it must be idempotent.
 */
export interface ScanTracker {
  /** Calls `onItem` for each update to the batch's items and resolves when the batch is finished (or `signal` aborts). */
  watch(batch: RemoteScanBatch, onItem: (item: RemoteScanItem) => void, signal?: AbortSignal): Promise<void>;
  /** Releases the connection. Call once the scan run is over. */
  close(): void;
}

type Message = { kind: "item"; item: RemoteScanItem } | { kind: "batch" };

/** Events for batches nobody is watching yet are kept briefly; this bounds how many batches that covers. */
const MAX_EARLY_BATCHES = 50;

function createSocketScanTracker(): ScanTracker {
  const socket = io(env.socketUrl, {
    // A function, so a reconnect picks up the current token.
    auth: (send) => send({ token: readToken() ?? "" }),
    transports: ["websocket"],
  });

  const watchers = new Map<string, (message: Message) => void>();
  const early = new Map<string, Message[]>();

  const dispatch = (batchId: string, message: Message) => {
    const handle = watchers.get(batchId);
    if (handle) return handle(message);
    if (!early.has(batchId) && early.size >= MAX_EARLY_BATCHES) early.delete(early.keys().next().value!);
    early.set(batchId, [...(early.get(batchId) ?? []), message]);
  };

  socket.on("scan:item", (event: { batchId: string; item: RemoteScanItem }) => dispatch(event.batchId, { kind: "item", item: event.item }));
  socket.on("scan:batch", (event: { batchId: string }) => dispatch(event.batchId, { kind: "batch" }));

  return {
    watch(batch, onItem, signal) {
      return new Promise<void>((resolve) => {
        let finished = false;

        const finish = () => {
          if (finished) return;
          finished = true;
          clearInterval(timer);
          watchers.delete(batch.id);
          signal?.removeEventListener("abort", finish);
          resolve();
        };

        const sync = async () => {
          try {
            const fresh = await api.scan.batch(batch.id);
            fresh.items.forEach(onItem);
            if (fresh.status === "complete") finish();
          } catch (error) {
            // The batch has expired or was never kept: nothing more will arrive. Anything else is retried on the next tick.
            if ((error as { status?: number }).status === 404) finish();
          }
        };

        const timer = setInterval(sync, env.scanPollMs);

        const handle = (message: Message) => {
          if (finished) return;
          if (message.kind === "item") onItem(message.item);
          else void sync(); // every item event came first, so this read is the final, consistent state
        };

        watchers.set(batch.id, handle);
        early.get(batch.id)?.forEach(handle);
        early.delete(batch.id);

        signal?.addEventListener("abort", finish);
        if (signal?.aborted) return finish();
        void sync();
      });
    },
    close: () => {
      socket.close();
    },
  };
}

export function createScanTracker(): ScanTracker {
  return env.useMock ? createMockScanTracker() : createSocketScanTracker();
}
