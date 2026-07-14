from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    role: str
    content: str
    created_at: datetime


class ConversationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    model: str
    created_at: datetime
    updated_at: datetime


class ConversationDetailOut(ConversationOut):
    messages: list[MessageOut] = []


class ConversationCreate(BaseModel):
    title: str | None = None
    model: str


class ConversationUpdate(BaseModel):
    title: str | None = None
    model: str | None = None


class ChatRequest(BaseModel):
    conversation_id: str
    content: str
