import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-ink/10 px-6 py-4">
        <p className="text-sm font-medium tracking-[0.18em] uppercase text-ink/60">
          EasyGenerator
        </p>
      </header>
      <Outlet />
    </div>
  );
}
