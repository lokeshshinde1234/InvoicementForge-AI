from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import GUID, TimestampMixin, UUIDPrimaryKeyMixin


class Client(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "clients"

    company_id: Mapped[str] = mapped_column(GUID(), ForeignKey("companies.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str | None] = mapped_column(String(64))
    address: Mapped[str | None] = mapped_column(Text)
    gst_number: Mapped[str | None] = mapped_column(String(64))

    company = relationship("Company", back_populates="clients")
    portal_users = relationship("User", back_populates="client")
    invoices = relationship("Invoice", back_populates="client")
    proposals = relationship("Proposal", back_populates="client")

