import { readToken } from "@/lib/auth/session";
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
  /** JSON-serialisable value, FormData, or a Blob/File sent as raw bytes. */
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/** The only thing a service depends on. Swap the adapter to change transport. */
export type HttpAdapter = <T>(path: string, options: RequestOptions) => Promise<T>;

const isFormData = (value: unknown): value is FormData => typeof FormData !== "undefined" && value instanceof FormData;
const isBlob = (value: unknown): value is Blob => typeof Blob !== "undefined" && value instanceof Blob;

function encodeBody(body: unknown): { payload: BodyInit | undefined; contentType?: string } {
  if (body === undefined || body === null) return { payload: undefined };
  if (isFormData(body)) return { payload: body };
  if (isBlob(body)) return { payload: body, contentType: body.type || "application/octet-stream" };
  return { payload: JSON.stringify(body), contentType: "application/json" };
}

const fetchAdapter: HttpAdapter = async <T,>(path: string, options: RequestOptions) => {
  const { method = "GET", body, headers = {}, signal } = options;
  const timeout = AbortSignal.timeout(apiConfig.timeoutMs);
  const { payload, contentType } = encodeBody(body);
  const token = readToken();

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: payload,
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });

  const payloadJson = await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(
      (payloadJson as { message?: string } | undefined)?.message ?? response.statusText,
      response.status,
      payloadJson,
    );
  }
  return payloadJson as T;
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
