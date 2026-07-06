from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.enums import ESignStatus, ProposalStatus
from app.models.mixins import GUID, TimestampMixin, UUIDPrimaryKeyMixin


class Proposal(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "proposals"

    company_id: Mapped[str] = mapped_column(GUID(), ForeignKey("companies.id"), index=True)
    client_id: Mapped[str] = mapped_column(GUID(), ForeignKey("clients.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[str] = mapped_column(Text)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[ProposalStatus] = mapped_column(Enum(ProposalStatus), default=ProposalStatus.draft)
    esign_status: Mapped[ESignStatus] = mapped_column(Enum(ESignStatus), default=ESignStatus.not_required)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    client = relationship("Client", back_populates="proposals")

