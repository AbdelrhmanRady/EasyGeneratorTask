import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-[minmax(280px,42%)_1fr]">
      <Outlet />
    </div>
  );
}
