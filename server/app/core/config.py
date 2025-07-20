from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    app_name: str = "FastAPI Backend"
    debug: bool = False

    database_url: str = "sqlite:///app.db"
    secret_key: str = "your-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    environment: str = "development"

    scripts_dir: Path = Path("/Users/rahulshah/Desktop/video/server/scripts")
    manim_quality: str = "720p30"
    manim_timeout: int = 300
    max_video_size_mb: float = 50.0

    docker_image: str = "manimcommunity/manim"
    docker_timeout: int = 30

    llm_api_key: str = "AIzaSyCQ0I2o7BRU4I9wtWb4gQhZkdcR382bWE0"
    llm_base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai/"

    class Config:
        env_file = ".env"

settings = Settings()
