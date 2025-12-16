"""
User Personalization Manager
user-personalization-manager.py

مدير التخصيص الشخصي للمستخدمين
User Personalization Manager - Manages user personalization data

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import logging
from typing import Optional, Dict, Any
from datetime import datetime
from ..data-models.user-personalization-models import (
    UserPreferences,
    UserSettings,
    UserProfile,
    ThemeMode,
    LayoutType
)

logger = logging.getLogger(__name__)


class UserPersonalizationManager:
    """مدير التخصيص الشخصي للمستخدمين"""
    
    def __init__(self, db_connection=None):
        """
        تهيئة المدير
        
        Args:
            db_connection: اتصال قاعدة البيانات (PostgreSQL)
        """
        self.db = db_connection
        self.logger = logging.getLogger(__name__)
    
    # ==================== User Preferences ====================
    
    async def get_user_preferences(self, user_id: str) -> Optional[UserPreferences]:
        """
        الحصول على تفضيلات المستخدم
        
        Args:
            user_id: معرف المستخدم
            
        Returns:
            UserPreferences أو None
        """
        try:
            if not self.db:
                # Mock data for development
                return UserPreferences(
                    user_id=user_id,
                    theme=ThemeMode.AUTO,
                    layout=LayoutType.COMFORTABLE,
                    language="ar",
                    timezone="Asia/Muscat"
                )
            
            query = """
                SELECT * FROM user_preferences 
                WHERE user_id = $1
            """
            result = await self.db.fetchrow(query, user_id)
            
            if not result:
                # Create default preferences
                return await self.create_default_preferences(user_id)
            
            return UserPreferences.from_dict(dict(result))
        
        except Exception as e:
            self.logger.error(f"Error getting user preferences: {e}", exc_info=True)
            return None
    
    async def update_user_preferences(
        self, 
        user_id: str, 
        preferences: Dict[str, Any]
    ) -> Optional[UserPreferences]:
        """
        تحديث تفضيلات المستخدم
        
        Args:
            user_id: معرف المستخدم
            preferences: التفضيلات المحدثة
            
        Returns:
            UserPreferences المحدثة
        """
        try:
            if not self.db:
                # Mock update for development
                prefs = UserPreferences(user_id=user_id)
                for key, value in preferences.items():
                    if hasattr(prefs, key):
                        setattr(prefs, key, value)
                prefs.updated_at = datetime.now()
                return prefs
            
            # Check if preferences exist
            existing = await self.get_user_preferences(user_id)
            
            if existing:
                # Update existing
                query = """
                    UPDATE user_preferences 
                    SET theme = $1, layout = $2, language = $3, timezone = $4,
                        date_format = $5, time_format = $6, notifications_enabled = $7,
                        email_notifications = $8, push_notifications = $9, sound_enabled = $10,
                        animations_enabled = $11, sidebar_collapsed = $12, custom_colors = $13,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = $14
                    RETURNING *
                """
                result = await self.db.fetchrow(
                    query,
                    preferences.get('theme', existing.theme.value),
                    preferences.get('layout', existing.layout.value),
                    preferences.get('language', existing.language),
                    preferences.get('timezone', existing.timezone),
                    preferences.get('date_format', existing.date_format),
                    preferences.get('time_format', existing.time_format),
                    preferences.get('notifications_enabled', existing.notifications_enabled),
                    preferences.get('email_notifications', existing.email_notifications),
                    preferences.get('push_notifications', existing.push_notifications),
                    preferences.get('sound_enabled', existing.sound_enabled),
                    preferences.get('animations_enabled', existing.animations_enabled),
                    preferences.get('sidebar_collapsed', existing.sidebar_collapsed),
                    preferences.get('custom_colors', existing.custom_colors),
                    user_id
                )
            else:
                # Create new
                return await self.create_user_preferences(user_id, preferences)
            
            return UserPreferences.from_dict(dict(result)) if result else None
        
        except Exception as e:
            self.logger.error(f"Error updating user preferences: {e}", exc_info=True)
            return None
    
    async def create_user_preferences(
        self, 
        user_id: str, 
        preferences: Optional[Dict[str, Any]] = None
    ) -> UserPreferences:
        """
        إنشاء تفضيلات جديدة للمستخدم
        
        Args:
            user_id: معرف المستخدم
            preferences: التفضيلات (اختياري)
            
        Returns:
            UserPreferences الجديدة
        """
        try:
            if not self.db:
                # Mock creation for development
                prefs = UserPreferences(user_id=user_id)
                if preferences:
                    for key, value in preferences.items():
                        if hasattr(prefs, key):
                            setattr(prefs, key, value)
                return prefs
            
            prefs_data = preferences or {}
            query = """
                INSERT INTO user_preferences (
                    user_id, theme, layout, language, timezone, date_format, time_format,
                    notifications_enabled, email_notifications, push_notifications,
                    sound_enabled, animations_enabled, sidebar_collapsed, custom_colors
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
                )
                RETURNING *
            """
            result = await self.db.fetchrow(
                query,
                user_id,
                prefs_data.get('theme', 'auto'),
                prefs_data.get('layout', 'comfortable'),
                prefs_data.get('language', 'ar'),
                prefs_data.get('timezone', 'Asia/Muscat'),
                prefs_data.get('date_format', 'DD/MM/YYYY'),
                prefs_data.get('time_format', '24h'),
                prefs_data.get('notifications_enabled', True),
                prefs_data.get('email_notifications', True),
                prefs_data.get('push_notifications', False),
                prefs_data.get('sound_enabled', True),
                prefs_data.get('animations_enabled', True),
                prefs_data.get('sidebar_collapsed', False),
                prefs_data.get('custom_colors', {})
            )
            
            return UserPreferences.from_dict(dict(result)) if result else None
        
        except Exception as e:
            self.logger.error(f"Error creating user preferences: {e}", exc_info=True)
            return await self.create_default_preferences(user_id)
    
    async def create_default_preferences(self, user_id: str) -> UserPreferences:
        """إنشاء تفضيلات افتراضية"""
        return await self.create_user_preferences(user_id, {})
    
    # ==================== User Settings ====================
    
    async def get_user_settings(self, user_id: str) -> Optional[UserSettings]:
        """
        الحصول على إعدادات المستخدم
        
        Args:
            user_id: معرف المستخدم
            
        Returns:
            UserSettings أو None
        """
        try:
            if not self.db:
                # Mock data for development
                return UserSettings(
                    user_id=user_id,
                    ai_model_preference="gemini-pro",
                    ai_temperature=0.7,
                    ai_max_tokens=1000
                )
            
            query = """
                SELECT * FROM user_settings 
                WHERE user_id = $1
            """
            result = await self.db.fetchrow(query, user_id)
            
            if not result:
                return await self.create_default_settings(user_id)
            
            return UserSettings.from_dict(dict(result))
        
        except Exception as e:
            self.logger.error(f"Error getting user settings: {e}", exc_info=True)
            return None
    
    async def update_user_settings(
        self, 
        user_id: str, 
        settings: Dict[str, Any]
    ) -> Optional[UserSettings]:
        """
        تحديث إعدادات المستخدم
        
        Args:
            user_id: معرف المستخدم
            settings: الإعدادات المحدثة
            
        Returns:
            UserSettings المحدثة
        """
        try:
            if not self.db:
                # Mock update for development
                user_settings = UserSettings(user_id=user_id)
                for key, value in settings.items():
                    if hasattr(user_settings, key):
                        setattr(user_settings, key, value)
                user_settings.updated_at = datetime.now()
                return user_settings
            
            existing = await self.get_user_settings(user_id)
            
            if existing:
                query = """
                    UPDATE user_settings 
                    SET ai_model_preference = $1, ai_temperature = $2, ai_max_tokens = $3,
                        auto_save_enabled = $4, auto_save_interval = $5, code_theme = $6,
                        font_size = $7, font_family = $8, tab_size = $9, word_wrap = $10,
                        line_numbers = $11, minimap_enabled = $12, updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = $13
                    RETURNING *
                """
                result = await self.db.fetchrow(
                    query,
                    settings.get('ai_model_preference', existing.ai_model_preference),
                    settings.get('ai_temperature', existing.ai_temperature),
                    settings.get('ai_max_tokens', existing.ai_max_tokens),
                    settings.get('auto_save_enabled', existing.auto_save_enabled),
                    settings.get('auto_save_interval', existing.auto_save_interval),
                    settings.get('code_theme', existing.code_theme),
                    settings.get('font_size', existing.font_size),
                    settings.get('font_family', existing.font_family),
                    settings.get('tab_size', existing.tab_size),
                    settings.get('word_wrap', existing.word_wrap),
                    settings.get('line_numbers', existing.line_numbers),
                    settings.get('minimap_enabled', existing.minimap_enabled),
                    user_id
                )
            else:
                return await self.create_user_settings(user_id, settings)
            
            return UserSettings.from_dict(dict(result)) if result else None
        
        except Exception as e:
            self.logger.error(f"Error updating user settings: {e}", exc_info=True)
            return None
    
    async def create_user_settings(
        self, 
        user_id: str, 
        settings: Optional[Dict[str, Any]] = None
    ) -> UserSettings:
        """
        إنشاء إعدادات جديدة للمستخدم
        
        Args:
            user_id: معرف المستخدم
            settings: الإعدادات (اختياري)
            
        Returns:
            UserSettings الجديدة
        """
        try:
            if not self.db:
                # Mock creation for development
                user_settings = UserSettings(user_id=user_id)
                if settings:
                    for key, value in settings.items():
                        if hasattr(user_settings, key):
                            setattr(user_settings, key, value)
                return user_settings
            
            settings_data = settings or {}
            query = """
                INSERT INTO user_settings (
                    user_id, ai_model_preference, ai_temperature, ai_max_tokens,
                    auto_save_enabled, auto_save_interval, code_theme, font_size,
                    font_family, tab_size, word_wrap, line_numbers, minimap_enabled
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
                )
                RETURNING *
            """
            result = await self.db.fetchrow(
                query,
                user_id,
                settings_data.get('ai_model_preference', 'gemini-pro'),
                settings_data.get('ai_temperature', 0.7),
                settings_data.get('ai_max_tokens', 1000),
                settings_data.get('auto_save_enabled', True),
                settings_data.get('auto_save_interval', 30),
                settings_data.get('code_theme', 'vs-dark'),
                settings_data.get('font_size', 14),
                settings_data.get('font_family', 'Consolas, monospace'),
                settings_data.get('tab_size', 2),
                settings_data.get('word_wrap', True),
                settings_data.get('line_numbers', True),
                settings_data.get('minimap_enabled', True)
            )
            
            return UserSettings.from_dict(dict(result)) if result else None
        
        except Exception as e:
            self.logger.error(f"Error creating user settings: {e}", exc_info=True)
            return await self.create_default_settings(user_id)
    
    async def create_default_settings(self, user_id: str) -> UserSettings:
        """إنشاء إعدادات افتراضية"""
        return await self.create_user_settings(user_id, {})
    
    # ==================== User Profile ====================
    
    async def get_user_profile(self, user_id: str) -> Optional[UserProfile]:
        """
        الحصول على الملف الشخصي للمستخدم
        
        Args:
            user_id: معرف المستخدم
            
        Returns:
            UserProfile أو None
        """
        try:
            if not self.db:
                # Mock data for development
                return UserProfile(
                    user_id=user_id,
                    display_name="",
                    bio=""
                )
            
            query = """
                SELECT * FROM user_profiles 
                WHERE user_id = $1
            """
            result = await self.db.fetchrow(query, user_id)
            
            if not result:
                return await self.create_default_profile(user_id)
            
            return UserProfile.from_dict(dict(result))
        
        except Exception as e:
            self.logger.error(f"Error getting user profile: {e}", exc_info=True)
            return None
    
    async def update_user_profile(
        self, 
        user_id: str, 
        profile_data: Dict[str, Any]
    ) -> Optional[UserProfile]:
        """
        تحديث الملف الشخصي للمستخدم
        
        Args:
            user_id: معرف المستخدم
            profile_data: بيانات الملف الشخصي
            
        Returns:
            UserProfile المحدث
        """
        try:
            if not self.db:
                # Mock update for development
                profile = UserProfile(user_id=user_id)
                for key, value in profile_data.items():
                    if hasattr(profile, key):
                        setattr(profile, key, value)
                profile.updated_at = datetime.now()
                return profile
            
            existing = await self.get_user_profile(user_id)
            
            if existing:
                query = """
                    UPDATE user_profiles 
                    SET display_name = $1, bio = $2, avatar_url = $3, cover_image_url = $4,
                        location = $5, website = $6, social_links = $7, skills = $8,
                        interests = $9, education = $10, experience = $11, achievements = $12,
                        stats = $13, updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = $14
                    RETURNING *
                """
                result = await self.db.fetchrow(
                    query,
                    profile_data.get('display_name', existing.display_name),
                    profile_data.get('bio', existing.bio),
                    profile_data.get('avatar_url', existing.avatar_url),
                    profile_data.get('cover_image_url', existing.cover_image_url),
                    profile_data.get('location', existing.location),
                    profile_data.get('website', existing.website),
                    profile_data.get('social_links', existing.social_links),
                    profile_data.get('skills', existing.skills),
                    profile_data.get('interests', existing.interests),
                    profile_data.get('education', existing.education),
                    profile_data.get('experience', existing.experience),
                    profile_data.get('achievements', existing.achievements),
                    profile_data.get('stats', existing.stats),
                    user_id
                )
            else:
                return await self.create_user_profile(user_id, profile_data)
            
            return UserProfile.from_dict(dict(result)) if result else None
        
        except Exception as e:
            self.logger.error(f"Error updating user profile: {e}", exc_info=True)
            return None
    
    async def create_user_profile(
        self, 
        user_id: str, 
        profile_data: Optional[Dict[str, Any]] = None
    ) -> UserProfile:
        """
        إنشاء ملف شخصي جديد للمستخدم
        
        Args:
            user_id: معرف المستخدم
            profile_data: بيانات الملف الشخصي (اختياري)
            
        Returns:
            UserProfile الجديد
        """
        try:
            if not self.db:
                # Mock creation for development
                profile = UserProfile(user_id=user_id)
                if profile_data:
                    for key, value in profile_data.items():
                        if hasattr(profile, key):
                            setattr(profile, key, value)
                return profile
            
            data = profile_data or {}
            query = """
                INSERT INTO user_profiles (
                    user_id, display_name, bio, avatar_url, cover_image_url,
                    location, website, social_links, skills, interests,
                    education, experience, achievements, stats
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
                )
                RETURNING *
            """
            result = await self.db.fetchrow(
                query,
                user_id,
                data.get('display_name', ''),
                data.get('bio', ''),
                data.get('avatar_url'),
                data.get('cover_image_url'),
                data.get('location'),
                data.get('website'),
                data.get('social_links', {}),
                data.get('skills', []),
                data.get('interests', []),
                data.get('education', []),
                data.get('experience', []),
                data.get('achievements', []),
                data.get('stats', {})
            )
            
            return UserProfile.from_dict(dict(result)) if result else None
        
        except Exception as e:
            self.logger.error(f"Error creating user profile: {e}", exc_info=True)
            return await self.create_default_profile(user_id)
    
    async def create_default_profile(self, user_id: str) -> UserProfile:
        """إنشاء ملف شخصي افتراضي"""
        return await self.create_user_profile(user_id, {})

