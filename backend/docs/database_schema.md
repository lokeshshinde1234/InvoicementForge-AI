# Database Schema

Invoice Forge AI uses row-level tenancy. Tenant-owned tables carry a `company_id` foreign key and all API queries are scoped from the authenticated user, not from client-supplied tenant IDs.

## users

- `id` UUID primary key
- `email` varchar unique
- `password_hash` varchar
- `role` enum: `super_admin`, `company_admin`, `client`
- `company_id` UUID foreign key to `companies.id`, nullable for super admins
- `client_id` UUID foreign key to `clients.id`, nullable except client-role users
- `is_active` boolean default true
- `created_at`, `updated_at`

## companies

- `id` UUID primary key
- `name` varchar
- `gst_number` varchar
- `address` text
- `logo_url` varchar
- `bank_account_name` varchar
- `bank_account_number` varchar
- `bank_ifsc` varchar
- `invoice_prefix` varchar default `INV`
- `is_active` boolean default true
- `created_at`, `updated_at`

## clients

- `id` UUID primary key
- `company_id` UUID foreign key to `companies.id`
- `name` varchar
- `email` varchar
- `phone` varchar
- `address` text
- `gst_number` varchar
- `created_at`, `updated_at`

## invoices

- `id` UUID primary key
- `company_id` UUID foreign key to `companies.id`
- `client_id` UUID foreign key to `clients.id`
- `invoice_number` varchar, prefix plus sequence such as `INV-0001`
- `status` enum: `unpaid`, `paid`, `partially_paid`, `overdue`
- `subtotal` numeric
- `tax_percent` numeric
- `discount` numeric
- `total` numeric
- `due_date` date
- `notes` text
- `created_at`, `updated_at`

## invoice_items

- `id` UUID primary key
- `company_id` UUID foreign key to `companies.id`
- `invoice_id` UUID foreign key to `invoices.id`
- `description` varchar
- `quantity` numeric
- `unit_price` numeric
- `line_total` numeric

`company_id` is included here to satisfy row-level tenancy directly on this child table, even though the invoice parent also carries the tenant key.

## proposals

- `id` UUID primary key
- `company_id` UUID foreign key to `companies.id`
- `client_id` UUID foreign key to `clients.id`
- `title` varchar
- `content` text
- `amount` numeric
- `status` enum: `draft`, `sent`, `approved`, `rejected`
- `esign_status` enum: `not_required`, `pending`, `signed`
- `sent_at`, `responded_at` timestamp
- `created_at`, `updated_at`

## payments

- `id` UUID primary key
- `company_id` UUID foreign key to `companies.id`
- `invoice_id` UUID foreign key to `invoices.id`
- `amount` numeric
- `method` varchar, such as `upi`, `bank_transfer`, `card`, `cash`
- `paid_at` timestamp
- `reference_note` varchar

`company_id` is included here to satisfy row-level tenancy directly on this child table, even though the invoice parent also carries the tenant key.

## documents

- `id` UUID primary key
- `company_id` UUID foreign key to `companies.id`
- `client_id` UUID foreign key to `clients.id`
- `proposal_id` UUID foreign key to `proposals.id`, nullable
- `doc_type` varchar, such as `aadhaar`, `pan`, `other`
- `file_url` varchar
- `visible_to_company` boolean default true
- `status` varchar default `uploaded`
- `uploaded_at` timestamp

Privacy rule: the table stores only the file object reference and type/status metadata. Raw extracted Aadhaar/PAN numbers must never be exposed to company admins. Company-facing response models must physically omit any future OCR or parsed identity fields.

Company-safe document endpoints return only:

- `id`
- `doc_type`
- `file_url`
- `uploaded_at`
- `status`

## audit_logs

- `id` UUID primary key
- `company_id` UUID foreign key to `companies.id`, nullable for super-admin actions
- `user_id` UUID foreign key to `users.id`
- `action` varchar
- `entity_type` varchar
- `entity_id` UUID
- `metadata` JSONB
- `created_at`, `updated_at`
