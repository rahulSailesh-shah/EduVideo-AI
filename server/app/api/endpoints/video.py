
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

from app.schemas.video import Video
from app.crud.video import   get_videos_by_chat_id

from app.models.user import User
from app.api.dependencies import get_current_user


router = APIRouter()


@router.get("/chat/{chat_id}", response_model=list[Video])
def get_videos_by_chat_id_endpoint(chat_id: int,
                                  db: Session = Depends(get_db),
                                  current_user: User = Depends(get_current_user)):
    videos = get_videos_by_chat_id(db=db, chat_id=chat_id)
    print(f"Retrieved {len(videos)} videos for chat_id {chat_id}")
    return videos
