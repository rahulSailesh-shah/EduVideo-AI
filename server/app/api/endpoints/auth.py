from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token
from app.core.config import settings
from app.crud.user import authenticate_user, get_user_by_oauth_id, create_oauth_user, get_user_by_email, update_user_refresh_token
from app.schemas.user import Token, User, GoogleAuthRequest
from app.api.dependencies import get_current_user
from app.service.google_oauth import google_oauth_service

router = APIRouter()

@router.post("/login", response_model=Token)
def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google", response_model=Token)
async def google_auth(
    auth_request: GoogleAuthRequest,
    db: Session = Depends(get_db)
) -> Any:
    """Handle Google OAuth authentication"""
    try:
        # Exchange code for access token and refresh token
        token_data = await google_oauth_service.exchange_code_for_token(
            auth_request.code, auth_request.redirect_uri
        )

        if not token_data or not token_data.get("access_token"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to exchange code for token"
            )

        # Get user info from Google
        user_info = await google_oauth_service.get_user_info(token_data["access_token"])

        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Google"
            )

        google_id = user_info.get("id")
        email = user_info.get("email")
        name = user_info.get("name", email.split("@")[0] if email else "user")

        if not google_id or not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user info from Google"
            )

        # Check if user exists
        user = get_user_by_oauth_id(db, "google", google_id)

        if not user:
            # Check if user exists with same email
            existing_user = get_user_by_email(db, email)
            if existing_user:
                # Update existing user with OAuth info
                existing_user.oauth_provider = "google"
                existing_user.oauth_id = google_id
                if token_data.get("refresh_token"):
                    existing_user.refresh_token = token_data["refresh_token"]
                db.commit()
                db.refresh(existing_user)
                user = existing_user
            else:
                # Create new user
                user = create_oauth_user(
                    db, name, email, "google", google_id,
                    token_data.get("refresh_token")
                )
        else:
            # Update refresh token if provided
            if token_data.get("refresh_token"):
                update_user_refresh_token(db, user.id, token_data["refresh_token"])

        # Create JWT token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        jwt_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        return {"access_token": jwt_token, "token_type": "bearer"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth authentication failed: {str(e)}"
        )

@router.post("/google/refresh")
async def refresh_google_token(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Refresh Google access token using stored refresh token"""
    try:
        if not current_user.refresh_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No refresh token available"
            )

        # Refresh the Google access token
        new_token_data = await google_oauth_service.refresh_access_token(
            current_user.refresh_token
        )

        if not new_token_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to refresh Google token"
            )

        return {
            "message": "Google token refreshed successfully",
            "expires_in": new_token_data.get("expires_in", 3600)
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )

@router.get("/google/url")
def get_google_auth_url(redirect_uri: str = None):
    """Get Google OAuth authorization URL"""
    try:
        if not redirect_uri:
            redirect_uri = settings.google_redirect_uri
        auth_url = google_oauth_service.get_authorization_url(redirect_uri)
        return {"auth_url": auth_url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate auth URL: {str(e)}"
        )

@router.get("/me", response_model=User)
def read_users_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user
