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

function parseFieldErrors(message: string | string[] | undefined) {
  const lines = Array.isArray(message) ? message : message ? [message] : [];
  const fieldErrors: Record<string, string> = {};
  const leftover: string[] = [];

  for (const line of lines) {
    const match = line.match(/^(email|name|password)\s*:\s*(.+)$/i);
    if (match) {
      fieldErrors[match[1].toLowerCase()] = match[2];
    } else {
      leftover.push(line);
    }
  }

  return {
    fieldErrors,
    formError: leftover.join(". ") || undefined,
  };
}

export function toAuthFormError<T extends string>(
  error: unknown,
  values: AuthFormResult<T>["values"],
) {
  if (isAxiosError(error) && error.response) {
    const status = error.response.status;
    const message = error.response.data?.message as string | string[] | undefined;
    const parsed = parseFieldErrors(message);
    const fieldErrors = {
      ...parsed.fieldErrors,
    } as AuthFormResult<T>["fieldErrors"];

    if (status === 409) {
      return data<AuthFormResult<T>>(
        {
          fieldErrors: {
            ...fieldErrors,
            email: "Email already registered",
          } as AuthFormResult<T>["fieldErrors"],
          values,
        },
        { status: 409 },
      );
    }

    if (status === 401) {
      return data<AuthFormResult<T>>(
        { formError: "Invalid email or password", values },
        { status: 401 },
      );
    }

    return data<AuthFormResult<T>>(
      {
        fieldErrors,
        formError:
          parsed.formError ||
          (fieldErrors && Object.keys(fieldErrors).length
            ? undefined
            : error.message),
        values,
      },
      { status },
    );
  }

  return data<AuthFormResult<T>>(
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
