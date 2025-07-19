from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class Message(Base):
  __tablename__ = "messages"

  id = Column(Integer, primary_key=True, index=True)
  content = Column(String, nullable=False)
  role = Column(String, nullable=False)
  created_at = Column(DateTime(timezone=True), nullable=False)
  updated_at = Column(DateTime(timezone=True), nullable=False)

  chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)

  chat = relationship("Chat", back_populates="messages")
