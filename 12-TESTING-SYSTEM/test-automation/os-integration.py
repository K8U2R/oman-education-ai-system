"""
OS Integration Layer
os-integration.py

طبقة التكامل مع نظام التشغيل (01-OPERATING-SYSTEM)
Integration layer with Operating System (01-OPERATING-SYSTEM)
"""

import asyncio
import logging
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
import json

# إعداد التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class OSIntegrationLayer:
    """
    طبقة التكامل مع نظام التشغيل
    يوفر واجهات للتفاعل مع 01-OPERATING-SYSTEM
    """
    
    def __init__(self, project_root: Optional[Path] = None):
        """
        تهيئة طبقة التكامل
        
        Args:
            project_root: مسار جذر المشروع
        """
        self.project_root = project_root or Path(__file__).parent.parent.parent
        self.os_system = None
        self.os_api_url = "http://localhost:8003"  # من api_server.py
        self.monitoring_active = False
        
    async def initialize(self):
        """تهيئة التكامل مع نظام التشغيل"""
        try:
            # محاولة استيراد نظام التشغيل
            os_path = self.project_root / "01-OPERATING-SYSTEM"
            if os_path.exists():
                sys.path.insert(0, str(os_path))
                
                try:
                    from operating_system import OperatingSystem
                    self.os_system = OperatingSystem(project_root=self.project_root)
                    await self.os_system.start()
                    logger.info("✅ تم الاتصال بنظام التشغيل بنجاح")
                except Exception as e:
                    logger.warning(f"⚠️ لا يمكن الاتصال بنظام التشغيل مباشرة: {e}")
                    logger.info("💡 سيتم استخدام API بدلاً من ذلك")
            else:
                logger.warning("⚠️ مجلد نظام التشغيل غير موجود")
                
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة التكامل: {e}")
            # لا نرفع الخطأ، يمكن العمل بدون نظام التشغيل
    
    async def get_system_metrics(self) -> Dict[str, Any]:
        """
        الحصول على مقاييس النظام الحالية
        
        Returns:
            مقاييس النظام
        """
        try:
            if self.os_system:
                status = self.os_system.get_status()
                return {
                    "cpu_usage": status.get("cpu_usage", 0),
                    "memory_usage": status.get("memory_usage", 0),
                    "disk_usage": status.get("disk_usage", 0),
                    "active_services": len(status.get("services", [])),
                    "timestamp": datetime.now().isoformat()
                }
            else:
                # استخدام API
                import aiohttp
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{self.os_api_url}/api/status") as response:
                        if response.status == 200:
                            return await response.json()
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على المقاييس: {e}")
        
        return {}
    
    async def start_service(
        self,
        service_name: str,
        config: Optional[Dict] = None
    ) -> bool:
        """
        تشغيل خدمة محددة
        
        Args:
            service_name: اسم الخدمة
            config: إعدادات الخدمة
            
        Returns:
            نجح/فشل
        """
        try:
            if self.os_system and self.os_system.service_manager:
                success = await self.os_system.service_manager.start_service(service_name)
                if success:
                    logger.info(f"✅ تم تشغيل الخدمة: {service_name}")
                return success
            else:
                # استخدام API
                import aiohttp
                async with aiohttp.ClientSession() as session:
                    async with session.post(
                        f"{self.os_api_url}/api/services/{service_name}/start",
                        json=config or {}
                    ) as response:
                        return response.status == 200
        except Exception as e:
            logger.error(f"❌ خطأ في تشغيل الخدمة {service_name}: {e}")
            return False
    
    async def stop_service(self, service_name: str) -> bool:
        """
        إيقاف خدمة محددة
        
        Args:
            service_name: اسم الخدمة
            
        Returns:
            نجح/فشل
        """
        try:
            if self.os_system and self.os_system.service_manager:
                success = await self.os_system.service_manager.stop_service(service_name)
                if success:
                    logger.info(f"✅ تم إيقاف الخدمة: {service_name}")
                return success
            else:
                # استخدام API
                import aiohttp
                async with aiohttp.ClientSession() as session:
                    async with session.post(
                        f"{self.os_api_url}/api/services/{service_name}/stop"
                    ) as response:
                        return response.status == 200
        except Exception as e:
            logger.error(f"❌ خطأ في إيقاف الخدمة {service_name}: {e}")
            return False
    
    async def monitor_test_execution(
        self,
        test_id: str,
        test_type: str
    ) -> Dict[str, Any]:
        """
        مراقبة تنفيذ اختبار معين
        
        Args:
            test_id: معرف الاختبار
            test_type: نوع الاختبار
            
        Returns:
            بيانات المراقبة
        """
        try:
            metrics = await self.get_system_metrics()
            
            monitoring_data = {
                "test_id": test_id,
                "test_type": test_type,
                "metrics": metrics,
                "timestamp": datetime.now().isoformat()
            }
            
            # تسجيل في نظام التشغيل
            await self.log_test_result({
                "test_id": test_id,
                "event": "monitoring",
                "data": monitoring_data
            })
            
            return monitoring_data
            
        except Exception as e:
            logger.error(f"❌ خطأ في مراقبة الاختبار {test_id}: {e}")
            return {}
    
    async def log_test_result(self, test_data: Dict[str, Any]) -> bool:
        """
        تسجيل نتائج الاختبار في نظام التشغيل
        
        Args:
            test_data: بيانات الاختبار
            
        Returns:
            نجح/فشل
        """
        try:
            if self.os_system:
                # استخدام نظام التسجيل في نظام التشغيل
                if hasattr(self.os_system, 'error_logger'):
                    self.os_system.error_logger.log(
                        level="INFO",
                        message=f"Test Result: {test_data.get('test_id')}",
                        data=test_data
                    )
                return True
            else:
                # استخدام API
                import aiohttp
                async with aiohttp.ClientSession() as session:
                    async with session.post(
                        f"{self.os_api_url}/api/logs/test",
                        json=test_data
                    ) as response:
                        return response.status == 200
        except Exception as e:
            logger.error(f"❌ خطأ في تسجيل نتائج الاختبار: {e}")
            return False
    
    async def notify_test_start(self, test_types: List) -> bool:
        """
        إعلام نظام التشغيل ببدء الاختبارات
        
        Args:
            test_types: أنواع الاختبارات
            
        Returns:
            نجح/فشل
        """
        try:
            await self.log_test_result({
                "event": "test_suite_start",
                "test_types": [t.value if hasattr(t, 'value') else str(t) for t in test_types],
                "timestamp": datetime.now().isoformat()
            })
            return True
        except Exception as e:
            logger.error(f"❌ خطأ في إعلام بدء الاختبارات: {e}")
            return False
    
    async def notify_test_complete(self, results: Dict[str, Any]) -> bool:
        """
        إعلام نظام التشغيل بانتهاء الاختبارات
        
        Args:
            results: نتائج الاختبارات
            
        Returns:
            نجح/فشل
        """
        try:
            await self.log_test_result({
                "event": "test_suite_complete",
                "results": results,
                "timestamp": datetime.now().isoformat()
            })
            
            # إرسال تنبيه إذا فشلت اختبارات
            failed_tests = [
                k for k, v in results.items()
                if v.get("status") in ["failed", "error"]
            ]
            
            if failed_tests and self.os_system:
                if hasattr(self.os_system, 'alert_generator'):
                    await self.os_system.alert_generator.generate_alert(
                        level="WARNING",
                        message=f"فشل {len(failed_tests)} اختبار",
                        data={"failed_tests": failed_tests}
                    )
            
            return True
        except Exception as e:
            logger.error(f"❌ خطأ في إعلام انتهاء الاختبارات: {e}")
            return False
    
    async def monitor_test(self, test_id: str, test_type: str):
        """
        بدء مراقبة اختبار
        
        Args:
            test_id: معرف الاختبار
            test_type: نوع الاختبار
        """
        self.monitoring_active = True
        # يمكن إضافة مراقبة مستمرة هنا
        await self.monitor_test_execution(test_id, test_type)
    
    async def shutdown(self):
        """إيقاف طبقة التكامل"""
        if self.os_system:
            await self.os_system.stop()
        logger.info("🛑 تم إيقاف طبقة التكامل مع نظام التشغيل")


# مثال على الاستخدام
async def main():
    """مثال على استخدام طبقة التكامل"""
    integration = OSIntegrationLayer()
    await integration.initialize()
    
    # الحصول على المقاييس
    metrics = await integration.get_system_metrics()
    print(f"مقاييس النظام: {metrics}")
    
    # تشغيل خدمة
    success = await integration.start_service("test_service")
    print(f"تشغيل الخدمة: {'نجح' if success else 'فشل'}")
    
    await integration.shutdown()


if __name__ == "__main__":
    asyncio.run(main())

