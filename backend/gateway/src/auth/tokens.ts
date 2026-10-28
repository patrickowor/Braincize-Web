import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";

export interface TokenClaims {
  userId: string;
  /** Unique per token; lets logout revoke it before it expires. */
  jti: string;
  /** Expiry, seconds since the epoch. */
  exp: number;
}

export function createTokenService(secret: string, ttlSeconds: number) {
  return {
    issue(userId: string): string {
      return jwt.sign({}, secret, { algorithm: "HS256", subject: userId, jwtid: randomUUID(), expiresIn: ttlSeconds });
    },
    /** Throws if the token is malformed, tampered with or expired. */
    verify(token: string): TokenClaims {
      const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
      if (typeof payload === "string" || !payload.sub || !payload.jti || !payload.exp) {
        throw new Error("Malformed token");
      }
      return { userId: payload.sub, jti: payload.jti, exp: payload.exp };
    },
  };
}

export type TokenService = ReturnType<typeof createTokenService>;
