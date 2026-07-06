from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_role
from app.db.session import get_session
from app.models.document import Document
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.document import DocumentClientRead, DocumentCompanyRead
from app.services.storage_service import storage_service

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentClientRead, status_code=201)
async def upload_document(doc_type: str = Form(...), proposal_id: str | None = Form(None), file: UploadFile = File(...), current_user: User = Depends(require_role(UserRole.client)), session: AsyncSession = Depends(get_session)):
    file_url = await storage_service.upload(file, f"companies/{current_user.company_id}/clients/{current_user.client_id}")
    document = Document(company_id=current_user.company_id, client_id=current_user.client_id, proposal_id=proposal_id, doc_type=doc_type, file_url=file_url)
    session.add(document)
    await session.commit()
    await session.refresh(document)
    return document


@router.get("", response_model=list[DocumentCompanyRead])
async def list_documents(client_id: str | None = None, current_user: User = Depends(require_role(UserRole.company_admin)), session: AsyncSession = Depends(get_session)):
    stmt = select(Document).where(Document.company_id == current_user.company_id, Document.visible_to_company.is_(True))
    if client_id:
        stmt = stmt.where(Document.client_id == client_id)
    return (await session.scalars(stmt.order_by(Document.uploaded_at.desc()))).all()

