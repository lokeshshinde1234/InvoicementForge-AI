import { Outlet } from "react-router-dom";
import { Nav } from "./Nav.jsx";

export function ClientPortalLayout() {
  return (
    <div className="app-shell">
      <Nav mode="client" />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
