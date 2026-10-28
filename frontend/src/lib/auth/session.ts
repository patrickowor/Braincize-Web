import type { AuthSession, AuthUser } from "@/lib/api/types";

/**
 * Browser-side session storage.
 *
 * The token lives in a cookie so middleware can gate `/dashboard`; the profile is kept in
 * localStorage for instant rendering. Swap this module if auth moves to httpOnly cookies.
 */
export const SESSION_COOKIE = "braincize_session";
const USER_KEY = "braincize_user";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function readToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") || null : null;
}

export function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveSession({ token, user }: AuthSession) {
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable (private mode); the cookie alone still authenticates */
  }
}

export function clearSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}
