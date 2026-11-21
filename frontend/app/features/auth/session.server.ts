import { createCookieSessionStorage } from "react-router";

export type AuthSessionData = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
};

const sessionSecret =
  process.env.SESSION_SECRET ?? "easygenerator-dev-session-secret";

export const authSessionStorage = createCookieSessionStorage<AuthSessionData>({
  cookie: {
    name: "__eg_auth",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  },
});

export const { getSession, commitSession, destroySession } = authSessionStorage;
