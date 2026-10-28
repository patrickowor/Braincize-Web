import type { NextFunction, Request, Response } from "express";
import type { Database } from "../db/types";
import { HttpError } from "../errors";
import type { Revocations } from "./revocations";
import type { TokenClaims, TokenService } from "./tokens";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: TokenClaims;
    }
  }
}

/** Shared by the HTTP middleware and the websocket handshake. Throws on any invalid token. */
export function createAuthenticator(tokens: TokenService, revocations: Revocations) {
  return async function authenticate(token: unknown): Promise<TokenClaims> {
    if (typeof token !== "string" || !token) throw new Error("Missing token");
    const claims = tokens.verify(token);
    if (await revocations.isRevoked(claims.jti)) throw new Error("Token revoked");
    return claims;
  };
}

export type Authenticator = ReturnType<typeof createAuthenticator>;

export const bearerToken = (request: Request) => {
  const header = request.headers.authorization;
  return header?.startsWith("Bearer ") ? header.slice(7).trim() : undefined;
};

export const isAdmin = (adminEmails: string[], email: string) => adminEmails.includes(email.toLowerCase());

/** Use after `requireAuth`. Admins are the users whose email is listed in `ADMIN_EMAILS`. */
export function requireAdmin(db: Pick<Database, "users">, adminEmails: string[]) {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const user = await db.users.findById(request.auth!.userId);
      if (!user || !isAdmin(adminEmails, user.email)) throw new HttpError(403, "Only administrators can do this.");
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAuth(authenticate: Authenticator) {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      request.auth = await authenticate(bearerToken(request));
      next();
    } catch {
      next(new HttpError(401, "Please sign in to continue."));
    }
  };
}
