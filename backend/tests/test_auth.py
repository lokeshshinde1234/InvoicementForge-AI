import os

os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./test_invoice_forge.db"

import pytest
from httpx import ASGITransport, AsyncClient

from app.db import base  # noqa: F401
from app.db.session import Base, engine
from app.main import app


@pytest.fixture(autouse=True)
async def reset_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


async def signup(client):
    response = await client.post(
        "/api/v1/auth/signup",
        json={"company_name": "Acme Studio", "email": "admin@example.com", "password": "strongpass123"},
    )
    assert response.status_code == 201, response.text
    return response.json()


@pytest.mark.asyncio
async def test_signup_login_and_refresh(client):
    tokens = await signup(client)
    assert tokens["access_token"]
    login = await client.post("/api/v1/auth/login", json={"email": "admin@example.com", "password": "strongpass123"})
    assert login.status_code == 200
    refresh = await client.post("/api/v1/auth/refresh", json={"refresh_token": login.json()["refresh_token"]})
    assert refresh.status_code == 200


@pytest.mark.asyncio
async def test_login_email_is_case_insensitive(client):
    response = await client.post(
        "/api/v1/auth/signup",
        json={"company_name": "Bajaj Demo", "email": "Bajaj.Admin@Example.com", "password": "strongpass123"},
    )
    assert response.status_code == 201, response.text

    login = await client.post("/api/v1/auth/login", json={"email": "bajaj.admin@example.com", "password": "strongpass123"})
    assert login.status_code == 200, login.text
    assert login.json()["access_token"]


@pytest.mark.asyncio
async def test_company_admin_role_and_scoped_client_create(client):
    tokens = await signup(client)
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    forbidden = await client.get("/api/v1/admin/companies", headers=headers)
    assert forbidden.status_code == 403
    created = await client.post("/api/v1/clients", headers=headers, json={"name": "Globex", "email": "billing@example.org"})
    assert created.status_code == 201, created.text
    assert created.json()["name"] == "Globex"
