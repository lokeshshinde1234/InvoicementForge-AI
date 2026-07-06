import { BadgeIndianRupee, LockKeyhole, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

function routeFor(role) {
  if (role === "super_admin") return "/superadmin";
  if (role === "client") return "/client";
  return "/company";
}

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(routeFor(user.role));
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6">
      <form onSubmit={submit} className="panel w-full max-w-md p-6">
        <Link to="/" className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-500 text-white">
            <BadgeIndianRupee size={22} />
          </div>
          <div>
            <p className="font-black text-slate-950">Invoice Forge AI</p>
            <p className="text-xs text-slate-500">Secure login</p>
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="text-2xl font-black text-slate-950">Login to your workspace</h1>
          </div>
          <LockKeyhole className="text-teal-700" />
        </div>
        <div className="mt-5 grid gap-3">
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
        <button className="primary-btn mt-5 w-full">
          <LogIn size={18} />
          Login
        </button>
        <p className="mt-5 text-center text-sm text-slate-500">
          New company? <Link className="font-black text-teal-700" to="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
