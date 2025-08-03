from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    # App settings with reasonable defaults
    app_name: str = "FastAPI Backend"
    debug: bool = False
    environment: str = "development"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # Required settings - no defaults (will raise error if not in .env)
    database_url: str
    secret_key: str
    llm_api_key: str

    # Optional settings with defaults
    llm_base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai/"

    # Path and config settings with defaults
    scripts_dir: Path = Path("./scripts")  # More portable default
    manim_quality: str = "720p30"
    manim_timeout: int = 300
    max_video_size_mb: float = 50.0

    docker_image: str = "manimcommunity/manim"
    docker_timeout: int = 30

    # S3 settings with defaults
    s3_bucket_name: str = "my-default-bucket"
    s3_region: str = "us-east-1"
    s3_access_key_id: str
    s3_secret_access_key: str

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
