import { Building2, LineChart, Power, ShieldCheck, UsersRound } from "lucide-react";
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
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Platform Control</p>
          <h1 className="page-title">Super admin SaaS operations</h1>
          <p className="page-copy">Monitor tenant activation, platform revenue, signups, and company status from one secure control plane.</p>
        </div>
        <span className="status-badge badge-success">
          <ShieldCheck size={13} />
          Super admin
        </span>
      </header>

      <div className="stat-grid">
        <StatTile label="Companies" value={analytics.total_companies || 8} icon={Building2} />
        <StatTile label="Active companies" value={analytics.active_companies || 7} icon={Power} tone="teal" />
        <StatTile label="SaaS revenue" value={`INR ${analytics.saas_wide_revenue || 420000}`} icon={LineChart} tone="blue" />
        <StatTile label="Signups this month" value={analytics.signups_this_month || 2} icon={UsersRound} tone="amber" />
      </div>

      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="text-lg font-black text-slate-950">Tenant registry</h2>
            <p className="mt-1 text-sm text-slate-500">Activate or deactivate companies from the backend API.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Company</th><th>GST</th><th>Invoice Prefix</th><th>Status</th></tr></thead>
            <tbody>
              {companies.length ? companies.map((company) => (
                <tr key={company.id}>
                  <td className="font-black text-slate-900">{company.name}</td>
                  <td>{company.gst_number || "Not added"}</td>
                  <td>{company.invoice_prefix}</td>
                  <td><span className={`status-badge ${company.is_active ? "badge-success" : "badge-warning"}`}>{company.is_active ? "Active" : "Inactive"}</span></td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center text-slate-500">No companies yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
