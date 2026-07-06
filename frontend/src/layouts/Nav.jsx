import { FileText, LayoutDashboard, LogOut, Users, Wand2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const links = [
  ["Dashboard", "/company", LayoutDashboard],
  ["Clients", "/company/clients", Users],
  ["Invoice", "/company/invoices/new", FileText],
  ["Proposals", "/company/proposals", Wand2]
];

export function Nav({ mode = "company" }) {
  const logout = useAuthStore((state) => state.logout);
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-line bg-white px-4 py-5">
      <h1 className="text-xl font-semibold text-ink">Invoice Forge AI</h1>
      <nav className="mt-8 grid gap-1">
        {(mode === "company" ? links : [["Overview", mode === "client" ? "/client" : "/superadmin", LayoutDashboard]]).map(([label, to, Icon]) => (
          <NavLink key={to} to={to} end className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${isActive ? "bg-teal text-white" : "text-slate-600 hover:bg-paper"}`}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={logout} className="mt-auto flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-slate-600">
        <LogOut size={17} />
        Sign out
      </button>
    </aside>
  );
}

