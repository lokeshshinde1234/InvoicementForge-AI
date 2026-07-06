import { FilePlus2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../api/client";

export function InvoiceBuilder() {
  const [invoice, setInvoice] = useState({ client_id: "", tax_percent: 18, discount: 0, due_date: "", notes: "", items: [{ description: "", quantity: 1, unit_price: 0 }] });
  const [created, setCreated] = useState(null);

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
    <form onSubmit={submit} className="grid gap-6">
      <div className="flex items-center gap-3">
        <FilePlus2 className="text-teal" />
        <h2 className="text-2xl font-semibold">Invoice Builder</h2>
      </div>
      <div className="panel grid gap-4 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <input placeholder="Client UUID" value={invoice.client_id} onChange={(e) => setInvoice({ ...invoice, client_id: e.target.value })} />
          <input type="number" placeholder="GST %" value={invoice.tax_percent} onChange={(e) => setInvoice({ ...invoice, tax_percent: Number(e.target.value) })} />
          <input type="number" placeholder="Discount" value={invoice.discount} onChange={(e) => setInvoice({ ...invoice, discount: Number(e.target.value) })} />
          <input type="date" value={invoice.due_date} onChange={(e) => setInvoice({ ...invoice, due_date: e.target.value })} />
        </div>
        {invoice.items.map((item, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-[1fr_100px_140px_44px]">
            <input placeholder="Description" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} />
            <input type="number" value={item.quantity} onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} />
            <input type="number" value={item.unit_price} onChange={(e) => updateItem(index, "unit_price", Number(e.target.value))} />
            <button type="button" title="Remove item" aria-label="Remove item" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line" onClick={() => setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== index) })}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" className="rounded-md border border-line bg-white px-3 py-2" onClick={() => setInvoice({ ...invoice, items: [...invoice.items, { description: "", quantity: 1, unit_price: 0 }] })}>
            <Plus size={18} />
          </button>
          <button className="primary-btn">Create invoice</button>
        </div>
      </div>
      {created && <div className="panel border-teal p-4">Created {created.invoice_number} for ₹{created.total}</div>}
    </form>
  );
}

