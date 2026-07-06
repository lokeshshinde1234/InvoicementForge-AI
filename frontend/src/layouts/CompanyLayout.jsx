import { Outlet } from "react-router-dom";
import { Nav } from "./Nav.jsx";

export function CompanyLayout() {
  return (
    <div className="app-shell">
      <Nav />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
