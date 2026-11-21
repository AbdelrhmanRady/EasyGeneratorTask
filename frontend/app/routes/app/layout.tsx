import { data, Outlet } from "react-router";
import { requireUser } from "~/features/auth/auth.server";
import type { Route } from "./+types/layout";

export async function loader({ request }: Route.LoaderArgs) {
  const { user, headers } = await requireUser(request);
  return data({ user }, { headers });
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
        <p className="text-sm font-medium tracking-[0.18em] uppercase text-ink/60">
          EasyGenerator
        </p>
        <p className="text-sm text-ink/55">{loaderData.user.email}</p>
      </header>
      <Outlet />
    </div>
  );
}
