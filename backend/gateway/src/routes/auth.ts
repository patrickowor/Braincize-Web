import { randomUUID } from "node:crypto";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { isAdmin, requireAuth, type Authenticator } from "../auth/authenticate";
import { hashPassword, verifyPassword } from "../auth/passwords";
import type { TokenService } from "../auth/tokens";
import type { Revocations } from "../auth/revocations";
import { EmailTakenError, type Database, type User } from "../db/types";
import { HttpError } from "../errors";

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

/** The frontend's login form sends `username`; accounts are created with an email, so that is the username. */
const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(1).max(254),
  password: z.string().min(1).max(200),
});

const publicUser = (user: User, adminEmails: string[]) => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email,
  isAdmin: isAdmin(adminEmails, user.email),
});

// Hashed once so a login for an unknown email costs the same as one for a known email.
const decoyHash = hashPassword("decoy-password");

interface Deps {
  db: Database;
  tokens: TokenService;
  revocations: Revocations;
  authenticate: Authenticator;
  config: { adminEmails: string[] };
}

export function authRouter({ db, tokens, revocations, authenticate, config }: Deps) {
  const router = Router();
  router.use(rateLimit({ windowMs: 15 * 60_000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false }));

  const session = (user: User) => ({ token: tokens.issue(user.id), user: publicUser(user, config.adminEmails) });

  router.post("/signup", async (request, response) => {
    const body = signupSchema.parse(request.body);
    try {
      const user = await db.users.create({
        id: randomUUID(), firstName: body.firstName, lastName: body.lastName, email: body.email,
        passwordHash: await hashPassword(body.password),
      });
      response.status(201).json(session(user));
    } catch (error) {
      if (error instanceof EmailTakenError) throw new HttpError(409, error.message);
      throw error;
    }
  });

  router.post("/login", async (request, response) => {
    const body = loginSchema.parse(request.body);
    const user = await db.users.findByEmail(body.username);
    const valid = await verifyPassword(body.password, user?.passwordHash ?? (await decoyHash));
    if (!user || !valid) throw new HttpError(401, "Incorrect email or password.");
    response.json(session(user));
  });

  router.post("/logout", requireAuth(authenticate), async (request, response) => {
    const { jti, exp } = request.auth!;
    await revocations.revoke(jti, exp);
    response.status(204).end();
  });

  router.get("/me", requireAuth(authenticate), async (request, response) => {
    const user = await db.users.findById(request.auth!.userId);
    if (!user) throw new HttpError(401, "Please sign in to continue.");
    response.json(publicUser(user, config.adminEmails));
  });

  return router;
}
