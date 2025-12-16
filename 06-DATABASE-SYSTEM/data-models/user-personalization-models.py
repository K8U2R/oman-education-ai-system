"""
User Personalization Models
user-personalization-models.py

نماذج التخصيص الشخصي للمستخدمين
User Personalization Models - User personalization data models

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum


class ThemeMode(Enum):
    """وضع الثيم"""
    LIGHT = "light"
    DARK = "dark"
    AUTO = "auto"


class LayoutType(Enum):
    """نوع التخطيط"""
    COMPACT = "compact"
    COMFORTABLE = "comfortable"
    SPACIOUS = "spacious"


@dataclass
class UserPreferences:
    """تفضيلات المستخدم"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    theme: ThemeMode = ThemeMode.AUTO
    layout: LayoutType = LayoutType.COMFORTABLE
    language: str = "ar"
    timezone: str = "Asia/Muscat"
    date_format: str = "DD/MM/YYYY"
    time_format: str = "24h"
    notifications_enabled: bool = True
    email_notifications: bool = True
    push_notifications: bool = False
    sound_enabled: bool = True
    animations_enabled: bool = True
    sidebar_collapsed: bool = False
    custom_colors: Dict[str, str] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "theme": self.theme.value,
            "layout": self.layout.value,
            "language": self.language,
            "timezone": self.timezone,
            "date_format": self.date_format,
            "time_format": self.time_format,
            "notifications_enabled": self.notifications_enabled,
            "email_notifications": self.email_notifications,
            "push_notifications": self.push_notifications,
            "sound_enabled": self.sound_enabled,
            "animations_enabled": self.animations_enabled,
            "sidebar_collapsed": self.sidebar_collapsed,
            "custom_colors": self.custom_colors,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'UserPreferences':
        """إنشاء من dict"""
        prefs = cls()
        prefs.id = data.get("id", str(uuid.uuid4()))
        prefs.user_id = data.get("user_id", "")
        prefs.theme = ThemeMode(data.get("theme", "auto"))
        prefs.layout = LayoutType(data.get("layout", "comfortable"))
        prefs.language = data.get("language", "ar")
        prefs.timezone = data.get("timezone", "Asia/Muscat")
        prefs.date_format = data.get("date_format", "DD/MM/YYYY")
        prefs.time_format = data.get("time_format", "24h")
        prefs.notifications_enabled = data.get("notifications_enabled", True)
        prefs.email_notifications = data.get("email_notifications", True)
        prefs.push_notifications = data.get("push_notifications", False)
        prefs.sound_enabled = data.get("sound_enabled", True)
        prefs.animations_enabled = data.get("animations_enabled", True)
        prefs.sidebar_collapsed = data.get("sidebar_collapsed", False)
        prefs.custom_colors = data.get("custom_colors", {})
        
        if "created_at" in data:
            prefs.created_at = datetime.fromisoformat(data["created_at"])
        if "updated_at" in data:
            prefs.updated_at = datetime.fromisoformat(data["updated_at"])
        
        return prefs


@dataclass
class UserSettings:
    """إعدادات المستخدم"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    ai_model_preference: str = "gemini-pro"
    ai_temperature: float = 0.7
    ai_max_tokens: int = 1000
    auto_save_enabled: bool = True
    auto_save_interval: int = 30  # seconds
    code_theme: str = "vs-dark"
    font_size: int = 14
    font_family: str = "Consolas, monospace"
    tab_size: int = 2
    word_wrap: bool = True
    line_numbers: bool = True
    minimap_enabled: bool = True
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "ai_model_preference": self.ai_model_preference,
            "ai_temperature": self.ai_temperature,
            "ai_max_tokens": self.ai_max_tokens,
            "auto_save_enabled": self.auto_save_enabled,
            "auto_save_interval": self.auto_save_interval,
            "code_theme": self.code_theme,
            "font_size": self.font_size,
            "font_family": self.font_family,
            "tab_size": self.tab_size,
            "word_wrap": self.word_wrap,
            "line_numbers": self.line_numbers,
            "minimap_enabled": self.minimap_enabled,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'UserSettings':
        """إنشاء من dict"""
        settings = cls()
        settings.id = data.get("id", str(uuid.uuid4()))
        settings.user_id = data.get("user_id", "")
        settings.ai_model_preference = data.get("ai_model_preference", "gemini-pro")
        settings.ai_temperature = float(data.get("ai_temperature", 0.7))
        settings.ai_max_tokens = int(data.get("ai_max_tokens", 1000))
        settings.auto_save_enabled = data.get("auto_save_enabled", True)
        settings.auto_save_interval = int(data.get("auto_save_interval", 30))
        settings.code_theme = data.get("code_theme", "vs-dark")
        settings.font_size = int(data.get("font_size", 14))
        settings.font_family = data.get("font_family", "Consolas, monospace")
        settings.tab_size = int(data.get("tab_size", 2))
        settings.word_wrap = data.get("word_wrap", True)
        settings.line_numbers = data.get("line_numbers", True)
        settings.minimap_enabled = data.get("minimap_enabled", True)
        
        if "created_at" in data:
            settings.created_at = datetime.fromisoformat(data["created_at"])
        if "updated_at" in data:
            settings.updated_at = datetime.fromisoformat(data["updated_at"])
        
        return settings


@dataclass
class UserProfile:
    """ملف المستخدم الشخصي"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    display_name: str = ""
    bio: str = ""
    avatar_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    social_links: Dict[str, str] = field(default_factory=dict)
    skills: List[str] = field(default_factory=list)
    interests: List[str] = field(default_factory=list)
    education: List[Dict[str, Any]] = field(default_factory=list)
    experience: List[Dict[str, Any]] = field(default_factory=list)
    achievements: List[Dict[str, Any]] = field(default_factory=list)
    stats: Dict[str, int] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "display_name": self.display_name,
            "bio": self.bio,
            "avatar_url": self.avatar_url,
            "cover_image_url": self.cover_image_url,
            "location": self.location,
            "website": self.website,
            "social_links": self.social_links,
            "skills": self.skills,
            "interests": self.interests,
            "education": self.education,
            "experience": self.experience,
            "achievements": self.achievements,
            "stats": self.stats,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'UserProfile':
        """إنشاء من dict"""
        profile = cls()
        profile.id = data.get("id", str(uuid.uuid4()))
        profile.user_id = data.get("user_id", "")
        profile.display_name = data.get("display_name", "")
        profile.bio = data.get("bio", "")
        profile.avatar_url = data.get("avatar_url")
        profile.cover_image_url = data.get("cover_image_url")
        profile.location = data.get("location")
        profile.website = data.get("website")
        profile.social_links = data.get("social_links", {})
        profile.skills = data.get("skills", [])
        profile.interests = data.get("interests", [])
        profile.education = data.get("education", [])
        profile.experience = data.get("experience", [])
        profile.achievements = data.get("achievements", [])
        profile.stats = data.get("stats", {})
        
        if "created_at" in data:
            profile.created_at = datetime.fromisoformat(data["created_at"])
        if "updated_at" in data:
            profile.updated_at = datetime.fromisoformat(data["updated_at"])
        
        return profile


# PostgreSQL Schemas
POSTGRES_USER_PREFERENCES_SCHEMA = """
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) NOT NULL DEFAULT 'auto',
    layout VARCHAR(20) NOT NULL DEFAULT 'comfortable',
    language VARCHAR(10) NOT NULL DEFAULT 'ar',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Muscat',
    date_format VARCHAR(20) NOT NULL DEFAULT 'DD/MM/YYYY',
    time_format VARCHAR(10) NOT NULL DEFAULT '24h',
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications BOOLEAN NOT NULL DEFAULT FALSE,
    sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    animations_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sidebar_collapsed BOOLEAN NOT NULL DEFAULT FALSE,
    custom_colors JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
"""

POSTGRES_USER_SETTINGS_SCHEMA = """
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ai_model_preference VARCHAR(50) NOT NULL DEFAULT 'gemini-pro',
    ai_temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7,
    ai_max_tokens INTEGER NOT NULL DEFAULT 1000,
    auto_save_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    auto_save_interval INTEGER NOT NULL DEFAULT 30,
    code_theme VARCHAR(50) NOT NULL DEFAULT 'vs-dark',
    font_size INTEGER NOT NULL DEFAULT 14,
    font_family VARCHAR(100) NOT NULL DEFAULT 'Consolas, monospace',
    tab_size INTEGER NOT NULL DEFAULT 2,
    word_wrap BOOLEAN NOT NULL DEFAULT TRUE,
    line_numbers BOOLEAN NOT NULL DEFAULT TRUE,
    minimap_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
"""

POSTGRES_USER_PROFILE_SCHEMA = """
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    skills JSONB DEFAULT '[]',
    interests JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    experience JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '[]',
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON user_profiles(display_name);
"""

