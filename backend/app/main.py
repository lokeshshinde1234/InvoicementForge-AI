from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import DBAPIError, OperationalError
from asyncpg.exceptions import PostgresError

from app.api.router import api_router
from app.core.config import get_settings

settings = get_settings()
app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.exception_handler(OperationalError)
async def operational_error_handler(_, exc: OperationalError):
    return JSONResponse(
        status_code=503,
        content={"detail": "Database connection failed. Check DATABASE_URL, database server, port, username, password, and migrations."},
    )


@app.exception_handler(DBAPIError)
async def dbapi_error_handler(_, exc: DBAPIError):
    return JSONResponse(
        status_code=503,
        content={"detail": "Database operation failed. Check DATABASE_URL and ensure migrations have been applied."},
    )


@app.exception_handler(PostgresError)
async def postgres_error_handler(_, exc: PostgresError):
    return JSONResponse(
        status_code=503,
        content={"detail": f"PostgreSQL error: {exc}. Check DATABASE_URL credentials and database setup."},
    )
