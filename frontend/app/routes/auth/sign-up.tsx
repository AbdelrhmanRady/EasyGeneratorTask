import { data, Link } from "react-router";
import {
  redirectIfAuthenticated,
  signUpAndRedirect,
  toAuthFormError,
} from "~/features/auth/auth.server";
import { AuthPanel } from "~/features/auth/components/AuthPanel";
import { SignUpForm } from "~/features/auth/components/SignUpForm";
import { fieldErrorsOf, signUpSchema } from "~/features/auth/lib/validation";
import { paths } from "~/lib/paths";
import type { Route } from "./+types/sign-up";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign up · EasyGenerator" },
    { name: "description", content: "Create an EasyGenerator account." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  await redirectIfAuthenticated(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const parsed = signUpSchema.safeParse(values);

  if (!parsed.success) {
    return data(
      {
        fieldErrors: fieldErrorsOf(parsed.error),
        values: { name: values.name, email: values.email },
      },
      { status: 400 },
    );
  }

  try {
    return await signUpAndRedirect(request, parsed.data);
  } catch (error) {
    if (error instanceof Response) throw error;
    return toAuthFormError(error, {
      name: parsed.data.name,
      email: parsed.data.email,
    });
  }
}

export default function SignUpPage({ actionData }: Route.ComponentProps) {
  return (
    <>
      <AuthPanel
        eyebrow="EasyGenerator"
        title="Start in a few minutes."
        description="Create an account with your name, email, and a strong password."
      />
      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <p className="mb-2 text-sm font-medium tracking-[0.18em] uppercase text-ink/50 lg:hidden">
            EasyGenerator
          </p>
          <h2 className="font-serif text-4xl text-ink">Create your account</h2>
          <p className="mt-2 text-sm text-ink/60">
            Already have one?{" "}
            <Link className="font-medium text-accent hover:underline" to={paths.signIn}>
              Sign in
            </Link>
          </p>
          <div className="mt-8">
            <SignUpForm result={actionData ?? undefined} />
          </div>
        </div>
      </main>
    </>
  );
}
