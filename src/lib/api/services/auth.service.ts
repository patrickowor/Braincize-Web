import { http } from "../http";
import { endpoints } from "../endpoints";
import type { AuthUser, Credentials, SignupPayload } from "../types";

export const authService = {
  login: (credentials: Credentials) => http.post<AuthUser>(endpoints.auth.login, credentials),
  signup: (payload: SignupPayload) => http.post<AuthUser>(endpoints.auth.signup, payload),
  logout: () => http.post<void>(endpoints.auth.logout),
  me: () => http.get<AuthUser>(endpoints.auth.me),
};
