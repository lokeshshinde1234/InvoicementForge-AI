import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { StatTile } from "../../components/dashboard/StatTile.jsx";

export function SuperAdminDashboard() {
  const [analytics, setAnalytics] = useState({ total_companies: 0, active_companies: 0, saas_wide_revenue: 0, signups_this_month: 0 });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setAnalytics(res.data)).catch(() => {});
    api.get("/admin/companies").then((res) => setCompanies(res.data)).catch(() => {});
  }, []);

  return (
    <section className="grid gap-6">
      <h2 className="text-2xl font-semibold">Super Admin</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <StatTile label="Companies" value={analytics.total_companies} />
        <StatTile label="Active" value={analytics.active_companies} tone="teal" />
        <StatTile label="Revenue" value={`₹${analytics.saas_wide_revenue}`} />
        <StatTile label="New this month" value={analytics.signups_this_month} tone="amber" />
      </div>
      <div className="panel overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-slate-500"><tr><th className="py-2">Company</th><th>GST</th><th>Status</th></tr></thead>
          <tbody>{companies.map((company) => <tr key={company.id} className="border-b border-line"><td className="py-3 font-medium">{company.name}</td><td>{company.gst_number}</td><td>{company.is_active ? "Active" : "Inactive"}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
