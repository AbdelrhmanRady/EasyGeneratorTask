import { data, Link } from "react-router";
import {
  redirectIfAuthenticated,
  signInAndRedirect,
  toAuthFormError,
} from "~/features/auth/auth.server";
import { AuthPanel } from "~/features/auth/components/AuthPanel";
import { SignInForm } from "~/features/auth/components/SignInForm";
import { fieldErrorsOf, signInSchema } from "~/features/auth/lib/validation";
import type { AuthFormResult } from "~/features/auth/types";
import { paths } from "~/lib/paths";
import type { Route } from "./+types/sign-in";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign in · EasyGenerator" },
    { name: "description", content: "Sign in to EasyGenerator." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  await redirectIfAuthenticated(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const parsed = signInSchema.safeParse(values);

  if (!parsed.success) {
    return data<AuthFormResult<"email" | "password">>(
      {
        fieldErrors: fieldErrorsOf(parsed.error),
        values: { email: values.email },
      },
      { status: 400 },
    );
  }

  try {
    return await signInAndRedirect(request, parsed.data);
  } catch (error) {
    if (error instanceof Response) throw error;
    return toAuthFormError<"email" | "password">(error, {
      email: parsed.data.email,
    });
  }
}

export default function SignInPage({ actionData }: Route.ComponentProps) {
  return (
    <>
      <AuthPanel
        eyebrow="EasyGenerator"
        title="Welcome back."
        description="Sign in with the email and password you used to create your account."
      />
      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <p className="mb-2 text-sm font-medium tracking-[0.18em] uppercase text-ink/50 lg:hidden">
            EasyGenerator
          </p>
          <h2 className="font-serif text-4xl text-ink">Sign in</h2>
          <p className="mt-2 text-sm text-ink/60">
            New here?{" "}
            <Link className="font-medium text-accent hover:underline" to={paths.signUp}>
              Create an account
            </Link>
          </p>
          <div className="mt-8">
            <SignInForm result={actionData ?? undefined} />
          </div>
        </div>
      </main>
    </>
  );
}
