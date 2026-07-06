import { CheckCircle2, ClipboardList, FileSignature, Send, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../api/client";

const stages = ["Brief", "AI Draft", "Review", "Send", "Approve"];

export function Proposals() {
  const [brief, setBrief] = useState("Build a 6-week finance automation dashboard with invoice PDFs, KYC upload, payment reminders, and client approvals.");
  const [draft, setDraft] = useState("");

  async function generate() {
    const { data } = await api.post("/ai/generate-proposal", { brief });
    setDraft(typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2));
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">AI Proposal Desk</p>
          <h1 className="page-title">Generate client-ready proposals from a project brief</h1>
          <p className="page-copy">Use AI to draft titles, scope, timelines, pricing, and acceptance language, then send the proposal into the client approval workflow.</p>
        </div>
        <button onClick={generate} className="primary-btn">
          <Wand2 size={18} />
          Generate draft
        </button>
      </header>

      <div className="panel p-4">
        <div className="grid gap-3 md:grid-cols-5">
          {stages.map((stage, index) => (
            <div key={stage} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-500">0{index + 1}</span>
                <CheckCircle2 size={16} className={index < 2 ? "text-teal-700" : "text-slate-300"} />
              </div>
              <p className="mt-2 text-sm font-black text-slate-950">{stage}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Client brief</h2>
              <p className="mt-1 text-sm text-slate-500">Paste the project scope and commercial terms.</p>
            </div>
            <ClipboardList className="text-teal-700" size={20} />
          </div>
          <div className="panel-body grid gap-4">
            <textarea className="min-h-72" value={brief} onChange={(e) => setBrief(e.target.value)} />
            <button type="button" onClick={generate} className="primary-btn">
              <Sparkles size={18} />
              Draft with AI
            </button>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Proposal draft</h2>
              <p className="mt-1 text-sm text-slate-500">Review AI output before creating the proposal record.</p>
            </div>
            <button className="secondary-btn" title="Send proposal">
              <Send size={18} />
              Send
            </button>
          </div>
          <div className="panel-body">
            {draft ? (
              <pre className="min-h-96 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-950 p-5 text-sm leading-6 text-slate-100">{draft}</pre>
            ) : (
              <div className="empty-state min-h-96">
                <div>
                  <FileSignature className="mx-auto text-slate-400" />
                  <p className="mt-3 font-semibold">No draft generated yet</p>
                  <p className="text-sm">Use the AI action to create a structured proposal.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
