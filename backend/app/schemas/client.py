from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.schemas.common import Timestamped


class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None
    gst_number: str | None = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    address: str | None = None
    gst_number: str | None = None


class ClientRead(ClientBase, Timestamped):
    company_id: UUID

