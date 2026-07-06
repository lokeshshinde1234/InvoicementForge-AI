import { AlertTriangle, BadgeIndianRupee, FileCheck2, FileClock, ReceiptText, Sparkles, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../../api/client";
import { StatTile } from "../../components/dashboard/StatTile.jsx";

export function CompanyDashboard() {
  const [summary, setSummary] = useState({ total_invoices: 0, paid_amount: 0, pending_amount: 0, overdue_count: 0, this_month_revenue: 0 });
  const [topClients, setTopClients] = useState([]);

  useEffect(() => {
    api.get("/dashboard/summary").then((res) => setSummary(res.data)).catch(() => {});
    api.get("/dashboard/top-clients").then((res) => setTopClients(res.data)).catch(() => {});
  }, []);

  const chartClients = topClients;
  const collectionRate = useMemo(() => {
    const paid = Number(summary.paid_amount || 0);
    const pending = Number(summary.pending_amount || 0);
    if (!paid && !pending) return 0;
    return Math.round((paid / Math.max(paid + pending, 1)) * 100);
  }, [summary]);
  const monthlyRevenue = [{ month: "This month", revenue: Number(summary.this_month_revenue || 0) }];

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Company Command Center</p>
          <h1 className="page-title">Invoice, proposal, and payment intelligence</h1>
          <p className="page-copy">Track receivables, draft proposals with AI, review client risk, and keep invoice status moving without jumping across tools.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/company/invoices/new" className="primary-btn">
            <ReceiptText size={18} />
            New invoice
          </a>
          <a href="/company/proposals" className="secondary-btn">
            <Sparkles size={18} />
            Generate proposal
          </a>
        </div>
      </header>

      <div className="stat-grid">
        <StatTile label="Total invoices" value={summary.total_invoices} icon={ReceiptText} caption="Across active clients" trend="Live" />
        <StatTile label="Paid amount" value={`INR ${summary.paid_amount}`} icon={BadgeIndianRupee} tone="teal" caption="Cleared revenue" trend="Live" />
        <StatTile label="Pending amount" value={`INR ${summary.pending_amount}`} icon={FileClock} tone="amber" caption="Open receivables" trend="Live" />
        <StatTile label="Overdue" value={summary.overdue_count} icon={AlertTriangle} tone="coral" caption="Needs follow-up" trend="Live" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">Revenue performance</h2>
              <p className="mt-1 text-sm text-slate-500">Monthly paid invoice trend and collection momentum.</p>
            </div>
            <span className="status-badge badge-success">
              <TrendingUp size={13} />
              {collectionRate}% collected
            </span>
          </div>
          <div className="panel-body h-80">
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
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="text-lg font-black text-slate-950">AI workflow queue</h2>
              <p className="mt-1 text-sm text-slate-500">Automation tasks ready for finance review.</p>
            </div>
          </div>
          <div className="panel-body grid gap-3">
            {[
              ["Draft payment reminders", `${summary.overdue_count} overdue invoices`, "badge-warning"],
              ["Detect missing invoice fields", `${summary.total_invoices} invoices ready`, "badge-info"],
              ["Generate monthly report", "July snapshot", "badge-success"],
              ["Convert brief to proposal", "Client pitch mode", "badge-info"]
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
            {chartClients.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartClients}>
                  <CartesianGrid stroke="#e7edf5" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} height={54} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
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
              <h2 className="text-lg font-black text-slate-950">Receivables pipeline</h2>
              <p className="mt-1 text-sm text-slate-500">A compact view of the invoice lifecycle.</p>
            </div>
            <FileCheck2 size={19} className="text-teal-700" />
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Owner</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-black text-slate-900">Invoices tracked</td>
                  <td>Your company</td>
                  <td>INR {summary.paid_amount}</td>
                  <td><span className="status-badge badge-success">Live</span></td>
                </tr>
                <tr>
                  <td className="font-black text-slate-900">Pending receivables</td>
                  <td>Your company</td>
                  <td>INR {summary.pending_amount}</td>
                  <td><span className="status-badge badge-warning">Open</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
