/**
 * The only thing the rest of the app knows about persistence. To move off SQLite, implement
 * `Database` (e.g. in `db/postgres.ts`) and return it from `openDatabase` in `db/index.ts`.
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

export type NewUser = Omit<User, "createdAt">;

export interface ContactMessage {
  name: string;
  email: string;
  address: string;
  phone: string;
  message: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer?: string;
}

export interface ResearchArticle {
  id: string;
  title: string;
  href?: string;
}

/** A group of models shown together, e.g. "Brain Scan". Drives the dashboard project picker. */
export interface Category {
  /** URL-safe slug, e.g. `brainscan`. */
  id: string;
  name: string;
  description: string;
  /** Icon name the frontend knows how to draw (`brain`, `lungs`, ...). */
  icon: string | null;
  /** Short label under the description, e.g. "Image & Video Analysis". */
  inputLabel: string | null;
  position: number;
  createdAt: number;
  updatedAt: number;
}

export type NewCategory = Omit<Category, "position" | "createdAt" | "updatedAt"> & { position?: number };
export type CategoryPatch = Partial<Omit<NewCategory, "id">>;

/** Documentation of one answer a model can give, shown to admins. */
export interface ModelResponseDoc {
  when: string;
  example: Record<string, unknown>;
}

/**
 * A prediction endpoint the gateway can call. `bodyMode` says how the file is sent:
 * `raw` posts the bytes as the whole body (what the Python scripts expect); `multipart`
 * posts a form with the file under `fileField`. The answer must be a JSON object with a
 * string `message`; every other field is passed through to the client.
 */
export interface ModelRecord {
  /** URL-safe slug, e.g. `measure-atrophy-yolo`. */
  id: string;
  name: string;
  version: string | null;
  type: string | null;
  description: string;
  categoryId: string | null;
  url: string;
  bodyMode: "raw" | "multipart";
  fileField: string | null;
  /** MIME types the model takes. Uploads are checked against this by file content. */
  accepts: string[];
  /** Extra request headers, e.g. an API key. Only ever shown to admins. */
  headers: Record<string, string>;
  /** Accept a self-signed certificate on https URLs. */
  insecureTls: boolean;
  /** Overrides the global timeout when set. */
  timeoutMs: number | null;
  /** Called by other services, not by users: never listed to non-admins and cannot run scans. */
  internal: boolean;
  enabled: boolean;
  responses: ModelResponseDoc[];
  position: number;
  createdAt: number;
  updatedAt: number;
}

export type NewModel = Omit<ModelRecord, "position" | "createdAt" | "updatedAt"> & { position?: number };
export type ModelPatch = Partial<Omit<NewModel, "id">>;

export interface ModelFilter {
  categoryId?: string;
  /** Include models with `enabled = false`. */
  includeDisabled?: boolean;
  /** Include models with `internal = true`. */
  includeInternal?: boolean;
}

/** Thrown when creating a category or model whose id is taken. */
export class AlreadyExistsError extends Error {
  constructor(what: string) {
    super(`${what} already exists.`);
    this.name = "AlreadyExistsError";
  }
}

/** Thrown by `users.create` when the email is already registered. */
export class EmailTakenError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "EmailTakenError";
  }
}

export interface Database {
  users: {
    create(user: NewUser): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
  };
  contact: {
    create(message: ContactMessage): Promise<void>;
  };
  newsletter: {
    /** Idempotent: subscribing twice is not an error. */
    subscribe(email: string): Promise<void>;
  };
  faq: {
    list(): Promise<FaqItem[]>;
  };
  research: {
    list(): Promise<ResearchArticle[]>;
    find(id: string): Promise<ResearchArticle | null>;
  };
  categories: {
    list(): Promise<Category[]>;
    find(id: string): Promise<Category | null>;
    create(category: NewCategory): Promise<Category>;
    update(id: string, patch: CategoryPatch): Promise<Category | null>;
    delete(id: string): Promise<boolean>;
  };
  models: {
    list(filter?: ModelFilter): Promise<ModelRecord[]>;
    find(id: string): Promise<ModelRecord | null>;
    create(model: NewModel): Promise<ModelRecord>;
    update(id: string, patch: ModelPatch): Promise<ModelRecord | null>;
    delete(id: string): Promise<boolean>;
    /** Makes `modelIds`, in that order, the whole list of `categoryId`; other members become uncategorised. */
    setCategoryModels(categoryId: string, modelIds: string[]): Promise<void>;
  };
  close(): void;
}
