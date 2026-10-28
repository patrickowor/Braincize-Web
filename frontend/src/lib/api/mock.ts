import { endpoints } from "./endpoints";
import { faqItems } from "@/content/faq";
import { researchArticles } from "@/content/research";
import { ApiError, type HttpAdapter } from "./http";
import type {
  AuthSession,
  CategoryDetail,
  Credentials,
  ModelCategory,
  RawScanResponse,
  RemoteScanBatch,
  ScanModel,
  SignupPayload,
} from "./types";

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

type Handler = (body?: unknown) => unknown;

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Same shape as the live prediction endpoints, so the UI is exercised end to end. */
export const mockScanResult = (): RawScanResponse =>
  pick<RawScanResponse>([
    { message: "image received. Small autrophy detected with value 12.4mm²", value: round1(5 + Math.random() * 10) },
    { message: "image received. Medium autrophy detected with value 98.4mm²", value: round1(15 + Math.random() * 15) },
    { message: "image received. Large autrophy detected with value 163mm²", value: round1(30 + Math.random() * 25) },
    { message: "image received. prediction completed no sizable shrinkage found", value: 0 },
  ]);

/** Accepts any non-empty credentials. */
const mockSession = (name: string, email?: string): AuthSession => ({
  token: `mock-${Math.random().toString(36).slice(2)}`,
  user: { id: "mock-user", name, email, isAdmin: false },
});

/* Registry data, as the backend would list it. */
const IMAGES = ["image/jpeg", "image/png"];
const mockModels: ScanModel[] = [
  { id: "detect-atrophy", name: "Detect Atrophy", version: "Version 1", type: "Mask RCNN", description: "Deep residual network optimized for brain MRI analysis", categoryId: "brainscan", accepts: IMAGES, position: 0 },
  { id: "measure-atrophy-v1", name: "Detect & Measure Atrophy Size", version: "Version 1", type: "Mask RCNN", description: "Efficiently detect the size of an atrophy with state-of-the-art performance", categoryId: "brainscan", accepts: IMAGES, position: 1 },
  { id: "measure-atrophy-yolo", name: "Detect & Measure Atrophy Size", version: "Version 2", type: "Yolo", description: "Efficiently detect the size of an atrophy with state-of-the-art performance and blazing speed", categoryId: "brainscan", accepts: IMAGES, position: 2 },
];
const mockCategories: Omit<ModelCategory, "modelCount">[] = [
  { id: "brainscan", name: "Brain Scan", description: "Analyze brain MRI images or video for atrophy detection and severity assessment", icon: "brain", inputLabel: "Image & Video Analysis", position: 0 },
  { id: "lungscan", name: "Lung Scan", description: "Upload scans for comprehensive lung analysis and disease detection", icon: "lungs", inputLabel: "Video Analysis", position: 1 },
];
const modelsOf = (categoryId: string) => mockModels.filter((model) => model.categoryId === categoryId);
const withCount = (category: Omit<ModelCategory, "modelCount">): ModelCategory => ({ ...category, modelCount: modelsOf(category.id).length });

/** Queues nothing: the mock tracker (lib/realtime) produces the results. */
const mockSubmit = (body: unknown): RemoteScanBatch => {
  const form = body as FormData;
  const files = form.getAll("images") as File[];
  const id = `mock-batch-${Math.random().toString(36).slice(2)}`;
  const now = Date.now();
  return {
    id,
    model: String(form.get("model")),
    status: "processing",
    total: files.length,
    done: 0,
    createdAt: now,
    expiresAt: now + 48 * 3600 * 1000,
    items: files.map((file, index) => ({ id: `${id}-${index}`, index, name: file.name, status: "pending" })),
  };
};

/**
 * Responses used instead of the backend (NEXT_PUBLIC_API_MOCK=true).
 * Keyed by `"METHOD path"`.
 */
const handlers: Record<string, Handler> = {
  [`GET ${endpoints.faq.list}`]: () => faqItems,
  [`GET ${endpoints.research.list}`]: () => researchArticles,
  [`POST ${endpoints.contact.send}`]: () => ({ ok: true }),
  [`POST ${endpoints.newsletter.subscribe}`]: () => ({ ok: true }),
  [`POST ${endpoints.auth.login}`]: (body) => mockSession((body as Credentials).username),
  [`POST ${endpoints.auth.signup}`]: (body) => {
    const { firstName, lastName, email } = body as SignupPayload;
    return mockSession(`${firstName} ${lastName}`.trim(), email);
  },
  [`POST ${endpoints.auth.logout}`]: () => undefined,
  [`GET ${endpoints.categories.list}`]: () => mockCategories.map(withCount),
  [`GET ${endpoints.models.list}`]: () => mockModels,
  ...Object.fromEntries(
    mockCategories.flatMap((category) => [
      [`GET ${endpoints.categories.detail(category.id)}`, (): CategoryDetail => ({ ...withCount(category), models: modelsOf(category.id) })],
      [`GET ${endpoints.categories.models(category.id)}`, () => modelsOf(category.id)],
    ]),
  ),
  [`POST ${endpoints.scan.submit}`]: mockSubmit,
};

export const mockAdapter: HttpAdapter = async <T,>(path: string, options: { method?: string; body?: unknown }) => {
  await wait(path.startsWith("/scans") ? 700 : 400);
  const handler = handlers[`${options.method ?? "GET"} ${path}`];
  if (!handler) {
    // http.ts and this file import each other; ApiError is only used here at call time, which is safe.
    if (path.startsWith("/categories/")) throw new ApiError("Category not found.", 404);
    throw new Error(`[mock api] No handler for ${options.method ?? "GET"} ${path}`);
  }
  return handler(options.body) as T;
};
