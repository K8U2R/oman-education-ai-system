"""
API Gateway Manager
api-gateway-manager.py

مدير بوابة API - بوابة موحدة لجميع API endpoints
API Gateway Manager - Unified gateway for all API endpoints

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Callable
from datetime import datetime
from enum import Enum
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.routing import APIRoute
import httpx

logger = logging.getLogger(__name__)


class RouteStatus(Enum):
    """حالة المسار"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"


class ApiGatewayManager:
    """
    مدير بوابة API
    يوفر بوابة موحدة لجميع API endpoints
    
    API Gateway Manager
    Provides unified gateway for all API endpoints
    """
    
    def __init__(self):
        """تهيئة مدير بوابة API"""
        self.name = "API Gateway Manager"
        self.version = "1.0.0"
        
        # المسارات المسجلة
        self.routes: Dict[str, Dict[str, Any]] = {}
        
        # إعدادات Rate Limiting
        self.rate_limits: Dict[str, Dict[str, int]] = {}
        
        # إعدادات Load Balancing
        self.load_balancers: Dict[str, List[str]] = {}
        
        # إحصائيات
        self.stats: Dict[str, Any] = {
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "start_time": datetime.now()
        }
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    def register_route(
        self,
        path: str,
        target_url: str,
        methods: List[str] = ["GET", "POST"],
        rate_limit: Optional[Dict[str, int]] = None,
        load_balancer: Optional[List[str]] = None
    ) -> bool:
        """
        تسجيل مسار جديد
        
        Args:
            path: مسار API Gateway
            target_url: URL الهدف
            methods: قائمة الطرق المسموحة
            rate_limit: حدود المعدل (requests_per_minute)
            load_balancer: قائمة URLs للـ Load Balancing
            
        Returns:
            bool: True إذا نجح التسجيل
        """
        try:
            self.routes[path] = {
                "target_url": target_url,
                "methods": methods,
                "status": RouteStatus.ACTIVE,
                "registered_at": datetime.now(),
                "request_count": 0,
                "error_count": 0
            }
            
            if rate_limit:
                self.rate_limits[path] = rate_limit
            
            if load_balancer:
                self.load_balancers[path] = load_balancer
            
            logger.info(f"✅ تم تسجيل مسار: {path} → {target_url}")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في تسجيل المسار {path}: {e}")
            return False
    
    def register_operating_system_routes(self, base_url: str = "http://localhost:8001"):
        """
        تسجيل مسارات نظام التشغيل
        
        Args:
            base_url: URL الأساسي لنظام التشغيل
        """
        routes = {
            "/api/integration/os/health": {
                "target": f"{base_url}/health",
                "methods": ["GET"]
            },
            "/api/integration/os/status": {
                "target": f"{base_url}/status",
                "methods": ["GET"]
            },
            "/api/integration/os/services": {
                "target": f"{base_url}/services",
                "methods": ["GET"]
            },
            "/api/integration/os/resources": {
                "target": f"{base_url}/resources",
                "methods": ["GET"]
            },
            "/api/integration/os/metrics": {
                "target": f"{base_url}/metrics",
                "methods": ["GET"]
            },
            "/api/integration/os/control/start": {
                "target": f"{base_url}/control/start",
                "methods": ["POST"]
            },
            "/api/integration/os/control/stop": {
                "target": f"{base_url}/control/stop",
                "methods": ["POST"]
            }
        }
        
        for path, config in routes.items():
            self.register_route(
                path=path,
                target_url=config["target"],
                methods=config["methods"],
                rate_limit={"requests_per_minute": 60}
            )
    
    def register_web_interface_routes(self, base_url: str = "http://localhost:8000"):
        """
        تسجيل مسارات واجهة الويب
        
        Args:
            base_url: URL الأساسي لواجهة الويب
        """
        routes = {
            "/api/integration/web/health": f"{base_url}/health",
            "/api/integration/web/chat": f"{base_url}/api/chat",
            "/api/integration/web/projects": f"{base_url}/api/projects",
            "/api/integration/web/files": f"{base_url}/api/files"
        }
        
        for path, target in routes.items():
            self.register_route(
                path=path,
                target_url=target,
                methods=["GET", "POST", "PUT", "DELETE"],
                rate_limit={"requests_per_minute": 100}
            )
    
    def register_ai_core_routes(self, base_url: str = "http://localhost:8002"):
        """
        تسجيل مسارات نواة الذكاء الاصطناعي
        
        Args:
            base_url: URL الأساسي لنواة الذكاء الاصطناعي
        """
        routes = {
            "/api/integration/ai/process": f"{base_url}/process",
            "/api/integration/ai/chat": f"{base_url}/chat",
            "/api/integration/ai/generate": f"{base_url}/generate"
        }
        
        for path, target in routes.items():
            self.register_route(
                path=path,
                target_url=target,
                methods=["POST"],
                rate_limit={"requests_per_minute": 30}
            )
    
    async def proxy_request(
        self,
        path: str,
        method: str,
        request: Request,
        body: Optional[bytes] = None
    ) -> Response:
        """
        توجيه الطلب إلى النظام الهدف
        
        Args:
            path: مسار الطلب
            method: طريقة HTTP
            request: كائن Request
            body: جسم الطلب
            
        Returns:
            Response: استجابة من النظام الهدف
        """
        if path not in self.routes:
            raise HTTPException(status_code=404, detail=f"المسار غير موجود: {path}")
        
        route_info = self.routes[path]
        
        if method not in route_info["methods"]:
            raise HTTPException(status_code=405, detail=f"الطريقة غير مسموحة: {method}")
        
        # تحديث الإحصائيات
        self.stats["total_requests"] += 1
        route_info["request_count"] += 1
        
        try:
            # اختيار URL (Load Balancing)
            target_url = self._select_target_url(path, route_info["target_url"])
            
            # إعداد الطلب
            headers = dict(request.headers)
            headers.pop("host", None)  # إزالة host header
            
            # إرسال الطلب
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.request(
                    method=method,
                    url=target_url,
                    headers=headers,
                    content=body or await request.body(),
                    params=dict(request.query_params)
                )
                
                # تحديث الإحصائيات
                self.stats["successful_requests"] += 1
                
                return Response(
                    content=response.content,
                    status_code=response.status_code,
                    headers=dict(response.headers)
                )
                
        except Exception as e:
            logger.error(f"❌ خطأ في توجيه الطلب إلى {path}: {e}")
            self.stats["failed_requests"] += 1
            route_info["error_count"] += 1
            raise HTTPException(status_code=502, detail=f"خطأ في توجيه الطلب: {str(e)}")
    
    def _select_target_url(self, path: str, default_url: str) -> str:
        """
        اختيار URL الهدف (Load Balancing)
        
        Args:
            path: مسار الطلب
            default_url: URL الافتراضي
            
        Returns:
            str: URL المختار
        """
        if path in self.load_balancers and self.load_balancers[path]:
            # Round-robin Load Balancing
            import random
            return random.choice(self.load_balancers[path])
        return default_url
    
    def get_route_info(self, path: str) -> Optional[Dict[str, Any]]:
        """
        الحصول على معلومات مسار
        
        Args:
            path: مسار API
            
        Returns:
            dict: معلومات المسار
        """
        if path in self.routes:
            return self.routes[path].copy()
        return None
    
    def get_all_routes(self) -> Dict[str, Dict[str, Any]]:
        """
        الحصول على جميع المسارات
        
        Returns:
            dict: جميع المسارات
        """
        return self.routes.copy()
    
    def get_stats(self) -> Dict[str, Any]:
        """
        الحصول على الإحصائيات
        
        Returns:
            dict: الإحصائيات
        """
        uptime = (datetime.now() - self.stats["start_time"]).total_seconds()
        
        return {
            **self.stats,
            "uptime_seconds": uptime,
            "routes_count": len(self.routes),
            "success_rate": (
                self.stats["successful_requests"] / self.stats["total_requests"]
                if self.stats["total_requests"] > 0
                else 0
            )
        }
    
    def disable_route(self, path: str) -> bool:
        """
        تعطيل مسار
        
        Args:
            path: مسار API
            
        Returns:
            bool: True إذا نجح التعطيل
        """
        if path in self.routes:
            self.routes[path]["status"] = RouteStatus.INACTIVE
            logger.info(f"تم تعطيل المسار: {path}")
            return True
        return False
    
    def enable_route(self, path: str) -> bool:
        """
        تفعيل مسار
        
        Args:
            path: مسار API
            
        Returns:
            bool: True إذا نجح التفعيل
        """
        if path in self.routes:
            self.routes[path]["status"] = RouteStatus.ACTIVE
            logger.info(f"تم تفعيل المسار: {path}")
            return True
        return False


async def main():
    """اختبار مدير بوابة API"""
    gateway = ApiGatewayManager()
    
    # تسجيل المسارات
    gateway.register_operating_system_routes()
    gateway.register_web_interface_routes()
    gateway.register_ai_core_routes()
    
    # عرض المسارات
    print("\n📋 المسارات المسجلة:")
    for path, info in gateway.get_all_routes().items():
        print(f"  {path} → {info['target_url']} ({', '.join(info['methods'])})")
    
    # عرض الإحصائيات
    stats = gateway.get_stats()
    print(f"\n📊 الإحصائيات:")
    print(f"  عدد المسارات: {stats['routes_count']}")
    print(f"  إجمالي الطلبات: {stats['total_requests']}")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    asyncio.run(main())
