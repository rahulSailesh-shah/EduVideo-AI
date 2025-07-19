from datetime import datetime
from sqlalchemy.orm import Session
from typing import Optional
from app.models.chat import Chat
from app.schemas.chat import ChatCreate, ChatUpdate



def get_chat(db: Session, chat_id: int) -> Optional[Chat]:
    return db.query(Chat).filter(Chat.id == chat_id).first()

def get_chats_by_user_id(db: Session, user_id: int) -> list[Chat]:
    return db.query(Chat).filter(Chat.user_id == user_id).all()

def create_chat(db: Session, chat: ChatCreate, user_id: int) -> Chat:
    db_chat = Chat(
        title=chat.title,
        user_id=user_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def update_chat(db: Session, chat_id: int, chat_update: ChatUpdate) -> Optional[Chat]:
    db_chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not db_chat:
        return None

    if chat_update.title is not None:
        db_chat.title = chat_update.title

    db.commit()
    db.refresh(db_chat)
    return db_chat

def delete_chat(db: Session, chat_id: int) -> Optional[Chat]:
    db_chat = get_chat(db, chat_id)
    if not db_chat:
        return None

    db.delete(db_chat)
    db.commit()
    return db_chat
