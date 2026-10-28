"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type AuthUser, type Credentials, type SignupPayload } from "@/lib/api";
import { clearSession, readToken, readUser, saveSession } from "@/lib/auth/session";

interface AuthContextValue {
  user: AuthUser | null;
  /** False until the stored session has been read on the client. */
  ready: boolean;
  login: (credentials: Credentials) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readToken() ? readUser() : null);
    setReady(true);
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    const session = await api.auth.login(credentials);
    saveSession(session);
    setUser(session.user);
    return session.user;
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    const session = await api.auth.signup(payload);
    saveSession(session);
    setUser(session.user);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      clearSession();
      setUser(null);
      router.push("/");
      router.refresh();
    }
  }, [router]);

  const value = useMemo(() => ({ user, ready, login, signup, logout }), [user, ready, login, signup, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
