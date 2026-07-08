import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { CompanyLayout } from "./layouts/CompanyLayout.jsx";
import { ClientPortalLayout } from "./layouts/ClientPortalLayout.jsx";
import { SuperAdminLayout } from "./layouts/SuperAdminLayout.jsx";
import { Landing } from "./routes/Landing.jsx";
import { Login } from "./routes/Login.jsx";
import { PublicProductPage } from "./routes/PublicProductPage.jsx";
import { Signup } from "./routes/Signup.jsx";
import { SuperAdminDashboard } from "./routes/superadmin/SuperAdminDashboard.jsx";
import { CompanyDashboard } from "./routes/company/CompanyDashboard.jsx";
import { Clients } from "./routes/company/Clients.jsx";
import { InvoiceBuilder } from "./routes/company/InvoiceBuilder.jsx";
import { Proposals } from "./routes/company/Proposals.jsx";
import { ClientPortal } from "./routes/client/ClientPortal.jsx";
import { useAuthStore } from "./store/auth.js";

function RequireAuth({ roles, children }) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const hydrateUser = useAuthStore((state) => state.hydrateUser);
  const [ready, setReady] = useState(!token);

  useEffect(() => {
    let alive = true;
    if (!token) {
      setReady(true);
      return;
    }
    hydrateUser()
      .catch(() => localStorage.clear())
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [hydrateUser, token]);

  if (!ready) return <main className="app-main"><div className="empty-state">Loading workspace...</div></main>;
  if (!localStorage.getItem("access_token")) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to={role === "super_admin" ? "/superadmin" : role === "client" ? "/client" : "/company"} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/invoice-generator" element={<PublicProductPage type="invoice" />} />
      <Route path="/estimate-generator" element={<PublicProductPage type="estimate" />} />
      <Route path="/expense-manager" element={<PublicProductPage type="expense" />} />
      <Route path="/pricing" element={<PublicProductPage type="pricing" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/superadmin" element={<RequireAuth roles={["super_admin"]}><SuperAdminLayout /></RequireAuth>}>
        <Route index element={<SuperAdminDashboard />} />
      </Route>
      <Route path="/company" element={<RequireAuth roles={["company_admin"]}><CompanyLayout /></RequireAuth>}>
        <Route index element={<CompanyDashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="invoices/new" element={<InvoiceBuilder />} />
        <Route path="proposals" element={<Proposals />} />
      </Route>
      <Route path="/client" element={<RequireAuth roles={["client"]}><ClientPortalLayout /></RequireAuth>}>
        <Route index element={<ClientPortal />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
