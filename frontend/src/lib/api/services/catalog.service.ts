import { http } from "../http";
import { endpoints } from "../endpoints";
import type { CategoryDetail, ModelCategory, ScanModel } from "../types";

/** The registry of categories and the models attached to them. */
export const catalogService = {
  categories: () => http.get<ModelCategory[]>(endpoints.categories.list),
  /** One category with its models. Rejects with a 404 `ApiError` for an unknown id. */
  category: (id: string) => http.get<CategoryDetail>(endpoints.categories.detail(id)),
  /** Every model the user can run, or only those of one category. */
  models: (categoryId?: string) =>
    http.get<ScanModel[]>(categoryId ? endpoints.categories.models(categoryId) : endpoints.models.list),
};
