
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

from app.schemas.message import MessageCreate, Message
from app.crud.message import get_message, create_message, get_messages_by_chat_id, delete_message

from app.models.user import User
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=Message)
def create_message_endpoint(message: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_message = create_message(db=db, message=message)
    return new_message

@router.get("/chat/{chat_id}", response_model=list[Message])
def get_messages_by_chat_endpoint(chat_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print("Fetching messages for chat_id:", chat_id)
    messages = get_messages_by_chat_id(db=db, chat_id=chat_id)
    if not messages:
        raise HTTPException(status_code=404, detail="No messages found for this chat")
    return messages

@router.delete("/{message_id}", response_model=Message)
def delete_message_endpoint(message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    message = delete_message(db=db, message_id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message
