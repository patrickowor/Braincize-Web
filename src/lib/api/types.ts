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
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

/* ───────────── scans ───────────── */

export type ScanModelId = "detect-atrophy" | "measure-atrophy-v1" | "measure-atrophy-yolo";

export type Severity = "Normal" | "Mild" | "Moderate" | "Severe";

/** What the prediction endpoints return: a message plus an optional numeric value. */
export interface RawScanResponse {
  message: string;
  value?: number | string | null;
}

/** A prediction interpreted for the UI. */
export interface ScanOutcome {
  severity: Severity;
  /** Percentage score reported by the model. */
  atrophyScore: number;
  message: string;
}

export interface AckResponse {
  ok: true;
}
