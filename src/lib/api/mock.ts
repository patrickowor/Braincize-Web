import { endpoints } from "./endpoints";
import { faqItems } from "@/content/faq";
import { researchArticles } from "@/content/research";
import type { HttpAdapter } from "./http";
import type { AuthSession, Credentials, RawScanResponse, SignupPayload } from "./types";

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

type Handler = (body?: unknown) => unknown;

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Same shape as the live prediction endpoints, so the UI is exercised end to end. */
const mockScan = (): RawScanResponse =>
  pick<RawScanResponse>([
    { message: "small atrophy detected", value: round1(5 + Math.random() * 10) },
    { message: "medium atrophy detected", value: round1(15 + Math.random() * 15) },
    { message: "large atrophy detected", value: round1(30 + Math.random() * 25) },
    { message: "no atrophy detected", value: round1(Math.random() * 4) },
  ]);

/** Accepts any non-empty credentials. Replace with the real auth API when it exists. */
const mockSession = (name: string, email?: string): AuthSession => ({
  token: `mock-${Math.random().toString(36).slice(2)}`,
  user: { id: "mock-user", name, email },
});

/**
 * Responses used while no backend contract exists (NEXT_PUBLIC_API_MOCK !== "false").
 * Keyed by `"METHOD path"`. Delete an entry once its real endpoint is live.
 */
const handlers: Record<string, Handler> = {
  [`GET ${endpoints.faq.list}`]: () => faqItems,
  [`GET ${endpoints.research.list}`]: () => researchArticles,
  [`POST ${endpoints.contact.send}`]: () => ({ ok: true }),
  [`POST ${endpoints.newsletter.subscribe}`]: () => ({ ok: true }),
  [`POST ${endpoints.auth.login}`]: (body) => mockSession((body as Credentials).username),
  [`POST ${endpoints.auth.signup}`]: (body) => {
    const { firstName, lastName, email } = body as SignupPayload;
    return mockSession(`${firstName} ${lastName}`.trim(), email);
  },
  [`POST ${endpoints.auth.logout}`]: () => undefined,
  ...Object.fromEntries(Object.values(endpoints.scan.predict).map((path) => [`POST ${path}`, mockScan])),
};

export const mockAdapter: HttpAdapter = async <T,>(path: string, options: { method?: string; body?: unknown }) => {
  await wait(path.startsWith("/predict") ? 700 : 400);
  const handler = handlers[`${options.method ?? "GET"} ${path}`];
  if (!handler) {
    throw new Error(`[mock api] No handler for ${options.method ?? "GET"} ${path}`);
  }
  return handler(options.body) as T;
};
