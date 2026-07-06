from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_company_id, require_role
from app.db.session import get_session
from app.models.enums import UserRole
from app.models.invoice import Invoice
from app.models.user import User
from app.schemas.ai import AIResult, BriefRequest, PromptRequest
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])


async def company_invoice(invoice_id: str, company_id, session: AsyncSession) -> Invoice:
    invoice = await session.get(Invoice, invoice_id)
    if not invoice or invoice.company_id != company_id:
        raise HTTPException(404, "Invoice not found")
    return invoice


@router.post("/invoice-from-text", response_model=AIResult)
async def invoice_from_text(payload: PromptRequest, _: User = Depends(require_role("company_admin"))):
    return AIResult(result=await ai_service.invoice_from_text(payload.prompt))


@router.post("/summarize-invoice/{invoice_id}", response_model=AIResult)
async def summarize_invoice(invoice_id: str, _: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    return AIResult(result=await ai_service.summarize_invoice(await company_invoice(invoice_id, company_id, session)))


@router.post("/detect-missing-fields/{invoice_id}", response_model=AIResult)
async def detect_missing_fields(invoice_id: str, _: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    return AIResult(result=await ai_service.detect_missing_fields(await company_invoice(invoice_id, company_id, session)))


@router.post("/payment-reminder/{invoice_id}", response_model=AIResult)
async def payment_reminder(invoice_id: str, _: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    return AIResult(result=await ai_service.payment_reminder_message(await company_invoice(invoice_id, company_id, session)))


@router.post("/generate-proposal", response_model=AIResult)
async def generate_proposal(payload: BriefRequest, _: User = Depends(require_role("company_admin"))):
    return AIResult(result=await ai_service.generate_proposal(payload.brief))


@router.post("/monthly-report", response_model=AIResult)
async def monthly_report(_: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id)):
    return AIResult(result=await ai_service.monthly_revenue_report({"company_id": str(company_id)}))
