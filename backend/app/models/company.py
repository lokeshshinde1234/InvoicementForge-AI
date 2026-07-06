from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Company(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "companies"

    name: Mapped[str] = mapped_column(String(255))
    gst_number: Mapped[str | None] = mapped_column(String(64))
    address: Mapped[str | None] = mapped_column(Text)
    logo_url: Mapped[str | None] = mapped_column(String(1024))
    bank_account_name: Mapped[str | None] = mapped_column(String(255))
    bank_account_number: Mapped[str | None] = mapped_column(String(64))
    bank_ifsc: Mapped[str | None] = mapped_column(String(32))
    invoice_prefix: Mapped[str] = mapped_column(String(16), default="INV")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    users = relationship("User", back_populates="company")
    clients = relationship("Client", back_populates="company")

