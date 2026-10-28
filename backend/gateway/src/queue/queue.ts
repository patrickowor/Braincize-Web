import amqp from "amqp-connection-manager";
import type { ConfirmChannel, ConsumeMessage } from "amqplib";
import type { ScanJobMessage } from "../types";

export interface ScanQueue {
  publish(job: ScanJobMessage): Promise<void>;
  /**
   * Handles up to `concurrency` jobs at once. A job is acknowledged when the handler resolves;
   * if it throws, the job goes back on the queue after a short pause.
   */
  consume(handler: (job: ScanJobMessage) => Promise<void>, concurrency: number): Promise<void>;
  close(): Promise<void>;
}

const QUEUE = "scan.images";
const REQUEUE_DELAY_MS = 1000;
const PUBLISH_TIMEOUT_MS = 10_000;

/** `ttlMs` is stamped on each message so nothing waits on the queue longer than the job TTL. */
export function createRabbitQueue(url: string, ttlMs: number): ScanQueue {
  const connection = amqp.connect([url]);
  connection.on("connect", () => console.log("[rabbitmq] connected"));
  connection.on("disconnect", ({ err }) => console.warn("[rabbitmq] disconnected:", err?.message));

  const channel = connection.createChannel({
    json: true,
    setup: (ch: ConfirmChannel) => ch.assertQueue(QUEUE, { durable: true }),
  });

  return {
    async publish(job) {
      await channel.sendToQueue(QUEUE, job, { persistent: true, expiration: String(ttlMs), timeout: PUBLISH_TIMEOUT_MS });
    },

    async consume(handler, concurrency) {
      await channel.addSetup(async (ch: ConfirmChannel) => {
        await ch.prefetch(concurrency);
        await ch.consume(QUEUE, (message: ConsumeMessage | null) => {
          if (!message) return;
          void handle(ch, message);
        });
      });

      async function handle(ch: ConfirmChannel, message: ConsumeMessage) {
        let job: ScanJobMessage;
        try {
          job = JSON.parse(message.content.toString()) as ScanJobMessage;
        } catch {
          console.error("[rabbitmq] dropping unreadable message");
          ch.nack(message, false, false);
          return;
        }
        try {
          await handler(job);
          ch.ack(message);
        } catch (error) {
          console.error(`[rabbitmq] job ${job.itemId} failed, requeueing:`, error);
          setTimeout(() => {
            try {
              ch.nack(message, false, true);
            } catch {
              /* channel closed; the broker redelivers unacknowledged messages on its own */
            }
          }, REQUEUE_DELAY_MS);
        }
      }
    },

    async close() {
      await channel.close();
      await connection.close();
    },
  };
}
