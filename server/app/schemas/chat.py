from pydantic import BaseModel
from datetime import datetime
from typing import  List
from app.schemas.message import Message

class ChatBase(BaseModel):
    title: str

class ChatCreate(ChatBase):
    pass

class ChatUpdate(ChatBase):
    pass

class Chat(ChatBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ChatWithMessages(Chat):
    messages: List[Message] = []
