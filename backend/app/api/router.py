from fastapi import APIRouter

from app.api.v1 import admin, ai, auth, clients, companies, dashboard, documents, invoices, payments, portal, proposals

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(admin.router)
api_router.include_router(companies.router)
api_router.include_router(clients.router)
api_router.include_router(invoices.router)
api_router.include_router(proposals.router)
api_router.include_router(documents.router)
api_router.include_router(payments.router)
api_router.include_router(ai.router)
api_router.include_router(dashboard.router)
api_router.include_router(portal.router)

