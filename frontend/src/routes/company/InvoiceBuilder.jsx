import { Bot, CalendarClock, Download, FilePlus2, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import { apiError, downloadBlob, money, shortDate } from "../../utils/format.js";

const blankInvoice = {
  client_id: "",
  tax_percent: 18,
  discount: 0,
  due_date: "",
  notes: "",
  items: [{ description: "", quantity: 1, unit_price: 0 }]
};

export function InvoiceBuilder() {
  const [invoice, setInvoice] = useState(blankInvoice);
  const [created, setCreated] = useState(null);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [payment, setPayment] = useState({ invoice_id: "", amount: "", method: "upi", reference_note: "" });
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const [clientRes, invoiceRes] = await Promise.all([
        api.get("/clients"),
        api.get("/invoices", { params: statusFilter ? { status: statusFilter } : {} })
      ]);
      setClients(clientRes.data);
      setInvoices(invoiceRes.data);
    } catch (err) {
      setError(apiError(err, "Could not load invoice data"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  const subtotal = useMemo(() => invoice.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0), [invoice.items]);
  const tax = subtotal * Number(invoice.tax_percent || 0) / 100;
  const total = Math.max(subtotal + tax - Number(invoice.discount || 0), 0);

  const clientNameById = useMemo(() => Object.fromEntries(clients.map((client) => [client.id, client.name])), [clients]);

  function updateItem(index, field, value) {
    setInvoice({ ...invoice, items: invoice.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)) });
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...invoice,
        due_date: invoice.due_date || null,
        items: invoice.items.filter((item) => item.description.trim()).map((item) => ({
          description: item.description,
          quantity: Number(item.quantity || 0),
          unit_price: Number(item.unit_price || 0)
        }))
      };
      const { data } = await api.post("/invoices", payload);
      setCreated(data);
      setInvoice({ ...blankInvoice, client_id: invoice.client_id });
      await load();
    } catch (err) {
      setError(apiError(err, "Could not create invoice"));
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(invoiceId, status) {
    setError("");
    try {
      await api.patch(`/invoices/${invoiceId}`, { status });
      await load();
    } catch (err) {
      setError(apiError(err, "Could not update invoice status"));
    }
  }

  async function recordPayment(event) {
    event.preventDefault();
    setError("");
    try {
      await api.post("/payments", { ...payment, amount: Number(payment.amount || 0) });
      setPayment({ invoice_id: "", amount: "", method: "upi", reference_note: "" });
      await load();
    } catch (err) {
      setError(apiError(err, "Could not record payment"));
    }
  }

  async function remove(invoiceId) {
    if (!window.confirm("Delete this invoice?")) return;
    setError("");
    try {
      await api.delete(`/invoices/${invoiceId}`);
      await load();
    } catch (err) {
      setError(apiError(err, "Could not delete invoice"));
    }
  }

  async function downloadPdf(row) {
    setError("");
    try {
      await downloadBlob(api.get(`/invoices/${row.id}/pdf`, { responseType: "blob" }), `${row.invoice_number}.pdf`);
    } catch (err) {
      setError(apiError(err, "Could not generate PDF. WeasyPrint system libraries may be missing."));
    }
  }

  async function draftFromText() {
    setError("");
    try {
      const { data } = await api.post("/ai/invoice-from-text", { prompt: aiPrompt });
      setAiResult(typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2));
    } catch (err) {
      setError(apiError(err, "Could not run AI invoice extraction"));
    }
  }

  async function runInvoiceAI(invoiceId, action) {
    setError("");
    try {
      const endpoint = action === "summary" ? `/ai/summarize-invoice/${invoiceId}` : action === "missing" ? `/ai/detect-missing-fields/${invoiceId}` : `/ai/payment-reminder/${invoiceId}`;
      const { data } = await api.post(endpoint);
      setAiResult(typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2));
    } catch (err) {
      setError(apiError(err, "Could not run invoice AI action"));
    }
  }

  return (
    <section className="page-stack">
      <form onSubmit={submit} className="page-stack">
        <header className="page-header">
          <div>
            <p className="eyebrow">Invoice Studio</p>
            <h1 className="page-title">Create and manage live invoices</h1>
            <p className="page-copy">Build invoices, record payments, update lifecycle status, download PDFs, and use AI checks against stored invoice records.</p>
          </div>
          <button className="primary-btn" disabled={saving || !clients.length}>
            <FilePlus2 size={18} />
            {saving ? "Creating" : "Create invoice"}
          </button>
        </header>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2 className="text-lg font-black text-slate-950">Invoice details</h2>
                <p className="mt-1 text-sm text-slate-500">Client choices load from the client API.</p>
              </div>
              <span className="status-badge badge-info">Draft</span>
            </div>
            <div className="panel-body grid gap-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_140px_140px_170px]">
                <select required value={invoice.client_id} onChange={(e) => setInvoice({ ...invoice, client_id: e.target.value })}>
                  <option value="">Select client</option>
                  {clients.map((client) => <option key={client.id} value={client.id}>{client.name} - {client.email}</option>)}
                </select>
                <input type="number" min="0" placeholder="GST %" value={invoice.tax_percent} onChange={(e) => setInvoice({ ...invoice, tax_percent: Number(e.target.value) })} />
                <input type="number" min="0" placeholder="Discount" value={invoice.discount} onChange={(e) => setInvoice({ ...invoice, discount: Number(e.target.value) })} />
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
                    <input required placeholder="Description" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} />
                    <input type="number" min="0.01" step="0.01" value={item.quantity} onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} />
                    <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateItem(index, "unit_price", Number(e.target.value))} />
                    <button type="button" title="Remove item" aria-label="Remove item" className="danger-btn h-11 w-11 p-0" onClick={() => setInvoice({ ...invoice, items: invoice.items.length > 1 ? invoice.items.filter((_, i) => i !== index) : invoice.items })}>
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
                <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><strong>{money(subtotal)}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">GST</span><strong>{money(tax)}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Discount</span><strong>{money(invoice.discount)}</strong></div>
                <div className="mt-2 rounded-lg bg-slate-950 p-4 text-white">
                  <p className="text-xs text-slate-300">Grand total</p>
                  <p className="mt-1 text-3xl font-black">{money(total)}</p>
                </div>
              </div>
            </div>
            <div className="panel p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="text-teal-700" />
                <div>
                  <p className="font-black text-slate-950">AI invoice extraction</p>
                  <p className="text-sm text-slate-500">Draft structured invoice details from a plain-language brief.</p>
                </div>
              </div>
              <textarea className="mt-3" rows={4} placeholder="Example: Create an invoice for design sprint, 2 items..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
              <button type="button" disabled={!aiPrompt} onClick={draftFromText} className="secondary-btn mt-3 w-full disabled:opacity-50">
                <Bot size={17} />
                Extract with AI
              </button>
            </div>
            {created && <div className="panel border-teal-200 bg-teal-50 p-4 text-teal-900">Created {created.invoice_number} for {money(created.total)}</div>}
          </aside>
        </div>
      </form>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="panel overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Invoice ledger</h2>
              <p className="mt-1 text-sm text-slate-500">Filter and operate on stored invoices.</p>
            </div>
            <div className="flex gap-2">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All statuses</option>
                <option value="unpaid">Unpaid</option>
                <option value="partially_paid">Partially paid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
              <button type="button" onClick={load} className="secondary-btn px-3"><RefreshCw size={18} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>No.</th><th>Client</th><th>Total</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {invoices.length ? invoices.map((row) => (
                  <tr key={row.id}>
                    <td className="font-black text-slate-900">{row.invoice_number}</td>
                    <td>{clientNameById[row.client_id] || row.client_id}</td>
                    <td>{money(row.total)}</td>
                    <td>{shortDate(row.due_date)}</td>
                    <td>
                      <select value={row.status} onChange={(e) => updateStatus(row.id, e.target.value)}>
                        <option value="unpaid">Unpaid</option>
                        <option value="partially_paid">Partially paid</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" title="Download PDF" aria-label="Download PDF" onClick={() => downloadPdf(row)} className="secondary-btn px-3"><Download size={17} /></button>
                        <button type="button" title="AI summary" aria-label="AI summary" onClick={() => runInvoiceAI(row.id, "summary")} className="secondary-btn px-3"><Bot size={17} /></button>
                        <button type="button" title="Delete" aria-label="Delete" onClick={() => remove(row.id)} className="danger-btn px-3"><Trash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center text-slate-500">{loading ? "Loading invoices" : "No invoices yet"}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-5">
          <form onSubmit={recordPayment} className="panel">
            <div className="panel-header">
              <h2 className="text-lg font-black text-slate-950">Record payment</h2>
            </div>
            <div className="panel-body grid gap-3">
              <select required value={payment.invoice_id} onChange={(e) => setPayment({ ...payment, invoice_id: e.target.value })}>
                <option value="">Select invoice</option>
                {invoices.map((row) => <option key={row.id} value={row.id}>{row.invoice_number} - {money(row.total)}</option>)}
              </select>
              <input required type="number" min="0.01" step="0.01" placeholder="Amount received" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} />
              <select value={payment.method} onChange={(e) => setPayment({ ...payment, method: e.target.value })}>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank transfer</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
              </select>
              <input placeholder="Reference note" value={payment.reference_note} onChange={(e) => setPayment({ ...payment, reference_note: e.target.value })} />
              <button className="primary-btn">Save payment</button>
            </div>
          </form>
          <div className="panel">
            <div className="panel-header">
              <h2 className="text-lg font-black text-slate-950">AI result</h2>
            </div>
            <div className="panel-body">
              {aiResult ? <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">{aiResult}</pre> : <div className="empty-state">Run invoice extraction or an invoice AI action.</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
