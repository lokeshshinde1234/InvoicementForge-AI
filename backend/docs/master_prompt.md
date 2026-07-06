# Master Prompt

Use this prompt to scaffold Invoice Forge AI in a single pass with an AI coding tool that has repository write access. Expect to iterate afterward.

```text
You are building "Invoice Forge AI", a multi-tenant SaaS for invoice and
proposal management with AI automation. Build it as a monorepo with
/backend (FastAPI + SQLAlchemy async + PostgreSQL + Alembic) and /frontend
(React + Vite + Tailwind CSS).

Roles: super_admin, company_admin, client - enforce with JWT + RBAC
dependencies, never trust client-supplied company_id/client_id for auth.

Implement these database tables exactly as specified: users, companies,
clients, invoices, invoice_items, proposals, payments, documents,
audit_logs. Use UUID primary keys and Alembic for migrations.

Build these modules in this order, with working tests after each:

1. Auth (signup/login/refresh, JWT, RBAC dependency)
2. Company onboarding (name, GST, address, logo, bank details, invoice prefix)
3. Client CRUD scoped to company
4. Invoice CRUD with invoice_items, tax/discount calculation, status enum
5. PDF generation for invoices via WeasyPrint, using company logo/branding
6. Proposal CRUD + send + client approve/reject + optional e-sign flag
7. Client portal: JWT-authenticated client login, view own invoices/proposals,
   upload documents (Aadhaar) to Cloudinary/S3 - store file URL only, never
   expose parsed document contents to company_admin responses
8. Payment recording endpoint + auto status transitions (unpaid to paid /
   partially_paid / overdue based on due_date and amount paid)
9. AI service layer (services/ai_service.py) wrapping OpenAI, with functions:
   invoice_from_text(prompt), summarize_invoice(invoice_id),
   detect_missing_fields(invoice_id), payment_reminder_message(invoice_id),
   generate_proposal(brief), monthly_revenue_report(company_id) - design
   this behind an interface so the provider can be swapped for a local LLM
   later.
10. Dashboard analytics endpoints (totals, paid/pending/overdue, monthly
    revenue, top clients) and super_admin SaaS-wide analytics.
11. Frontend: three route trees (superadmin/, company/, client/) with
    role-based redirect after login, Tailwind-styled dashboards, invoice
    builder form, proposal viewer/approval UI, document upload widget.
12. Dockerfiles for backend, deployment config for Render/Railway (backend
    + Postgres) and Vercel (frontend), with .env.example files for both.

Follow REST conventions from the v1 endpoint map.
Enforce the document privacy rule: company_admin can see that an Aadhaar
document was uploaded, never its extracted contents.

After scaffolding, provide a root README with setup instructions, a
docker-compose.yml for local dev (postgres + redis + backend + frontend),
and a checklist of remaining TODOs.
```
