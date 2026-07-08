import {
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  FileSignature,
  FileText,
  Fingerprint,
  Gauge,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import heroProduct from "../assets/landing-hero-product.png";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { money } from "../utils/format.js";

const navLinks = [
  ["Invoice Generator", "/invoice-generator"],
  ["Estimate Generator", "/estimate-generator"],
  ["Expense Manager", "/expense-manager"],
  ["Pricing", "/pricing"]
];

const operatingSystem = [
  ["Signal intake", "Briefs, client records, tax rules, due dates, documents.", Fingerprint],
  ["Document forge", "Invoices, estimates, proposals, PDFs, reminders.", FileSignature],
  ["Receivable control", "Paid, partial, pending, overdue, and client risk view.", Gauge],
  ["Client room", "Approval, uploads, metadata privacy, and shared status.", LockKeyhole]
];

const featureRows = [
  ["AI proposal desk", "Turn a messy sales note into a scoped proposal with amount, terms, and approval-ready language.", Bot],
  ["Invoice studio", "Build itemized GST-ready invoices with live totals, discounts, due dates, notes, and PDF routing.", ReceiptText],
  ["Client memory", "Save buyer profiles once and reuse them across invoices, proposals, uploads, and follow-up history.", Users],
  ["Privacy ledger", "Keep KYC and document handling scoped, with company-safe metadata instead of reckless data exposure.", ShieldCheck],
  ["Payment command", "Track partial payments, pending receivables, overdue work, and monthly revenue from one dashboard.", CreditCard],
  ["Launch-ready workspace", "Start with polished workflows for quoting, invoicing, approvals, documents, and collections.", Layers3]
];

const roleMoments = [
  ["Founder", "Run proposals, invoices, clients, payments, and follow-ups from one polished finance workspace."],
  ["Agency", "Quote work, send proposals, convert to invoices, and keep every client conversation tied to money."],
  ["Client", "Approve proposals, upload documents, and understand payment status without asking for updates."]
];

function PublicNav() {
  return (
    <nav className="premium-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="premium-mark">
            <BadgeIndianRupee size={22} />
          </div>
          <div>
            <p className="text-sm font-black leading-tight">Invoice Forge AI</p>
            <p className="text-xs font-bold text-stone-500">Finance automation studio</p>
          </div>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-extrabold text-stone-600 lg:flex">
          {navLinks.map(([label, to]) => <Link key={to} to={to} className="hover:text-stone-950">{label}</Link>)}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="secondary-btn">Sign in</Link>
          <Link to="/signup" className="primary-btn">
            Start
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function MiniLedger({ stats }) {
  return (
    <div className="rounded-lg border border-stone-800 bg-[#151515] p-4 text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <p className="text-xs font-black uppercase text-[#f8d47a]">Receivable pulse</p>
          <p className="mt-1 text-lg font-black">Today, 4:42 PM</p>
        </div>
        <span className="status-badge border-emerald-400/20 bg-emerald-400/10 text-emerald-200">Live</span>
      </div>
      <div className="mt-4 grid gap-2">
        {[
          ["Invoices created", stats.invoices, "Ready to send"],
          ["Proposal drafts", stats.proposals, "Approval ready"],
          ["Client profiles", stats.clients, "Client-ready"],
          ["Invoice value", money(stats.invoice_value), "Live total"]
        ].map(([name, value, meta]) => (
          <div key={name} data-reveal="scale" className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
            <div>
              <p className="text-sm font-black">{name}</p>
              <p className="text-xs text-stone-400">{meta}</p>
            </div>
            <p className="text-sm font-black text-[#f8d47a]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Landing() {
  const revealRef = useScrollReveal();
  const [stats, setStats] = useState({ active_companies: 0, clients: 0, invoices: 0, proposals: 0, invoice_value: 0 });

  useEffect(() => {
    api.get("/public/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <main ref={revealRef} className="premium-shell">
      <PublicNav />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-10 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div data-reveal="left">
          <div className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm font-black text-stone-800">
            <Sparkles size={16} className="text-teal-700" />
            Built like a finance teammate, not a form generator
          </div>
          <h1 className="font-editorial mt-6 max-w-4xl text-5xl font-bold leading-[0.92] text-stone-950 md:text-7xl">
            Invoice Forge AI
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-stone-600">
            A premium invoicing operating room where proposals, invoices, payments, client approvals, KYC uploads, and AI follow-ups move through one calm workflow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="primary-btn">
              Create your workspace
              <ArrowRight size={18} />
            </Link>
            <Link to="/invoice-generator" className="secondary-btn">
              Explore invoice studio
            </Link>
          </div>
        </div>

        <div className="grid gap-4" data-reveal="right">
          <div className="relative overflow-hidden rounded-lg border border-stone-300 bg-[#fffefa] shadow-2xl shadow-stone-900/10">
            <div className="grid gap-4 p-4 md:grid-cols-[1.2fr_0.8fr]">
              <img src={heroProduct} alt="Invoice Forge AI dashboard, invoice panel, proposal panel, and revenue analytics" className="h-full min-h-80 w-full rounded-lg border border-stone-200 object-cover object-left-top" />
              <MiniLedger stats={stats} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Draft", "Approve", "Collect"].map((item, index) => (
              <div key={item} data-reveal="scale" className="rounded-lg border border-stone-300 bg-white/70 p-4">
                <p className="text-xs font-black text-teal-800">0{index + 1}</p>
                <p className="mt-2 font-black">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-stone-300 bg-[#151515] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div data-reveal="left">
            <p className="text-sm font-black uppercase text-[#f8d47a]">A different operating model</p>
            <h2 className="font-editorial mt-3 text-4xl font-bold leading-none md:text-5xl">One invoice is never just one invoice.</h2>
            <p className="mt-4 leading-7 text-stone-300">It contains a client relationship, tax logic, payment pressure, approval risk, documents, reminders, and proof. This UI treats that reality seriously.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {operatingSystem.map(([title, copy, Icon]) => (
              <article key={title} data-reveal="scale" className="rounded-lg border border-white/10 bg-white/5 p-5">
                <Icon className="text-[#f8d47a]" size={24} />
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-300">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal="left">
            <p className="eyebrow">Working surfaces</p>
            <h2 className="font-editorial text-4xl font-bold leading-none md:text-6xl">Pages that feel like someone uses them every day.</h2>
            <p className="mt-5 leading-7 text-stone-600">The homepage now introduces the real product system: not decorative promises, but the exact work people need when money is moving.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featureRows.map(([title, copy, Icon]) => (
              <article key={title} data-reveal="scale" className="panel p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-stone-950 text-[#f8d47a]">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-black text-stone-950">{title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-stone-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffefa]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div data-reveal="left" className="panel overflow-hidden">
            <div className="border-b border-stone-300 p-5">
              <p className="eyebrow">AI workbench</p>
              <h2 className="font-editorial text-4xl font-bold leading-none">Ask for a document. Get a workflow.</h2>
            </div>
            <div className="grid gap-3 p-5">
              {[
                ["User", "Create a proposal for a 6-week analytics dashboard with payment reminders."],
                ["Invoice Forge AI", "Drafted scope, timeline, pricing, client approval copy, invoice conversion note, and reminder sequence."],
                ["System", "Ready to review, share, and turn into a proposal."]
              ].map(([speaker, text]) => (
                <div key={speaker} data-reveal="scale" className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-black uppercase text-stone-500">{speaker}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-stone-800">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {roleMoments.map(([role, copy]) => (
              <article key={role} data-reveal="right" className="rounded-lg border border-stone-300 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-editorial text-3xl font-bold">{role}</h3>
                  <CheckCircle2 className="text-teal-700" />
                </div>
                <p className="mt-3 leading-7 text-stone-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            [FileText, "Invoice"],
            [FileCheck2, "Estimate"],
            [UploadCloud, "Document"],
            [Banknote, "Payment"]
          ].map(([Icon, label]) => (
            <div key={label} data-reveal="scale" className="rounded-lg border border-stone-300 bg-[#151515] p-5 text-white">
              <Icon className="text-[#f8d47a]" />
              <p className="mt-8 text-xs font-black uppercase text-stone-400">Module</p>
              <p className="font-editorial mt-1 text-3xl font-bold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div data-reveal="scale" className="grid gap-5 rounded-lg border border-stone-300 bg-[#fffefa] p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow">Ready for records</p>
            <h2 className="font-editorial text-4xl font-bold leading-none">Start with signup. Continue with real stored finance data.</h2>
            <p className="mt-3 text-stone-600">Create your workspace once and keep every client, document, proposal, invoice, and payment update in one place.</p>
          </div>
          <Link to="/signup" className="primary-btn">
            Open the onboarding room
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer data-reveal className="border-t border-stone-300 bg-[#151515] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-4">
          <div>
            <div className="premium-mark">
              <BadgeIndianRupee size={22} />
            </div>
            <p className="mt-4 font-black">Invoice Forge AI</p>
            <p className="mt-2 text-sm leading-6 text-stone-400">A human-shaped finance automation studio for invoices, proposals, payments, and client rooms.</p>
          </div>
          {[
            ["Products", navLinks],
            ["Workflows", [["Invoice Studio", "/invoice-generator"], ["AI Proposal Desk", "/estimate-generator"], ["Document Vault", "/expense-manager"]]],
            ["Access", [["Login", "/login"], ["Sign up", "/signup"], ["Client Portal", "/client"]]]
          ].map(([heading, links]) => (
            <div key={heading}>
              <p className="font-black">{heading}</p>
              <div className="mt-3 grid gap-2 text-sm text-stone-400">
                {links.map(([label, to]) => <Link key={label} to={to} className="hover:text-white">{label}</Link>)}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}

export { PublicNav };
