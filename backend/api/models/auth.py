from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


class OAuthLoginRequest(BaseModel):
    """Base OAuth login request model."""
    provider_user_id: str = Field(..., description="User ID from the OAuth provider")
    email: str = Field(..., description="User email from OAuth provider")
    name: Optional[str] = Field(None, description="User display name")
    avatar_url: Optional[str] = Field(None, description="User avatar URL")
    access_token: Optional[str] = Field(None, description="OAuth access token")
    refresh_token: Optional[str] = Field(None, description="OAuth refresh token")


class  MSALLoginRequest(OAuthLoginRequest):
    """Microsoft Azure AD (MSAL) login request."""
    pass


class GoogleLoginRequest(OAuthLoginRequest):
    """Google OAuth login request."""
    pass


class GitHubLoginRequest(OAuthLoginRequest):
    """GitHub OAuth login request."""
    pass


class OAuthLoginResponse(BaseModel):
    """OAuth login response model."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user_id: str
    email: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    message: str = "Login successful"