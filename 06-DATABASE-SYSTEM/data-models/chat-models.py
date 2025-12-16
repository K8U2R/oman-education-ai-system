"""
Chat Models
chat-models.py

نماذج المحادثة - تعريفات نماذج بيانات المحادثة
Chat Models - Chat data model definitions

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum


class MessageRole(Enum):
    """دور الرسالة"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatStatus(Enum):
    """حالة المحادثة"""
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"


@dataclass
class ChatMessage:
    """نموذج رسالة محادثة"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    chat_id: str = ""
    role: MessageRole = MessageRole.USER
    content: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "chat_id": self.chat_id,
            "role": self.role.value,
            "content": self.content,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'ChatMessage':
        """إنشاء من dict"""
        message = cls()
        message.id = data.get("id", str(uuid.uuid4()))
        message.chat_id = data.get("chat_id", "")
        message.role = MessageRole(data.get("role", "user"))
        message.content = data.get("content", "")
        message.metadata = data.get("metadata", {})
        
        if "created_at" in data:
            message.created_at = datetime.fromisoformat(data["created_at"])
        
        return message


@dataclass
class Chat:
    """نموذج محادثة"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    title: str = ""
    ai_model: str = "gpt-4"
    status: ChatStatus = ChatStatus.ACTIVE
    messages: List[ChatMessage] = field(default_factory=list)
    context: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "ai_model": self.ai_model,
            "status": self.status.value,
            "messages": [msg.to_dict() for msg in self.messages],
            "context": self.context,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Chat':
        """إنشاء من dict"""
        chat = cls()
        chat.id = data.get("id", str(uuid.uuid4()))
        chat.user_id = data.get("user_id", "")
        chat.title = data.get("title", "")
        chat.ai_model = data.get("ai_model", "gpt-4")
        chat.status = ChatStatus(data.get("status", "active"))
        chat.context = data.get("context", {})
        
        if "messages" in data:
            chat.messages = [ChatMessage.from_dict(msg) for msg in data["messages"]]
        
        if "created_at" in data:
            chat.created_at = datetime.fromisoformat(data["created_at"])
        if "updated_at" in data:
            chat.updated_at = datetime.fromisoformat(data["updated_at"])
        
        return chat


# MongoDB Schema (للمحادثات)
MONGODB_CHAT_SCHEMA = {
    "collection": "chats",
    "indexes": [
        {"fields": [("user_id", 1), ("created_at", -1)]},
        {"fields": [("status", 1)]},
        {"fields": [("id", 1)], "unique": True}
    ]
}

# PostgreSQL Schema (للميتاداتا)
POSTGRES_CHAT_SCHEMA = """
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    ai_model VARCHAR(100) DEFAULT 'gpt-4',
    status VARCHAR(50) DEFAULT 'active',
    context JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_status ON chats(status);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);
"""
