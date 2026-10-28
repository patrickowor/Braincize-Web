import { http } from "../http";
import { endpoints } from "../endpoints";
import type { AckResponse, NewsletterSubscription } from "../types";

export const newsletterService = {
  subscribe: (subscription: NewsletterSubscription) =>
    http.post<AckResponse>(endpoints.newsletter.subscribe, subscription),
};
