import { Outlet } from "react-router-dom";
import { Nav } from "./Nav.jsx";

export function SuperAdminLayout() {
  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <Nav mode="superadmin" />
      <main className="w-full min-w-0 p-6">
        <Outlet />
      </main>
    </div>
  );
}

