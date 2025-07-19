from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List



class MessageBase(BaseModel):
  content: str
  role: str

class MessageCreate(MessageBase):
  chat_id: int

class MessageUpdate(MessageBase):
  content: Optional[str] = None
  role: Optional[str] = None

class Message(MessageBase):
  id: int
  chat_id: int
  created_at: datetime
  updated_at: datetime

  class Config:
    from_attributes = True
