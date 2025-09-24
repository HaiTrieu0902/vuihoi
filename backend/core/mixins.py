from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

class ConversationMixin(BaseModel):
    conversation_id: Optional[UUID] = None
