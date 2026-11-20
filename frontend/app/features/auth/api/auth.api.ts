import type { AuthSession, SignInPayload, SignUpPayload } from "../types";

const notImplemented = (operation: string): never => {
  throw new Error(`Auth API is not wired yet: ${operation}`);
};

export async function signUp(_payload: SignUpPayload): Promise<AuthSession> {
  return notImplemented("signUp");
}

export async function signIn(_payload: SignInPayload): Promise<AuthSession> {
  return notImplemented("signIn");
}

export async function signOut(): Promise<void> {
  return notImplemented("signOut");
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  return null;
}
