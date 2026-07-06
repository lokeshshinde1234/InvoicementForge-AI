from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import ESignStatus, ProposalStatus
from app.schemas.common import Timestamped


class ProposalCreate(BaseModel):
    client_id: UUID
    title: str
    content: str
    amount: Decimal = Decimal("0")
    esign_status: ESignStatus = ESignStatus.not_required


class ProposalUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    amount: Decimal | None = None
    status: ProposalStatus | None = None
    esign_status: ESignStatus | None = None


class ProposalRespond(BaseModel):
    decision: ProposalStatus


class ProposalRead(Timestamped):
    company_id: UUID
    client_id: UUID
    title: str
    content: str
    amount: Decimal
    status: ProposalStatus
    esign_status: ESignStatus
    sent_at: datetime | None
    responded_at: datetime | None

