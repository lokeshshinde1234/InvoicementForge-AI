from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_company_id, require_role
from app.db.session import get_session
from app.models.client import Client
from app.models.enums import InvoiceStatus, UserRole
from app.models.invoice import Invoice
from app.models.user import User
from app.schemas.dashboard import DashboardSummary, TopClient

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def summary(_: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    month_start = date.today().replace(day=1)
    total = await session.scalar(select(func.count()).select_from(Invoice).where(Invoice.company_id == company_id))
    paid = await session.scalar(select(func.coalesce(func.sum(Invoice.total), 0)).where(Invoice.company_id == company_id, Invoice.status == InvoiceStatus.paid))
    pending = await session.scalar(select(func.coalesce(func.sum(Invoice.total), 0)).where(Invoice.company_id == company_id, Invoice.status.in_([InvoiceStatus.unpaid, InvoiceStatus.partially_paid, InvoiceStatus.overdue])))
    overdue = await session.scalar(select(func.count()).select_from(Invoice).where(Invoice.company_id == company_id, Invoice.status == InvoiceStatus.overdue))
    month_revenue = await session.scalar(select(func.coalesce(func.sum(Invoice.total), 0)).where(Invoice.company_id == company_id, Invoice.status == InvoiceStatus.paid, Invoice.created_at >= month_start))
    return DashboardSummary(total_invoices=total or 0, paid_amount=Decimal(str(paid or 0)), pending_amount=Decimal(str(pending or 0)), overdue_count=overdue or 0, this_month_revenue=Decimal(str(month_revenue or 0)))


@router.get("/top-clients", response_model=list[TopClient])
async def top_clients(_: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    rows = await session.execute(
        select(Client.id, Client.name, func.coalesce(func.sum(Invoice.total), 0).label("total_invoiced"))
        .join(Invoice, Invoice.client_id == Client.id)
        .where(Client.company_id == company_id)
        .group_by(Client.id, Client.name)
        .order_by(func.sum(Invoice.total).desc())
        .limit(10)
    )
    return [TopClient(client_id=row.id, name=row.name, total_invoiced=Decimal(str(row.total_invoiced or 0))) for row in rows]
