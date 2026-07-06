from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_role
from app.db.session import get_session
from app.models.company import Company
from app.models.document import Document
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.company import CompanyRead, CompanyUpdate
from app.schemas.document import DocumentCompanyRead

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/me", response_model=CompanyRead)
async def get_my_company(current_user: User = Depends(require_role(UserRole.company_admin)), session: AsyncSession = Depends(get_session)):
    company = await session.get(Company, current_user.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.patch("/me", response_model=CompanyRead)
async def update_my_company(payload: CompanyUpdate, current_user: User = Depends(require_role(UserRole.company_admin)), session: AsyncSession = Depends(get_session)):
    company = await session.get(Company, current_user.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(company, key, value)
    await session.commit()
    await session.refresh(company)
    return company


@router.get("/{company_id}/documents", response_model=list[DocumentCompanyRead])
async def get_company_documents(
    company_id: str,
    client_id: str | None = None,
    current_user: User = Depends(require_role(UserRole.company_admin)),
    session: AsyncSession = Depends(get_session),
):
    if str(current_user.company_id) != company_id:
        raise HTTPException(status_code=404, detail="Company not found")
    stmt = select(Document).where(Document.company_id == current_user.company_id, Document.visible_to_company.is_(True))
    if client_id:
        stmt = stmt.where(Document.client_id == client_id)
    return (await session.scalars(stmt.order_by(Document.uploaded_at.desc()))).all()
