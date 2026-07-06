# Deployment Checklist

## Database

Provision Postgres on Render, Railway, or Neon, then copy the `DATABASE_URL`.

For local development on this machine, PostgreSQL 17 is configured to listen on port `8080`, so the local URL shape is:

```env
DATABASE_URL=postgresql+asyncpg://postgres:<your-password>@localhost:8080/invoice_forge
```

## Backend

Deploy `/backend` to Render or Railway as a Docker service.

Required backend environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `CLOUDINARY_URL` or equivalent S3 credentials
- `REDIS_URL`
- `CORS_ORIGINS`

Run migrations during release:

```bash
alembic upgrade head
```

Render uses `backend/scripts/release.sh` as the pre-deploy command.

## Redis

Add Redis on Railway or Render if Celery reminders or async AI reports are enabled.

## Frontend

Deploy `/frontend` to Vercel and set:

- `VITE_API_BASE_URL=https://your-backend-domain/api/v1`

## CORS

Add the Vercel domain to backend `CORS_ORIGINS`, for example:

```env
CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
```

Use comma-separated origins for multiple environments.

## File Storage

Set Cloudinary or S3 credentials in backend env vars. Confirm uploads from the deployed frontend URL, not only from localhost.

## Health Check

The backend exposes:

```http
GET /health
```

Expected response:

```json
{"status": "ok"}
```

## Custom Domain

Optionally point the frontend domain to Vercel and a backend subdomain, such as `api.yourapp.com`, to Render/Railway.
