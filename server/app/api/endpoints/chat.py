
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.chat import ChatCreate, ChatUpdate, Chat
from app.crud.chat import create_chat, get_chat, get_chats_by_user_id
from app.models.user import User
from app.api.dependencies import get_current_user


router = APIRouter()

@router.post("/", response_model=Chat)
def create_chat_endpoint(chat: ChatCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_chat = create_chat(db=db, chat=chat, user_id=current_user.id)
    return new_chat

@router.get("/{chat_id}", response_model=Chat)
def get_chat_endpoint(chat_id: int, db: Session = Depends(get_db)):
    chat = get_chat(db=db, chat_id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.get("/user/{user_id}", response_model=list[Chat])
def get_chats_by_user_endpoint(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    chats = get_chats_by_user_id(db=db, user_id=current_user.id)
    if not chats:
        raise HTTPException(status_code=404, detail="No chats found for this user")
    # print(f"Retrieved {len(chats)} chats for user {current_user.id}")
    return chats
