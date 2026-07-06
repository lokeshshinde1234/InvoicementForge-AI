from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.enums import InvoiceStatus
from app.schemas.common import ORMModel, Timestamped


class InvoiceItemCreate(BaseModel):
    description: str
    quantity: Decimal = Field(gt=0)
    unit_price: Decimal = Field(ge=0)


class InvoiceItemRead(ORMModel):
    id: UUID
    company_id: UUID
    description: str
    quantity: Decimal
    unit_price: Decimal
    line_total: Decimal


class InvoiceCreate(BaseModel):
    client_id: UUID
    items: list[InvoiceItemCreate]
    tax_percent: Decimal = Decimal("0")
    discount: Decimal = Decimal("0")
    due_date: date | None = None
    notes: str | None = None


class InvoiceUpdate(BaseModel):
    status: InvoiceStatus | None = None
    due_date: date | None = None
    notes: str | None = None


class InvoiceRead(Timestamped):
    company_id: UUID
    client_id: UUID
    invoice_number: str
    status: InvoiceStatus
    subtotal: Decimal
    tax_percent: Decimal
    discount: Decimal
    total: Decimal
    due_date: date | None
    notes: str | None
    items: list[InvoiceItemRead] = []


class PaymentCreate(BaseModel):
    invoice_id: UUID
    amount: Decimal = Field(gt=0)
    method: str
    reference_note: str | None = None


class PaymentRead(ORMModel):
    id: UUID
    company_id: UUID
    invoice_id: UUID
    amount: Decimal
    method: str
    paid_at: datetime
    reference_note: str | None
