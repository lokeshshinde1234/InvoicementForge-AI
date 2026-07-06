from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_company_id, require_role
from app.db.session import get_session
from app.models.client import Client
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.client import ClientCreate, ClientRead, ClientUpdate

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=list[ClientRead])
async def list_clients(search: str | None = None, limit: int = Query(25, le=100), offset: int = 0, _: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    stmt = select(Client).where(Client.company_id == company_id)
    if search:
        stmt = stmt.where(or_(Client.name.ilike(f"%{search}%"), Client.email.ilike(f"%{search}%")))
    return (await session.scalars(stmt.order_by(Client.name).limit(limit).offset(offset))).all()


@router.post("", response_model=ClientRead, status_code=201)
async def create_client(payload: ClientCreate, _: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    client = Client(**payload.model_dump(), company_id=company_id)
    session.add(client)
    await session.commit()
    await session.refresh(client)
    return client


async def scoped_client(client_id: str, company_id, session: AsyncSession) -> Client:
    client = await session.get(Client, client_id)
    if not client or client.company_id != company_id:
        raise HTTPException(404, "Client not found")
    return client


@router.get("/{client_id}", response_model=ClientRead)
async def get_client(client_id: str, _: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    return await scoped_client(client_id, company_id, session)


@router.patch("/{client_id}", response_model=ClientRead)
async def update_client(client_id: str, payload: ClientUpdate, _: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    client = await scoped_client(client_id, company_id, session)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(client, key, value)
    await session.commit()
    await session.refresh(client)
    return client


@router.delete("/{client_id}", status_code=204)
async def delete_client(client_id: str, _: User = Depends(require_role("company_admin")), company_id=Depends(get_current_company_id), session: AsyncSession = Depends(get_session)):
    client = await scoped_client(client_id, company_id, session)
    await session.delete(client)
    await session.commit()
