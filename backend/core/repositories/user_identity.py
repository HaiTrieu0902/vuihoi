from __future__ import annotations

from datetime import datetime
from typing import Iterable, Optional
from uuid import UUID

from core.models import UserIdentity
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from .base import BaseRepository

class UserIdentityRepository(BaseRepository[UserIdentity]):
	def __init__(self, session: AsyncSession) -> None:
		super().__init__(session)

	# UserIdentity CRUD
	async def create(
		self,
		user_id: UUID,
		provider: str,
		provider_user_id: str,
		access_token: Optional[str] = None,
		refresh_token: Optional[str] = None,
	) -> UserIdentity:
		identity = UserIdentity(
			user_id=user_id,
			provider=provider,
			provider_user_id=provider_user_id,
			access_token=access_token,
			refresh_token=refresh_token,
			created_at=datetime.utcnow(),
			updated_at=datetime.utcnow(),
		)
		await self.add(identity)
		await self.flush()
		return identity

	async def get_by_id(self, identity_id: UUID) -> Optional[UserIdentity]:
		return await self.session.get(UserIdentity, identity_id)

	async def list_by_user(self, user_id: UUID) -> list[UserIdentity]:
		stmt = select(UserIdentity).where(UserIdentity.user_id == user_id)
		result = await self.session.execute(stmt)
		return list(result.scalars().all())

	async def list_all(self) -> list[UserIdentity]:
		stmt = select(UserIdentity).order_by(UserIdentity.created_at.desc())
		result = await self.session.execute(stmt)
		return list(result.scalars().all())

	async def update(self, identity: UserIdentity, **kwargs) -> None:
		for key, value in kwargs.items():
			if hasattr(identity, key):
				setattr(identity, key, value)
		identity.updated_at = datetime.utcnow()
		await self.flush()

	async def delete(self, identity: UserIdentity) -> None:
		await super().delete(identity)
