from __future__ import annotations

import hmac
from datetime import timedelta
import logfire
import aiohttp
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
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
import secrets
import urllib.parse

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth_router = APIRouter(prefix="/auth", tags=["oauth"])
SECURE_COOKIE = settings.env == "prod"
SAMESITE_VALUE = "none" if SECURE_COOKIE else "lax"

# OAuth redirect URIs
MSAL_REDIRECT_URI = settings.effective_msal_redirect_uri
FRONTEND_REDIRECT_URI = settings.effective_frontend_redirect_uri
GOOGLE_REDIRECT_URI = settings.effective_google_redirect_uri
GOOGLE_FRONTEND_REDIRECT_URI = settings.effective_google_frontend_redirect_uri
GITHUB_REDIRECT_URI = settings.effective_github_redirect_uri
GITHUB_FRONTEND_REDIRECT_URI = settings.effective_github_frontend_redirect_uri


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
    
    
# OAuth Redirect Endpoints

@oauth_router.get("/msal/login")
async def msal_login():
    """Redirect to Microsoft OAuth login."""
    # Microsoft OAuth URL
    tenant_id = settings.effective_azure_tenant_id or "common"
    client_id = settings.effective_azure_client_id
    scopes = "https://graph.microsoft.com/User.Read openid profile email"
    
    auth_url = (
        f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/authorize?"
        f"client_id={client_id}&"
        f"response_type=code&"
        f"redirect_uri={urllib.parse.quote(MSAL_REDIRECT_URI)}&"
        f"scope={urllib.parse.quote(scopes)}&"
        f"prompt=select_account"
    )
    
    return RedirectResponse(auth_url)


@oauth_router.get("/msal/logout")
async def msal_logout():
    """Redirect to Microsoft OAuth logout."""
    tenant_id = settings.effective_azure_tenant_id or "common"
    
    logout_url = (
        f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/logout?"
        f"post_logout_redirect_uri={urllib.parse.quote(FRONTEND_REDIRECT_URI)}"
    )
    
    return RedirectResponse(logout_url)


@oauth_router.get("/google/login")
async def google_login():
    """Redirect to Google OAuth login."""
    client_id = settings.effective_google_client_id
    scopes = "openid profile email"
    
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={client_id}&"
        f"response_type=code&"
        f"redirect_uri={urllib.parse.quote(GOOGLE_REDIRECT_URI)}&"
        f"scope={urllib.parse.quote(scopes)}&"
        f"access_type=offline&"
        f"prompt=select_account"
    )
    
    return RedirectResponse(auth_url)


@oauth_router.get("/google/logout")
async def google_logout():
    """Redirect to Google OAuth logout."""
    logout_url = (
        f"https://accounts.google.com/logout?"
        f"continue={urllib.parse.quote(GOOGLE_FRONTEND_REDIRECT_URI)}"
    )
    
    return RedirectResponse(logout_url)


@oauth_router.get("/github/login")
async def github_login():
    """Redirect to GitHub OAuth login."""
    client_id = settings.effective_github_client_id
    scopes = "user:email"
    
    auth_url = (
        f"https://github.com/login/oauth/authorize?"
        f"client_id={client_id}&"
        f"redirect_uri={urllib.parse.quote(GITHUB_REDIRECT_URI)}&"
        f"scope={urllib.parse.quote(scopes)}&"
        f"state=github_oauth"
    )
    
    return RedirectResponse(auth_url)


@oauth_router.get("/github/logout")
async def github_logout():
    """Redirect to GitHub OAuth logout."""
    logout_url = (
        f"https://github.com/logout?"
        f"return_to={urllib.parse.quote(GITHUB_FRONTEND_REDIRECT_URI)}"
    )
    
    return RedirectResponse(logout_url)


@oauth_router.get("/msal")
async def msal_callback(
    code: str = None,
    state: str = None,
    error: str = None,
    error_description: str = None,
    session: AsyncSession = Depends(get_session)
):
    """Handle Microsoft OAuth callback."""
    try:
        # Check for errors
        if error:
            error_msg = error_description or error
            redirect_url = f"{FRONTEND_REDIRECT_URI}?error={urllib.parse.quote(error_msg)}"
            return RedirectResponse(redirect_url)
        
        if not code:
            redirect_url = f"{FRONTEND_REDIRECT_URI}?error=no_code"
            return RedirectResponse(redirect_url)
        
        # Exchange code for tokens (skip state validation for simplicity)
        token_url = f"https://login.microsoftonline.com/{settings.effective_azure_tenant_id or 'common'}/oauth2/v2.0/token"
        
        token_data = {
            'client_id': settings.effective_azure_client_id,
            'client_secret': settings.azure_client_secret,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': MSAL_REDIRECT_URI,
        }
        async with aiohttp.ClientSession() as http_session:
            async with http_session.post(token_url, data=token_data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logfire.error(f"Token exchange failed. Status: {response.status}, Error: {error_text}")
                    redirect_url = f"{FRONTEND_REDIRECT_URI}?error=token_exchange_failed&details={urllib.parse.quote(error_text[:100])}"
                    return RedirectResponse(redirect_url)
                
                token_response = await response.json()
        
        access_token = token_response.get('access_token')
        refresh_token = token_response.get('refresh_token')
        
        if not access_token:
            redirect_url = f"{FRONTEND_REDIRECT_URI}?error=no_access_token"
            return RedirectResponse(redirect_url)
        
        # Get user profile from Microsoft Graph
        graph_url = "https://graph.microsoft.com/v1.0/me"
        headers = {'Authorization': f'Bearer {access_token}'}
        
        async with aiohttp.ClientSession() as http_session:
            async with http_session.get(graph_url, headers=headers) as response:
                if response.status == 200:
                    user_profile = await response.json()
                else:
                    user_profile = {}
        
        # Prepare user data
        user_data = {
            'id': user_profile.get('id', f"msal_{secrets.token_hex(8)}"),
            'email': user_profile.get('mail') or user_profile.get('userPrincipalName', ''),
            'name': user_profile.get('displayName', ''),
            'avatar_url': None,  # MS Graph doesn't provide avatar URL directly
            'access_token': access_token,
            'refresh_token': refresh_token,
        }
        
        # Create user session via auth service
        auth_service = AuthService(session)
        user, identity = await auth_service.login_msal(
            provider_user_id=user_data['id'],
            email=user_data['email'],
            name=user_data['name'],
            avatar_url=user_data['avatar_url'],
            access_token=user_data['access_token'],
            refresh_token=user_data['refresh_token'],
        )
        
        # Create JWT tokens
        jwt_access_token = create_access_token(str(user.id))
        jwt_refresh_token = create_refresh_token(str(user.id))
        
        await session.commit()
        
        # Redirect back to frontend with tokens
        redirect_url = (
            f"{FRONTEND_REDIRECT_URI}?"
            f"access_token={urllib.parse.quote(jwt_access_token)}&"
            f"refresh_token={urllib.parse.quote(jwt_refresh_token)}&"
            f"user_id={user.id}&"
            f"email={urllib.parse.quote(user.email or '')}&"
            f"name={urllib.parse.quote(user.name or '')}"
        )
        
        response = RedirectResponse(redirect_url)
        
        # Set refresh token as HTTP-only cookie
        response.set_cookie(
            key=REFRESH_COOKIE_NAME,
            value=jwt_refresh_token,
            httponly=True,
            secure=SECURE_COOKIE,
            samesite=SAMESITE_VALUE,
            max_age=30 * 24 * 60 * 60,  # 30 days
            path="/",
        )
        
        return response
        
        return response
        
    except Exception as e:
        logfire.error(f"MSAL callback error: {str(e)}")
        redirect_url = f"{FRONTEND_REDIRECT_URI}?error=server_error"
        return RedirectResponse(redirect_url)
    

@oauth_router.get("/callback/google")
async def google_callback(
    code: str = None,
    state: str = None,
    error: str = None,
    error_description: str = None,
    session: AsyncSession = Depends(get_session)
):
    """Handle Google OAuth callback."""
    try:
        # Check for errors
        if error:
            error_msg = error_description or error
            redirect_url = f"{GOOGLE_FRONTEND_REDIRECT_URI}?error={urllib.parse.quote(error_msg)}"
            return RedirectResponse(redirect_url)
        
        if not code:
            redirect_url = f"{GOOGLE_FRONTEND_REDIRECT_URI}?error=no_code"
            return RedirectResponse(redirect_url)
        
        # Exchange code for tokens
        token_url = "https://oauth2.googleapis.com/token"
        
        token_data = {
            'client_id': settings.effective_google_client_id,
            'client_secret': settings.effective_google_client_secret,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': GOOGLE_REDIRECT_URI,
        }
        async with aiohttp.ClientSession() as http_session:
            async with http_session.post(token_url, data=token_data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logfire.error(f"Google token exchange failed. Status: {response.status}, Error: {error_text}")
                    redirect_url = f"{GOOGLE_FRONTEND_REDIRECT_URI}?error=token_exchange_failed&details={urllib.parse.quote(error_text[:100])}"
                    return RedirectResponse(redirect_url)
                
                token_response = await response.json()
        
        access_token = token_response.get('access_token')
        refresh_token = token_response.get('refresh_token')
        
        if not access_token:
            redirect_url = f"{GOOGLE_FRONTEND_REDIRECT_URI}?error=no_access_token"
            return RedirectResponse(redirect_url)
        
        # Get user profile from Google
        profile_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {'Authorization': f'Bearer {access_token}'}
        
        async with aiohttp.ClientSession() as http_session:
            async with http_session.get(profile_url, headers=headers) as response:
                if response.status == 200:
                    user_profile = await response.json()
                else:
                    user_profile = {}
        
        # Prepare user data
        user_data = {
            'id': user_profile.get('id', f"google_{secrets.token_hex(8)}"),
            'email': user_profile.get('email', ''),
            'name': user_profile.get('name', ''),
            'avatar_url': user_profile.get('picture'),
            'access_token': access_token,
            'refresh_token': refresh_token,
        }
        
        # Create user session via auth service
        auth_service = AuthService(session)
        user, identity = await auth_service.login_google(
            provider_user_id=user_data['id'],
            email=user_data['email'],
            name=user_data['name'],
            avatar_url=user_data['avatar_url'],
            access_token=user_data['access_token'],
            refresh_token=user_data['refresh_token'],
        )
        
        # Create JWT tokens
        jwt_access_token = create_access_token(str(user.id))
        jwt_refresh_token = create_refresh_token(str(user.id))
        
        await session.commit()
        
        # Redirect back to frontend with tokens
        redirect_url = (
            f"{GOOGLE_FRONTEND_REDIRECT_URI}?"
            f"access_token={urllib.parse.quote(jwt_access_token)}&"
            f"refresh_token={urllib.parse.quote(jwt_refresh_token)}&"
            f"user_id={user.id}&"
            f"email={urllib.parse.quote(user.email or '')}&"
            f"name={urllib.parse.quote(user.name or '')}"
        )
        
        response = RedirectResponse(redirect_url)
        
        # Set refresh token as HTTP-only cookie
        response.set_cookie(
            key=REFRESH_COOKIE_NAME,
            value=jwt_refresh_token,
            httponly=True,
            secure=SECURE_COOKIE,
            samesite=SAMESITE_VALUE,
            max_age=30 * 24 * 60 * 60,  # 30 days
            path="/",
        )
        
        return response
        
        return response
        
    except Exception as e:
        logfire.error(f"Google callback error: {str(e)}")
        redirect_url = f"{GOOGLE_FRONTEND_REDIRECT_URI}?error=server_error"
        return RedirectResponse(redirect_url)
    

@oauth_router.get("/callback/github")
async def github_callback(
    code: str = None,
    state: str = None,
    error: str = None,
    error_description: str = None,
    session: AsyncSession = Depends(get_session)
):
    """Handle GitHub OAuth callback."""
    try:
        # Check for errors
        if error:
            error_msg = error_description or error
            redirect_url = f"{GITHUB_FRONTEND_REDIRECT_URI}?error={urllib.parse.quote(error_msg)}"
            return RedirectResponse(redirect_url)
        
        if not code:
            redirect_url = f"{GITHUB_FRONTEND_REDIRECT_URI}?error=no_code"
            return RedirectResponse(redirect_url)
        
        # Exchange code for access token
        token_url = "https://github.com/login/oauth/access_token"
        
        token_data = {
            'client_id': settings.effective_github_client_id,
            'client_secret': settings.effective_github_client_secret,
            'code': code,
            'redirect_uri': GITHUB_REDIRECT_URI,
        }
        headers = {'Accept': 'application/json'}
        
        async with aiohttp.ClientSession() as http_session:
            async with http_session.post(token_url, data=token_data, headers=headers) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logfire.error(f"GitHub token exchange failed. Status: {response.status}, Error: {error_text}")
                    redirect_url = f"{GITHUB_FRONTEND_REDIRECT_URI}?error=token_exchange_failed&details={urllib.parse.quote(error_text[:100])}"
                    return RedirectResponse(redirect_url)
                
                token_response = await response.json()
        
        access_token = token_response.get('access_token')
        
        if not access_token:
            redirect_url = f"{GITHUB_FRONTEND_REDIRECT_URI}?error=no_access_token"
            return RedirectResponse(redirect_url)
        
        # Get user profile from GitHub
        user_url = "https://api.github.com/user"
        headers = {'Authorization': f'token {access_token}', 'Accept': 'application/vnd.github.v3+json'}
        
        async with aiohttp.ClientSession() as http_session:
            async with http_session.get(user_url, headers=headers) as response:
                if response.status == 200:
                    user_profile = await response.json()
                else:
                    user_profile = {}
        
        # Get user email from GitHub (may require additional API call)
        email_url = "https://api.github.com/user/emails"
        async with aiohttp.ClientSession() as http_session:
            async with http_session.get(email_url, headers=headers) as response:
                if response.status == 200:
                    emails = await response.json()
                    primary_email = next((email for email in emails if email.get('primary')), None)
                    user_email = primary_email.get('email') if primary_email else user_profile.get('email', '')
                else:
                    user_email = user_profile.get('email', '')
        
        # Prepare user data
        user_data = {
            'id': str(user_profile.get('id', f"github_{secrets.token_hex(8)}")),
            'email': user_email,
            'name': user_profile.get('name') or user_profile.get('login', ''),
            'avatar_url': user_profile.get('avatar_url'),
            'access_token': access_token,
            'refresh_token': None,  # GitHub doesn't provide refresh tokens
        }
        
        # Create user session via auth service
        auth_service = AuthService(session)
        user, identity = await auth_service.login_github(
            provider_user_id=user_data['id'],
            email=user_data['email'],
            name=user_data['name'],
            avatar_url=user_data['avatar_url'],
            access_token=user_data['access_token'],
            refresh_token=user_data['refresh_token'],
        )
        
        # Create JWT tokens
        jwt_access_token = create_access_token(str(user.id))
        jwt_refresh_token = create_refresh_token(str(user.id))
        
        await session.commit()
        
        # Redirect back to frontend with tokens
        redirect_url = (
            f"{GITHUB_FRONTEND_REDIRECT_URI}?"
            f"access_token={urllib.parse.quote(jwt_access_token)}&"
            f"refresh_token={urllib.parse.quote(jwt_refresh_token)}&"
            f"user_id={user.id}&"
            f"email={urllib.parse.quote(user.email or '')}&"
            f"name={urllib.parse.quote(user.name or '')}"
        )
        
        response = RedirectResponse(redirect_url)
        
        # Set refresh token as HTTP-only cookie
        response.set_cookie(
            key=REFRESH_COOKIE_NAME,
            value=jwt_refresh_token,
            httponly=True,
            secure=SECURE_COOKIE,
            samesite=SAMESITE_VALUE,
            max_age=30 * 24 * 60 * 60,  # 30 days
            path="/",
        )
        
        return response
        
    except Exception as e:
        logfire.error(f"GitHub callback error: {str(e)}")
        redirect_url = f"{GITHUB_FRONTEND_REDIRECT_URI}?error=server_error"
        return RedirectResponse(redirect_url)    
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
        access_token = create_access_token(str(user.id))
        refresh_token = create_refresh_token(str(user.id))
        
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
        access_token = create_access_token(str(user.id))
        refresh_token = create_refresh_token(str(user.id))
        
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
    
    
    
    
    
__all__ = ["router", "oauth_router"]