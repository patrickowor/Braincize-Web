import { z } from "zod";
import type { NewCategory, NewModel } from "../db/types";
import { SUPPORTED_FILE_TYPES } from "../storage/files";

/*
 * The field shapes carry no defaults on purpose: a PATCH is the same shape made partial, and a default
 * would silently overwrite fields the caller left out. Defaults are applied once, on create, below.
 */

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, digits and single dashes, e.g. brain-scan");

/** Set by the gateway itself, so a stored header must not fight it. */
const RESERVED_HEADERS = new Set(["content-type", "content-length", "host", "transfer-encoding"]);

const httpUrl = z
  .string()
  .trim()
  .url("Enter a full URL, e.g. https://host:4000/predict")
  .refine((value) => !URL.canParse(value) || /^https?:$/.test(new URL(value).protocol), "Only http and https URLs are supported");

const text = (max: number) => z.string().trim().min(1).max(max);

const categoryShape = {
  id: slug,
  name: text(80),
  description: z.string().trim().max(500),
  icon: text(40).nullable(),
  inputLabel: text(80).nullable(),
  position: z.number().int().min(0),
};

export const categoryInput = z
  .object(categoryShape)
  .partial()
  .required({ id: true, name: true })
  .transform(
    (category): NewCategory => ({
      ...category,
      description: category.description ?? "",
      icon: category.icon ?? null,
      inputLabel: category.inputLabel ?? null,
    }),
  );
export const categoryPatch = z.object(categoryShape).omit({ id: true }).partial();

const modelShape = {
  id: slug,
  name: text(80),
  version: text(40).nullable(),
  type: text(40).nullable(),
  description: z.string().trim().max(500),
  categoryId: slug.nullable(),
  url: httpUrl,
  bodyMode: z.enum(["raw", "multipart"]),
  fileField: text(60).nullable(),
  accepts: z.array(z.enum(SUPPORTED_FILE_TYPES)).min(1, "List at least one accepted file type"),
  headers: z
    .record(z.string().min(1).max(100), z.string().max(2000))
    .refine((headers) => !Object.keys(headers).some((name) => RESERVED_HEADERS.has(name.toLowerCase())), {
      message: `These headers are set automatically: ${[...RESERVED_HEADERS].join(", ")}`,
    }),
  insecureTls: z.boolean(),
  timeoutMs: z.number().int().min(1000).max(600_000).nullable(),
  internal: z.boolean(),
  enabled: z.boolean(),
  responses: z.array(z.object({ when: text(300), example: z.record(z.string(), z.unknown()) })),
  position: z.number().int().min(0),
};

export const modelInput = z
  .object(modelShape)
  .partial()
  .required({ id: true, name: true, url: true })
  .transform((model): NewModel => {
    const bodyMode = model.bodyMode ?? "raw";
    return {
      ...model,
      version: model.version ?? null,
      type: model.type ?? null,
      description: model.description ?? "",
      categoryId: model.categoryId ?? null,
      bodyMode,
      // A multipart model without a field name gets the conventional `file`.
      fileField: bodyMode === "multipart" ? (model.fileField ?? "file") : null,
      accepts: model.accepts ?? ["image/jpeg", "image/png"],
      headers: model.headers ?? {},
      insecureTls: model.insecureTls ?? false,
      timeoutMs: model.timeoutMs ?? null,
      internal: model.internal ?? false,
      enabled: model.enabled ?? true,
      responses: model.responses ?? [],
    };
  });
export const modelPatch = z.object(modelShape).omit({ id: true }).partial();

/** Applies a patch to a stored model and re-validates the result, so every PATCH leaves a valid record. */
export const mergeModelPatch = (current: object, patch: z.infer<typeof modelPatch>) => modelInput.parse({ ...current, ...patch });

export const categoryModelsInput = z.object({ modelIds: z.array(slug).max(500) });
