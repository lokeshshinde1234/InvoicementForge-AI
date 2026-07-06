from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.enums import UserRole
from app.schemas.common import ORMModel


class SignupRequest(BaseModel):
    company_name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8)
    gst_number: str | None = None
    address: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserRead(ORMModel):
    id: UUID
    email: EmailStr
    role: UserRole
    company_id: UUID | None
    client_id: UUID | None
    is_active: bool

