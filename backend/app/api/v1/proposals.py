from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_role
from app.db.session import get_session
from app.models.client import Client
from app.models.enums import ProposalStatus, UserRole
from app.models.proposal import Proposal
from app.models.user import User
from app.schemas.proposal import ProposalCreate, ProposalRead, ProposalRespond, ProposalUpdate

router = APIRouter(prefix="/proposals", tags=["proposals"])


async def scoped_proposal(proposal_id: str, current_user: User, session: AsyncSession) -> Proposal:
    proposal = await session.get(Proposal, proposal_id)
    if not proposal:
        raise HTTPException(404, "Proposal not found")
    if current_user.role == UserRole.company_admin and proposal.company_id != current_user.company_id:
        raise HTTPException(404, "Proposal not found")
    if current_user.role == UserRole.client and proposal.client_id != current_user.client_id:
        raise HTTPException(404, "Proposal not found")
    return proposal


@router.get("", response_model=list[ProposalRead])
async def list_proposals(current_user: User = Depends(require_role(UserRole.company_admin)), session: AsyncSession = Depends(get_session)):
    return (await session.scalars(select(Proposal).where(Proposal.company_id == current_user.company_id).order_by(Proposal.created_at.desc()))).all()


@router.post("", response_model=ProposalRead, status_code=201)
async def create_proposal(payload: ProposalCreate, current_user: User = Depends(require_role(UserRole.company_admin)), session: AsyncSession = Depends(get_session)):
    client = await session.get(Client, payload.client_id)
    if not client or client.company_id != current_user.company_id:
        raise HTTPException(404, "Client not found")
    proposal = Proposal(**payload.model_dump(), company_id=current_user.company_id)
    session.add(proposal)
    await session.commit()
    await session.refresh(proposal)
    return proposal


@router.patch("/{proposal_id}", response_model=ProposalRead)
async def update_proposal(proposal_id: str, payload: ProposalUpdate, current_user: User = Depends(require_role(UserRole.company_admin)), session: AsyncSession = Depends(get_session)):
    proposal = await scoped_proposal(proposal_id, current_user, session)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(proposal, key, value)
    await session.commit()
    await session.refresh(proposal)
    return proposal


@router.delete("/{proposal_id}", status_code=204)
async def delete_proposal(proposal_id: str, current_user: User = Depends(require_role(UserRole.company_admin)), session: AsyncSession = Depends(get_session)):
    proposal = await scoped_proposal(proposal_id, current_user, session)
    await session.delete(proposal)
    await session.commit()


@router.post("/{proposal_id}/send", response_model=ProposalRead)
async def send_proposal(proposal_id: str, current_user: User = Depends(require_role(UserRole.company_admin)), session: AsyncSession = Depends(get_session)):
    proposal = await scoped_proposal(proposal_id, current_user, session)
    proposal.status = ProposalStatus.sent
    proposal.sent_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(proposal)
    return proposal


@router.post("/{proposal_id}/respond", response_model=ProposalRead)
async def respond_to_proposal(proposal_id: str, payload: ProposalRespond, current_user: User = Depends(require_role(UserRole.client)), session: AsyncSession = Depends(get_session)):
    if payload.decision not in {ProposalStatus.approved, ProposalStatus.rejected}:
        raise HTTPException(400, "Decision must be approved or rejected")
    proposal = await scoped_proposal(proposal_id, current_user, session)
    proposal.status = payload.decision
    proposal.responded_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(proposal)
    return proposal

