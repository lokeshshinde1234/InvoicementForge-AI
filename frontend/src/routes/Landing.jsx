import { ArrowRight, BadgeIndianRupee, BarChart3, Bot, CheckCircle2, Clock, CreditCard, FileCheck2, FileSignature, FileText, LockKeyhole, MessageSquareText, ReceiptText, ShieldCheck, Sparkles, Star, UploadCloud, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroProduct from "../assets/landing-hero-product.png";

const navLinks = [
  ["Invoice Generator", "/invoice-generator"],
  ["Estimate Generator", "/estimate-generator"],
  ["Expense Manager", "/expense-manager"],
  ["Pricing", "/pricing"]
];

const valueCards = [
  ["Incredibly easy", "Create, manage, and send invoices or proposals in a few clicks.", Clock],
  ["Clients love it", "Simple approvals, secure uploads, and clear invoice access.", Users],
  ["Professional", "Brand invoices with logo, bank details, GST, and polished PDFs.", FileCheck2]
];

const features = [
  ["Save time", "Create invoices and proposals in seconds. Reuse clients, line items, tax rates, discounts, and notes without spreadsheet work.", FileText],
  ["Generate proposals", "Use AI to draft title, scope, pricing, terms, and client-ready content from a short project brief.", FileSignature],
  ["Track payments", "Record partial or full payments and move invoices through unpaid, partially paid, paid, and overdue states.", CreditCard],
  ["Stay organized", "Manage clients, proposals, documents, payments, and dashboard analytics from a single tenant-scoped workspace.", BarChart3],
  ["Secure KYC uploads", "Clients can upload Aadhaar/PAN files while company admins only see safe file metadata, not parsed contents.", UploadCloud],
  ["AI assistant", "Draft payment reminders, summarize invoices, detect missing fields, and prepare monthly revenue reports.", Bot]
];

const aiPrompts = [
  "Create an invoice for website redesign",
  "Generate a proposal for mobile app MVP",
  "Who has pending payment?",
  "Draft a polite reminder"
];

const reviews = [
  ["Fast, professional, and much easier than managing invoices in docs.", "Aarav M.", "Agency Owner"],
  ["The client approval flow makes proposals feel polished and trustworthy.", "Priya S.", "Consultant"],
  ["Finally a portfolio SaaS project that feels like real business software.", "Rohan K.", "Developer"]
];

function PublicNav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-600 text-white">
            <BadgeIndianRupee size={22} />
          </div>
          <div>
            <p className="font-black leading-tight">Invoice Forge AI</p>
            <p className="text-xs font-semibold text-slate-500">AI invoicing software</p>
          </div>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-bold text-slate-600 lg:flex">
          {navLinks.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="secondary-btn">Sign in</Link>
          <Link to="/signup" className="primary-btn">Sign up</Link>
        </div>
      </div>
    </nav>
  );
}

export function Landing() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <PublicNav />

      <section className="overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#eef7f5_100%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-14 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-black text-teal-800 shadow-sm">
              <Sparkles size={16} />
              Unlimited invoicing software with AI built in
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
              Create invoices, proposals, clients, and payment workflows in one place.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Invoice Forge AI helps businesses generate invoices, draft proposals, manage clients, collect approvals, upload KYC documents, and track payments with a professional SaaS workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="primary-btn">
                Create your invoice
                <ArrowRight size={18} />
              </Link>
              <Link to="/estimate-generator" className="secondary-btn">Build a proposal</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 text-amber-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</div>
              <p className="text-sm font-black text-slate-700">Trusted by service businesses, agencies, and consultants</p>
            </div>
          </div>

          <div className="relative">
            <img src={heroProduct} alt="Invoice Forge AI dashboard with invoice, proposal, revenue, and client portal panels" className="w-full rounded-lg border border-slate-200 bg-white shadow-2xl shadow-teal-950/15" />
            <div className="absolute -bottom-5 left-5 right-5 rounded-lg border border-slate-200 bg-white p-4 shadow-xl md:left-auto md:w-80">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700"><ReceiptText size={18} /></div>
                <div>
                  <p className="text-sm font-black">Invoice INV-2048 created</p>
                  <p className="text-xs text-slate-500">Draft saved and ready to send</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-3">
          {valueCards.map(([title, copy, Icon]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <Icon className="text-teal-700" size={28} />
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="text-center">
          <p className="eyebrow">Invoicing, estimates, payments, and client approvals</p>
          <h2 className="mx-auto mt-2 max-w-3xl text-3xl font-black md:text-5xl">Save time, get paid faster, and stay organized.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, copy, Icon]) => (
            <article key={title} className="panel p-6">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-50 text-teal-700"><Icon size={22} /></div>
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-teal-300">AI pricing, proposals, and invoices</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Build business documents just by asking.</h2>
            <p className="mt-4 leading-7 text-slate-300">Ask Invoice Forge AI to draft a proposal, detect invoice gaps, write a payment reminder, or summarize monthly revenue.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {aiPrompts.map((prompt) => <span key={prompt} className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm font-bold text-slate-200">{prompt}</span>)}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/8 p-4">
            <div className="rounded-lg bg-white p-5 text-slate-950">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700"><MessageSquareText size={18} /></div>
                <div>
                  <p className="font-black">Invoice Forge AI</p>
                  <p className="text-sm text-slate-500">Generated proposal draft</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  ["Scope", "Client portal, invoice PDFs, KYC upload, and payment tracking"],
                  ["Timeline", "6 weeks with milestone-based delivery"],
                  ["Amount", "INR 1,85,000 with GST-ready invoice conversion"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-black uppercase text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="primary-btn mt-5 w-full">Start invoicing with AI</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Customer feedback</p>
            <h2 className="text-3xl font-black md:text-4xl">What teams say about the workflow</h2>
            <p className="mt-4 leading-7 text-slate-600">Realistic social proof layout for a production SaaS homepage.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map(([quote, name, role]) => (
              <article key={name} className="panel p-5">
                <div className="flex text-amber-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}</div>
                <p className="mt-4 text-sm leading-6 text-slate-700">"{quote}"</p>
                <p className="mt-4 font-black">{name}</p>
                <p className="text-xs text-slate-500">{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-lg bg-teal-700 p-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black">Ready to get paid faster?</h2>
            <p className="mt-2 text-teal-50">Start free, create clients, generate proposals, and send your first invoice.</p>
          </div>
          <Link to="/signup" className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 font-black text-teal-800 md:mt-0">Get started</Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-4">
          <div>
            <p className="font-black">Invoice Forge AI</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">AI-powered invoice and proposal SaaS for client-facing businesses.</p>
          </div>
          {[
            ["Products", navLinks],
            ["Free tools", [["Payment Reminder Generator", "/pricing"], ["Proposal Brief Builder", "/estimate-generator"], ["Invoice PDF Preview", "/invoice-generator"]]],
            ["Company", [["Login", "/login"], ["Sign up", "/signup"], ["Client Portal", "/client"]]]
          ].map(([heading, links]) => (
            <div key={heading}>
              <p className="font-black">{heading}</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-500">
                {links.map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}

export { PublicNav };
