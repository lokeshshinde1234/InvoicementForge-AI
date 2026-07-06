from datetime import date
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import InvoiceStatus
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.models.payment import Payment


def calculate_totals(items: list, tax_percent: Decimal, discount: Decimal) -> tuple[Decimal, Decimal]:
    subtotal = sum((item.quantity * item.unit_price for item in items), Decimal("0"))
    tax = subtotal * tax_percent / Decimal("100")
    total = max(subtotal + tax - discount, Decimal("0"))
    return subtotal.quantize(Decimal("0.01")), total.quantize(Decimal("0.01"))


async def next_invoice_number(session: AsyncSession, company_id, prefix: str) -> str:
    count = await session.scalar(select(func.count()).select_from(Invoice).where(Invoice.company_id == company_id))
    return f"{prefix}-{(count or 0) + 1:04d}"


async def amount_paid(session: AsyncSession, invoice_id) -> Decimal:
    total = await session.scalar(select(func.coalesce(func.sum(Payment.amount), 0)).where(Payment.invoice_id == invoice_id))
    return Decimal(str(total or 0))


async def refresh_invoice_status(session: AsyncSession, invoice: Invoice) -> None:
    paid = await amount_paid(session, invoice.id)
    if paid >= invoice.total:
        invoice.status = InvoiceStatus.paid
    elif paid > 0:
        invoice.status = InvoiceStatus.partially_paid
    elif invoice.due_date and invoice.due_date < date.today():
        invoice.status = InvoiceStatus.overdue
    else:
        invoice.status = InvoiceStatus.unpaid


def make_invoice_items(company_id, invoice_id, item_inputs: list) -> list[InvoiceItem]:
    rows = []
    for item in item_inputs:
        line_total = (item.quantity * item.unit_price).quantize(Decimal("0.01"))
        rows.append(
            InvoiceItem(
                company_id=company_id,
                invoice_id=invoice_id,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                line_total=line_total,
            )
        )
    return rows
