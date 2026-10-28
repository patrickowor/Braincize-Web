import { EventEmitter } from "node:events";
import type { Redis } from "ioredis";
import type { BatchStatus, ScanItem } from "../types";

/** Progress events. The worker publishes them; the API process relays them to websocket clients. */
export type ScanEvent =
  | { type: "scan:item"; userId: string; batchId: string; item: ScanItem; done: number; total: number }
  | { type: "scan:batch"; userId: string; batchId: string; status: BatchStatus; done: number; total: number };

export interface EventBus {
  publish(event: ScanEvent): Promise<void>;
  /** Resolves to an unsubscribe function. */
  subscribe(handler: (event: ScanEvent) => void): Promise<() => Promise<void>>;
}

const CHANNEL = "scan:events";

/** Redis pub/sub, so the worker and the API can be separate processes (or several of each). */
export function createRedisEventBus(redis: Redis): EventBus {
  return {
    async publish(event) {
      await redis.publish(CHANNEL, JSON.stringify(event));
    },
    async subscribe(handler) {
      const subscriber = redis.duplicate();
      subscriber.on("message", (_channel, payload) => {
        try {
          handler(JSON.parse(payload) as ScanEvent);
        } catch (error) {
          console.error("[events] bad payload", error);
        }
      });
      await subscriber.subscribe(CHANNEL);
      return async () => {
        subscriber.disconnect();
      };
    },
  };
}

export function createMemoryEventBus(): EventBus {
  const emitter = new EventEmitter();
  return {
    async publish(event) {
      emitter.emit("event", event);
    },
    async subscribe(handler) {
      emitter.on("event", handler);
      return async () => {
        emitter.off("event", handler);
      };
    },
  };
}
