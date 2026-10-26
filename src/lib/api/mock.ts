import { endpoints } from "./endpoints";
import { faqItems } from "@/content/faq";
import { researchArticles } from "@/content/research";
import type { HttpAdapter } from "./http";
import type { ScanResult } from "./types";

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

type Handler = (body?: unknown) => unknown;

const mockScanResult = (model: ScanResult["model"]): ScanResult => ({
  id: `mock-${model}`,
  model,
  summary: "Mock result. Replace once the prediction endpoint contract is agreed.",
  imageUrls: [],
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
  [`POST ${endpoints.scan.predictMid}`]: () => mockScanResult("predictMid"),
  [`POST ${endpoints.scan.predictSize}`]: () => mockScanResult("predictSize"),
  [`POST ${endpoints.scan.predictYolo}`]: () => mockScanResult("predictYolo"),
};

export const mockAdapter: HttpAdapter = async <T,>(path: string, options: { method?: string; body?: unknown }) => {
  await wait();
  const handler = handlers[`${options.method ?? "GET"} ${path}`];
  if (!handler) {
    throw new Error(`[mock api] No handler for ${options.method ?? "GET"} ${path}`);
  }
  return handler(options.body) as T;
};
