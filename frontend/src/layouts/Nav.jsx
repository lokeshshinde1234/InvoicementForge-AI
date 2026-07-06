import { BadgeIndianRupee, Bell, Building2, FileText, LayoutDashboard, LogOut, ShieldCheck, Sparkles, UploadCloud, Users, Wand2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const companyLinks = [
  ["Dashboard", "/company", LayoutDashboard],
  ["Clients", "/company/clients", Users],
  ["Invoice Studio", "/company/invoices/new", FileText],
  ["AI Proposals", "/company/proposals", Wand2]
];

const modeLinks = {
  superadmin: [["SaaS Control", "/superadmin", ShieldCheck]],
  client: [["Client Portal", "/client", UploadCloud]]
};

export function Nav({ mode = "company" }) {
  const logout = useAuthStore((state) => state.logout);
  const links = mode === "company" ? companyLinks : modeLinks[mode];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[var(--nav)] p-4 text-white lg:flex">
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-400 text-slate-950">
          <BadgeIndianRupee size={22} />
        </div>
        <div>
          <p className="text-sm font-black leading-tight">Invoice Forge AI</p>
          <p className="text-xs text-slate-300">Finance automation OS</p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Workspace</p>
            <p className="mt-1 text-sm font-semibold">{mode === "client" ? "Client Portal" : mode === "superadmin" ? "Platform Admin" : "Acme Finance"}</p>
          </div>
          <Building2 size={18} className="text-teal-300" />
        </div>
      </div>

      <nav className="mt-6 grid gap-1">
        {links.map(([label, to, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-teal-400 text-slate-950 shadow-lg shadow-teal-950/20" : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto grid gap-3">
        <div className="rounded-lg border border-teal-300/20 bg-teal-300/10 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-teal-100">
            <Sparkles size={16} />
            AI automation ready
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-300">Generate proposals, detect invoice gaps, and prepare payment reminders from one workspace.</p>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Bell size={15} />
            Live sync
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <button onClick={logout} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/8">
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
