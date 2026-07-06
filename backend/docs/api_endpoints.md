# API Endpoint Map

All endpoints are versioned under `/api/v1`.

## Auth

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Super Admin

- `GET /admin/companies`
- `PATCH /admin/companies/{id}/activate`
- `PATCH /admin/companies/{id}/deactivate`
- `GET /admin/analytics`

## Company

- `GET /companies/me`
- `PATCH /companies/me`
- `POST /companies/me/logo`

## Clients

- `GET /clients`
- `POST /clients`
- `GET /clients/{id}`
- `PATCH /clients/{id}`
- `DELETE /clients/{id}`

## Invoices

- `GET /invoices`
- `POST /invoices`
- `GET /invoices/{id}`
- `PATCH /invoices/{id}`
- `DELETE /invoices/{id}`
- `GET /invoices/{id}/pdf`

## Proposals

- `GET /proposals`
- `POST /proposals`
- `GET /proposals/{id}`
- `PATCH /proposals/{id}`
- `DELETE /proposals/{id}`
- `POST /proposals/{id}/send`
- `POST /proposals/{id}/respond`

## Documents

- `POST /documents/upload`
- `GET /documents?client_id=`

## Payments

- `POST /payments`
- `GET /invoices/{id}/payments`

## AI

- `POST /ai/invoice-from-text`
- `POST /ai/summarize-invoice/{id}`
- `POST /ai/detect-missing-fields/{id}`
- `POST /ai/payment-reminder/{invoice_id}`
- `POST /ai/generate-proposal`
- `POST /ai/monthly-report`

## Dashboard

- `GET /dashboard/summary`
- `GET /dashboard/top-clients`

## Additional Implemented Endpoints

- `GET /companies/{company_id}/documents` is a privacy-safe alias for company document review.
- `GET /portal/invoices`, `GET /portal/proposals`, and `GET /portal/invoices/{id}/pdf` support the client portal route tree.
