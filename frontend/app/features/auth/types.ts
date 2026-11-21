import type { z } from "zod";
import type { signInSchema, signUpSchema } from "./lib/validation";

export type SignUpPayload = z.infer<typeof signUpSchema>;
export type SignInPayload = z.infer<typeof signInSchema>;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type TokenResponse = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};

export type AuthResponse = TokenResponse & {
  user: AuthUser;
};

export type AuthFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export type AuthFormResult = {
  fieldErrors?: AuthFieldErrors;
  formError?: string;
  values?: {
    name?: string;
    email?: string;
  };
};
