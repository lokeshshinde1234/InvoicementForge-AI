import { Check, Download, FileText, RefreshCw, ShieldCheck, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { apiError, downloadBlob, money, shortDate } from "../../utils/format.js";

export function ClientPortal() {
  const [proposals, setProposals] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("aadhaar");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const [proposalRes, invoiceRes] = await Promise.all([api.get("/portal/proposals"), api.get("/portal/invoices")]);
      setProposals(proposalRes.data);
      setInvoices(invoiceRes.data);
    } catch (err) {
      setError(apiError(err, "Could not load portal data"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function respond(id, decision) {
    setError("");
    try {
      await api.post(`/proposals/${id}/respond`, { decision });
      await load();
    } catch (err) {
      setError(apiError(err, "Could not update proposal response"));
    }
  }

  async function upload(event) {
    event.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      form.append("doc_type", docType);
      form.append("file", file);
      await api.post("/documents/upload", form);
      setFile(null);
      setMessage("Document uploaded successfully.");
    } catch (err) {
      setError(apiError(err, "Could not upload document"));
    } finally {
      setUploading(false);
    }
  }

  async function downloadInvoice(invoice) {
    setError("");
    try {
      await downloadBlob(api.get(`/portal/invoices/${invoice.id}/pdf`, { responseType: "blob" }), `${invoice.invoice_number}.pdf`);
    } catch (err) {
      setError(apiError(err, "Could not download invoice PDF"));
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Client Portal</p>
          <h1 className="page-title">Review proposals, invoices, and secure KYC uploads</h1>
          <p className="page-copy">Portal data is loaded from client-scoped endpoints, so clients only see their own proposals, invoices, and upload actions.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} disabled={loading} className="secondary-btn">
            <RefreshCw size={18} />
            Refresh
          </button>
          <span className="status-badge badge-success">
            <ShieldCheck size={13} />
            Own data only
          </span>
        </div>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</div>}

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Proposal approvals</h2>
              <p className="mt-1 text-sm text-slate-500">Approve or reject active proposals.</p>
            </div>
          </div>
          <div className="panel-body grid gap-3">
            {proposals.length ? proposals.map((proposal) => (
              <article key={proposal.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-950">{proposal.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{money(proposal.amount)} · Updated {shortDate(proposal.updated_at)}</p>
                  </div>
                  <span className={`status-badge ${proposal.status === "approved" ? "badge-success" : proposal.status === "rejected" ? "badge-warning" : "badge-info"}`}>{proposal.status}</span>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{proposal.content}</p>
                <div className="mt-4 flex gap-2">
                  <button title="Approve" aria-label="Approve" onClick={() => respond(proposal.id, "approved")} disabled={proposal.status === "approved"} className="primary-btn px-3 disabled:opacity-50">
                    <Check size={18} />
                    Approve
                  </button>
                  <button title="Reject" aria-label="Reject" onClick={() => respond(proposal.id, "rejected")} disabled={proposal.status === "rejected"} className="danger-btn disabled:opacity-50">
                    <X size={18} />
                    Reject
                  </button>
                </div>
              </article>
            )) : (
              <div className="empty-state">{loading ? "Loading proposals" : "No proposals assigned yet."}</div>
            )}
          </div>
        </div>

        <aside className="grid gap-5">
          <form onSubmit={upload} className="panel">
            <div className="panel-header">
              <h2 className="text-lg font-black text-slate-950">Client document</h2>
              <Upload className="text-teal-700" size={20} />
            </div>
            <div className="panel-body grid gap-3">
              <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="aadhaar">Aadhaar</option>
                <option value="pan">PAN</option>
                <option value="gst_certificate">GST certificate</option>
                <option value="receipt">Receipt</option>
                <option value="other">Other</option>
              </select>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <button disabled={!file || uploading} className="primary-btn w-full disabled:opacity-50">
                <Upload size={18} />
                {uploading ? "Uploading" : "Upload document"}
              </button>
              <p className="text-xs leading-5 text-slate-500">Only safe file metadata is visible to the company admin. Parsed identity values are not exposed.</p>
            </div>
          </form>

          <div className="panel overflow-hidden">
            <div className="panel-header">
              <h2 className="text-lg font-black text-slate-950">Invoices</h2>
              <FileText className="text-teal-700" size={20} />
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>No.</th><th>Total</th><th>Status</th><th>PDF</th></tr></thead>
                <tbody>
                  {invoices.length ? invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="font-black">{invoice.invoice_number}</td>
                      <td>{money(invoice.total)}</td>
                      <td><span className="status-badge badge-info">{invoice.status}</span></td>
                      <td><button type="button" className="secondary-btn px-3" onClick={() => downloadInvoice(invoice)}><Download size={17} /></button></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center text-slate-500">{loading ? "Loading invoices" : "No invoices yet"}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
