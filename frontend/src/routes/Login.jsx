import { ArrowRight, BadgeIndianRupee, CheckCircle2, Fingerprint, LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

function routeFor(role) {
  if (role === "super_admin") return "/superadmin";
  if (role === "client") return "/client";
  return "/company";
}

const securityNotes = [
  "JWT workspace session",
  "Role-aware redirect",
  "PostgreSQL-backed account",
  "Company scoped data"
];

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(routeFor(user.role));
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <Link to="/" className="flex w-fit items-center gap-3">
          <div className="premium-mark">
            <BadgeIndianRupee size={22} />
          </div>
          <div>
            <p className="font-black">Invoice Forge AI</p>
            <p className="text-xs font-bold text-stone-400">Secure workspace entry</p>
          </div>
        </Link>

        <div className="mt-16 max-w-2xl">
          <p className="text-sm font-black uppercase text-[#f8d47a]">Welcome back</p>
          <h1 className="font-editorial mt-4 text-5xl font-bold leading-none md:text-7xl">Return to the money room.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-stone-300">
            Your invoices, proposals, client records, payment state, and AI finance desk are waiting behind one clean sign-in.
          </p>
        </div>

        <div className="mt-12 grid max-w-xl gap-3 sm:grid-cols-2">
          {securityNotes.map((note) => (
            <div key={note} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="text-[#f8d47a]" size={18} />
              <p className="mt-3 text-sm font-black">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-form-wrap">
        <form onSubmit={submit} className="auth-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Identity check</p>
              <h2 className="font-editorial text-4xl font-bold leading-none">Sign in</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">Use the admin email and password created during company onboarding.</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-stone-950 text-[#f8d47a]">
              <Fingerprint size={23} />
            </div>
          </div>

          <div className="mt-7 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-stone-500">Email</span>
              <input required placeholder="admin@company.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-stone-500">Password</span>
              <input required minLength={8} placeholder="Your workspace password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
          </div>

          {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}

          <button disabled={loading} className="primary-btn mt-6 w-full disabled:opacity-60">
            {loading ? <LockKeyhole size={18} /> : <LogIn size={18} />}
            {loading ? "Checking access" : "Enter workspace"}
          </button>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm">
            <span className="inline-flex items-center gap-2 font-bold text-stone-600">
              <ShieldCheck size={16} className="text-teal-700" />
              New company?
            </span>
            <Link className="inline-flex items-center gap-1 font-black text-teal-800" to="/signup">
              Create workspace
              <ArrowRight size={15} />
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
