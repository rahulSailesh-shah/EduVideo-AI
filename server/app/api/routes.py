from fastapi import APIRouter
from app.api.endpoints import auth
from app.api.endpoints import user
from app.api.endpoints import chat
from app.api.endpoints import message
from app.api.endpoints import stream
from app.api.endpoints import video
from app.api.endpoints import generate_script
from app.api.endpoints import merge_audio

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(chat.router, prefix="/chats", tags=["chats"])
api_router.include_router(message.router, prefix="/messages", tags=["messages"])
api_router.include_router(video.router, prefix="/videos", tags=["videos"])
api_router.include_router(generate_script.router, prefix="/generate-script", tags=["generate_script"])
api_router.include_router(merge_audio.router, prefix="/merge-audio", tags=["merge_audio"])
#
api_router.include_router(stream.router, prefix="", tags=["stream"])
