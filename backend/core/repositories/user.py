from __future__ import annotations

from datetime import datetime
from typing import Iterable, Optional
from uuid import UUID

from core.models import (
    User,
    UserIdentity
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from .base import BaseRepository

class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)
        
    # User CRUD
    async def create(
        self,
        username: str,
        email: Optional[str] = None,
        full_name: Optional[str] = None,
        is_active: bool = True,
        is_superuser: bool = False,
        identities: Optional[Iterable[UserIdentity]] = None,
    ) -> User:
        user = User(
            username=username,
            email=email,
            full_name=full_name,
            is_active=is_active,
            is_superuser=is_superuser,
            identities=list(identities) if identities else [],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        await self.add(user)
        await self.flush()
        return user
    
    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        return await self.session.get(User, user_id)
    
    async def get_by_username(self, username: str) -> Optional[User]:
        stmt = select(User).where(User.username == username)
        result = await self.session.execute(stmt)
        return result.scalars().first()
    
    async def list_all(self) -> list[User]:
        stmt = select(User).order_by(User.created_at.desc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update(self, user: User, **kwargs) -> None:
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        user.updated_at = datetime.utcnow()
        await self.flush()

    async def delete(self, user: User) -> None:
        await super().delete(user)
