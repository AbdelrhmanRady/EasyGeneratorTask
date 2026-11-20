import { Button } from "~/components/ui/Button";
import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Application · EasyGenerator" },
    { name: "description", content: "Welcome to the application." },
  ];
}

export default function ApplicationPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-2xl flex-col items-start justify-center px-6 py-16">
      <p className="text-sm font-medium tracking-[0.18em] uppercase text-accent">
        Signed in
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-tight text-ink">
        Welcome to the application.
      </h1>
      <p className="mt-4 max-w-lg text-base text-ink/65">
        This is the protected application page. Session checks and logout will
        be wired in the next step.
      </p>
      <Button variant="secondary" className="mt-8" disabled>
        Log out
      </Button>
    </main>
  );
}
