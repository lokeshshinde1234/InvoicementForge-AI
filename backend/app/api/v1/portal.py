from io import BytesIO

from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends

from app.core.deps import get_current_client_id, get_current_company_id, require_role
from app.db.session import get_session
from app.models.enums import UserRole
from app.models.client import Client
from app.models.company import Company
from app.models.invoice import Invoice
from app.models.proposal import Proposal
from app.models.user import User
from app.schemas.invoice import InvoiceRead
from app.schemas.proposal import ProposalRead
from app.services.pdf_service import render_invoice_pdf

router = APIRouter(prefix="/portal", tags=["client-portal"])


@router.get("/invoices", response_model=list[InvoiceRead])
async def portal_invoices(_: User = Depends(require_role("client")), company_id=Depends(get_current_company_id), client_id=Depends(get_current_client_id), session: AsyncSession = Depends(get_session)):
    return (await session.scalars(select(Invoice).options(selectinload(Invoice.items)).where(Invoice.company_id == company_id, Invoice.client_id == client_id).order_by(Invoice.created_at.desc()))).all()


@router.get("/proposals", response_model=list[ProposalRead])
async def portal_proposals(_: User = Depends(require_role("client")), company_id=Depends(get_current_company_id), client_id=Depends(get_current_client_id), session: AsyncSession = Depends(get_session)):
    return (await session.scalars(select(Proposal).where(Proposal.company_id == company_id, Proposal.client_id == client_id).order_by(Proposal.created_at.desc()))).all()


@router.get("/invoices/{invoice_id}/pdf")
async def portal_invoice_pdf(invoice_id: str, _: User = Depends(require_role("client")), company_id=Depends(get_current_company_id), client_id=Depends(get_current_client_id), session: AsyncSession = Depends(get_session)):
    invoice = await session.scalar(select(Invoice).options(selectinload(Invoice.items)).where(Invoice.id == invoice_id, Invoice.company_id == company_id, Invoice.client_id == client_id))
    if not invoice:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Invoice not found")
    company = await session.get(Company, company_id)
    client = await session.get(Client, client_id)
    pdf = render_invoice_pdf(company, client, invoice)
    return StreamingResponse(BytesIO(pdf), media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{invoice.invoice_number}.pdf"'})
