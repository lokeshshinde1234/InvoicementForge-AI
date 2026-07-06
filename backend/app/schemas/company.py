from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import Timestamped


class CompanyRead(Timestamped):
    name: str
    gst_number: str | None
    address: str | None
    logo_url: str | None
    bank_account_name: str | None
    bank_account_number: str | None
    bank_ifsc: str | None
    invoice_prefix: str
    is_active: bool


class CompanyUpdate(BaseModel):
    name: str | None = None
    gst_number: str | None = None
    address: str | None = None
    logo_url: str | None = None
    bank_account_name: str | None = None
    bank_account_number: str | None = None
    bank_ifsc: str | None = None
    invoice_prefix: str | None = None


class AdminCompanyRead(CompanyRead):
    id: UUID

