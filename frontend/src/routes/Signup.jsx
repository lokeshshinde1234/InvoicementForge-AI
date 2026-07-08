import { ArrowRight, BadgeIndianRupee, Building2, CheckCircle2, FileText, Landmark, LockKeyhole, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { useAuthStore } from "../store/auth";

const onboardingSteps = [
  "Create company identity",
  "Open admin workspace",
  "Save client and invoice details",
  "Generate invoice-ready data"
];

export function Signup() {
  const revealRef = useScrollReveal();
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const [form, setForm] = useState({ company_name: "", email: "", password: "", gst_number: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const completeness = useMemo(() => {
    const keys = ["company_name", "email", "password", "address"];
    return Math.round((keys.filter((key) => form[key]).length / keys.length) * 100);
  }, [form]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      navigate("/company");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main ref={revealRef} className="auth-shell">
      <section className="auth-panel">
        <Link to="/" className="flex w-fit items-center gap-3">
          <div className="premium-mark">
            <BadgeIndianRupee size={22} />
          </div>
          <div>
            <p className="font-black">Invoice Forge AI</p>
            <p className="text-xs font-bold text-stone-400">Company launch room</p>
          </div>
        </Link>

        <div data-reveal="left" className="mt-16 max-w-2xl">
          <p className="text-sm font-black uppercase text-[#f8d47a]">Workspace creation</p>
          <h1 className="font-editorial mt-4 text-5xl font-bold leading-none md:text-7xl">Give your finance work a permanent home.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-stone-300">
            Create a company admin account and land inside a dashboard designed for proposals, invoices, clients, and collections.
          </p>
        </div>

        <div data-reveal="scale" className="mt-12 max-w-xl rounded-lg border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-stone-400">Onboarding quality</p>
              <p className="font-editorial mt-1 text-4xl font-bold">{completeness}%</p>
            </div>
            <Sparkles className="text-[#f8d47a]" />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#f8d47a]" style={{ width: `${completeness}%` }} />
          </div>
          <div className="mt-5 grid gap-3">
            {onboardingSteps.map((step) => (
              <div key={step} data-reveal="scale" className="flex items-center gap-3 text-sm font-bold text-stone-200">
                <CheckCircle2 size={16} className="text-[#f8d47a]" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="auth-form-wrap">
        <form data-reveal="right" onSubmit={submit} className="auth-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Company profile</p>
              <h2 className="font-editorial text-4xl font-bold leading-none">Create workspace</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">These fields become the company and admin records used by invoices, proposals, and dashboards.</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-stone-950 text-[#f8d47a]">
              <Building2 size={23} />
            </div>
          </div>

          <div className="mt-7 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-stone-500">Company name</span>
              <input required minLength={2} placeholder="Acme Creative Studio" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase text-stone-500">Admin email</span>
                <input required placeholder="founder@company.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase text-stone-500">Password</span>
                <input required minLength={8} placeholder="Minimum 8 characters" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-stone-500">GST number</span>
              <input placeholder="Optional, invoice-ready when added" value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-stone-500">Registered address</span>
              <textarea required rows={3} placeholder="Billing address used on company documents" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </label>
          </div>

          {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}

          <button disabled={loading} className="primary-btn mt-6 w-full disabled:opacity-60">
            {loading ? <LockKeyhole size={18} /> : <Landmark size={18} />}
            {loading ? "Creating workspace" : "Create company workspace"}
          </button>

          <div className="mt-5 grid gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
            <span className="inline-flex items-center gap-2 font-bold text-stone-600">
              <FileText size={16} className="text-teal-700" />
              Already onboarded?
            </span>
            <Link className="inline-flex items-center gap-1 font-black text-teal-800" to="/login">
              Sign in
              <ArrowRight size={15} />
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
