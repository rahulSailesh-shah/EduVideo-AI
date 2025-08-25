from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship


class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, index=True, nullable=False)
  email = Column(String, unique=True, index=True, nullable=True)
  hashed_password = Column(String, nullable=True)  # Made nullable for OAuth users
  oauth_provider = Column(String, nullable=True)  # 'google', 'github', etc.
  oauth_id = Column(String, nullable=True)  # OAuth provider's user ID
  refresh_token = Column(String, nullable=True)  # OAuth refresh token
  created_at = Column(DateTime(timezone=True), nullable=False)
  updated_at = Column(DateTime(timezone=True), nullable=False)

  chats = relationship("Chat", back_populates="user", cascade="all, delete-orphan")
