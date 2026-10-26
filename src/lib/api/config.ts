/**
 * Single place for API runtime configuration.
 * Everything here is driven by env vars so environments can be switched
 * without touching a component.
 *
 *   NEXT_PUBLIC_API_BASE_URL  backend origin (no trailing slash)
 *   NEXT_PUBLIC_API_MOCK      "true" → serve responses from the in-memory mock adapter
 */
export const apiConfig = {
  baseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://braincize.net").replace(/\/$/, ""),
  useMock: process.env.NEXT_PUBLIC_API_MOCK !== "false",
  timeoutMs: 30_000,
} as const;
