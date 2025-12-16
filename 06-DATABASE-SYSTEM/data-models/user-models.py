"""
User Models
user-models.py

نماذج المستخدمين - تعريفات نماذج بيانات المستخدمين
User Models - User data model definitions

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum


class UserRole(Enum):
    """أدوار المستخدم"""
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"
    DEVELOPER = "developer"
    PARENT = "parent"


class UserStatus(Enum):
    """حالة المستخدم"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"


@dataclass
class User:
    """نموذج المستخدم"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    email: str = ""
    username: str = ""
    password_hash: str = ""
    full_name: str = ""
    role: UserRole = UserRole.STUDENT
    status: UserStatus = UserStatus.PENDING
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    last_login: Optional[datetime] = None
    profile_data: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "full_name": self.full_name,
            "role": self.role.value,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "profile_data": self.profile_data
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'User':
        """إنشاء من dict"""
        user = cls()
        user.id = data.get("id", str(uuid.uuid4()))
        user.email = data.get("email", "")
        user.username = data.get("username", "")
        user.password_hash = data.get("password_hash", "")
        user.full_name = data.get("full_name", "")
        user.role = UserRole(data.get("role", "student"))
        user.status = UserStatus(data.get("status", "pending"))
        
        if "created_at" in data:
            user.created_at = datetime.fromisoformat(data["created_at"])
        if "updated_at" in data:
            user.updated_at = datetime.fromisoformat(data["updated_at"])
        if "last_login" in data and data["last_login"]:
            user.last_login = datetime.fromisoformat(data["last_login"])
        
        user.profile_data = data.get("profile_data", {})
        return user


@dataclass
class UserSession:
    """نموذج جلسة المستخدم"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    token: str = ""
    ip_address: str = ""
    user_agent: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    expires_at: datetime = field(default_factory=lambda: datetime.now())
    last_activity: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "token": self.token,
            "ip_address": self.ip_address,
            "user_agent": self.user_agent,
            "created_at": self.created_at.isoformat(),
            "expires_at": self.expires_at.isoformat(),
            "last_activity": self.last_activity.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'UserSession':
        """إنشاء من dict"""
        session = cls()
        session.id = data.get("id", str(uuid.uuid4()))
        session.user_id = data.get("user_id", "")
        session.token = data.get("token", "")
        session.ip_address = data.get("ip_address", "")
        session.user_agent = data.get("user_agent", "")
        
        if "created_at" in data:
            session.created_at = datetime.fromisoformat(data["created_at"])
        if "expires_at" in data:
            session.expires_at = datetime.fromisoformat(data["expires_at"])
        if "last_activity" in data:
            session.last_activity = datetime.fromisoformat(data["last_activity"])
        
        return session


# PostgreSQL Schema
POSTGRES_USER_SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    profile_data JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
"""

POSTGRES_SESSION_SCHEMA = """
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);
"""
