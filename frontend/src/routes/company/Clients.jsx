import { Mail, Plus, Search, ShieldCheck, UserRoundCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", gst_number: "", address: "" });

  async function load() {
    const { data } = await api.get("/clients", { params: { search } });
    setClients(data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function create(event) {
    event.preventDefault();
    await api.post("/clients", form);
    setForm({ name: "", email: "", phone: "", gst_number: "", address: "" });
    await load();
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Client CRM</p>
          <h1 className="page-title">Manage buyers, billing profiles, and portal access</h1>
          <p className="page-copy">Create client records once and reuse them across invoices, proposal approvals, KYC uploads, and payment history.</p>
        </div>
        <span className="status-badge badge-success">
          <ShieldCheck size={13} />
          Tenant scoped
        </span>
      </header>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <form onSubmit={create} className="panel">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Add client</h2>
              <p className="mt-1 text-sm text-slate-500">Billing and portal identity.</p>
            </div>
            <UserRoundCheck className="text-teal-700" size={20} />
          </div>
          <div className="panel-body grid gap-3">
            <input placeholder="Client or company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Billing email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input placeholder="GST number" value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} />
            </div>
            <textarea rows={3} placeholder="Billing address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <button className="primary-btn">
              <Plus size={18} />
              Save client
            </button>
          </div>
        </form>

        <div className="panel overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Client directory</h2>
              <p className="mt-1 text-sm text-slate-500">Search by name or email, scoped to your company.</p>
            </div>
            <div className="flex min-w-72 gap-2">
              <input placeholder="Search clients" value={search} onChange={(e) => setSearch(e.target.value)} />
              <button title="Search" aria-label="Search" onClick={load} className="secondary-btn px-3">
                <Search size={18} />
              </button>
            </div>
          </div>
          {clients.length ? (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>KYC</th></tr></thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="font-black text-slate-900">{client.name}</td>
                      <td><span className="inline-flex items-center gap-2"><Mail size={14} />{client.email}</span></td>
                      <td>{client.phone || "Not added"}</td>
                      <td><span className="status-badge badge-info">Portal ready</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="panel-body">
              <div className="empty-state">
                <div>
                  <Users className="mx-auto text-slate-400" />
                  <p className="mt-3 font-semibold">No clients yet</p>
                  <p className="text-sm">Add your first client to start invoicing and proposals.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
