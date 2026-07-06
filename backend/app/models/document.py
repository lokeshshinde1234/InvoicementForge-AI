from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
from app.models.mixins import GUID, UUIDPrimaryKeyMixin


class Document(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "documents"

    company_id: Mapped[str] = mapped_column(GUID(), ForeignKey("companies.id"), index=True)
    client_id: Mapped[str] = mapped_column(GUID(), ForeignKey("clients.id"), index=True)
    proposal_id: Mapped[str | None] = mapped_column(GUID(), ForeignKey("proposals.id"), nullable=True)
    doc_type: Mapped[str] = mapped_column(String(64))
    file_url: Mapped[str] = mapped_column(String(1024))
    visible_to_company: Mapped[bool] = mapped_column(Boolean, default=True)
    # Never add extracted Aadhaar/PAN values to company-facing schemas.
    status: Mapped[str] = mapped_column(String(64), default="uploaded")
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
