from datetime import date
from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.deps import get_current_client_id, get_current_company_id, require_role
from app.db.session import get_session
from app.models.client import Client
from app.models.company import Company
from app.models.enums import InvoiceStatus, UserRole
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.user import User
from app.schemas.invoice import InvoiceCreate, InvoiceRead, InvoiceUpdate, PaymentCreate, PaymentRead
from app.services.invoice_service import calculate_totals, make_invoice_items, next_invoice_number, refresh_invoice_status
from app.services.pdf_service import render_invoice_pdf

router = APIRouter(prefix="/invoices", tags=["invoices"])


async def scoped_invoice(invoice_id: str, current_user: User, session: AsyncSession) -> Invoice:
    invoice = await session.scalar(select(Invoice).options(selectinload(Invoice.items)).where(Invoice.id == invoice_id))
    if not invoice:
        raise HTTPException(404, "Invoice not found")
    if current_user.role == UserRole.company_admin and invoice.company_id != current_user.company_id:
        raise HTTPException(404, "Invoice not found")
    if current_user.role == UserRole.client and invoice.client_id != current_user.client_id:
        raise HTTPException(404, "Invoice not found")
    return invoice


@router.get("", response_model=list[InvoiceRead])
async def list_invoices(status: InvoiceStatus | None = None, client_id: str | None = None, date_from: date | None = None, date_to: date | None = None, _: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    stmt = select(Invoice).options(selectinload(Invoice.items)).where(Invoice.company_id == company_id)
    if status:
        stmt = stmt.where(Invoice.status == status)
    if client_id:
        stmt = stmt.where(Invoice.client_id == client_id)
    if date_from:
        stmt = stmt.where(Invoice.created_at >= date_from)
    if date_to:
        stmt = stmt.where(Invoice.created_at <= date_to)
    return (await session.scalars(stmt.order_by(Invoice.created_at.desc()))).all()


@router.post("", response_model=InvoiceRead, status_code=201)
async def create_invoice(payload: InvoiceCreate, current_user: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    client = await session.get(Client, payload.client_id)
    if not client or client.company_id != company_id:
        raise HTTPException(404, "Client not found")
    company = await session.get(Company, company_id)
    subtotal, total = calculate_totals(payload.items, payload.tax_percent, payload.discount)
    invoice = Invoice(
        company_id=company_id,
        client_id=payload.client_id,
        invoice_number=await next_invoice_number(session, company_id, company.invoice_prefix if company else "INV"),
        subtotal=subtotal,
        tax_percent=payload.tax_percent,
        discount=payload.discount,
        total=total,
        due_date=payload.due_date,
        notes=payload.notes,
    )
    session.add(invoice)
    await session.flush()
    session.add_all(make_invoice_items(company_id, invoice.id, payload.items))
    await session.commit()
    return await scoped_invoice(invoice.id, current_user, session)


@router.get("/{invoice_id}", response_model=InvoiceRead)
async def get_invoice(invoice_id: str, current_user: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    return await scoped_invoice(invoice_id, current_user, session)


@router.patch("/{invoice_id}", response_model=InvoiceRead)
async def update_invoice(invoice_id: str, payload: InvoiceUpdate, current_user: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    invoice = await scoped_invoice(invoice_id, current_user, session)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(invoice, key, value)
    await refresh_invoice_status(session, invoice)
    await session.commit()
    return await scoped_invoice(invoice_id, current_user, session)


@router.delete("/{invoice_id}", status_code=204)
async def delete_invoice(invoice_id: str, current_user: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    invoice = await scoped_invoice(invoice_id, current_user, session)
    await session.delete(invoice)
    await session.commit()


@router.get("/{invoice_id}/pdf")
async def invoice_pdf(invoice_id: str, current_user: User = Depends(require_role("company_admin", "client")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    invoice = await scoped_invoice(invoice_id, current_user, session)
    company = await session.get(Company, invoice.company_id)
    client = await session.get(Client, invoice.client_id)
    pdf = render_invoice_pdf(company, client, invoice)
    return StreamingResponse(BytesIO(pdf), media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{invoice.invoice_number}.pdf"'})


@router.get("/{invoice_id}/payments", response_model=list[PaymentRead])
async def list_invoice_payments(invoice_id: str, current_user: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    invoice = await scoped_invoice(invoice_id, current_user, session)
    return (await session.scalars(select(Payment).where(Payment.company_id == company_id, Payment.invoice_id == invoice.id).order_by(Payment.paid_at.desc()))).all()
