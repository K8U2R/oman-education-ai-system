"""
System Models
system-models.py

نماذج النظام - تعريفات نماذج بيانات النظام
System Models - System data model definitions

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum


class SystemStatus(Enum):
    """حالة النظام"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    ERROR = "error"


class LogLevel(Enum):
    """مستوى السجل"""
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


@dataclass
class SystemLog:
    """سجل النظام"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    module: str = ""
    level: LogLevel = LogLevel.INFO
    message: str = ""
    details: Dict[str, Any] = field(default_factory=dict)
    user_id: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "module": self.module,
            "level": self.level.value,
            "message": self.message,
            "details": self.details,
            "user_id": self.user_id,
            "timestamp": self.timestamp.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'SystemLog':
        """إنشاء من dict"""
        log = cls()
        log.id = data.get("id", str(uuid.uuid4()))
        log.module = data.get("module", "")
        log.level = LogLevel(data.get("level", "info"))
        log.message = data.get("message", "")
        log.details = data.get("details", {})
        log.user_id = data.get("user_id")
        
        if "timestamp" in data:
            log.timestamp = datetime.fromisoformat(data["timestamp"])
        
        return log


@dataclass
class SystemMetric:
    """مقياس النظام"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    metric_name: str = ""
    value: float = 0.0
    unit: str = ""
    tags: Dict[str, str] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "metric_name": self.metric_name,
            "value": self.value,
            "unit": self.unit,
            "tags": self.tags,
            "timestamp": self.timestamp.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'SystemMetric':
        """إنشاء من dict"""
        metric = cls()
        metric.id = data.get("id", str(uuid.uuid4()))
        metric.metric_name = data.get("metric_name", "")
        metric.value = data.get("value", 0.0)
        metric.unit = data.get("unit", "")
        metric.tags = data.get("tags", {})
        
        if "timestamp" in data:
            metric.timestamp = datetime.fromisoformat(data["timestamp"])
        
        return metric


@dataclass
class SystemConfig:
    """إعدادات النظام"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    key: str = ""
    value: Any = None
    category: str = "general"
    description: str = ""
    is_encrypted: bool = False
    updated_at: datetime = field(default_factory=datetime.now)
    updated_by: Optional[str] = None
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "key": self.key,
            "value": self.value,
            "category": self.category,
            "description": self.description,
            "is_encrypted": self.is_encrypted,
            "updated_at": self.updated_at.isoformat(),
            "updated_by": self.updated_by
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'SystemConfig':
        """إنشاء من dict"""
        config = cls()
        config.id = data.get("id", str(uuid.uuid4()))
        config.key = data.get("key", "")
        config.value = data.get("value")
        config.category = data.get("category", "general")
        config.description = data.get("description", "")
        config.is_encrypted = data.get("is_encrypted", False)
        config.updated_by = data.get("updated_by")
        
        if "updated_at" in data:
            config.updated_at = datetime.fromisoformat(data["updated_at"])
        
        return config


# PostgreSQL Schema
POSTGRES_SYSTEM_SCHEMA = """
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    user_id UUID,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_logs_module ON system_logs(module);
CREATE INDEX IF NOT EXISTS idx_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON system_logs(timestamp DESC);

CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20),
    tags JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_metrics_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON system_metrics(timestamp DESC);

CREATE TABLE IF NOT EXISTS system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB,
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_configs_key ON system_configs(key);
CREATE INDEX IF NOT EXISTS idx_configs_category ON system_configs(category);
"""

# MongoDB Schema (للبيانات الزمنية)
MONGODB_SYSTEM_SCHEMA = {
    "collection": "system_metrics",
    "indexes": [
        {"fields": [("metric_name", 1), ("timestamp", -1)]},
        {"fields": [("timestamp", -1)]},
        {"fields": [("tags", 1)]}
    ]
}
