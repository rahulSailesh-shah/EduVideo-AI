from typing import Optional
from app.schemas.message import  Message
from pydantic import BaseModel
from datetime import datetime



class VideoBase(BaseModel):
  chat_id: str
  video_url: Optional[str] = None
  duration: int = 0

class VideoCreate(VideoBase):
  chat_id: int
  video_url: Optional[str] = None
  message_id: int


class VideoUpdate(VideoBase):
  video_url: Optional[str] = None
  role: Optional[str] = None

class Video(VideoBase):
  id: int
  chat_id: int
  created_at: datetime
  updated_at: datetime
  video_url: Optional[str] = None
  message_id: int
  script: Optional[str] = None
  class Config:
    from_attributes = True

class VideoDataWithMode(Video):
    mode: Optional[str] = "compact"


class VideoResponse(BaseModel):
    text: Message
    video_response: Optional['Video'] = None
