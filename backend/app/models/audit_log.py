from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.db.session import Base
from app.models.mixins import GUID, TimestampMixin, UUIDPrimaryKeyMixin


class AuditLog(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "audit_logs"

    company_id: Mapped[str | None] = mapped_column(GUID(), ForeignKey("companies.id"), nullable=True)
    user_id: Mapped[str] = mapped_column(GUID(), ForeignKey("users.id"), index=True)
    action: Mapped[str] = mapped_column(String(128))
    entity_type: Mapped[str] = mapped_column(String(128))
    entity_id: Mapped[str | None] = mapped_column(GUID())
    metadata_json: Mapped[dict | None] = mapped_column("metadata", JSON().with_variant(JSONB, "postgresql"))
