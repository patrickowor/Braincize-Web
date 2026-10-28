/** Shared request/response shapes. Services return these, components consume them. */

export interface ContactMessage {
  name: string;
  email: string;
  address: string;
  phone: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
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

/* ───────────── auth ───────────── */

export interface Credentials {
  username: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  /** True for accounts listed in the backend's ADMIN_EMAILS. */
  isAdmin?: boolean;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

/* ───────────── models and categories ───────────── */

/** A group of models, e.g. "Brain Scan". `modelCount` is how many the signed-in user can run. */
export interface ModelCategory {
  id: string;
  name: string;
  description: string;
  /** Icon name from the backend (`brain`, `lungs`, ...). Unknown names get a generic icon. */
  icon: string | null;
  /** Short label under the description, e.g. "Image & Video Analysis". */
  inputLabel: string | null;
  position: number;
  modelCount: number;
}

/** An analysis model as the backend lists it for users. */
export interface ScanModel {
  id: string;
  name: string;
  version: string | null;
  type: string | null;
  description: string;
  categoryId: string | null;
  /** MIME types the model takes, e.g. `image/jpeg`. */
  accepts: string[];
  position: number;
}

export interface CategoryDetail extends ModelCategory {
  models: ScanModel[];
}

/* ───────────── scans ───────────── */

export type ScanModelId = string;

export type Severity = "Normal" | "Mild" | "Moderate" | "Severe" | "Detected";

/** What a prediction endpoint answers: a message plus an optional numeric value. */
export interface RawScanResponse {
  message: string;
  value?: number | string | null;
}

/** A prediction interpreted for the UI. */
export interface ScanOutcome {
  severity: Severity;
  /** Number reported by the model, or null when it reported none (e.g. "no shrinkage"). */
  atrophyScore: number | null;
  message: string;
}

export type RemoteItemStatus = "pending" | "processing" | "complete" | "error";

/** One image of a batch as the backend tracks it. */
export interface RemoteScanItem {
  id: string;
  /** Position in the upload, so it can be matched to the file that was sent. */
  index: number;
  name: string;
  status: RemoteItemStatus;
  result?: RawScanResponse;
  error?: string;
}

export interface RemoteScanBatch {
  id: string;
  model: ScanModelId;
  status: "processing" | "complete";
  total: number;
  done: number;
  createdAt: number;
  expiresAt: number;
  items: RemoteScanItem[];
}

export interface AckResponse {
  ok: true;
}
