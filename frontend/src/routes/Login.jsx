import { Building2, LogIn } from "lucide-react";
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
    <main className="grid min-h-screen place-items-center bg-paper p-6 text-ink">
      <form onSubmit={submit} className="panel w-full max-w-md p-6">
        <div className="flex items-center gap-3">
          <Building2 className="text-teal" />
          <h1 className="text-2xl font-semibold">Invoice Forge AI</h1>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-md bg-paper p-1">
          {["login", "signup"].map((item) => (
            <button type="button" key={item} onClick={() => setMode(item)} className={`rounded px-3 py-2 text-sm ${mode === item ? "bg-white font-semibold shadow-sm" : "text-slate-600"}`}>
              {item === "login" ? "Login" : "Sign up"}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3">
          {mode === "signup" && <input placeholder="Company name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />}
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="mt-3 text-sm text-coral">{error}</p>}
        <button className="primary-btn mt-5 w-full justify-center">
          <LogIn size={18} />
          Continue
        </button>
      </form>
    </main>
  );
}

