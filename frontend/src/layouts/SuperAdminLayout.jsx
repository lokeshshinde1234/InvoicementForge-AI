import { Outlet } from "react-router-dom";
import { Nav } from "./Nav.jsx";

export function SuperAdminLayout() {
  return (
    <div className="app-shell">
      <Nav mode="superadmin" />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
