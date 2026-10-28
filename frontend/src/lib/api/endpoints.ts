/**
 * Every backend path the app talks to, in one file.
 * Changing a route means editing it here and nowhere else.
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
  categories: {
    list: "/categories",
    detail: (id: string) => `/categories/${encodeURIComponent(id)}`,
    models: (id: string) => `/categories/${encodeURIComponent(id)}/models`,
  },
  models: {
    list: "/models",
  },
  scan: {
    /** POST multipart: `model` plus one or more `images`. Results then arrive over the websocket. */
    submit: "/scans",
    batch: (id: string) => `/scans/${encodeURIComponent(id)}`,
  },
} as const;
