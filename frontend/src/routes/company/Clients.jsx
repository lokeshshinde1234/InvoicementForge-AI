import { Edit3, Mail, Plus, RefreshCw, Save, Search, ShieldCheck, Trash2, UserRoundCheck, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import { apiError, money } from "../../utils/format.js";

const blankForm = { name: "", email: "", phone: "", gst_number: "", address: "" };

export function Clients() {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState(blankForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load(nextSearch = search) {
    setError("");
    setLoading(true);
    try {
      const [clientRes, invoiceRes, proposalRes] = await Promise.all([
        api.get("/clients", { params: { search: nextSearch } }),
        api.get("/invoices"),
        api.get("/proposals")
      ]);
      setClients(clientRes.data);
      setInvoices(invoiceRes.data);
      setProposals(proposalRes.data);
    } catch (err) {
      setError(apiError(err, "Could not load clients"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("");
  }, []);

  const clientStats = useMemo(() => {
    const stats = {};
    clients.forEach((client) => {
      const clientInvoices = invoices.filter((invoice) => invoice.client_id === client.id);
      const clientProposals = proposals.filter((proposal) => proposal.client_id === client.id);
      stats[client.id] = {
        invoiceCount: clientInvoices.length,
        proposalCount: clientProposals.length,
        total: clientInvoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0)
      };
    });
    return stats;
  }, [clients, invoices, proposals]);

  async function create(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/clients", form);
      setForm(blankForm);
      await load();
    } catch (err) {
      setError(apiError(err, "Could not create client"));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(client) {
    setEditingId(client.id);
    setEditForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      gst_number: client.gst_number || "",
      address: client.address || ""
    });
  }

  async function update(clientId) {
    setSaving(true);
    setError("");
    try {
      await api.patch(`/clients/${clientId}`, editForm);
      setEditingId("");
      await load();
    } catch (err) {
      setError(apiError(err, "Could not update client"));
    } finally {
      setSaving(false);
    }
  }

  async function remove(clientId) {
    if (!window.confirm("Delete this client? Linked invoices or proposals may prevent deletion.")) return;
    setError("");
    try {
      await api.delete(`/clients/${clientId}`);
      await load();
    } catch (err) {
      setError(apiError(err, "Could not delete client"));
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Client CRM</p>
          <h1 className="page-title">Manage buyers, billing profiles, and portal access</h1>
          <p className="page-copy">Every row is loaded from the tenant-scoped API, with linked invoice and proposal activity calculated live.</p>
        </div>
        <span className="status-badge badge-success">
          <ShieldCheck size={13} />
          {loading ? "Syncing" : `${clients.length} clients`}
        </span>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

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
            <input required placeholder="Client or company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required placeholder="Billing email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input placeholder="GST number" value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} />
            </div>
            <textarea rows={3} placeholder="Billing address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <button className="primary-btn" disabled={saving}>
              <Plus size={18} />
              {saving ? "Saving" : "Save client"}
            </button>
          </div>
        </form>

        <div className="panel overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Client directory</h2>
              <p className="mt-1 text-sm text-slate-500">Search, edit, delete, and review real client activity.</p>
            </div>
            <div className="flex min-w-72 gap-2">
              <input placeholder="Search clients" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load(search)} />
              <button title="Search" aria-label="Search" onClick={() => load(search)} className="secondary-btn px-3">
                <Search size={18} />
              </button>
              <button title="Refresh" aria-label="Refresh" onClick={() => load(search)} className="secondary-btn px-3">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
          {clients.length ? (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Activity</th><th>Actions</th></tr></thead>
                <tbody>
                  {clients.map((client) => {
                    const stats = clientStats[client.id] || { invoiceCount: 0, proposalCount: 0, total: 0 };
                    const editing = editingId === client.id;
                    return (
                      <tr key={client.id}>
                        <td className="min-w-60">
                          {editing ? (
                            <div className="grid gap-2">
                              <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                              <textarea rows={2} value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                            </div>
                          ) : (
                            <div>
                              <p className="font-black text-slate-900">{client.name}</p>
                              <p className="text-xs text-slate-500">{client.gst_number || "GST not added"}</p>
                            </div>
                          )}
                        </td>
                        <td className="min-w-56">
                          {editing ? <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /> : <span className="inline-flex items-center gap-2"><Mail size={14} />{client.email}</span>}
                        </td>
                        <td>{editing ? <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /> : client.phone || "Not added"}</td>
                        <td>
                          <div className="grid gap-1 text-xs font-bold text-slate-500">
                            <span>{stats.invoiceCount} invoices</span>
                            <span>{stats.proposalCount} proposals</span>
                            <span>{money(stats.total)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {editing ? (
                              <>
                                <button title="Save" aria-label="Save" className="primary-btn px-3" onClick={() => update(client.id)} disabled={saving}><Save size={17} /></button>
                                <button title="Cancel" aria-label="Cancel" className="secondary-btn px-3" onClick={() => setEditingId("")}><X size={17} /></button>
                              </>
                            ) : (
                              <>
                                <button title="Edit" aria-label="Edit" className="secondary-btn px-3" onClick={() => startEdit(client)}><Edit3 size={17} /></button>
                                <button title="Delete" aria-label="Delete" className="danger-btn px-3" onClick={() => remove(client.id)}><Trash2 size={17} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="panel-body">
              <div className="empty-state">
                <div>
                  <Users className="mx-auto text-slate-400" />
                  <p className="mt-3 font-semibold">{loading ? "Loading clients" : "No clients yet"}</p>
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
