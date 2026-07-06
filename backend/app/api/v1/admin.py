from datetime import datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import extract, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_role
from app.db.session import get_session
from app.models.company import Company
from app.models.enums import UserRole
from app.models.invoice import Invoice
from app.schemas.company import CompanyRead
from app.schemas.dashboard import AdminAnalytics

router = APIRouter(prefix="/admin", tags=["super-admin"])


@router.get("/companies", response_model=list[CompanyRead])
async def list_companies(_: object = Depends(require_role(UserRole.super_admin)), session: AsyncSession = Depends(get_session)):
    return (await session.scalars(select(Company).order_by(Company.created_at.desc()))).all()


@router.patch("/companies/{company_id}/activate", response_model=CompanyRead)
async def activate_company(company_id: str, _: object = Depends(require_role(UserRole.super_admin)), session: AsyncSession = Depends(get_session)):
    company = await session.get(Company, company_id)
    if not company:
        raise HTTPException(404, "Company not found")
    company.is_active = True
    await session.commit()
    await session.refresh(company)
    return company


@router.patch("/companies/{company_id}/deactivate", response_model=CompanyRead)
async def deactivate_company(company_id: str, _: object = Depends(require_role(UserRole.super_admin)), session: AsyncSession = Depends(get_session)):
    company = await session.get(Company, company_id)
    if not company:
        raise HTTPException(404, "Company not found")
    company.is_active = False
    await session.commit()
    await session.refresh(company)
    return company


@router.get("/analytics", response_model=AdminAnalytics)
async def analytics(_: object = Depends(require_role(UserRole.super_admin)), session: AsyncSession = Depends(get_session)):
    now = datetime.now(timezone.utc)
    total_companies = await session.scalar(select(func.count()).select_from(Company))
    active_companies = await session.scalar(select(func.count()).select_from(Company).where(Company.is_active.is_(True)))
    revenue = await session.scalar(select(func.coalesce(func.sum(Invoice.total), 0)))
    signups = await session.scalar(select(func.count()).select_from(Company).where(extract("month", Company.created_at) == now.month, extract("year", Company.created_at) == now.year))
    return AdminAnalytics(total_companies=total_companies or 0, active_companies=active_companies or 0, saas_wide_revenue=Decimal(str(revenue or 0)), signups_this_month=signups or 0)

