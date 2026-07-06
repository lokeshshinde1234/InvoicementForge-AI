from sqlalchemy import Boolean, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.enums import UserRole
from app.models.mixins import GUID, TimestampMixin, UUIDPrimaryKeyMixin


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), index=True)
    company_id: Mapped[str | None] = mapped_column(GUID(), ForeignKey("companies.id"), nullable=True)
    client_id: Mapped[str | None] = mapped_column(GUID(), ForeignKey("clients.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    company = relationship("Company", back_populates="users")
    client = relationship("Client", back_populates="portal_users")

