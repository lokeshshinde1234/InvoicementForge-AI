from datetime import datetime
from uuid import UUID

from app.schemas.common import ORMModel


class DocumentCompanyRead(ORMModel):
    id: UUID
    doc_type: str
    file_url: str
    uploaded_at: datetime
    status: str


class DocumentClientRead(DocumentCompanyRead):
    company_id: UUID
    client_id: UUID

