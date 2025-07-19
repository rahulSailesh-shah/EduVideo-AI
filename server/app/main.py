# type: ignore
import logging
from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes import api_router
from app.middleware.cors import add_cors_middleware
from app.models import User, Chat, Message

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="Production-ready FastAPI backend with SQLAlchemy",
    version="1.0.0",
    debug=settings.debug,
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],
)

add_cors_middleware(app)

app.include_router(api_router, prefix='/api', tags=["api"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {"message": "FastAPI Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )
