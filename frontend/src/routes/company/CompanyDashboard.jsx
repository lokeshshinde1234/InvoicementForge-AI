import { AlertTriangle, BadgeIndianRupee, Building2, FileCheck2, FileClock, ReceiptText, RefreshCw, Save, Sparkles, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../../api/client";
import { StatTile } from "../../components/dashboard/StatTile.jsx";
import { apiError, money, shortDate } from "../../utils/format.js";

const blankSummary = { total_invoices: 0, paid_amount: 0, pending_amount: 0, overdue_count: 0, this_month_revenue: 0 };

export function CompanyDashboard() {
  const [summary, setSummary] = useState(blankSummary);
  const [topClients, setTopClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [company, setCompany] = useState(null);
  const [profile, setProfile] = useState({ name: "", gst_number: "", address: "", invoice_prefix: "INV" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const [summaryRes, topClientRes, invoiceRes, companyRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/top-clients"),
        api.get("/invoices"),
        api.get("/companies/me")
      ]);
      setSummary(summaryRes.data);
      setTopClients(topClientRes.data);
      setInvoices(invoiceRes.data);
      setCompany(companyRes.data);
      setProfile({
        name: companyRes.data.name || "",
        gst_number: companyRes.data.gst_number || "",
        address: companyRes.data.address || "",
        invoice_prefix: companyRes.data.invoice_prefix || "INV"
      });
    } catch (err) {
      setError(apiError(err, "Could not load dashboard data"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await api.patch("/companies/me", profile);
      setCompany(data);
    } catch (err) {
      setError(apiError(err, "Could not update company profile"));
    } finally {
      setSaving(false);
    }
  }

  const collectionRate = useMemo(() => {
    const paid = Number(summary.paid_amount || 0);
    const pending = Number(summary.pending_amount || 0);
    if (!paid && !pending) return 0;
    return Math.round((paid / Math.max(paid + pending, 1)) * 100);
  }, [summary]);

  const monthlyRevenue = useMemo(() => {
    const buckets = new Map();
    invoices.forEach((invoice) => {
      const date = new Date(invoice.created_at);
      const label = date.toLocaleString("en-IN", { month: "short", year: "2-digit" });
      const current = buckets.get(label) || 0;
      buckets.set(label, current + (invoice.status === "paid" ? Number(invoice.total || 0) : 0));
    });
    return Array.from(buckets, ([month, revenue]) => ({ month, revenue })).slice(0, 6).reverse();
  }, [invoices]);

  const statusCounts = useMemo(() => {
    return invoices.reduce((acc, invoice) => ({ ...acc, [invoice.status]: (acc[invoice.status] || 0) + 1 }), {});
  }, [invoices]);

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Company Command Center</p>
          <h1 className="page-title">{company?.name || "Invoice, proposal, and payment intelligence"}</h1>
          <p className="page-copy">Live receivables, company profile, client concentration, and invoice activity from your workspace records.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={load} className="secondary-btn" disabled={loading}>
            <RefreshCw size={18} />
            Refresh
          </button>
          <a href="/company/invoices/new" className="primary-btn">
            <ReceiptText size={18} />
            New invoice
          </a>
        </div>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      <div className="stat-grid">
        <StatTile label="Total invoices" value={summary.total_invoices} icon={ReceiptText} caption={`${statusCounts.unpaid || 0} unpaid`} trend={loading ? "Loading" : "Live"} />
        <StatTile label="Paid amount" value={money(summary.paid_amount)} icon={BadgeIndianRupee} tone="teal" caption="Cleared revenue" trend="Live" />
        <StatTile label="Pending amount" value={money(summary.pending_amount)} icon={FileClock} tone="amber" caption={`${statusCounts.partially_paid || 0} partial`} trend="Live" />
        <StatTile label="Overdue" value={summary.overdue_count} icon={AlertTriangle} tone="coral" caption="Needs follow-up" trend="Live" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Revenue performance</h2>
              <p className="mt-1 text-sm text-slate-500">Paid invoice trend from real invoice creation dates.</p>
            </div>
            <span className="status-badge badge-success">
              <TrendingUp size={13} />
              {collectionRate}% collected
            </span>
          </div>
          <div className="panel-body h-80">
            {monthlyRevenue.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e7edf5" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => money(value)} />
                  <Area type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} fill="url(#revenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state h-full">Create and mark invoices paid to build a revenue chart.</div>
            )}
          </div>
        </div>

        <form onSubmit={saveProfile} className="panel">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Company profile</h2>
              <p className="mt-1 text-sm text-slate-500">Used on new invoice numbers and documents.</p>
            </div>
            <Building2 size={19} className="text-teal-700" />
          </div>
          <div className="panel-body grid gap-3">
            <input placeholder="Company name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="GST number" value={profile.gst_number} onChange={(e) => setProfile({ ...profile, gst_number: e.target.value })} />
              <input placeholder="Invoice prefix" value={profile.invoice_prefix} onChange={(e) => setProfile({ ...profile, invoice_prefix: e.target.value.toUpperCase() })} />
            </div>
            <textarea rows={3} placeholder="Registered address" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
            <button className="primary-btn" disabled={saving}>
              <Save size={18} />
              {saving ? "Saving" : "Update profile"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.2fr]">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Top clients</h2>
              <p className="mt-1 text-sm text-slate-500">Ranked by total invoiced value.</p>
            </div>
            <Users size={19} className="text-teal-700" />
          </div>
          <div className="panel-body h-72">
            {topClients.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClients}>
                  <CartesianGrid stroke="#e7edf5" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} height={54} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => money(value)} />
                  <Bar dataKey="total_invoiced" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state h-full">Create invoices to populate top-client analytics.</div>
            )}
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Recent invoice pipeline</h2>
              <p className="mt-1 text-sm text-slate-500">Latest invoices from the workspace API.</p>
            </div>
            <FileCheck2 size={19} className="text-teal-700" />
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Invoice</th><th>Total</th><th>Due</th><th>Status</th></tr>
              </thead>
              <tbody>
                {invoices.length ? invoices.slice(0, 8).map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="font-black text-slate-900">{invoice.invoice_number}</td>
                    <td>{money(invoice.total)}</td>
                    <td>{shortDate(invoice.due_date)}</td>
                    <td><span className={`status-badge ${invoice.status === "paid" ? "badge-success" : invoice.status === "overdue" ? "badge-warning" : "badge-info"}`}>{invoice.status}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center text-slate-500">No invoices yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="text-lg font-black text-slate-950">AI workflow queue</h2>
            <p className="mt-1 text-sm text-slate-500">Counts are based on current invoices.</p>
          </div>
        </div>
        <div className="panel-body grid gap-3 md:grid-cols-3">
          {[
            ["Draft payment reminders", `${summary.overdue_count} overdue invoices`, "badge-warning"],
            ["Detect missing invoice fields", `${summary.total_invoices} invoices ready`, "badge-info"],
            ["Generate monthly report", `${money(summary.this_month_revenue)} this month`, "badge-success"]
          ].map(([title, meta, badge]) => (
            <div key={title} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-teal-700">
                  <Sparkles size={17} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{meta}</p>
                </div>
              </div>
              <span className={`status-badge ${badge}`}>Ready</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
