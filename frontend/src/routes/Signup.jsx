import { BadgeIndianRupee, Building2, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export function Signup() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const [form, setForm] = useState({ company_name: "", email: "", password: "", gst_number: "", address: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/company");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6">
      <form onSubmit={submit} className="panel w-full max-w-xl p-6">
        <Link to="/" className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-500 text-white">
            <BadgeIndianRupee size={22} />
          </div>
          <div>
            <p className="font-black text-slate-950">Invoice Forge AI</p>
            <p className="text-xs text-slate-500">Company onboarding</p>
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Start your SaaS workspace</p>
            <h1 className="text-2xl font-black text-slate-950">Create company admin account</h1>
          </div>
          <Building2 className="text-teal-700" />
        </div>
        <div className="mt-5 grid gap-3">
          <input placeholder="Company name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Admin email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <input placeholder="GST number" value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} />
          <textarea rows={3} placeholder="Company address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
        <button className="primary-btn mt-5 w-full">
          <LogIn size={18} />
          Create workspace
        </button>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link className="font-black text-teal-700" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
