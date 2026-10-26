/**
 * Every backend path the app talks to, in one file.
 * Changing a route means editing it here and nowhere else.
 *
 * `scan.*` paths come from the previous codebase (models.ts).
 * The remaining groups are placeholders until the backend contract is agreed.
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
    models: "/scan/models",
    predictMid: "/predictmid/",
    predictSize: "/predictsz/",
    predictYolo: "/predictyolo",
  },
} as const;
