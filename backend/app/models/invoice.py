from datetime import date
from decimal import Decimal

from sqlalchemy import Date, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.enums import InvoiceStatus
from app.models.mixins import GUID, TimestampMixin, UUIDPrimaryKeyMixin


class Invoice(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "invoices"

    company_id: Mapped[str] = mapped_column(GUID(), ForeignKey("companies.id"), index=True)
    client_id: Mapped[str] = mapped_column(GUID(), ForeignKey("clients.id"), index=True)
    invoice_number: Mapped[str] = mapped_column(String(64), index=True)
    status: Mapped[InvoiceStatus] = mapped_column(Enum(InvoiceStatus), default=InvoiceStatus.unpaid)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    tax_percent: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0)
    discount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    due_date: Mapped[date | None] = mapped_column(Date)
    notes: Mapped[str | None] = mapped_column(Text)

    client = relationship("Client", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan", lazy="selectin")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")

