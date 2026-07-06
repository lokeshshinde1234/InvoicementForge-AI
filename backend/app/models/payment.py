from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import GUID, UUIDPrimaryKeyMixin


class Payment(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "payments"

    company_id: Mapped[str] = mapped_column(GUID(), ForeignKey("companies.id"), index=True)
    invoice_id: Mapped[str] = mapped_column(GUID(), ForeignKey("invoices.id"), index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    method: Mapped[str] = mapped_column(String(64))
    paid_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    reference_note: Mapped[str | None] = mapped_column(String(512))

    invoice = relationship("Invoice", back_populates="payments")
