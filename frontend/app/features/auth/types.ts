export type SignUpPayload = {
  email: string;
  name: string;
  password: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;
