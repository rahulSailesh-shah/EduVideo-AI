from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class Video(Base):
  __tablename__ = "videos"

  id = Column(Integer, primary_key=True, index=True)
  created_at = Column(DateTime(timezone=True), nullable=False)
  updated_at = Column(DateTime(timezone=True), nullable=False)
  video_url = Column(String, nullable=True)
  chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)
  message_id = Column(Integer, ForeignKey("messages.id"), nullable=False)

  chat = relationship("Chat", back_populates="videos")
  message = relationship("Message", back_populates="videos")
