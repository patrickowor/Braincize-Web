import { env } from "@/config/env";

/**
 * Runtime configuration for the API layer. The values come from `src/config/env.ts`
 * (NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_API_MOCK, NEXT_PUBLIC_API_TIMEOUT_MS), so environments can be
 * switched without touching a component.
 */
export const apiConfig = {
  baseUrl: env.apiBaseUrl,
  useMock: env.useMock,
  timeoutMs: env.apiTimeoutMs,
} as const;
