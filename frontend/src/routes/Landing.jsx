import { ArrowRight, BadgeIndianRupee, BarChart3, Bot, CheckCircle2, FileCheck2, FileSignature, FileText, LockKeyhole, ShieldCheck, Sparkles, UploadCloud, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroProduct from "../assets/landing-hero-product.png";

const modules = [
  ["AI proposal builder", "Turn a project brief into structured scope, pricing, and client approval flow.", Bot],
  ["Invoice management", "Generate itemized GST invoices with status tracking, PDF output, and payment history.", FileText],
  ["Client portal", "Clients approve proposals, view invoices, and upload KYC documents securely.", Users],
  ["Admin control", "Super Admins monitor tenant activation, analytics, and platform-wide revenue.", ShieldCheck]
];

const workflow = [
  ["01", "Onboard company", "Create a tenant workspace with bank, GST, logo, and invoice prefix."],
  ["02", "Add clients", "Maintain a company-scoped client directory for invoices and proposals."],
  ["03", "Generate documents", "Use AI-assisted proposal drafts and invoice PDFs from one workflow."],
  ["04", "Collect approval", "Clients approve proposals, upload KYC, and receive invoice access."]
];

export function Landing() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-600 text-white">
              <BadgeIndianRupee size={22} />
            </div>
            <div>
              <p className="font-black leading-tight">Invoice Forge AI</p>
              <p className="text-xs font-semibold text-slate-500">Invoice and proposal automation</p>
            </div>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-bold text-slate-600 md:flex">
            <a href="#modules">Modules</a>
            <a href="#workflow">Workflow</a>
            <a href="#security">Security</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="secondary-btn">Login</Link>
            <Link to="/signup" className="primary-btn">Start free</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-teal-800">
            <Sparkles size={16} />
            Built for client-facing finance teams
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            Invoice, proposal, and payment workflows without spreadsheet chaos.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A multi-tenant SaaS workspace for companies that need branded invoices, AI-generated proposals, client approvals, secure KYC uploads, and payment tracking in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="primary-btn">
              Create your company workspace
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="secondary-btn">Login to existing account</Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["JWT + RBAC", LockKeyhole],
              ["PostgreSQL-backed", BarChart3],
              ["PDF + AI ready", FileCheck2]
            ].map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700">
                <Icon size={16} className="text-teal-700" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-8 hidden rounded-lg border border-slate-200 bg-white p-4 shadow-xl lg:block">
            <p className="text-xs font-black uppercase text-slate-500">This month</p>
            <p className="mt-1 text-2xl font-black text-slate-950">86% collected</p>
          </div>
          <img src={heroProduct} alt="Invoice Forge AI product dashboard showing invoices, proposals, and revenue analytics" className="w-full rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-300/50" />
          <div className="absolute -bottom-5 right-5 hidden rounded-lg border border-teal-200 bg-white p-4 shadow-xl sm:block">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700">
                <FileSignature size={18} />
              </div>
              <div>
                <p className="text-sm font-black">Proposal approved</p>
                <p className="text-xs text-slate-500">Ready for invoice</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["3 roles", "Super Admin, Company Admin, Client"],
            ["100% scoped", "Tenant-safe database access"],
            ["AI assisted", "Proposals and reminders"],
            ["Deployment ready", "Render, Railway, Vercel"]
          ].map(([value, label]) => (
            <div key={value} className="rounded-lg bg-slate-50 p-4">
              <p className="text-2xl font-black text-slate-950">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="mx-auto max-w-7xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">Product modules</p>
          <h2 className="text-3xl font-black text-slate-950 md:text-4xl">Everything a service company needs after the first client call.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map(([title, copy, Icon]) => (
            <article key={title} className="panel p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-50 text-teal-700">
                <Icon size={21} />
              </div>
              <h3 className="mt-5 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase text-teal-300">Workflow</p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">From signup to signed proposal and paid invoice.</h2>
              <p className="mt-4 leading-7 text-slate-300">The flow is designed for real company-client work, not a static portfolio mockup.</p>
            </div>
            <div className="grid gap-3">
              {workflow.map(([step, title, copy]) => (
                <div key={step} className="grid gap-4 rounded-lg border border-white/10 bg-white/5 p-4 sm:grid-cols-[70px_1fr]">
                  <span className="text-2xl font-black text-teal-300">{step}</span>
                  <div>
                    <h3 className="font-black">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="eyebrow">Security and privacy</p>
          <h2 className="text-3xl font-black text-slate-950 md:text-4xl">Role-based access built into the backend, not hidden in the UI.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">Company admins only see their tenant data. Clients only see their own invoices and proposals. Aadhaar/KYC uploads expose file metadata only, not parsed identity details.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["JWT access and refresh tokens", "Company-scoped SQLAlchemy queries", "Client-only portal endpoints", "Document privacy response models"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CheckCircle2 size={17} className="text-teal-700" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-50 text-teal-700">
              <UploadCloud size={22} />
            </div>
            <div>
              <p className="font-black text-slate-950">KYC uploads</p>
              <p className="text-sm text-slate-500">Visible as file status, never extracted contents.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {["doc_type", "file_url", "uploaded_at", "status"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-3">
                <span className="font-mono text-sm text-slate-700">{item}</span>
                <span className="status-badge badge-success">Allowed</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-lg bg-teal-700 p-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black">Ready to create your company workspace?</h2>
            <p className="mt-2 text-teal-50">Start with signup, add clients, generate proposals, and issue your first invoice.</p>
          </div>
          <Link to="/signup" className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 font-black text-teal-800 md:mt-0">
            Start free
          </Link>
        </div>
      </section>
    </main>
  );
}
