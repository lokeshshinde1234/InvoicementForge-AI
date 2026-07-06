import { ArrowRight, BadgeIndianRupee, Bot, CheckCircle2, FileSignature, FileText, LockKeyhole, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  ["Invoice automation", "Create GST-ready invoices with itemized totals, discounts, due dates, status tracking, and downloadable PDFs.", FileText],
  ["AI proposal desk", "Turn a raw client brief into proposal copy, pricing, and approval workflow with one secure workspace.", Bot],
  ["Client portal", "Clients approve proposals, view their own invoices, and upload KYC documents without cross-tenant leakage.", Users],
  ["RBAC security", "Super Admin, Company Admin, and Client roles are enforced with JWT and tenant-scoped backend queries.", ShieldCheck]
];

export function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-400 text-slate-950">
            <BadgeIndianRupee size={22} />
          </div>
          <div>
            <p className="font-black">Invoice Forge AI</p>
            <p className="text-xs text-slate-400">Invoice and proposal SaaS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="ghost-btn text-slate-200">Login</Link>
          <Link to="/signup" className="primary-btn">Start free</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-sm font-bold text-teal-200">
            <Sparkles size={16} />
            AI-powered receivables operating system
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">Run invoices, proposals, approvals, and payments from one SaaS workspace.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Invoice Forge AI helps companies onboard clients, generate professional proposals, issue branded invoices, collect KYC documents, and monitor payment status with tenant-safe access control.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="primary-btn">
              Create company account
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="secondary-btn">Login to portal</Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["JWT auth", "PostgreSQL + Alembic", "OpenAI-ready"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <CheckCircle2 size={17} className="text-teal-300" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/8 p-4 shadow-2xl shadow-black/30">
          <div className="rounded-lg bg-white p-4 text-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-bold text-teal-700">Live finance dashboard</p>
                <h2 className="text-2xl font-black">INR 4.2L collected</h2>
              </div>
              <span className="status-badge badge-success">86% collection</span>
            </div>
            <div className="mt-4 grid gap-3">
              {[
                ["Proposal approved", "Northstar Labs", FileSignature],
                ["Invoice PDF generated", "Maven Retail", FileText],
                ["KYC metadata received", "Orbit Works", LockKeyhole]
              ].map(([title, client, Icon]) => (
                <div key={title} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-black">{title}</p>
                      <p className="text-sm text-slate-500">{client}</p>
                    </div>
                  </div>
                  <span className="status-badge badge-info">Synced</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-16 md:grid-cols-2 xl:grid-cols-4">
        {features.map(([title, copy, Icon]) => (
          <article key={title} className="rounded-lg border border-white/10 bg-white/5 p-5">
            <Icon className="text-teal-300" />
            <h3 className="mt-4 text-lg font-black">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
