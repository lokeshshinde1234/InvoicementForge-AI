from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends

from app.core.deps import require_role
from app.db.session import get_session
from app.models.enums import UserRole
from app.models.invoice import Invoice
from app.models.proposal import Proposal
from app.models.user import User
from app.schemas.invoice import InvoiceRead
from app.schemas.proposal import ProposalRead

router = APIRouter(prefix="/portal", tags=["client-portal"])


@router.get("/invoices", response_model=list[InvoiceRead])
async def portal_invoices(current_user: User = Depends(require_role(UserRole.client)), session: AsyncSession = Depends(get_session)):
    return (await session.scalars(select(Invoice).options(selectinload(Invoice.items)).where(Invoice.client_id == current_user.client_id).order_by(Invoice.created_at.desc()))).all()


@router.get("/proposals", response_model=list[ProposalRead])
async def portal_proposals(current_user: User = Depends(require_role(UserRole.client)), session: AsyncSession = Depends(get_session)):
    return (await session.scalars(select(Proposal).where(Proposal.client_id == current_user.client_id).order_by(Proposal.created_at.desc()))).all()

