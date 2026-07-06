import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../../api/client";
import { StatTile } from "../../components/dashboard/StatTile.jsx";

export function CompanyDashboard() {
  const [summary, setSummary] = useState({ total_invoices: 0, paid_amount: 0, pending_amount: 0, overdue_count: 0, this_month_revenue: 0 });
  const [topClients, setTopClients] = useState([]);

  useEffect(() => {
    api.get("/dashboard/summary").then((res) => setSummary(res.data)).catch(() => {});
    api.get("/dashboard/top-clients").then((res) => setTopClients(res.data)).catch(() => {});
  }, []);

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Company Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatTile label="Invoices" value={summary.total_invoices} />
        <StatTile label="Paid" value={`₹${summary.paid_amount}`} tone="teal" />
        <StatTile label="Pending" value={`₹${summary.pending_amount}`} tone="amber" />
        <StatTile label="Overdue" value={summary.overdue_count} tone="coral" />
      </div>
      <div className="panel p-4">
        <h3 className="text-lg font-semibold">Top Clients</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topClients}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_invoiced" fill="#087f8c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

