import { researchArticles } from "@/content/research";
import { http } from "../http";
import { endpoints } from "../endpoints";
import type { ResearchArticle } from "../types";

export const researchService = {
  /** Falls back to the copy bundled in `content/research.ts` when the backend can't be reached; see `faqService`. */
  list: () => http.get<ResearchArticle[]>(endpoints.research.list).catch(() => researchArticles),
};
