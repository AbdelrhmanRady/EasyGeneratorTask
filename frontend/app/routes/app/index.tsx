import { Form, redirect, useNavigation } from "react-router";
import { Button } from "~/components/ui/Button";
import { clearAuthCookie } from "~/features/auth/auth.server";
import { paths } from "~/lib/paths";
import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Application · EasyGenerator" },
    { name: "description", content: "Welcome to the application." },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  return redirect(paths.signIn, {
    headers: { "Set-Cookie": await clearAuthCookie(request) },
  });
}

export default function ApplicationPage() {
  const navigation = useNavigation();
  const loggingOut = navigation.state !== "idle";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-2xl flex-col items-start justify-center px-6 py-16">
      <p className="text-sm font-medium tracking-[0.18em] uppercase text-accent">
        Signed in
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-tight text-ink">
        Welcome to the application.
      </h1>
      <p className="mt-4 max-w-lg text-base text-ink/65">
        You are signed in. Use log out when you are done with this session.
      </p>
      <Form method="post" className="mt-8">
        <Button type="submit" variant="secondary" disabled={loggingOut}>
          {loggingOut ? "Signing out…" : "Log out"}
        </Button>
      </Form>
    </main>
  );
}
