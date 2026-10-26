import type { ScanModelId } from "./types";

/**
 * Every backend path the app talks to, in one file.
 * Changing a route means editing it here and nowhere else.
 *
 * `scan.predict` paths come from the previous codebase and are the only ones confirmed against a
 * live backend. The other groups are placeholders until their contracts are agreed.
 */
export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  contact: {
    send: "/contact",
  },
  newsletter: {
    subscribe: "/newsletter/subscribe",
  },
  research: {
    list: "/research",
    detail: (id: string) => `/research/${id}`,
  },
  faq: {
    list: "/faq",
  },
  scan: {
    /** POST the raw image bytes as the request body. */
    predict: {
      "detect-atrophy": "/predictmid/",
      "measure-atrophy-v1": "/predictsz/",
      "measure-atrophy-yolo": "/predictyolo",
    } satisfies Record<ScanModelId, string>,
  },
} as const;
