from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_company, get_current_company_id, require_role
from app.db.session import get_session
from app.models.company import Company
from app.models.document import Document
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.company import CompanyRead, CompanyUpdate
from app.schemas.document import DocumentCompanyRead
from app.services.storage_service import storage_service

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/me", response_model=CompanyRead)
async def get_my_company(_: User = Depends(require_role("company_admin")), company: Company = Depends(get_current_company)):
    return company


@router.patch("/me", response_model=CompanyRead)
async def update_my_company(payload: CompanyUpdate, _: User = Depends(require_role("company_admin")), company: Company = Depends(get_current_company), session: AsyncSession = Depends(get_session)):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(company, key, value)
    await session.commit()
    await session.refresh(company)
    return company


@router.post("/me/logo", response_model=CompanyRead)
async def upload_company_logo(
    file: UploadFile = File(...),
    _: User = Depends(require_role("company_admin")),
    company: Company = Depends(get_current_company),
    session: AsyncSession = Depends(get_session),
):
    company.logo_url = await storage_service.upload(file, f"companies/{company.id}/logo")
    await session.commit()
    await session.refresh(company)
    return company


@router.get("/{company_id}/documents", response_model=list[DocumentCompanyRead])
async def get_company_documents(
    company_id: str,
    client_id: str | None = None,
    _: User = Depends(require_role("company_admin")),
    current_company_id=Depends(get_current_company_id),
    session: AsyncSession = Depends(get_session),
):
    if str(current_company_id) != company_id:
        raise HTTPException(status_code=404, detail="Company not found")
    stmt = select(Document).where(Document.company_id == current_company_id, Document.visible_to_company.is_(True))
    if client_id:
        stmt = stmt.where(Document.client_id == client_id)
    return (await session.scalars(stmt.order_by(Document.uploaded_at.desc()))).all()
