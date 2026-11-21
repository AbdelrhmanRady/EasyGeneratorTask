import { api } from "~/lib/http";
import type {
  AuthResponse,
  AuthUser,
  SignInPayload,
  SignUpPayload,
  TokenResponse,
} from "../types";

export async function signUp(payload: SignUpPayload) {
  const { data } = await api.post<AuthResponse>("/auth/sign-up", payload);
  return data;
}

export async function signIn(payload: SignInPayload) {
  const { data } = await api.post<AuthResponse>("/auth/sign-in", payload);
  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const { data } = await api.post<TokenResponse>("/auth/token/refresh", {
    refreshToken,
  });
  return data;
}

export async function getMe(accessToken: string) {
  const { data } = await api.get<AuthUser>("/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
}
