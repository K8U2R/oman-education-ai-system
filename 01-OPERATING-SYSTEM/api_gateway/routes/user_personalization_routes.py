"""
User Personalization Routes
user_personalization_routes.py

مسارات API للتخصيص الشخصي للمستخدمين
API routes for user personalization (Preferences, Settings, Profile)
"""

import logging
from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
import sys
from pathlib import Path

# Add project root to path
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent.parent.parent
sys.path.insert(0, str(project_root))

# Import models
try:
    import importlib.util
    # Load user personalization models
    models_path = project_root / "06-DATABASE-SYSTEM" / "data-models" / "user-personalization-models.py"
    if models_path.exists():
        spec = importlib.util.spec_from_file_location("user_personalization_models", models_path)
        models_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(models_module)
        UserPreferences = models_module.UserPreferences
        UserSettings = models_module.UserSettings
        UserProfile = models_module.UserProfile
    else:
        UserPreferences = None
        UserSettings = None
        UserProfile = None
    
    # Load user personalization manager
    manager_path = project_root / "06-DATABASE-SYSTEM" / "database-operations" / "user-personalization-manager.py"
    if manager_path.exists():
        spec = importlib.util.spec_from_file_location("user_personalization_manager", manager_path)
        manager_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(manager_module)
        UserPersonalizationManager = manager_module.UserPersonalizationManager
    else:
        UserPersonalizationManager = None
except Exception as e:
    # Fallback for development - will use mock data
    UserPersonalizationManager = None
    UserPreferences = None
    UserSettings = None
    UserProfile = None

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/user", tags=["User Personalization"])

# Global manager instance
personalization_manager = UserPersonalizationManager() if UserPersonalizationManager else None


# Pydantic Models for API
class PreferencesUpdate(BaseModel):
    theme: Optional[str] = None
    layout: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    date_format: Optional[str] = None
    time_format: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    sound_enabled: Optional[bool] = None
    animations_enabled: Optional[bool] = None
    sidebar_collapsed: Optional[bool] = None
    custom_colors: Optional[Dict[str, str]] = None


class SettingsUpdate(BaseModel):
    ai_model_preference: Optional[str] = None
    ai_temperature: Optional[float] = None
    ai_max_tokens: Optional[int] = None
    auto_save_enabled: Optional[bool] = None
    auto_save_interval: Optional[int] = None
    code_theme: Optional[str] = None
    font_size: Optional[int] = None
    font_family: Optional[str] = None
    tab_size: Optional[int] = None
    word_wrap: Optional[bool] = None
    line_numbers: Optional[bool] = None
    minimap_enabled: Optional[bool] = None


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    skills: Optional[list] = None
    interests: Optional[list] = None
    education: Optional[list] = None
    experience: Optional[list] = None
    achievements: Optional[list] = None
    stats: Optional[Dict[str, int]] = None


# Helper function to get user_id from request (mock for now)
def get_current_user_id(request: Request) -> str:
    """
    الحصول على معرف المستخدم الحالي
    TODO: Implement actual authentication
    """
    # Mock: Get from header or token
    user_id = request.headers.get("X-User-ID")
    if not user_id:
        # For development, use a default user
        user_id = "default-user-id"
    return user_id


# ==================== Preferences Routes ====================

@router.get("/preferences")
async def get_preferences(request: Request) -> Dict[str, Any]:
    """
    الحصول على تفضيلات المستخدم الحالي
    """
    try:
        user_id = get_current_user_id(request)
        
        if not personalization_manager:
            # Mock response for development
            return {
                "user_id": user_id,
                "theme": "auto",
                "layout": "comfortable",
                "language": "ar",
                "timezone": "Asia/Muscat",
                "date_format": "DD/MM/YYYY",
                "time_format": "24h",
                "notifications_enabled": True,
                "email_notifications": True,
                "push_notifications": False,
                "sound_enabled": True,
                "animations_enabled": True,
                "sidebar_collapsed": False,
                "custom_colors": {}
            }
        
        preferences = await personalization_manager.get_user_preferences(user_id)
        
        if not preferences:
            raise HTTPException(status_code=404, detail="Preferences not found")
        
        return preferences.to_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting preferences: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/preferences")
async def update_preferences(
    request: Request,
    preferences_update: PreferencesUpdate
) -> Dict[str, Any]:
    """
    تحديث تفضيلات المستخدم الحالي
    """
    try:
        user_id = get_current_user_id(request)
        
        update_data = preferences_update.dict(exclude_unset=True)
        
        if not personalization_manager:
            # Mock response for development
            return {
                "user_id": user_id,
                **update_data,
                "message": "Preferences updated (mock)"
            }
        
        preferences = await personalization_manager.update_user_preferences(
            user_id, 
            update_data
        )
        
        if not preferences:
            raise HTTPException(status_code=500, detail="Failed to update preferences")
        
        return preferences.to_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating preferences: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# ==================== Settings Routes ====================

@router.get("/settings")
async def get_settings(request: Request) -> Dict[str, Any]:
    """
    الحصول على إعدادات المستخدم الحالي
    """
    try:
        user_id = get_current_user_id(request)
        
        if not personalization_manager:
            # Mock response for development
            return {
                "user_id": user_id,
                "ai_model_preference": "gemini-pro",
                "ai_temperature": 0.7,
                "ai_max_tokens": 1000,
                "auto_save_enabled": True,
                "auto_save_interval": 30,
                "code_theme": "vs-dark",
                "font_size": 14,
                "font_family": "Consolas, monospace",
                "tab_size": 2,
                "word_wrap": True,
                "line_numbers": True,
                "minimap_enabled": True
            }
        
        settings = await personalization_manager.get_user_settings(user_id)
        
        if not settings:
            raise HTTPException(status_code=404, detail="Settings not found")
        
        return settings.to_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting settings: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/settings")
async def update_settings(
    request: Request,
    settings_update: SettingsUpdate
) -> Dict[str, Any]:
    """
    تحديث إعدادات المستخدم الحالي
    """
    try:
        user_id = get_current_user_id(request)
        
        update_data = settings_update.dict(exclude_unset=True)
        
        if not personalization_manager:
            # Mock response for development
            return {
                "user_id": user_id,
                **update_data,
                "message": "Settings updated (mock)"
            }
        
        settings = await personalization_manager.update_user_settings(
            user_id, 
            update_data
        )
        
        if not settings:
            raise HTTPException(status_code=500, detail="Failed to update settings")
        
        return settings.to_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating settings: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# ==================== Profile Routes ====================

@router.get("/profile")
async def get_profile(request: Request) -> Dict[str, Any]:
    """
    الحصول على الملف الشخصي للمستخدم الحالي
    """
    try:
        user_id = get_current_user_id(request)
        
        if not personalization_manager:
            # Mock response for development
            return {
                "user_id": user_id,
                "display_name": "",
                "bio": "",
                "avatar_url": None,
                "cover_image_url": None,
                "location": None,
                "website": None,
                "social_links": {},
                "skills": [],
                "interests": [],
                "education": [],
                "experience": [],
                "achievements": [],
                "stats": {}
            }
        
        profile = await personalization_manager.get_user_profile(user_id)
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return profile.to_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting profile: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/profile")
async def update_profile(
    request: Request,
    profile_update: ProfileUpdate
) -> Dict[str, Any]:
    """
    تحديث الملف الشخصي للمستخدم الحالي
    """
    try:
        user_id = get_current_user_id(request)
        
        update_data = profile_update.dict(exclude_unset=True)
        
        if not personalization_manager:
            # Mock response for development
            return {
                "user_id": user_id,
                **update_data,
                "message": "Profile updated (mock)"
            }
        
        profile = await personalization_manager.update_user_profile(
            user_id, 
            update_data
        )
        
        if not profile:
            raise HTTPException(status_code=500, detail="Failed to update profile")
        
        return profile.to_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

