from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import GUID, UUIDPrimaryKeyMixin


class InvoiceItem(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "invoice_items"

    company_id: Mapped[str] = mapped_column(GUID(), ForeignKey("companies.id"), index=True)
    invoice_id: Mapped[str] = mapped_column(GUID(), ForeignKey("invoices.id"), index=True)
    description: Mapped[str] = mapped_column(String(512))
    quantity: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    line_total: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    invoice = relationship("Invoice", back_populates="items")
