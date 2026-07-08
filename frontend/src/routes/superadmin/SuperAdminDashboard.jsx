import { Building2, LineChart, Power, RefreshCw, ShieldCheck, ToggleLeft, ToggleRight, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { StatTile } from "../../components/dashboard/StatTile.jsx";
import { apiError, money, shortDate } from "../../utils/format.js";

export function SuperAdminDashboard() {
  const [analytics, setAnalytics] = useState({ total_companies: 0, active_companies: 0, saas_wide_revenue: 0, signups_this_month: 0 });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const [analyticsRes, companyRes] = await Promise.all([api.get("/admin/analytics"), api.get("/admin/companies")]);
      setAnalytics(analyticsRes.data);
      setCompanies(companyRes.data);
    } catch (err) {
      setError(apiError(err, "Could not load platform data"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setCompanyActive(company) {
    setError("");
    try {
      await api.patch(`/admin/companies/${company.id}/${company.is_active ? "deactivate" : "activate"}`);
      await load();
    } catch (err) {
      setError(apiError(err, "Could not update tenant status"));
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Platform Control</p>
          <h1 className="page-title">Super admin SaaS operations</h1>
          <p className="page-copy">Monitor tenant activation, platform revenue, signups, and company status from one control center.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} disabled={loading} className="secondary-btn">
            <RefreshCw size={18} />
            Refresh
          </button>
          <span className="status-badge badge-success">
            <ShieldCheck size={13} />
            Super admin
          </span>
        </div>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      <div className="stat-grid">
        <StatTile label="Companies" value={analytics.total_companies} icon={Building2} trend={loading ? "Syncing" : "Live"} />
        <StatTile label="Active companies" value={analytics.active_companies} icon={Power} tone="teal" />
        <StatTile label="SaaS revenue" value={money(analytics.saas_wide_revenue)} icon={LineChart} tone="blue" />
        <StatTile label="Signups this month" value={analytics.signups_this_month} icon={UsersRound} tone="amber" />
      </div>

      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="text-lg font-black text-slate-950">Tenant registry</h2>
            <p className="mt-1 text-sm text-slate-500">Activate or deactivate companies as their access changes.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Company</th><th>GST</th><th>Invoice Prefix</th><th>Created</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {companies.length ? companies.map((company) => (
                <tr key={company.id}>
                  <td className="font-black text-slate-900">{company.name}</td>
                  <td>{company.gst_number || "Not added"}</td>
                  <td>{company.invoice_prefix}</td>
                  <td>{shortDate(company.created_at)}</td>
                  <td><span className={`status-badge ${company.is_active ? "badge-success" : "badge-warning"}`}>{company.is_active ? "Active" : "Inactive"}</span></td>
                  <td>
                    <button className={company.is_active ? "danger-btn" : "primary-btn"} onClick={() => setCompanyActive(company)}>
                      {company.is_active ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}
                      {company.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center text-slate-500">{loading ? "Loading companies" : "No companies yet"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
