import { BadgeIndianRupee, CheckCircle2, LockKeyhole, LogIn, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuthStore } from "../store/auth";

export function Login() {
  const navigate = useNavigate();
  const setRole = useAuthStore((state) => state.setRole);
  const login = useAuthStore((state) => state.login);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ company_name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "signup") {
        const { data } = await api.post("/auth/signup", form);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
      } else {
        await login(form.email, form.password);
      }
      setRole("company_admin");
      navigate("/company");
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed");
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex min-h-screen flex-col justify-between bg-[var(--nav)] p-8 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-400 text-slate-950">
            <BadgeIndianRupee size={24} />
          </div>
          <div>
            <p className="text-lg font-black">Invoice Forge AI</p>
            <p className="text-sm text-slate-300">Invoice and proposal automation</p>
          </div>
        </div>

        <div className="max-w-2xl py-12">
          <p className="eyebrow text-teal-300">Client-ready SaaS</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">Turn briefs, invoices, KYC, and payments into one finance workflow.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Create invoices, generate proposals with AI, manage client approvals, track payments, and keep every tenant securely scoped.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["JWT + RBAC", "AI proposals", "PDF invoices"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <CheckCircle2 size={18} className="text-teal-300" />
                <p className="mt-2 text-sm font-bold">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-400">Built for Super Admin, Company Admin, and Client portal workflows.</p>
      </section>

      <section className="grid place-items-center bg-slate-50 p-6">
        <form onSubmit={submit} className="panel w-full max-w-md p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Secure access</p>
              <h2 className="text-2xl font-black text-slate-950">{mode === "login" ? "Welcome back" : "Create workspace"}</h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-50 text-teal-700">
              <LockKeyhole size={20} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {["login", "signup"].map((item) => (
              <button type="button" key={item} onClick={() => setMode(item)} className={`rounded-md px-3 py-2 text-sm font-black ${mode === item ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>
                {item === "login" ? "Login" : "Sign up"}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            {mode === "signup" && <input placeholder="Company name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />}
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
          <button className="primary-btn mt-5 w-full">
            <LogIn size={18} />
            Continue to workspace
          </button>
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            <Sparkles size={17} className="text-teal-700" />
            Role-based routing is ready for production auth flows.
          </div>
        </form>
      </section>
    </main>
  );
}
