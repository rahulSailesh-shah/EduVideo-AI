from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    app_name: str = "FastAPI Backend"
    debug: bool = False
    database_url: str = "sqlite:///app.db"
    secret_key: str = "your-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 120
    environment: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
