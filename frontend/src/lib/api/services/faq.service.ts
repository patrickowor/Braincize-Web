import { faqItems } from "@/content/faq";
import { http } from "../http";
import { endpoints } from "../endpoints";
import type { FaqItem } from "../types";

export const faqService = {
  /**
   * The FAQ is rendered on the server and shown on public pages, so it must not depend on the backend
   * being up (including while building). If the request fails, the copy bundled in `content/faq.ts` is used.
   */
  list: () => http.get<FaqItem[]>(endpoints.faq.list).catch(() => faqItems),
};
