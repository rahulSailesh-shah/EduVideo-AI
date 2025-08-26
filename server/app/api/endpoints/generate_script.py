
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.api.dependencies import get_current_user
from app.pipeline.llm import LLMService
from app.core.config import settings
from app.schemas.video import VideoDataWithMode
from app.crud.message import get_message
import re
from typing import Dict

router = APIRouter()

llm_service = LLMService(
    api_key=settings.llm_api_key,
)

def extract_code_from_content(content: str) -> str:
    code_match = re.search(r"```python([\s\S]*?)```", content)
    return code_match.group(1).strip() if code_match else ""

@router.post("/", response_model=str)
def generate_script_endpoint(videoData: VideoDataWithMode, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    print("Received request to generate script with videoData:", videoData)

    message_id = videoData.message_id
    if not message_id:
        raise HTTPException(status_code=400, detail="Message ID is required")

    message = get_message(db=db, message_id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    content = message.content
    if not content:
        raise HTTPException(status_code=400, detail="Message content is empty")

    code = extract_code_from_content(content)
    mode = videoData.mode or "compact"
    if not code:
        raise HTTPException(status_code=400, detail="No code found in message content")

    # Generate script using LLM
    try:
        ai_response = llm_service.generate_script_from_code(code, mode)
        return ai_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate script: {str(e)}")
