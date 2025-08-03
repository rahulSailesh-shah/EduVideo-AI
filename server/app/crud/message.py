from datetime import datetime
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.message import Message
from app.schemas.message import MessageCreate


def get_message(db: Session, message_id: int) -> Optional[Message]:
    return db.query(Message).filter(Message.id == message_id).first()

def get_messages_by_chat_id(db: Session, chat_id: int) -> List[Message]:
    return db.query(Message).filter(Message.chat_id == chat_id).all()

def create_message(db: Session, message: MessageCreate) -> Message:
    db_message = Message(
        content=message.content,
        role=message.role,
        chat_id=message.chat_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def update_message(db: Session, message_id: int, message: MessageCreate) -> Optional[Message]:
    db_message = get_message(db, message_id)
    if not db_message:
        return None

    db_message.content = message.content
    db_message.role = message.role
    db_message.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_message)
    return db_message

def delete_message(db: Session, message_id: int) -> Optional[Message]:
    db_message = get_message(db, message_id)
    if not db_message:
        return None

    db.delete(db_message)
    db.commit()
    return db_message
