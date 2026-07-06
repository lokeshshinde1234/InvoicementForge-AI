import { Check, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export function ClientPortal() {
  const [proposals, setProposals] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    api.get("/portal/proposals").then((res) => setProposals(res.data)).catch(() => {});
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
    <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="panel p-4">
        <h2 className="text-xl font-semibold">Proposals</h2>
        <div className="mt-4 grid gap-3">
          {proposals.map((proposal) => (
            <article key={proposal.id} className="rounded-md border border-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold">{proposal.title}</h3>
                <span className="rounded bg-paper px-2 py-1 text-sm">{proposal.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{proposal.content}</p>
              <div className="mt-4 flex gap-2">
                <button title="Approve" aria-label="Approve" onClick={() => respond(proposal.id, "approved")} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-teal"><Check size={18} /></button>
                <button title="Reject" aria-label="Reject" onClick={() => respond(proposal.id, "rejected")} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-coral"><X size={18} /></button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <form onSubmit={upload} className="panel p-4">
        <h2 className="text-xl font-semibold">KYC Upload</h2>
        <input className="mt-4" type="file" onChange={(e) => setFile(e.target.files?.[0])} />
        <button disabled={!file} className="primary-btn mt-4 disabled:opacity-50">
          <Upload size={18} />
          Upload
        </button>
      </form>
    </section>
  );
}

