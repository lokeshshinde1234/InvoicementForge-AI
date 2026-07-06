# Phase-by-Phase Prompts

Use these prompts one at a time, in order, when rebuilding or extending Invoice Forge AI with an AI coding tool.

## Phase 1 - Auth and Roles

```text
Set up the FastAPI backend skeleton for "Invoice Forge AI":
- Postgres connection via SQLAlchemy async + Alembic
- users table (id, email, password_hash, role enum[super_admin,
  company_admin, client], company_id nullable FK, client_id nullable FK,
  is_active, timestamps)
- JWT auth: /auth/signup (creates a company + company_admin user together),
  /auth/login (returns access + refresh token), /auth/refresh
- A get_current_user dependency and a require_role(*roles) dependency
- Password hashing with bcrypt via passlib
Give me working pytest tests for signup/login/role enforcement.
```

## Phase 2 - Company Onboarding

```text
Add the companies table (name, gst_number, address, logo_url, bank_account_
name, bank_account_number, bank_ifsc, invoice_prefix, is_active) and:
- PATCH /companies/me for company_admin to update their own company profile
- Logo upload endpoint storing to Cloudinary/S3, saving only the URL
- GET /companies/me
Add Alembic migration and Pydantic schemas with response_model excluding
any internal fields.
```

## Phase 3 - Client Management

```text
Add clients table (company_id FK, name, email, phone, address, gst_number)
with full CRUD scoped strictly to the logged-in company_admin's company_id
(never trust a company_id in the request body). Add pagination and search
by name/email on GET /clients.
```

## Phase 4 - Invoice CRUD

```text
Add invoices + invoice_items tables per the schema in Section 5. Build:
- POST /invoices (nested invoice_items in the payload, auto-calculate
  subtotal, tax, discount, total)
- GET /invoices with filters: status, client_id, date range
- PATCH /invoices/{id}, DELETE /invoices/{id}
- Auto-generate invoice_number using the company's invoice_prefix +
  sequential counter per company
```

## Phase 5 - PDF Generation

```text
Add a pdf_service.py using WeasyPrint. Build GET /invoices/{id}/pdf that
renders an HTML/Jinja2 invoice template (company logo, bank details,
itemized table, tax/discount breakdown, due date, status badge) to PDF and
returns it as a downloadable file response.
```

## Phase 6 - Proposals

```text
Add proposals table per schema. Build CRUD + POST /proposals/{id}/send
(marks status=sent, sent_at=now, optionally emails the client a portal
link) + POST /proposals/{id}/respond for client role only (approve/reject,
sets responded_at). Add esign_status field, default 'not_required'.
```

## Phase 7 - Client Portal

```text
Build client-facing auth: clients get a portal login (email + magic-link
or password set on first proposal send). Build client-only endpoints:
GET /portal/invoices, GET /portal/proposals, GET /portal/invoices/{id}/pdf
- all scoped to the logged-in client's client_id only, never another
client's data.
```

## Phase 8 - Document Upload (Aadhaar/KYC)

```text
Add documents table per schema. Build POST /documents/upload (client role,
multipart file upload to Cloudinary/S3, doc_type field) and GET /documents
for company_admin that returns ONLY {doc_type, file_url, uploaded_at,
status} - enforce via response_model so no parsed/extracted document data
can ever leak into the company-facing response, even if such a field is
added to the model later.
```

## Phase 9 - Payment Tracking

```text
Add payments table. Build POST /payments (amount, method, invoice_id) and
auto-update the parent invoice's status:
- amount_paid == total -> paid
- 0 < amount_paid < total -> partially_paid
- due_date passed and amount_paid < total -> overdue
Add GET /invoices/{id}/payments to list payment history.
```

## Phase 10 - AI Assistant

```text
Build services/ai_service.py wrapping the OpenAI API behind an interface
(so a local LLM can be swapped in later). Implement:
- invoice_from_text(prompt) -> structured invoice JSON (client name, items,
  quantities, prices, GST%) using function-calling/JSON mode
- summarize_invoice(invoice_id) -> 2-3 sentence summary
- detect_missing_fields(invoice_id) -> list of missing/inconsistent fields
- payment_reminder_message(invoice_id) -> polite reminder email draft
- generate_proposal(brief) -> proposal title + content draft
- monthly_revenue_report(company_id) -> narrative summary of the month's
  invoices/payments/top clients
Expose these as POST /ai/* endpoints from Section 6's API map.
```

## Phase 11 - Dashboard Analytics

```text
Build GET /dashboard/summary (total invoices, paid amount, pending amount,
overdue count, this month's revenue) and GET /dashboard/top-clients (by
total invoiced amount) for company_admin. Build GET /admin/analytics for
super_admin (total companies, active companies, SaaS-wide revenue,
signups this month). Build the matching React dashboard pages with
Tailwind + a chart library (recharts) for monthly revenue.
```

## Phase 12 - Deployment

```text
Give me:
1. A backend Dockerfile (multi-stage, Python 3.11-slim) and a
   render.yaml / railway.json for deploying FastAPI + Postgres
2. Environment variable list (.env.example) for backend: DATABASE_URL,
   JWT_SECRET, OPENAI_API_KEY, CLOUDINARY_URL (or AWS creds), REDIS_URL
3. Vercel config for the React frontend with VITE_API_BASE_URL
4. A docker-compose.yml for local dev spinning up postgres, redis,
   backend, and frontend together
5. A step-by-step deployment checklist: DB migration on deploy, CORS
   config for the Vercel domain, health-check endpoint
```
