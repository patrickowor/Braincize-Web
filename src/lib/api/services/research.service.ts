import { http } from "../http";
import { endpoints } from "../endpoints";
import type { ResearchArticle } from "../types";

export const researchService = {
  list: () => http.get<ResearchArticle[]>(endpoints.research.list),
};
