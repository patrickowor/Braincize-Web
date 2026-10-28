import { authService } from "./services/auth.service";
import { catalogService } from "./services/catalog.service";
import { contactService } from "./services/contact.service";
import { faqService } from "./services/faq.service";
import { newsletterService } from "./services/newsletter.service";
import { researchService } from "./services/research.service";
import { scanService } from "./services/scan.service";

/**
 * The only import components need:  import { api } from "@/lib/api"
 * Transport, base URL and routes live in config.ts / endpoints.ts / http.ts.
 */
export const api = {
  auth: authService,
  catalog: catalogService,
  contact: contactService,
  faq: faqService,
  newsletter: newsletterService,
  research: researchService,
  scan: scanService,
};

export { ApiError } from "./http";
export type * from "./types";
