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
  /** Not present in the Figma file yet, so it stays optional. */
  answer?: string;
}

export interface ResearchArticle {
  id: string;
  title: string;
  href?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupPayload extends Credentials {
  name: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export type ScanModelId = "predictMid" | "predictSize" | "predictYolo";

export interface ScanRequest {
  model: ScanModelId;
  files: File[];
}

export interface ScanResult {
  id: string;
  model: ScanModelId;
  summary: string;
  imageUrls: string[];
}

export interface AckResponse {
  ok: true;
}
