import { http } from "../http";
import { endpoints } from "../endpoints";
import type { FaqItem } from "../types";

export const faqService = {
  list: () => http.get<FaqItem[]>(endpoints.faq.list),
};
