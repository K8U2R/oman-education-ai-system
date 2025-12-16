"""
Info Routes - مسارات المعلومات
Additional information endpoints
"""

from fastapi import APIRouter
from datetime import datetime
from typing import Dict, Any

router = APIRouter()


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    فحص جاهزية بسيط للخدمة
    Lightweight health check
    """
    return {
        "status": "ok",
        "service": "api-gateway",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


@router.get("/ready")
async def readiness_check() -> Dict[str, Any]:
    """
    فحص الاستعداد للتشغيل
    Readiness check
    """
    return {
        "status": "ready",
        "api": "/api/v1",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


@router.get("/info")
async def get_api_info() -> Dict[str, Any]:
    """
    معلومات شاملة عن الـ API
    Comprehensive API information
    """
    return {
        "name": "Oman Education AI - Operating System API",
        "version": "1.0.0",
        "description": "نظام تشغيل متكامل ومتقدم لإدارة وتشغيل تطبيق سطح المكتب التعليمي الذكي",
        "status": "running",
        "api_version": "v1",
        "base_url": "/api/v1",
        "endpoints": {
            "system": {
                "status": "/api/v1/system/status",
                "health": "/api/v1/system/health",
                "shutdown": "/api/v1/system/shutdown"
            },
            "monitoring": {
                "health": "/api/v1/monitoring/health",
                "performance": "/api/v1/monitoring/performance",
                "resources": "/api/v1/monitoring/resources"
            },
            "errors": {
                "list": "/api/v1/errors/",
                "stats": "/api/v1/errors/stats",
                "get_by_id": "/api/v1/errors/{error_id}",
                "clear": "/api/v1/errors/"
            },
            "services": {
                "list": "/api/v1/services/list",
                "start": "/api/v1/services/start/{service_name}",
                "stop": "/api/v1/services/stop/{service_name}"
            },
            "websocket": {
                "system_status": "/ws/system-status",
                "monitoring": "/ws/monitoring",
                "events": "/ws/events"
            }
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        },
        "timestamp": datetime.now().isoformat()
    }


@router.get("/version")
async def get_version() -> Dict[str, Any]:
    """
    معلومات الإصدار
    Version information
    """
    return {
        "version": "1.0.0",
        "api_version": "v1",
        "release_date": "2025-12-12",
        "status": "stable"
    }

