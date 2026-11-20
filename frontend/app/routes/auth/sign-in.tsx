import { Link } from "react-router";
import { AuthPanel } from "~/features/auth/components/AuthPanel";
import { SignInForm } from "~/features/auth/components/SignInForm";
import { paths } from "~/lib/paths";
import type { Route } from "./+types/sign-in";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign in · EasyGenerator" },
    { name: "description", content: "Sign in to EasyGenerator." },
  ];
}

export default function SignInPage() {
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
            <SignInForm />
          </div>
        </div>
      </main>
    </>
  );
}
