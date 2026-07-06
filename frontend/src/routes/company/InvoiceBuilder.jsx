import { CalendarClock, FilePlus2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";

export function InvoiceBuilder() {
  const [invoice, setInvoice] = useState({
    client_id: "",
    tax_percent: 18,
    discount: 0,
    due_date: "",
    notes: "",
    items: [{ description: "AI proposal automation sprint", quantity: 1, unit_price: 45000 }]
  });
  const [created, setCreated] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    api.get("/clients").then((res) => setClients(res.data)).catch(() => {});
  }, []);

  const subtotal = useMemo(() => invoice.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0), [invoice.items]);
  const tax = subtotal * Number(invoice.tax_percent || 0) / 100;
  const total = Math.max(subtotal + tax - Number(invoice.discount || 0), 0);

  function updateItem(index, field, value) {
    setInvoice({ ...invoice, items: invoice.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)) });
  }

  async function submit(event) {
    event.preventDefault();
    const payload = { ...invoice, due_date: invoice.due_date || null };
    const { data } = await api.post("/invoices", payload);
    setCreated(data);
  }

  return (
    <form onSubmit={submit} className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Invoice Studio</p>
          <h1 className="page-title">Build accurate invoices with tax, discounts, and PDF output</h1>
          <p className="page-copy">Create itemized invoices, auto-calculate totals, and keep the payload clean for FastAPI validation and PDF rendering.</p>
        </div>
        <button className="primary-btn">
          <FilePlus2 size={18} />
          Create invoice
        </button>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Invoice details</h2>
              <p className="mt-1 text-sm text-slate-500">Use a client UUID from your client directory.</p>
            </div>
            <span className="status-badge badge-info">Draft</span>
          </div>
          <div className="panel-body grid gap-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_140px_140px_170px]">
              <select value={invoice.client_id} onChange={(e) => setInvoice({ ...invoice, client_id: e.target.value })}>
                <option value="">Select client</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.name} - {client.email}</option>)}
              </select>
              <input type="number" placeholder="GST %" value={invoice.tax_percent} onChange={(e) => setInvoice({ ...invoice, tax_percent: Number(e.target.value) })} />
              <input type="number" placeholder="Discount" value={invoice.discount} onChange={(e) => setInvoice({ ...invoice, discount: Number(e.target.value) })} />
              <input type="date" value={invoice.due_date} onChange={(e) => setInvoice({ ...invoice, due_date: e.target.value })} />
            </div>
            <textarea rows={3} placeholder="Notes, terms, payment instructions" value={invoice.notes} onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })} />
            {!clients.length && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">Add a client first, then return here to create invoices dynamically.</div>}

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-950">Line items</h3>
                <button type="button" className="secondary-btn" onClick={() => setInvoice({ ...invoice, items: [...invoice.items, { description: "", quantity: 1, unit_price: 0 }] })}>
                  <Plus size={17} />
                  Add item
                </button>
              </div>
              {invoice.items.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_110px_150px_44px]">
                  <input placeholder="Description" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} />
                  <input type="number" min="0" step="0.01" value={item.quantity} onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} />
                  <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateItem(index, "unit_price", Number(e.target.value))} />
                  <button type="button" title="Remove item" aria-label="Remove item" className="danger-btn h-11 w-11 p-0" onClick={() => setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== index) })}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="grid gap-5">
          <div className="panel">
            <div className="panel-header">
              <h2 className="text-lg font-black text-slate-950">Live summary</h2>
              <CalendarClock size={19} className="text-teal-700" />
            </div>
            <div className="panel-body grid gap-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><strong>INR {subtotal.toFixed(2)}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">GST</span><strong>INR {tax.toFixed(2)}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Discount</span><strong>INR {Number(invoice.discount || 0).toFixed(2)}</strong></div>
              <div className="mt-2 rounded-lg bg-slate-950 p-4 text-white">
                <p className="text-xs text-slate-300">Grand total</p>
                <p className="mt-1 text-3xl font-black">INR {total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="panel p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="text-teal-700" />
              <div>
                <p className="font-black text-slate-950">AI invoice extraction</p>
                <p className="text-sm text-slate-500">Paste a brief into the AI endpoint to draft structured invoice JSON.</p>
              </div>
            </div>
          </div>
          {created && <div className="panel border-teal-200 bg-teal-50 p-4 text-teal-900">Created {created.invoice_number} for INR {created.total}</div>}
        </aside>
      </div>
    </form>
  );
}
