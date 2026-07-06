from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_role
from app.db.session import get_session
from app.models.enums import UserRole
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.user import User
from app.schemas.invoice import PaymentCreate, PaymentRead
from app.services.invoice_service import refresh_invoice_status

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("", response_model=PaymentRead, status_code=201)
async def record_payment(payload: PaymentCreate, current_user: User = Depends(require_role(UserRole.company_admin)), session: AsyncSession = Depends(get_session)):
    invoice = await session.get(Invoice, payload.invoice_id)
    if not invoice or invoice.company_id != current_user.company_id:
        raise HTTPException(404, "Invoice not found")
    payment = Payment(**payload.model_dump(), company_id=current_user.company_id)
    session.add(payment)
    await session.flush()
    await refresh_invoice_status(session, invoice)
    await session.commit()
    await session.refresh(payment)
    return payment
