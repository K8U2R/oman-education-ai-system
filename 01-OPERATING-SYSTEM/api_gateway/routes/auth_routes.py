"""
Authentication Routes - مسارات المصادقة
API routes for authentication (Login, Register, OAuth)
"""

import os
import secrets
from fastapi import APIRouter, HTTPException, Request, Depends, Query
from fastapi.responses import RedirectResponse
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timedelta
import logging
import httpx
from urllib.parse import urlencode

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

# OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/oauth/google/callback")

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:3000/auth/oauth/github/callback")

# Store OAuth states (in production, use Redis)
oauth_states: Dict[str, str] = {}


# Pydantic Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2)


class OAuthCallbackRequest(BaseModel):
    code: str
    state: Optional[str] = None


@router.post("/login")
async def login(request: LoginRequest) -> Dict[str, Any]:
    """
    تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
    """
    try:
        # TODO: Implement actual authentication logic
        # For now, return a mock response
        logger.info(f"Login attempt for: {request.email}")
        
        # Mock authentication (replace with actual logic)
        if request.email == "demo@flowforge.com" and request.password == "demo123":
            return {
                "user": {
                    "id": "user-1",
                    "email": request.email,
                    "name": "مستخدم تجريبي",
                    "role": "user",
                    "createdAt": datetime.now().isoformat(),
                },
                "token": "mock-jwt-token-" + secrets.token_urlsafe(32),
                "refreshToken": "mock-refresh-token-" + secrets.token_urlsafe(32),
                "expiresIn": 3600,
            }
        else:
            raise HTTPException(status_code=401, detail="البريد الإلكتروني أو كلمة المرور غير صحيحة")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="خطأ في تسجيل الدخول")


@router.post("/register")
async def register(request: RegisterRequest) -> Dict[str, Any]:
    """
    إنشاء حساب جديد
    """
    try:
        logger.info(f"Registration attempt for: {request.email}")
        
        # TODO: Implement actual registration logic
        # For now, return a mock response
        return {
            "user": {
                "id": "user-" + secrets.token_urlsafe(8),
                "email": request.email,
                "name": request.name,
                "role": "user",
                "createdAt": datetime.now().isoformat(),
            },
            "token": "mock-jwt-token-" + secrets.token_urlsafe(32),
            "refreshToken": "mock-refresh-token-" + secrets.token_urlsafe(32),
            "expiresIn": 3600,
        }
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="خطأ في إنشاء الحساب")


@router.get("/oauth/google/initiate")
async def initiate_google_oauth() -> Dict[str, str]:
    """
    بدء عملية تسجيل الدخول مع Google
    """
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth غير مُعد بشكل صحيح")
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    oauth_states[state] = datetime.now().isoformat()
    
    # Google OAuth URL
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent",
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    
    return {"url": auth_url}


@router.post("/oauth/google/callback")
async def google_oauth_callback(request: OAuthCallbackRequest) -> Dict[str, Any]:
    """
    معالجة callback من Google OAuth
    """
    try:
        # Verify state
        if request.state and request.state not in oauth_states:
            raise HTTPException(status_code=400, detail="Invalid state parameter")
        
        if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
            raise HTTPException(status_code=500, detail="Google OAuth غير مُعد بشكل صحيح")
        
        # Exchange code for token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": request.code,
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "redirect_uri": GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
            )
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="فشل في الحصول على token من Google")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            # Get user info from Google
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="فشل في الحصول على معلومات المستخدم من Google")
            
            user_data = user_response.json()
            
            # TODO: Create or update user in database
            # For now, return mock response
            user = {
                "id": "google-user-" + user_data.get("id", secrets.token_urlsafe(8)),
                "email": user_data.get("email"),
                "name": user_data.get("name", user_data.get("email", "مستخدم Google")),
                "avatar": user_data.get("picture"),
                "role": "user",
                "createdAt": datetime.now().isoformat(),
            }
            
            # Generate JWT token (mock for now)
            token = "google-jwt-token-" + secrets.token_urlsafe(32)
            
            # Clean up state
            if request.state:
                oauth_states.pop(request.state, None)
            
            return {
                "user": user,
                "token": token,
                "refreshToken": "google-refresh-token-" + secrets.token_urlsafe(32),
                "expiresIn": 3600,
            }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Google OAuth callback error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="خطأ في معالجة callback من Google")


@router.get("/oauth/github/initiate")
async def initiate_github_oauth() -> Dict[str, str]:
    """
    بدء عملية تسجيل الدخول مع GitHub
    """
    if not GITHUB_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GitHub OAuth غير مُعد بشكل صحيح")
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    oauth_states[state] = datetime.now().isoformat()
    
    # GitHub OAuth URL
    params = {
        "client_id": GITHUB_CLIENT_ID,
        "redirect_uri": GITHUB_REDIRECT_URI,
        "scope": "user:email",
        "state": state,
    }
    
    auth_url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
    
    return {"url": auth_url}


@router.post("/oauth/github/callback")
async def github_oauth_callback(request: OAuthCallbackRequest) -> Dict[str, Any]:
    """
    معالجة callback من GitHub OAuth
    """
    try:
        # Verify state
        if request.state and request.state not in oauth_states:
            raise HTTPException(status_code=400, detail="Invalid state parameter")
        
        if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
            raise HTTPException(status_code=500, detail="GitHub OAuth غير مُعد بشكل صحيح")
        
        # Exchange code for token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "code": request.code,
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "redirect_uri": GITHUB_REDIRECT_URI,
                },
                headers={"Accept": "application/json"},
            )
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="فشل في الحصول على token من GitHub")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                raise HTTPException(status_code=400, detail="فشل في الحصول على access token من GitHub")
            
            # Get user info from GitHub
            user_response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"token {access_token}"},
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="فشل في الحصول على معلومات المستخدم من GitHub")
            
            user_data = user_response.json()
            
            # Get user email (may need separate API call)
            email = user_data.get("email")
            if not email:
                email_response = await client.get(
                    "https://api.github.com/user/emails",
                    headers={"Authorization": f"token {access_token}"},
                )
                if email_response.status_code == 200:
                    emails = email_response.json()
                    email = next((e.get("email") for e in emails if e.get("primary")), emails[0].get("email") if emails else None)
            
            # TODO: Create or update user in database
            # For now, return mock response
            user = {
                "id": "github-user-" + str(user_data.get("id", secrets.token_urlsafe(8))),
                "email": email or f"{user_data.get('login')}@github.local",
                "name": user_data.get("name", user_data.get("login", "مستخدم GitHub")),
                "avatar": user_data.get("avatar_url"),
                "role": "user",
                "createdAt": datetime.now().isoformat(),
            }
            
            # Generate JWT token (mock for now)
            token = "github-jwt-token-" + secrets.token_urlsafe(32)
            
            # Clean up state
            if request.state:
                oauth_states.pop(request.state, None)
            
            return {
                "user": user,
                "token": token,
                "refreshToken": "github-refresh-token-" + secrets.token_urlsafe(32),
                "expiresIn": 3600,
            }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"GitHub OAuth callback error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="خطأ في معالجة callback من GitHub")


@router.post("/logout")
async def logout() -> Dict[str, str]:
    """
    تسجيل الخروج
    """
    return {"message": "تم تسجيل الخروج بنجاح"}

