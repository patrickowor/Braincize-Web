import { apiConfig } from "./config";
import { mockAdapter } from "./mock";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/** The only thing a service depends on. Swap the adapter to change transport. */
export type HttpAdapter = <T>(path: string, options: RequestOptions) => Promise<T>;

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

const fetchAdapter: HttpAdapter = async <T,>(path: string, options: RequestOptions) => {
  const { method = "GET", body, headers = {}, signal } = options;
  const timeout = AbortSignal.timeout(apiConfig.timeoutMs);

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body && !isFormData(body) ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? (isFormData(body) ? body : JSON.stringify(body)) : undefined,
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(
      (payload as { message?: string } | undefined)?.message ?? response.statusText,
      response.status,
      payload,
    );
  }
  return payload as T;
};

const adapter: HttpAdapter = apiConfig.useMock ? mockAdapter : fetchAdapter;

export const http = {
  get: <T,>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    adapter<T>(path, { ...options, method: "GET" }),
  post: <T,>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    adapter<T>(path, { ...options, method: "POST", body }),
  put: <T,>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    adapter<T>(path, { ...options, method: "PUT", body }),
  patch: <T,>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    adapter<T>(path, { ...options, method: "PATCH", body }),
  delete: <T,>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    adapter<T>(path, { ...options, method: "DELETE" }),
};
