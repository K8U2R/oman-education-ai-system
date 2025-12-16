"""
Operating System Bridge
operating_system_bridge.py

جسر نظام التشغيل - واجهة مباشرة للتفاعل مع Operating System
Operating System Bridge - Direct interface to interact with Operating System
"""

import asyncio
import logging
import httpx
from typing import Dict, Any, Optional
from pathlib import Path
import importlib.util

logger = logging.getLogger(__name__)


class OperatingSystemBridge:
    """
    جسر نظام التشغيل
    يوفر واجهة مباشرة للتفاعل مع Operating System
    """
    
    def __init__(self, project_root: Optional[Path] = None, api_url: str = "http://localhost:8001"):
        """
        تهيئة الجسر
        
        Args:
            project_root: مسار جذر المشروع
            api_url: URL لـ API Server
        """
        self.name = "Operating System Bridge"
        self.version = "1.0.0"
        self.project_root = project_root or Path(__file__).parent.parent.parent
        self.api_url = api_url.rstrip('/')
        
        # مثيل Operating System (إذا كان متاحاً محلياً)
        self.os_instance: Optional[Any] = None
        
        # HTTP Client
        self.client: Optional[httpx.AsyncClient] = None
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def initialize(self):
        """تهيئة الجسر"""
        try:
            # محاولة تحميل Operating System محلياً
            os_path = self.project_root / "01-OPERATING-SYSTEM" / "operating_system.py"
            if os_path.exists():
                try:
                    spec = importlib.util.spec_from_file_location("operating_system", os_path)
                    if spec and spec.loader:
                        module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(module)
                        OperatingSystem = module.OperatingSystem
                        self.os_instance = OperatingSystem(self.project_root)
                        await self.os_instance.start()
                        logger.info("✅ تم تحميل Operating System محلياً")
                except Exception as e:
                    logger.warning(f"فشل في تحميل Operating System محلياً: {e}")
            
            # تهيئة HTTP Client
            self.client = httpx.AsyncClient(
                base_url=self.api_url,
                timeout=30.0
            )
            
            logger.info("✅ تم تهيئة الجسر بنجاح")
            
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة الجسر: {e}")
            raise
    
    async def shutdown(self):
        """إيقاف الجسر"""
        if self.os_instance:
            try:
                await self.os_instance.stop()
            except Exception as e:
                logger.warning(f"خطأ في إيقاف OS: {e}")
        
        if self.client:
            await self.client.aclose()
        
        logger.info("✅ تم إيقاف الجسر")
    
    async def get_health(self) -> Dict[str, Any]:
        """الحصول على صحة النظام"""
        if self.os_instance:
            try:
                status = self.os_instance.get_status()
                return {
                    "status": "healthy" if self.os_instance.running else "stopped",
                    "source": "local",
                    "data": status
                }
            except Exception as e:
                logger.error(f"خطأ في الحصول على الصحة محلياً: {e}")
                # محاولة API كبديل
                pass
        
        # استخدام API
        if not self.client:
            return {
                "status": "error",
                "source": "api",
                "error": "HTTP client not initialized"
            }
        
        try:
            response = await self.client.get("/health", timeout=10.0)
            response.raise_for_status()
            data = response.json()
            data["source"] = "api"
            return data
        except Exception as e:
            logger.error(f"خطأ في الحصول على الصحة من API: {e}")
            return {
                "status": "error",
                "source": "api",
                "error": str(e)
            }
    
    async def get_status(self) -> Dict[str, Any]:
        """الحصول على حالة النظام"""
        if self.os_instance:
            try:
                return {
                    "source": "local",
                    "data": self.os_instance.get_status()
                }
            except Exception as e:
                logger.error(f"خطأ في الحصول على الحالة محلياً: {e}")
        
        # استخدام API
        try:
            response = await self.client.get("/status")
            response.raise_for_status()
            data = response.json()
            data["source"] = "api"
            return data
        except Exception as e:
            logger.error(f"خطأ في الحصول على الحالة من API: {e}")
            return {
                "source": "api",
                "error": str(e)
            }
    
    async def get_services(self) -> Dict[str, Any]:
        """الحصول على قائمة الخدمات"""
        if self.os_instance and self.os_instance.service_manager:
            try:
                services = self.os_instance.service_manager.get_all_services()
                return {
                    "source": "local",
                    "services": services,
                    "count": len(services)
                }
            except Exception as e:
                logger.error(f"خطأ في الحصول على الخدمات محلياً: {e}")
        
        # استخدام API
        try:
            response = await self.client.get("/services")
            response.raise_for_status()
            data = response.json()
            data["source"] = "api"
            return data
        except Exception as e:
            logger.error(f"خطأ في الحصول على الخدمات من API: {e}")
            return {
                "source": "api",
                "error": str(e)
            }
    
    async def get_resources(self) -> Dict[str, Any]:
        """الحصول على معلومات الموارد"""
        if self.os_instance and self.os_instance.resource_allocator:
            try:
                usage_summary = self.os_instance.resource_allocator.get_usage_summary()
                return {
                    "source": "local",
                    "resources": usage_summary
                }
            except Exception as e:
                logger.error(f"خطأ في الحصول على الموارد محلياً: {e}")
        
        # استخدام API
        try:
            response = await self.client.get("/resources")
            response.raise_for_status()
            data = response.json()
            data["source"] = "api"
            return data
        except Exception as e:
            logger.error(f"خطأ في الحصول على الموارد من API: {e}")
            return {
                "source": "api",
                "error": str(e)
            }
    
    async def get_metrics(self) -> Dict[str, Any]:
        """الحصول على المقاييس"""
        if self.os_instance:
            try:
                metrics = {}
                if self.os_instance.resource_allocator:
                    metrics["resources"] = self.os_instance.resource_allocator.get_usage_summary()
                if self.os_instance.service_manager:
                    services = self.os_instance.service_manager.get_all_services()
                    metrics["services"] = {
                        "total": len(services),
                        "running": sum(1 for s in services.values() if s.get("status") == "running")
                    }
                return {
                    "source": "local",
                    "metrics": metrics
                }
            except Exception as e:
                logger.error(f"خطأ في الحصول على المقاييس محلياً: {e}")
        
        # استخدام API
        try:
            response = await self.client.get("/metrics")
            response.raise_for_status()
            data = response.json()
            data["source"] = "api"
            return data
        except Exception as e:
            logger.error(f"خطأ في الحصول على المقاييس من API: {e}")
            return {
                "source": "api",
                "error": str(e)
            }
    
    async def start_system(self) -> Dict[str, Any]:
        """بدء نظام التشغيل"""
        if self.os_instance:
            try:
                if not self.os_instance.running:
                    await self.os_instance.start()
                return {
                    "source": "local",
                    "message": "تم بدء النظام بنجاح",
                    "status": "started"
                }
            except Exception as e:
                logger.error(f"خطأ في بدء النظام محلياً: {e}")
        
        # استخدام API
        try:
            response = await self.client.post("/control/start")
            response.raise_for_status()
            data = response.json()
            data["source"] = "api"
            return data
        except Exception as e:
            logger.error(f"خطأ في بدء النظام من API: {e}")
            return {
                "source": "api",
                "error": str(e)
            }
    
    async def stop_system(self) -> Dict[str, Any]:
        """إيقاف نظام التشغيل"""
        if self.os_instance:
            try:
                if self.os_instance.running:
                    await self.os_instance.stop()
                return {
                    "source": "local",
                    "message": "تم إيقاف النظام بنجاح",
                    "status": "stopped"
                }
            except Exception as e:
                logger.error(f"خطأ في إيقاف النظام محلياً: {e}")
        
        # استخدام API
        try:
            response = await self.client.post("/control/stop")
            response.raise_for_status()
            data = response.json()
            data["source"] = "api"
            return data
        except Exception as e:
            logger.error(f"خطأ في إيقاف النظام من API: {e}")
            return {
                "source": "api",
                "error": str(e)
            }

