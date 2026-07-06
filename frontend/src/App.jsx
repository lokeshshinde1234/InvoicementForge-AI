import { Navigate, Route, Routes } from "react-router-dom";
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
