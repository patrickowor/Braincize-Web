import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import type { Database } from "../db/types";
import { HttpError } from "../errors";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(254),
  // The form leaves these two optional, so they may arrive empty.
  address: z.string().trim().max(300).default(""),
  phone: z.string().trim().max(40).default(""),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254),
});

/** Public, unauthenticated routes: FAQ, research, contact form and newsletter sign-up. */
export function contentRouter(db: Database) {
  const router = Router();
  const writes = rateLimit({ windowMs: 60 * 60_000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false });

  router.get("/faq", async (_request, response) => {
    response.json(await db.faq.list());
  });

  router.get("/research", async (_request, response) => {
    response.json(await db.research.list());
  });

  router.get("/research/:id", async (request, response) => {
    const article = await db.research.find(String(request.params.id));
    if (!article) throw new HttpError(404, "Article not found.");
    response.json(article);
  });

  router.post("/contact", writes, async (request, response) => {
    await db.contact.create(contactSchema.parse(request.body));
    response.json({ ok: true });
  });

  router.post("/newsletter/subscribe", writes, async (request, response) => {
    await db.newsletter.subscribe(newsletterSchema.parse(request.body).email);
    response.json({ ok: true });
  });

  return router;
}
