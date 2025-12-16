"""
Configuration
config.py

إعدادات وتكوين نظام التكامل
Configuration for System Integration

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import os
from typing import List, Optional

try:
    from pydantic_settings import BaseSettings
except ImportError:
    # Fallback for older pydantic versions
    try:
        from pydantic import BaseSettings
    except ImportError:
        # Simple fallback
        class BaseSettings:
            class Config:
                env_file = ".env"
                case_sensitive = True


class Settings(BaseSettings):
    """إعدادات التطبيق"""
    
    # إعدادات الخادم
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8003))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:8001",
        "https://oman-education.ai"
    ]
    
    # قاعدة البيانات
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:pass@localhost:5432/integration_db"
    )
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    REDIS_POOL_SIZE: int = int(os.getenv("REDIS_POOL_SIZE", "10"))
    
    # RabbitMQ
    RABBITMQ_URL: str = os.getenv(
        "RABBITMQ_URL",
        "amqp://guest:guest@localhost:5672/"
    )
    
    # Kafka
    KAFKA_BROKERS: List[str] = os.getenv(
        "KAFKA_BROKERS",
        "localhost:9092"
    ).split(",")
    
    # الأمان
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-jwt-secret-here")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # التكامل الخارجي
    EXTERNAL_API_TIMEOUT: int = 30
    MAX_RETRIES: int = 3
    RETRY_DELAY: int = 1
    
    # URLs الأنظمة
    OPERATING_SYSTEM_URL: str = os.getenv(
        "OPERATING_SYSTEM_URL",
        "http://localhost:8001"
    )
    WEB_INTERFACE_URL: str = os.getenv(
        "WEB_INTERFACE_URL",
        "http://localhost:8000"
    )
    AI_CORE_URL: str = os.getenv(
        "AI_CORE_URL",
        "http://localhost:8002"
    )
    
    # المراقبة
    PROMETHEUS_PORT: int = int(os.getenv("PROMETHEUS_PORT", "9090"))
    JAEGER_ENDPOINT: Optional[str] = os.getenv("JAEGER_ENDPOINT")
    
    # الخدمة
    SERVICE_NAME: str = "system-integration"
    SERVICE_VERSION: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# إنشاء نسخة من الإعدادات
settings = Settings()

