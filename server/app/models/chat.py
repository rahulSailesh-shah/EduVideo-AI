from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship


class Chat(Base):
  __tablename__ = "chats"

  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, nullable=False)
  created_at = Column(DateTime(timezone=True), nullable=False)
  updated_at = Column(DateTime(timezone=True), nullable=False)

  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

  user = relationship("User", back_populates="chats")
  messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")
