import { isAxiosError } from "axios";
import { data, redirect } from "react-router";
import { paths } from "~/lib/paths";
import { getMe, refreshAccessToken, signIn, signUp } from "./api/auth.api";
import { commitSession, destroySession, getSession } from "./session.server";
import type {
  AuthFormResult,
  AuthResponse,
  AuthUser,
  SignInPayload,
  SignUpPayload,
  TokenResponse,
} from "./types";

const REFRESH_SKEW_MS = 60_000;

function applyTokens(
  session: Awaited<ReturnType<typeof getSession>>,
  tokens: TokenResponse,
) {
  session.set("accessToken", tokens.accessToken);
  session.set("refreshToken", tokens.refreshToken);
  session.set(
    "accessTokenExpiresAt",
    Date.now() + tokens.expiresIn * 1000,
  );
}

export async function createAuthCookie(request: Request, tokens: TokenResponse) {
  const session = await getSession(request.headers.get("Cookie"));
  applyTokens(session, tokens);
  return commitSession(session);
}

export async function clearAuthCookie(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return destroySession(session);
}

async function refreshSession(
  session: Awaited<ReturnType<typeof getSession>>,
) {
  const refreshToken = session.get("refreshToken");
  if (!refreshToken) return false;

  try {
    const tokens = await refreshAccessToken(refreshToken);
    applyTokens(session, tokens);
    return true;
  } catch {
    return false;
  }
}

export async function requireUser(request: Request): Promise<{
  user: AuthUser;
  headers: Headers;
}> {
  const session = await getSession(request.headers.get("Cookie"));
  const headers = new Headers();
  let accessToken = session.get("accessToken");
  const expiresAt = session.get("accessTokenExpiresAt") ?? 0;
  const needsRefresh =
    !accessToken || Date.now() >= expiresAt - REFRESH_SKEW_MS;

  if (needsRefresh) {
    const refreshed = await refreshSession(session);
    if (refreshed) {
      accessToken = session.get("accessToken");
      headers.set("Set-Cookie", await commitSession(session));
    } else if (!accessToken) {
      throw redirect(paths.signIn, {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }
  }

  try {
    const user = await getMe(accessToken as string);
    return { user, headers };
  } catch (error) {
    if (!isAxiosError(error) || error.response?.status !== 401) {
      throw error;
    }

    const refreshed = await refreshSession(session);
    if (!refreshed) {
      throw redirect(paths.signIn, {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }

    headers.set("Set-Cookie", await commitSession(session));
    const user = await getMe(session.get("accessToken") as string);
    return { user, headers };
  }
}

export async function redirectIfAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("accessToken") || session.get("refreshToken")) {
    throw redirect(paths.app);
  }
}

export function toAuthFormError(
  error: unknown,
  values: AuthFormResult["values"],
) {
  if (isAxiosError(error) && error.response?.status === 409) {
    return data<AuthFormResult>(
      { fieldErrors: { email: "Email already registered" }, values },
      { status: 409 },
    );
  }

  if (isAxiosError(error) && error.response?.status === 401) {
    return data<AuthFormResult>(
      { formError: "Invalid email or password", values },
      { status: 401 },
    );
  }

  if (isAxiosError(error) && error.response) {
    const message = error.response.data?.message;
    const formError = Array.isArray(message)
      ? message.join(". ")
      : typeof message === "string"
        ? message
        : "Something went wrong. Try again.";

    return data<AuthFormResult>(
      { formError, values },
      { status: error.response.status },
    );
  }

  return data<AuthFormResult>(
    {
      formError: "Unable to reach the server. Try again in a moment.",
      values,
    },
    { status: 503 },
  );
}

export async function authenticateAndRedirect(
  request: Request,
  result: AuthResponse,
) {
  throw redirect(paths.app, {
    headers: {
      "Set-Cookie": await createAuthCookie(request, result),
    },
  });
}

export async function signUpAndRedirect(
  request: Request,
  payload: SignUpPayload,
) {
  const result = await signUp(payload);
  return authenticateAndRedirect(request, result);
}

export async function signInAndRedirect(
  request: Request,
  payload: SignInPayload,
) {
  const result = await signIn(payload);
  return authenticateAndRedirect(request, result);
}
