import { CheckCircle2, ClipboardList, Edit3, FileSignature, Save, Send, Sparkles, Trash2, Wand2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import { apiError, money, shortDate } from "../../utils/format.js";

const stages = ["Brief", "AI Draft", "Review", "Send", "Approve"];

export function Proposals() {
  const [brief, setBrief] = useState("Build a 6-week finance automation dashboard with invoice PDFs, KYC upload, payment reminders, and client approvals.");
  const [draft, setDraft] = useState("");
  const [clients, setClients] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [form, setForm] = useState({ client_id: "", title: "", amount: 0, esign_status: "not_required" });
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState({ title: "", amount: 0, content: "", status: "draft", esign_status: "not_required" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const [clientRes, proposalRes] = await Promise.all([api.get("/clients"), api.get("/proposals")]);
      setClients(clientRes.data);
      setProposals(proposalRes.data);
    } catch (err) {
      setError(apiError(err, "Could not load proposals"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const clientNameById = useMemo(() => Object.fromEntries(clients.map((client) => [client.id, client.name])), [clients]);

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/ai/generate-proposal", { brief });
      setDraft(typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2));
    } catch (err) {
      setError(apiError(err, "Could not generate proposal"));
    } finally {
      setBusy(false);
    }
  }

  async function createProposal() {
    const content = draft || brief;
    setBusy(true);
    setError("");
    try {
      await api.post("/proposals", {
        client_id: form.client_id,
        title: form.title || "AI Generated Proposal",
        content,
        amount: Number(form.amount || 0),
        esign_status: form.esign_status
      });
      setForm({ client_id: "", title: "", amount: 0, esign_status: "not_required" });
      setDraft("");
      await load();
    } catch (err) {
      setError(apiError(err, "Could not save proposal"));
    } finally {
      setBusy(false);
    }
  }

  function startEdit(proposal) {
    setEditingId(proposal.id);
    setEditForm({
      title: proposal.title || "",
      amount: Number(proposal.amount || 0),
      content: proposal.content || "",
      status: proposal.status || "draft",
      esign_status: proposal.esign_status || "not_required"
    });
  }

  async function updateProposal(proposalId) {
    setError("");
    try {
      await api.patch(`/proposals/${proposalId}`, editForm);
      setEditingId("");
      await load();
    } catch (err) {
      setError(apiError(err, "Could not update proposal"));
    }
  }

  async function sendProposal(proposalId) {
    setError("");
    try {
      await api.post(`/proposals/${proposalId}/send`);
      await load();
    } catch (err) {
      setError(apiError(err, "Could not send proposal"));
    }
  }

  async function deleteProposal(proposalId) {
    if (!window.confirm("Delete this proposal?")) return;
    setError("");
    try {
      await api.delete(`/proposals/${proposalId}`);
      await load();
    } catch (err) {
      setError(apiError(err, "Could not delete proposal"));
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">AI Proposal Desk</p>
          <h1 className="page-title">Generate and manage client-ready proposals</h1>
          <p className="page-copy">Draft with AI, save proposals, send them to clients, and track response and e-sign status.</p>
        </div>
        <button onClick={generate} disabled={busy || !brief} className="primary-btn">
          <Wand2 size={18} />
          {busy ? "Working" : "Generate draft"}
        </button>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      <div className="panel p-4">
        <div className="grid gap-3 md:grid-cols-5">
          {stages.map((stage, index) => (
            <div key={stage} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-500">0{index + 1}</span>
                <CheckCircle2 size={16} className={index < (draft ? 3 : 1) ? "text-teal-700" : "text-slate-300"} />
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
            <button type="button" onClick={generate} disabled={busy || !brief} className="primary-btn disabled:opacity-50">
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
            <button type="button" onClick={createProposal} disabled={busy || !form.client_id || (!draft && !brief)} className="secondary-btn disabled:opacity-50" title="Save proposal">
              <Send size={18} />
              Save proposal
            </button>
          </div>
          <div className="panel-body">
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_1fr_140px_170px]">
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
                <option value="">Select client</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
              <input placeholder="Proposal title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
              <select value={form.esign_status} onChange={(e) => setForm({ ...form, esign_status: e.target.value })}>
                <option value="not_required">E-sign not required</option>
                <option value="pending">E-sign pending</option>
                <option value="signed">E-sign signed</option>
              </select>
            </div>
            {draft ? (
              <pre className="min-h-96 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-950 p-5 text-sm leading-6 text-slate-100">{draft}</pre>
            ) : (
              <div className="empty-state min-h-96">
                <div>
                  <FileSignature className="mx-auto text-slate-400" />
                  <p className="mt-3 font-semibold">{busy ? "Generating draft" : "No draft generated yet"}</p>
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
            <p className="mt-1 text-sm text-slate-500">Review, send, update, and organize your proposal workflow.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Client</th><th>Amount</th><th>Status</th><th>E-sign</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {proposals.length ? proposals.map((proposal) => {
                const editing = editingId === proposal.id;
                return (
                  <tr key={proposal.id}>
                    <td className="min-w-72">
                      {editing ? (
                        <div className="grid gap-2">
                          <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                          <textarea rows={3} value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} />
                        </div>
                      ) : (
                        <div>
                          <p className="font-black text-slate-900">{proposal.title}</p>
                          <p className="line-clamp-2 text-xs text-slate-500">{proposal.content}</p>
                        </div>
                      )}
                    </td>
                    <td>{clientNameById[proposal.client_id] || proposal.client_id}</td>
                    <td>{editing ? <input type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })} /> : money(proposal.amount)}</td>
                    <td>{editing ? (
                      <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                        <option value="draft">Draft</option><option value="sent">Sent</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
                      </select>
                    ) : <span className="status-badge badge-info">{proposal.status}</span>}</td>
                    <td>{editing ? (
                      <select value={editForm.esign_status} onChange={(e) => setEditForm({ ...editForm, esign_status: e.target.value })}>
                        <option value="not_required">Not required</option><option value="pending">Pending</option><option value="signed">Signed</option>
                      </select>
                    ) : proposal.esign_status}</td>
                    <td>{shortDate(proposal.updated_at)}</td>
                    <td>
                      <div className="flex gap-2">
                        {editing ? (
                          <>
                            <button title="Save" aria-label="Save" className="primary-btn px-3" onClick={() => updateProposal(proposal.id)}><Save size={17} /></button>
                            <button title="Cancel" aria-label="Cancel" className="secondary-btn px-3" onClick={() => setEditingId("")}><X size={17} /></button>
                          </>
                        ) : (
                          <>
                            <button title="Send" aria-label="Send" className="secondary-btn px-3" onClick={() => sendProposal(proposal.id)} disabled={proposal.status !== "draft"}><Send size={17} /></button>
                            <button title="Edit" aria-label="Edit" className="secondary-btn px-3" onClick={() => startEdit(proposal)}><Edit3 size={17} /></button>
                            <button title="Delete" aria-label="Delete" className="danger-btn px-3" onClick={() => deleteProposal(proposal.id)}><Trash2 size={17} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="7" className="text-center text-slate-500">{loading ? "Loading proposals" : "No proposals yet"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
