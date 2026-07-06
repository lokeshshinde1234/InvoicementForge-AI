# Role and Permission Matrix

Permissions are enforced in FastAPI through `require_role(...)` plus tenant/client scope dependencies. Company-scoped queries use `get_current_company_id`; client-only views also use `get_current_client_id`.

| Action | Super Admin | Company Admin | Client |
|---|---:|---:|---:|
| Activate/deactivate companies | Yes | No | No |
| View SaaS-wide analytics | Yes | No | No |
| Manage own clients | No | Yes | No |
| Create invoice/proposal | No | Yes | No |
| View own invoice/proposal | No | Yes, own company | Yes, own only |
| Upload Aadhaar/document | No | No | Yes |
| See Aadhaar file, not contents | No | Yes | Yes, own only |
| Approve/reject proposal | No | No | Yes |
| Record payment | No | Yes | No |

Rules:

- Never trust `company_id` from a request body for authorization.
- Never trust `client_id` from a request body without checking it belongs to the current company or current client.
- Company admins can only query rows where `row.company_id == current_company_id`.
- Clients can only query rows where `row.client_id == current_client_id` and `row.company_id == current_company_id`.
- Company-facing document schemas must never expose OCR or parsed Aadhaar/PAN contents.
