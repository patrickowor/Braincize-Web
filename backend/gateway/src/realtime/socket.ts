import type http from "node:http";
import { Server } from "socket.io";
import type { Authenticator } from "../auth/authenticate";
import type { EventBus } from "../events/bus";

const room = (userId: string) => `user:${userId}`;

/**
 * Websocket endpoint. Connect with `io(API_URL, { auth: { token } })`. Each user is put in their
 * own room and receives only their own events:
 *   scan:item   { batchId, item, done, total }      an image started, finished or failed
 *   scan:batch  { batchId, status, done, total }    every image in a batch is finished
 * Missed events (page reload, dropped connection) can be recovered with GET /scans/:id.
 */
export async function attachRealtime(
  server: http.Server,
  { corsOrigins, authenticate, events }: { corsOrigins: string[]; authenticate: Authenticator; events: EventBus },
) {
  const io = new Server(server, { cors: { origin: corsOrigins, credentials: true } });

  io.use(async (socket, next) => {
    try {
      const { userId } = await authenticate(socket.handshake.auth?.token);
      socket.data.userId = userId;
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    void socket.join(room(socket.data.userId as string));
  });

  const unsubscribe = await events.subscribe(({ userId, type, ...payload }) => {
    io.to(room(userId)).emit(type, payload);
  });

  return {
    io,
    async close() {
      await unsubscribe();
      await io.close();
    },
  };
}
