from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends

from app.core.deps import get_current_client_id, get_current_company_id, require_role
from app.db.session import get_session
from app.models.enums import UserRole
from app.models.invoice import Invoice
from app.models.proposal import Proposal
from app.models.user import User
from app.schemas.invoice import InvoiceRead
from app.schemas.proposal import ProposalRead

router = APIRouter(prefix="/portal", tags=["client-portal"])


@router.get("/invoices", response_model=list[InvoiceRead])
async def portal_invoices(_: User = Depends(require_role("client")), company_id=Depends(get_current_company_id), client_id=Depends(get_current_client_id), session: AsyncSession = Depends(get_session)):
    return (await session.scalars(select(Invoice).options(selectinload(Invoice.items)).where(Invoice.company_id == company_id, Invoice.client_id == client_id).order_by(Invoice.created_at.desc()))).all()


@router.get("/proposals", response_model=list[ProposalRead])
async def portal_proposals(_: User = Depends(require_role("client")), company_id=Depends(get_current_company_id), client_id=Depends(get_current_client_id), session: AsyncSession = Depends(get_session)):
    return (await session.scalars(select(Proposal).where(Proposal.company_id == company_id, Proposal.client_id == client_id).order_by(Proposal.created_at.desc()))).all()
