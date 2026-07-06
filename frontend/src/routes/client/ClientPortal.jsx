import { Check, FileText, ShieldCheck, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export function ClientPortal() {
  const [proposals, setProposals] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    api.get("/portal/proposals").then((res) => setProposals(res.data)).catch(() => {});
    api.get("/portal/invoices").then((res) => setInvoices(res.data)).catch(() => {});
  }, []);

  async function respond(id, decision) {
    await api.post(`/proposals/${id}/respond`, { decision });
    const { data } = await api.get("/portal/proposals");
    setProposals(data);
  }

  async function upload(event) {
    event.preventDefault();
    const form = new FormData();
    form.append("doc_type", "aadhaar");
    form.append("file", file);
    await api.post("/documents/upload", form);
    setFile(null);
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Client Portal</p>
          <h1 className="page-title">Review proposals, invoices, and secure KYC uploads</h1>
          <p className="page-copy">Clients can approve proposals, download invoices, and upload documents without seeing another client's data.</p>
        </div>
        <span className="status-badge badge-success">
          <ShieldCheck size={13} />
          Own data only
        </span>
      </header>

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
                    <p className="mt-1 text-sm text-slate-500">INR {proposal.amount}</p>
                  </div>
                  <span className="status-badge badge-info">{proposal.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{proposal.content}</p>
                <div className="mt-4 flex gap-2">
                  <button title="Approve" aria-label="Approve" onClick={() => respond(proposal.id, "approved")} className="primary-btn px-3">
                    <Check size={18} />
                    Approve
                  </button>
                  <button title="Reject" aria-label="Reject" onClick={() => respond(proposal.id, "rejected")} className="danger-btn">
                    <X size={18} />
                    Reject
                  </button>
                </div>
              </article>
            )) : (
              <div className="empty-state">No proposals assigned yet.</div>
            )}
          </div>
        </div>

        <aside className="grid gap-5">
          <form onSubmit={upload} className="panel">
            <div className="panel-header">
              <h2 className="text-lg font-black text-slate-950">KYC document</h2>
              <Upload className="text-teal-700" size={20} />
            </div>
            <div className="panel-body">
              <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
              <button disabled={!file} className="primary-btn mt-4 w-full disabled:opacity-50">
                <Upload size={18} />
                Upload Aadhaar
              </button>
              <p className="mt-3 text-xs leading-5 text-slate-500">Only file metadata is visible to the company admin. Parsed identity values are not exposed.</p>
            </div>
          </form>

          <div className="panel overflow-hidden">
            <div className="panel-header">
              <h2 className="text-lg font-black text-slate-950">Invoices</h2>
              <FileText className="text-teal-700" size={20} />
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>No.</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {invoices.length ? invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="font-black">{invoice.invoice_number}</td>
                      <td>INR {invoice.total}</td>
                      <td><span className="status-badge badge-info">{invoice.status}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="text-center text-slate-500">No invoices yet</td></tr>
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
