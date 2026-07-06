from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_client_id, get_current_company_id, require_role
from app.db.session import get_session
from app.models.document import Document
from app.models.enums import UserRole
from app.models.proposal import Proposal
from app.models.user import User
from app.schemas.document import DocumentClientRead, DocumentCompanyRead
from app.services.storage_service import storage_service

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentClientRead, status_code=201)
async def upload_document(
    doc_type: str = Form(...),
    proposal_id: str | None = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("client")),
    company_id=Depends(get_current_company_id),
    client_id=Depends(get_current_client_id),
    session: AsyncSession = Depends(get_session),
):
    if proposal_id:
        proposal = await session.get(Proposal, proposal_id)
        if not proposal or proposal.company_id != company_id or proposal.client_id != client_id:
            from fastapi import HTTPException

            raise HTTPException(status_code=404, detail="Proposal not found")
    file_url = await storage_service.upload(file, f"companies/{company_id}/clients/{client_id}")
    document = Document(company_id=company_id, client_id=client_id, proposal_id=proposal_id, doc_type=doc_type, file_url=file_url)
    session.add(document)
    await session.commit()
    await session.refresh(document)
    return document


@router.get("", response_model=list[DocumentCompanyRead])
async def list_documents(
    client_id: str | None = None,
    current_user: User = Depends(require_role("company_admin", "client")),
    company_id=Depends(get_current_company_id),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Document).where(Document.company_id == company_id, Document.visible_to_company.is_(True))
    if current_user.role == UserRole.client:
        stmt = stmt.where(Document.client_id == current_user.client_id)
    elif client_id:
        stmt = stmt.where(Document.client_id == client_id)
    return (await session.scalars(stmt.order_by(Document.uploaded_at.desc()))).all()
