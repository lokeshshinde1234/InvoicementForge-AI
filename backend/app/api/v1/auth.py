from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.db.session import get_session
from app.models.company import Company
from app.models.enums import UserRole
from app.models.user import User
from app.core.deps import get_current_user
from app.schemas.auth import LoginRequest, RefreshRequest, SignupRequest, TokenPair, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


def token_pair(user: User) -> TokenPair:
    return TokenPair(access_token=create_access_token(user.id), refresh_token=create_refresh_token(user.id))


@router.post("/signup", response_model=TokenPair, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest, session: AsyncSession = Depends(get_session)):
    existing = await session.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    company = Company(name=payload.company_name, gst_number=payload.gst_number, address=payload.address)
    session.add(company)
    await session.flush()
    user = User(email=payload.email, password_hash=hash_password(payload.password), role=UserRole.company_admin, company_id=company.id)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return token_pair(user)


@router.post("/login", response_model=TokenPair)
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_session)):
    user = await session.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return token_pair(user)


@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: RefreshRequest, session: AsyncSession = Depends(get_session)):
    try:
        user_id = decode_token(payload.refresh_token, "refresh")
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Invalid refresh token") from exc
    user = await session.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return token_pair(user)


@router.post("/logout")
async def logout():
    return {"message": "Logged out"}


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
