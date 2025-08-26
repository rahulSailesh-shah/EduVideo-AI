import math
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.crud.video import get_video, update_video
from app.api.dependencies import get_current_user
from app.pipeline.llm import LLMService
from app.core.config import settings
from app.schemas.video import Video, VideoCreate
from app.crud.message import get_message
from app.service.merger import VideoAudioMerger
from app.service.upload import S3UploadService
from pathlib import Path
from pydantic import BaseModel
import subprocess


# Response schema
class MergeAudioResponse(BaseModel):
    success: bool
    video_url: str
    chat_id: int = None
    message_id: int = None

router = APIRouter()

llm_service = LLMService(
    api_key=settings.llm_api_key,
)

upload_service = S3UploadService()

@router.post("/", response_model=MergeAudioResponse)
def merge_audio_endpoint(videoData: Video, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    video_id = videoData.id
    if not video_id:
        raise HTTPException(status_code=400, detail="Video ID is required")

    script = videoData.script
    if not script:
        raise HTTPException(status_code=400, detail="Script is required")

    message_id = videoData.message_id
    if not message_id:
        raise HTTPException(status_code=400, detail="Message ID is required")

    message = get_message(db=db, message_id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    s3_url = videoData.video_url
    if not s3_url:
        raise HTTPException(status_code=400, detail="Video URL is required")

    video = get_video(db=db, video_id=video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    try:
        fileName = llm_service.generate_speech_from_text(script)
        filePath = Path.cwd() / 'audios' / fileName
        output_path = VideoAudioMerger.merge_video_with_audio(
            s3_video_url=s3_url,
            audio_file_path=str(filePath),
        )
        result = subprocess.run([
                    'ffprobe', '-v', 'quiet', '-show_entries',
                    'format=duration', '-of', 'csv=p=0', str(output_path)
                ], capture_output=True, text=True)
        duration = float(result.stdout.strip())
        updated_video_url = upload_service.update_video_from_path(s3_url=s3_url, video_path=output_path)
        generated_video = VideoCreate(
                    chat_id=message.chat_id,
                    video_url=updated_video_url,
                    message_id=message.id,
                    duration=math.ceil(duration) or 0,
                )
        update_video(db=db, video_id=video_id, video=generated_video)

        output_path = Path.cwd() / str(output_path)
        if output_path.exists():
            output_path.unlink()
        return MergeAudioResponse(success=True, video_url=updated_video_url, chat_id=message.chat_id, message_id=message.id)

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")
