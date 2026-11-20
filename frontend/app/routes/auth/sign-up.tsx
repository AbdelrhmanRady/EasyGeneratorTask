import { Link } from "react-router";
import { AuthPanel } from "~/features/auth/components/AuthPanel";
import { SignUpForm } from "~/features/auth/components/SignUpForm";
import { paths } from "~/lib/paths";
import type { Route } from "./+types/sign-up";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign up · EasyGenerator" },
    { name: "description", content: "Create an EasyGenerator account." },
  ];
}

export default function SignUpPage() {
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
            <SignUpForm />
          </div>
        </div>
      </main>
    </>
  );
}
