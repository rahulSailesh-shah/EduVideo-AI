
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

from app.schemas.message import MessageCreate, Message
from app.crud.message import  create_message, get_message, get_messages_by_chat_id, delete_message
from app.crud.chat import get_chat

from app.models.user import User
from app.api.dependencies import get_current_user
from app.pipeline.llm import PromptSession, LLMGenerationError, LLMService
from app.service.manim import ManimService, ManimGenerationError
from app.core.config import settings
from app.schemas.video import VideoResponse, VideoCreate
from app.service.upload import S3UploadService
from app.crud.video import create_video

router = APIRouter()

manim_service = ManimService(
    scripts_dir=settings.scripts_dir,
    docker_image=settings.docker_image
)

llm_service = LLMService(
    api_key=settings.llm_api_key,
)

s3_upload_service = S3UploadService()

@router.post("/", response_model=VideoResponse)
def create_message_endpoint(message: MessageCreate,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    new_message = create_message(db=db, message=message)

    if message.role == "user":
        chat = get_chat(db=db, chat_id=message.chat_id)
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

        chat_messages = chat.messages
        prompt_session = PromptSession([
            {"role": m.role, "content": m.content} for m in chat_messages
        ])

        try:
            generated_code = llm_service.generate_manim_code(message.content, prompt_session)


            try:
                video_b64, video_bytes, size_mb = manim_service.generate_video(generated_code)
                s3_url = s3_upload_service.upload_video(video_bytes, username=current_user.username, chat_id=message.chat_id)
                ai_message = MessageCreate(
                    content=generated_code,
                    role="assistant",
                    chat_id=message.chat_id,
                    video_url=s3_url
                )
                ai_response = create_message(db=db, message=ai_message)

                generated_video = VideoCreate(
                    chat_id=message.chat_id,
                    video_url=s3_url,
                    message_id=ai_response.id
                )
                new_video = create_video(db=db, video=generated_video)
                print(f"Video created with ID: {new_video.id}, URL: {new_video.video_url}, Message ID: {new_video.message_id}")

                return VideoResponse(
                    text=ai_response,
                    video_response=new_video,
                )

            except ManimGenerationError as e:
                # Reprompt LLM with error included
                # print(f"Error generating video: {e}")
                # print(f"Original message content: {message.content}")
                # error_message = f"Video generation failed: {str(e)}. Please fix the code and try again."
                # reprompt_content = f"{message.content}\n\n{error_message}"
                # try:
                #     regenerated_code = llm_service.generate_manim_code(reprompt_content, prompt_session)
                #     ai_message_retry = MessageCreate(
                #         content=regenerated_code,
                #         role="assistant",
                #         chat_id=message.chat_id
                #     )
                #     ai_response_retry = create_message(db=db, message=ai_message_retry)
                #     video_data_retry, video_size_mb_retry = manim_service.generate_video(regenerated_code)
                #     return VideoResponse(
                #         text=ai_response_retry,
                #         video_data=video_data_retry,
                #     )
                # except ManimGenerationError as e2:
                #     raise HTTPException(
                #         status_code=422,
                #         detail={
                #             "error": "Video generation failed after retry",
                #             "detail": str(e2),
                #             "error_code": "MANIM_GENERATION_ERROR_RETRY"
                #         }
                #     )
                raise HTTPException(
                        status_code=422,
                        detail={
                            "error": "Video generation failed after retry",
                            "detail": str(e2),
                            "error_code": "MANIM_GENERATION_ERROR_RETRY"
                        }
                    )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/{chat_id}", response_model=list[Message])
def get_messages_by_chat_endpoint(chat_id: int,
                                  db: Session = Depends(get_db),
                                  current_user: User = Depends(get_current_user)):
    messages = get_messages_by_chat_id(db=db, chat_id=chat_id)
    return messages

@router.delete("/{message_id}", response_model=Message)
def delete_message_endpoint(message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    message = delete_message(db=db, message_id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message



@router.get("/{message_id}", response_model=Message)
def get_message_endpoint(message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    message = get_message(db=db, message_id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message
