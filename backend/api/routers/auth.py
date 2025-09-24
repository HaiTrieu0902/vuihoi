from __future__ import annotations

import hmac
from datetime import timedelta
import logfire
from core.auth import (
    REFRESH_COOKIE_NAME,
    create_access_token,
    create_refresh_token,
    generate_simple_user_id,
    get_jwt_secret_key,
    verify_refresh_token,
)
from core.services.auth_service import AuthService
from api.models.auth import (
    MSALLoginRequest, 
    GoogleLoginRequest, 
    GitHubLoginRequest, 
    OAuthLoginResponse
)
from db import get_session
from settings import settings
from fastapi import APIRouter, HTTPException, Request, Response, status, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/auth", tags=["auth"])
SECURE_COOKIE = settings.env == "prod"
SAMESITE_VALUE = "none" if SECURE_COOKIE else "lax"


class TokenRequest(BaseModel):
    """Request model for getting an access token.

    For MVP, we'll use a simple approach where users can request a token
    with just an identifier (email, username, etc.) - no password required.
    """

    identifier: str = Field(
        ...,
        min_length=3,
        max_length=255,
        description="Email, username, or any unique identifier",
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user_id: str
    
    
@router.post("/login-msal", response_model=OAuthLoginResponse)
async def login_msal(
    request: MSALLoginRequest, 
    response: Response, 
    session: AsyncSession = Depends(get_session)
) -> OAuthLoginResponse:
    """Microsoft Azure AD (MSAL) login endpoint."""
    try:
        auth_service = AuthService(session)
        user, identity = await auth_service.login_msal(
            provider_user_id=request.provider_user_id,
            email=request.email,
            name=request.name,
            avatar_url=request.avatar_url,
            access_token=request.access_token,
            refresh_token=request.refresh_token,
        )
        
        # Create JWT tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Set refresh token as HTTP-only cookie
        response.set_cookie(
            key=REFRESH_COOKIE_NAME,
            value=refresh_token,
            httponly=True,
            secure=SECURE_COOKIE,
            samesite=SAMESITE_VALUE,
            max_age=30 * 24 * 60 * 60,  # 30 days
            path="/",
        )
        
        await session.commit()
        
        return OAuthLoginResponse(
            access_token=access_token,
            expires_in=15 * 60,  # 15 minutes
            user_id=str(user.id),
            email=user.email,
            name=user.name,
            avatar_url=user.avatar_url,
        )
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"MSAL login failed: {str(e)}"
        )    
    
@router.post("/login-google", response_model=OAuthLoginResponse)
async def login_google(
    request: GoogleLoginRequest, 
    response: Response, 
    session: AsyncSession = Depends(get_session)
) -> OAuthLoginResponse:
    """Google OAuth login endpoint."""
    try:
        auth_service = AuthService(session)
        user, identity = await auth_service.login_google(
            provider_user_id=request.provider_user_id,
            email=request.email,
            name=request.name,
            avatar_url=request.avatar_url,
            access_token=request.access_token,
            refresh_token=request.refresh_token,
        )
        
        # Create JWT tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Set refresh token as HTTP-only cookie
        response.set_cookie(
            key=REFRESH_COOKIE_NAME,
            value=refresh_token,
            httponly=True,
            secure=SECURE_COOKIE,
            samesite=SAMESITE_VALUE,
            max_age=30 * 24 * 60 * 60,  # 30 days
            path="/",
        )
        
        await session.commit()
        
        return OAuthLoginResponse(
            access_token=access_token,
            expires_in=15 * 60,  # 15 minutes
            user_id=str(user.id),
            email=user.email,
            name=user.name,
            avatar_url=user.avatar_url,
        )
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google login failed: {str(e)}"
        )  

@router.post("/login-github", response_model=OAuthLoginResponse)
async def login_github(
    request: GitHubLoginRequest, 
    response: Response, 
    session: AsyncSession = Depends(get_session)
) -> OAuthLoginResponse:
    """GitHub OAuth login endpoint."""
    try:
        auth_service = AuthService(session)
        user, identity = await auth_service.login_github(
            provider_user_id=request.provider_user_id,
            email=request.email,
            name=request.name,
            avatar_url=request.avatar_url,
            access_token=request.access_token,
            refresh_token=request.refresh_token,
        )
        
        # Create JWT tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Set refresh token as HTTP-only cookie
        response.set_cookie(
            key=REFRESH_COOKIE_NAME,
            value=refresh_token,
            httponly=True,
            secure=SECURE_COOKIE,
            samesite=SAMESITE_VALUE,
            max_age=30 * 24 * 60 * 60,  # 30 days
            path="/",
        )
        
        await session.commit()
        
        return OAuthLoginResponse(
            access_token=access_token,
            expires_in=15 * 60,  # 15 minutes
            user_id=str(user.id),
            email=user.email,
            name=user.name,
            avatar_url=user.avatar_url,
        )
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"GitHub login failed: {str(e)}"
        )  
    
@router.post("/logout")
async def logout(response: Response) -> dict:
    response.delete_cookie(REFRESH_COOKIE_NAME, path="/")
    return {"status": "ok"}
    
    
    
    
    
__all__ = ["router"]