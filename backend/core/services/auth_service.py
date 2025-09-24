from __future__ import annotations

from typing import Optional
from uuid import UUID

from core.models import User, UserIdentity
from core.repositories.user import UserRepository
from core.repositories.user_identity import UserIdentityRepository
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class AuthService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)
        self.identity_repo = UserIdentityRepository(session)

    async def login_with_oauth(
        self,
        provider: str,
        provider_user_id: str,
        email: str,
        name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        access_token: Optional[str] = None,
        refresh_token: Optional[str] = None,
    ) -> tuple[User, UserIdentity]:
        """
        Handle OAuth login for any provider (MSAL, Google, GitHub).
        
        Returns:
            tuple[User, UserIdentity]: The user and their identity record
        """
        # First, check if this identity already exists
        stmt = select(UserIdentity).where(
            UserIdentity.provider == provider,
            UserIdentity.provider_user_id == provider_user_id
        )
        result = await self.session.execute(stmt)
        existing_identity = result.scalars().first()
        
        if existing_identity:
            # User identity exists, update tokens and return the user
            await self.identity_repo.update(
                existing_identity,
                access_token=access_token,
                refresh_token=refresh_token
            )
            
            # Get the associated user
            user = await self.user_repo.get_by_id(existing_identity.user_id)
            if not user:
                raise ValueError("User not found for existing identity")
            
            # Update user info if provided
            if name or avatar_url:
                await self.user_repo.update(
                    user,
                    name=name or user.name,
                    avatar_url=avatar_url or user.avatar_url
                )
            
            return user, existing_identity
        
        # Check if user exists by email
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        existing_user = result.scalars().first()
        
        if existing_user:
            # User exists but with different provider, create new identity
            identity = await self.identity_repo.create(
                user_id=existing_user.id,
                provider=provider,
                provider_user_id=provider_user_id,
                access_token=access_token,
                refresh_token=refresh_token
            )
            
            # Update user info if provided
            if name or avatar_url:
                await self.user_repo.update(
                    existing_user,
                    name=name or existing_user.name,
                    avatar_url=avatar_url or existing_user.avatar_url
                )
            
            return existing_user, identity
        
        # Create new user and identity
        user = User(
            email=email,
            name=name,
            avatar_url=avatar_url
        )
        
        # Add user to session
        self.session.add(user)
        await self.session.flush()  # Get the user ID
        
        # Create identity for the new user
        identity = await self.identity_repo.create(
            user_id=user.id,
            provider=provider,
            provider_user_id=provider_user_id,
            access_token=access_token,
            refresh_token=refresh_token
        )
        
        return user, identity

    async def login_msal(
        self,
        provider_user_id: str,
        email: str,
        name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        access_token: Optional[str] = None,
        refresh_token: Optional[str] = None,
    ) -> tuple[User, UserIdentity]:
        """Handle Microsoft Azure AD (MSAL) login."""
        return await self.login_with_oauth(
            provider="msal",
            provider_user_id=provider_user_id,
            email=email,
            name=name,
            avatar_url=avatar_url,
            access_token=access_token,
            refresh_token=refresh_token,
        )

    async def login_google(
        self,
        provider_user_id: str,
        email: str,
        name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        access_token: Optional[str] = None,
        refresh_token: Optional[str] = None,
    ) -> tuple[User, UserIdentity]:
        """Handle Google OAuth login."""
        return await self.login_with_oauth(
            provider="google",
            provider_user_id=provider_user_id,
            email=email,
            name=name,
            avatar_url=avatar_url,
            access_token=access_token,
            refresh_token=refresh_token,
        )

    async def login_github(
        self,
        provider_user_id: str,
        email: str,
        name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        access_token: Optional[str] = None,
        refresh_token: Optional[str] = None,
    ) -> tuple[User, UserIdentity]:
        """Handle GitHub OAuth login."""
        return await self.login_with_oauth(
            provider="github",
            provider_user_id=provider_user_id,
            email=email,
            name=name,
            avatar_url=avatar_url,
            access_token=access_token,
            refresh_token=refresh_token,
        )