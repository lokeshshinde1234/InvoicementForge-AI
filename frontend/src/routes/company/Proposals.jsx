import { CheckCircle2, ClipboardList, FileSignature, Send, Sparkles, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/client";

const stages = ["Brief", "AI Draft", "Review", "Send", "Approve"];

export function Proposals() {
  const [brief, setBrief] = useState("Build a 6-week finance automation dashboard with invoice PDFs, KYC upload, payment reminders, and client approvals.");
  const [draft, setDraft] = useState("");
  const [clients, setClients] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [form, setForm] = useState({ client_id: "", title: "", amount: 0 });

  async function load() {
    const [clientRes, proposalRes] = await Promise.all([api.get("/clients"), api.get("/proposals")]);
    setClients(clientRes.data);
    setProposals(proposalRes.data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function generate() {
    const { data } = await api.post("/ai/generate-proposal", { brief });
    setDraft(typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2));
  }

  async function createProposal() {
    const content = draft || brief;
    await api.post("/proposals", {
      client_id: form.client_id,
      title: form.title || "AI Generated Proposal",
      content,
      amount: Number(form.amount || 0)
    });
    setForm({ client_id: "", title: "", amount: 0 });
    setDraft("");
    await load();
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
            <button type="button" onClick={createProposal} disabled={!form.client_id || (!draft && !brief)} className="secondary-btn disabled:opacity-50" title="Save proposal">
              <Send size={18} />
              Save proposal
            </button>
          </div>
          <div className="panel-body">
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_1fr_140px]">
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
                <option value="">Select client</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
              <input placeholder="Proposal title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
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

      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="text-lg font-black text-slate-950">Live proposals</h2>
            <p className="mt-1 text-sm text-slate-500">Records loaded from FastAPI and PostgreSQL.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Amount</th><th>Status</th><th>E-sign</th></tr></thead>
            <tbody>
              {proposals.length ? proposals.map((proposal) => (
                <tr key={proposal.id}>
                  <td className="font-black text-slate-900">{proposal.title}</td>
                  <td>INR {proposal.amount}</td>
                  <td><span className="status-badge badge-info">{proposal.status}</span></td>
                  <td>{proposal.esign_status}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center text-slate-500">No proposals yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
