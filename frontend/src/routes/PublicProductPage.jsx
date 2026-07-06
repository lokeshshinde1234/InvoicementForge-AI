import { ArrowRight, BadgeIndianRupee, Bot, CheckCircle2, CreditCard, FileSignature, FileText, ReceiptText, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "./Landing.jsx";

const pages = {
  invoice: {
    eyebrow: "Free invoice generator",
    title: "Create professional invoices from a clean, guided workflow.",
    copy: "Use clients, line items, tax, discounts, notes, and PDF output to generate invoices without spreadsheet formatting.",
    icon: ReceiptText,
    bullets: ["GST-ready invoice fields", "Automatic subtotal and total calculation", "Downloadable invoice PDF", "Payment status tracking"]
  },
  estimate: {
    eyebrow: "AI estimate and proposal generator",
    title: "Turn project briefs into client-ready proposals.",
    copy: "Draft scope, deliverables, price, terms, and approval-ready proposal content with an AI-assisted workflow.",
    icon: FileSignature,
    bullets: ["AI proposal drafts", "Client approval or rejection", "Convert approved work into invoices", "Optional e-sign tracking"]
  },
  expense: {
    eyebrow: "AI expense and document manager",
    title: "Keep receipts, KYC files, and supporting documents organized.",
    copy: "Upload files securely and expose only safe metadata to company admins, with room for future AI extraction workflows.",
    icon: UploadCloud,
    bullets: ["Client-only uploads", "Company-safe metadata responses", "Cloudinary or S3 ready", "Privacy-first document handling"]
  },
  pricing: {
    eyebrow: "Simple SaaS pricing",
    title: "Start with a portfolio-ready MVP and grow into paid plans.",
    copy: "Use the current product as a launchable base: company signup, client management, invoices, proposals, AI, and dashboards.",
    icon: CreditCard,
    bullets: ["Free local development", "Deploy to Vercel and Render", "PostgreSQL production ready", "Add payments when ready"]
  }
};

export function PublicProductPage({ type }) {
  const page = pages[type];
  const Icon = page.icon;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <PublicNav />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-teal-800">
            <Icon size={16} />
            {page.eyebrow}
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{page.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{page.copy}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="primary-btn">Start free <ArrowRight size={18} /></Link>
            <Link to="/login" className="secondary-btn">Sign in</Link>
          </div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-50 text-teal-700"><BadgeIndianRupee size={22} /></div>
            <div>
              <p className="font-black">Invoice Forge AI</p>
              <p className="text-sm text-slate-500">Product workflow preview</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {page.bullets.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <CheckCircle2 className="text-teal-700" size={18} />
                <span className="text-sm font-bold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <Bot className="text-teal-300" />
              <div>
                <p className="font-black">AI assistant ready</p>
                <p className="text-sm text-slate-300">Generate, summarize, detect, and remind.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
