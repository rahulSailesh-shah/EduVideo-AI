
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

from app.schemas.message import MessageCreate, Message
from app.crud.message import get_message, create_message, get_messages_by_chat_id, delete_message
from app.crud.chat import get_chat, update_prompt_session_history

from app.models.user import User
from app.api.dependencies import get_current_user
from app.pipeline.llm import PromptSession, generate_manim_code

router = APIRouter()

@router.post("/", response_model=Message)
def create_message_endpoint(message: MessageCreate,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    new_message = create_message(db=db, message=message)

    if message.role == "user":
        chat = get_chat(db=db, chat_id=message.chat_id)
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

        prompt_session = PromptSession.from_json(chat.prompt_session_history)

        try:
            generated_code = generate_manim_code(message.content, prompt_session)
            print(f"Generated Manim code: {generated_code}")

            ai_message = MessageCreate(
                content=generated_code,
                role="assistant",
                chat_id=message.chat_id
            )
            ai_response = create_message(db=db, message=ai_message)

            update_prompt_session_history(
                db=db,
                chat_id=message.chat_id,
                session_history_json=prompt_session.to_json()
            )

            return new_message

        except Exception as e:
            # If generation fails, still return the user message but log the error
            print(f"Error generating Manim code: {e}")
            return new_message

    return new_message

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
