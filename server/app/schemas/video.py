from app.schemas.message import  Message
from pydantic import BaseModel

class VideoResponse(BaseModel):
    text: Message
    video_data: str
