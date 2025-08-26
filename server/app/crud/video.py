from datetime import datetime
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.video import Video
from app.schemas.video import VideoCreate


def get_video(db: Session, video_id: int) -> Optional[Video]:
    return db.query(Video).filter(Video.id == video_id).first()

def get_videos_by_chat_id(db: Session, chat_id: int) -> List[Video]:
  return db.query(Video).filter(Video.chat_id == chat_id).order_by(Video.updated_at.desc()).all()

def create_video(db: Session, video: VideoCreate) -> Video:
    db_video = Video(
        chat_id=video.chat_id,
        video_url=video.video_url,
        message_id=video.message_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        duration=video.duration
    )

    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

def update_video(db: Session, video_id: int, video: VideoCreate) -> Optional[Video]:
    db_video = get_video(db, video_id)
    if not db_video:
        return None

    db_video.video_url = video.video_url
    db_video.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_video)
    return db_video

def get_video_by_video_url(db: Session, video_url: str) -> Optional[Video]:
    return db.query(Video).filter(Video.video_url == video_url).first()

def delete_video(db: Session, video_id: int) -> Optional[Video]:
    db_video = get_video(db, video_id)
    if not db_video:
        return None

    db.delete(db_video)
    db.commit()
    return db_video
