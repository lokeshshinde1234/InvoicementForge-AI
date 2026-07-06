import { Navigate, Route, Routes } from "react-router-dom";
import { CompanyLayout } from "./layouts/CompanyLayout.jsx";
import { ClientPortalLayout } from "./layouts/ClientPortalLayout.jsx";
import { SuperAdminLayout } from "./layouts/SuperAdminLayout.jsx";
import { Login } from "./routes/Login.jsx";
import { SuperAdminDashboard } from "./routes/superadmin/SuperAdminDashboard.jsx";
import { CompanyDashboard } from "./routes/company/CompanyDashboard.jsx";
import { Clients } from "./routes/company/Clients.jsx";
import { InvoiceBuilder } from "./routes/company/InvoiceBuilder.jsx";
import { Proposals } from "./routes/company/Proposals.jsx";
import { ClientPortal } from "./routes/client/ClientPortal.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
      </Route>
      <Route path="/company" element={<CompanyLayout />}>
        <Route index element={<CompanyDashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="invoices/new" element={<InvoiceBuilder />} />
        <Route path="proposals" element={<Proposals />} />
      </Route>
      <Route path="/client" element={<ClientPortalLayout />}>
        <Route index element={<ClientPortal />} />
      </Route>
      <Route path="*" element={<Navigate to="/company" replace />} />
    </Routes>
  );
}

