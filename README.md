# Invoice Forge AI

AI-powered invoice and proposal management SaaS with FastAPI, PostgreSQL, React, JWT/RBAC, PDF generation, client portal flows, document upload, payments, dashboards, and an OpenAI-backed service abstraction.

## Structure

- `backend/` FastAPI, SQLAlchemy async, Alembic, Pydantic v2
- `frontend/` React, Vite, Tailwind CSS, React Router, Zustand, Recharts
- `docker-compose.yml` local Postgres, Redis, backend, frontend

## Local Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000` with health check `GET /health`.

## Local Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Docker

```bash
docker compose up --build
```

Run migrations inside the backend container before first use:

```bash
docker compose exec backend alembic upgrade head
```

## API Highlights

- `POST /api/v1/auth/signup` creates a company and company admin.
- `GET/PATCH /api/v1/companies/me` manages tenant profile.
- `GET/POST /api/v1/clients` is scoped to the logged-in company.
- `GET/POST /api/v1/invoices` supports nested items and automatic totals.
- `GET /api/v1/invoices/{id}/pdf` renders invoice PDFs.
- `POST /api/v1/proposals/{id}/respond` lets clients approve or reject.
- `POST /api/v1/documents/upload` stores file URLs only.
- `GET /api/v1/documents` returns a privacy-safe company-facing response.
- `POST /api/v1/ai/*` calls the swappable AI service layer.

The detailed schema and document privacy rules are captured in `backend/docs/database_schema.md`.

## Deployment Checklist

1. Provision Postgres and Redis.
2. Deploy `backend/` as a Docker service.
3. Set `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, `OPENAI_API_KEY`, `CLOUDINARY_URL`, and `CORS_ORIGINS`.
4. Run `alembic upgrade head` during release.
5. Deploy `frontend/` to Vercel.
6. Set `VITE_API_BASE_URL` to the deployed backend `/api/v1` URL.
7. Update backend `CORS_ORIGINS` with the Vercel domain.
8. Confirm `/health`, signup, login, invoice PDF, and document upload from deployed URLs.

## Remaining TODOs

- Replace local upload fallback with Cloudinary or S3 provider implementation.
- Add client magic-link/password setup flow when sending proposals.
- Add richer Alembic hand-authored migrations for production review.
- Add background reminder tasks and email provider integration.
- Expand frontend CRUD editing and payment recording screens.
- Add full test coverage for invoices, proposals, payments, portal, and document privacy.
