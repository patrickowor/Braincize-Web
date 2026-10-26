import { http } from "../http";
import { endpoints } from "../endpoints";
import type { AuthSession, Credentials, SignupPayload } from "../types";

export const authService = {
  login: (credentials: Credentials) => http.post<AuthSession>(endpoints.auth.login, credentials),
  signup: (payload: SignupPayload) => http.post<AuthSession>(endpoints.auth.signup, payload),
  logout: () => http.post<void>(endpoints.auth.logout),
  me: () => http.get<AuthSession["user"]>(endpoints.auth.me),
};
