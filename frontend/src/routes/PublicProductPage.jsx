import {
  ArrowRight,
  BadgeIndianRupee,
  Bot,
  CheckCircle2,
  CreditCard,
  FileSignature,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  UploadCloud
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { money } from "../utils/format.js";
import { PublicNav } from "./Landing.jsx";

const pages = {
  invoice: {
    eyebrow: "Invoice Studio",
    title: "A working room for invoices that need accuracy, memory, and speed.",
    copy: "Create itemized invoices with GST, discounts, due dates, saved clients, payment state, and PDF-ready structure.",
    icon: ReceiptText,
    accent: "INR 58,410",
    bullets: ["Client profile reuse", "Automatic subtotal and GST", "Discount and due-date logic", "Payment lifecycle ready"],
    flow: ["Select client", "Add line items", "Review totals", "Create invoice"]
  },
  estimate: {
    eyebrow: "AI Proposal Desk",
    title: "Turn an unsure client brief into a proposal that can actually be sent.",
    copy: "Draft scope, timeline, commercial terms, amount, and approval language from a short project note.",
    icon: FileSignature,
    accent: "6-week sprint",
    bullets: ["AI proposal draft", "Client approval flow", "Amount and title capture", "Convertible business context"],
    flow: ["Paste brief", "Generate draft", "Assign client", "Save proposal"]
  },
  expense: {
    eyebrow: "Document Vault",
    title: "A privacy-aware document layer for receipts, KYC, and supporting proof.",
    copy: "Handle uploads with company-safe metadata patterns and keep sensitive client documents separate from casual views.",
    icon: UploadCloud,
    accent: "Safe metadata",
    bullets: ["Client-only upload path", "KYC-oriented structure", "Cloud storage ready", "Privacy-first response design"],
    flow: ["Upload", "Classify", "Protect", "Reference"]
  },
  pricing: {
    eyebrow: "Launch Economics",
    title: "A SaaS-ready base you can price, deploy, and grow into a real product.",
    copy: "Start with a polished finance workspace for proposals, invoices, client approvals, documents, and payment follow-up.",
    icon: CreditCard,
    accent: "Production path",
    bullets: ["Workspace-ready onboarding", "Client approval flows", "Invoice and payment tracking", "Flexible growth path"],
    flow: ["Launch", "Invite", "Measure", "Grow"]
  }
};

function PreviewCard({ page, accent }) {
  const Icon = page.icon;

  return (
    <div data-reveal="right" className="panel overflow-hidden">
      <div className="grid gap-4 border-b border-stone-300 p-5 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="text-xs font-black uppercase text-stone-500">Live preview</p>
          <p className="font-editorial mt-2 text-4xl font-bold leading-none">{accent || page.accent}</p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-stone-950 text-[#f8d47a]">
          <Icon size={25} />
        </div>
      </div>
      <div className="grid gap-3 p-5">
        {page.flow.map((step, index) => (
          <div key={step} data-reveal="scale" className="grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-xs font-black text-stone-500">0{index + 1}</span>
            <span className="font-black text-stone-900">{step}</span>
            <CheckCircle2 className={index < 2 ? "text-teal-700" : "text-stone-300"} size={18} />
          </div>
        ))}
      </div>
      <div className="border-t border-stone-300 bg-[#151515] p-5 text-white">
        <div className="flex items-center gap-3">
          <Bot className="text-[#f8d47a]" />
          <div>
            <p className="font-black">AI assist layer</p>
            <p className="text-sm text-stone-400">Generate, inspect, summarize, and prepare the next action.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicProductPage({ type }) {
  const page = pages[type];
  const Icon = page.icon;
  const revealRef = useScrollReveal();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/public/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const accent = useMemo(() => {
    if (!stats) return page.accent;
    if (type === "invoice") return `${stats.invoices} invoices`;
    if (type === "estimate") return `${stats.proposals} proposals`;
    if (type === "expense") return `${stats.clients} client profiles`;
    return money(stats.invoice_value);
  }, [page.accent, stats, type]);

  return (
    <main ref={revealRef} className="premium-shell">
      <PublicNav />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div data-reveal="left">
          <div className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm font-black text-stone-800">
            <Icon size={16} className="text-teal-700" />
            {page.eyebrow}
          </div>
          <h1 className="font-editorial mt-6 max-w-4xl text-5xl font-bold leading-[0.94] md:text-7xl">{page.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">{page.copy}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="primary-btn">
              Start workspace
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="secondary-btn">Sign in</Link>
          </div>
        </div>
        <PreviewCard page={page} accent={accent} />
      </section>

      <section className="border-y border-stone-300 bg-[#fffefa]">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 md:grid-cols-4">
          {page.bullets.map((item) => (
            <article key={item} data-reveal="scale" className="rounded-lg border border-stone-300 bg-white p-5">
              <CheckCircle2 className="text-teal-700" />
              <p className="mt-5 text-sm font-black leading-6 text-stone-900">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal="left">
            <p className="eyebrow">Product principle</p>
            <h2 className="font-editorial text-4xl font-bold leading-none md:text-5xl">Every page should reduce the next decision.</h2>
            <p className="mt-4 leading-7 text-stone-600">The interface is designed around the natural order of finance work: identify the client, create the document, protect the proof, then collect the money.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [ScanLine, "Structured"],
              [ShieldCheck, "Scoped"],
              [BadgeIndianRupee, "Collectable"]
            ].map(([CardIcon, label]) => (
              <div key={label} data-reveal="scale" className="rounded-lg border border-stone-300 bg-[#151515] p-5 text-white">
                <CardIcon className="text-[#f8d47a]" />
                <p className="font-editorial mt-12 text-3xl font-bold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
