from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.models.client import Client
from app.models.company import Company
from app.models.invoice import Invoice
from app.models.proposal import Proposal

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/stats")
async def public_stats(session: AsyncSession = Depends(get_session)):
    companies = await session.scalar(select(func.count()).select_from(Company).where(Company.is_active.is_(True)))
    clients = await session.scalar(select(func.count()).select_from(Client))
    invoices = await session.scalar(select(func.count()).select_from(Invoice))
    proposals = await session.scalar(select(func.count()).select_from(Proposal))
    revenue = await session.scalar(select(func.coalesce(func.sum(Invoice.total), 0)))
    return {
        "active_companies": companies or 0,
        "clients": clients or 0,
        "invoices": invoices or 0,
        "proposals": proposals or 0,
        "invoice_value": Decimal(str(revenue or 0)),
    }
