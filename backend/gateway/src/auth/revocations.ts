import type { Redis } from "ioredis";

/** Tokens invalidated by logout. Entries only need to live until the token would have expired. */
export interface Revocations {
  revoke(jti: string, expiresAt: number): Promise<void>;
  isRevoked(jti: string): Promise<boolean>;
}

const key = (jti: string) => `auth:revoked:${jti}`;

export function createRedisRevocations(redis: Redis): Revocations {
  return {
    async revoke(jti, expiresAt) {
      const seconds = Math.ceil(expiresAt - Date.now() / 1000);
      if (seconds > 0) await redis.set(key(jti), "1", "EX", seconds);
    },
    async isRevoked(jti) {
      return (await redis.exists(key(jti))) === 1;
    },
  };
}

export function createMemoryRevocations(): Revocations {
  const revoked = new Map<string, number>();
  return {
    async revoke(jti, expiresAt) {
      revoked.set(jti, expiresAt);
    },
    async isRevoked(jti) {
      const expiresAt = revoked.get(jti);
      if (expiresAt === undefined) return false;
      if (expiresAt * 1000 < Date.now()) {
        revoked.delete(jti);
        return false;
      }
      return true;
    },
  };
}
