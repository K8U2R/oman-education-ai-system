"""
System Connector
system-connector.py

موصل الأنظمة - يربط جميع الأنظمة معاً
System Connector - Connects all systems together

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
import importlib.util
from pathlib import Path
from typing import Dict, Optional, Any, Callable
from datetime import datetime
from enum import Enum

logger = logging.getLogger(__name__)


class SystemStatus(Enum):
    """حالة النظام"""
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    UNKNOWN = "unknown"


class SystemConnector:
    """
    موصل الأنظمة
    يربط جميع الأنظمة المختلفة معاً
    
    System Connector
    Connects all different systems together
    """
    
    def __init__(self, project_root: Optional[Path] = None):
        """
        تهيئة موصل الأنظمة
        
        Args:
            project_root: مسار جذر المشروع
        """
        self.name = "System Connector"
        self.version = "1.0.0"
        self.project_root = project_root or Path(__file__).parent.parent.parent
        
        # أنظمة مربوطة
        self.connected_systems: Dict[str, Dict[str, Any]] = {}
        
        # معالجات الأخطاء
        self.error_handlers: Dict[str, Callable] = {}
        
        # حالة الاتصال
        self.status: SystemStatus = SystemStatus.UNKNOWN
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    def load_module(self, module_name: str, file_path: Path):
        """
        تحميل وحدة من مسار معين
        
        Args:
            module_name: اسم الوحدة
            file_path: مسار الملف
            
        Returns:
            الوحدة المحملة
        """
        try:
            spec = importlib.util.spec_from_file_location(module_name, file_path)
            if spec is None or spec.loader is None:
                raise ImportError(f"لا يمكن تحميل الوحدة: {file_path}")
            
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
        except Exception as e:
            logger.error(f"خطأ في تحميل الوحدة {module_name}: {e}")
            raise
    
    async def connect_operating_system(self) -> bool:
        """
        ربط نظام التشغيل (01-OPERATING-SYSTEM)
        
        Returns:
            bool: True إذا نجح الربط
        """
        try:
            os_path = self.project_root / "01-OPERATING-SYSTEM" / "operating_system.py"
            
            if not os_path.exists():
                logger.warning(f"نظام التشغيل غير موجود: {os_path}")
                return False
            
            # تحميل نظام التشغيل
            os_module = self.load_module("operating_system", os_path)
            OperatingSystem = os_module.OperatingSystem
            
            # إنشاء مثيل
            os_instance = OperatingSystem(self.project_root)
            
            # حفظ الاتصال
            self.connected_systems["operating_system"] = {
                "instance": os_instance,
                "path": str(os_path),
                "status": SystemStatus.CONNECTED,
                "connected_at": datetime.now(),
                "type": "01-OPERATING-SYSTEM"
            }
            
            logger.info("✅ تم ربط نظام التشغيل بنجاح")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في ربط نظام التشغيل: {e}")
            self.connected_systems["operating_system"] = {
                "status": SystemStatus.ERROR,
                "error": str(e),
                "connected_at": datetime.now()
            }
            return False
    
    async def connect_web_interface(self) -> bool:
        """
        ربط واجهة الويب (03-WEB-INTERFACE)
        
        Returns:
            bool: True إذا نجح الربط
        """
        try:
            # محاولة الاتصال عبر API
            import httpx
            web_api_url = "http://localhost:8000"
            
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    response = await client.get(f"{web_api_url}/health")
                    if response.status_code == 200:
                        # حفظ الاتصال
                        self.connected_systems["web_interface"] = {
                            "url": web_api_url,
                            "status": SystemStatus.CONNECTED,
                            "connected_at": datetime.now(),
                            "type": "03-WEB-INTERFACE",
                            "connection_type": "api"
                        }
                        logger.info("✅ تم ربط واجهة الويب بنجاح (عبر API)")
                        return True
            except Exception as api_error:
                logger.warning(f"فشل الاتصال عبر API: {api_error}")
            
            # محاولة تحميل محلي
            web_api_path = self.project_root / "03-WEB-INTERFACE" / "backend-api" / "app.py"
            
            if not web_api_path.exists():
                logger.warning(f"واجهة الويب غير موجودة: {web_api_path}")
                self.connected_systems["web_interface"] = {
                    "status": SystemStatus.DISCONNECTED,
                    "connected_at": datetime.now(),
                    "type": "03-WEB-INTERFACE"
                }
                return False
            
            # تحميل واجهة الويب
            web_module = self.load_module("web_interface", web_api_path)
            
            # حفظ الاتصال
            self.connected_systems["web_interface"] = {
                "module": web_module,
                "path": str(web_api_path),
                "status": SystemStatus.CONNECTED,
                "connected_at": datetime.now(),
                "type": "03-WEB-INTERFACE",
                "connection_type": "local"
            }
            
            logger.info("✅ تم ربط واجهة الويب بنجاح (محلياً)")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في ربط واجهة الويب: {e}")
            self.connected_systems["web_interface"] = {
                "status": SystemStatus.ERROR,
                "error": str(e),
                "connected_at": datetime.now()
            }
            return False
    
    async def connect_ai_core(self) -> bool:
        """
        ربط نواة الذكاء الاصطناعي (00-AI-CORE-SYSTEM)
        
        Returns:
            bool: True إذا نجح الربط
        """
        try:
            ai_core_path = self.project_root / "00-AI-CORE-SYSTEM"
            
            if not ai_core_path.exists():
                logger.warning(f"نواة الذكاء الاصطناعي غير موجودة: {ai_core_path}")
                return False
            
            # حفظ الاتصال (سيتم تطويره لاحقاً)
            self.connected_systems["ai_core"] = {
                "path": str(ai_core_path),
                "status": SystemStatus.CONNECTED,
                "connected_at": datetime.now(),
                "type": "00-AI-CORE-SYSTEM",
                "note": "سيتم تطوير الربط الكامل لاحقاً"
            }
            
            logger.info("✅ تم ربط نواة الذكاء الاصطناعي بنجاح")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في ربط نواة الذكاء الاصطناعي: {e}")
            self.connected_systems["ai_core"] = {
                "status": SystemStatus.ERROR,
                "error": str(e),
                "connected_at": datetime.now()
            }
            return False
    
    async def connect_all_systems(self) -> Dict[str, bool]:
        """
        ربط جميع الأنظمة
        
        Returns:
            dict: نتائج الربط لكل نظام
        """
        logger.info("🔗 بدء ربط جميع الأنظمة...")
        
        results = {
            "operating_system": await self.connect_operating_system(),
            "web_interface": await self.connect_web_interface(),
            "ai_core": await self.connect_ai_core()
        }
        
        # تحديث الحالة العامة
        all_connected = all(results.values())
        self.status = SystemStatus.CONNECTED if all_connected else SystemStatus.ERROR
        
        logger.info(f"✅ اكتمل ربط الأنظمة: {sum(results.values())}/{len(results)}")
        
        return results
    
    def get_system(self, system_name: str) -> Optional[Any]:
        """
        الحصول على نظام مربوط
        
        Args:
            system_name: اسم النظام
            
        Returns:
            النظام المربوط أو None
        """
        if system_name in self.connected_systems:
            system_info = self.connected_systems[system_name]
            if "instance" in system_info:
                return system_info["instance"]
            elif "module" in system_info:
                return system_info["module"]
        
        return None
    
    def get_system_status(self, system_name: str) -> Optional[SystemStatus]:
        """
        الحصول على حالة نظام
        
        Args:
            system_name: اسم النظام
            
        Returns:
            حالة النظام أو None
        """
        if system_name in self.connected_systems:
            return self.connected_systems[system_name].get("status")
        return None
    
    def get_all_connected_systems(self) -> Dict[str, Dict[str, Any]]:
        """
        الحصول على جميع الأنظمة المربوطة
        
        Returns:
            dict: معلومات جميع الأنظمة
        """
        return self.connected_systems.copy()
    
    def is_system_connected(self, system_name: str) -> bool:
        """
        التحقق من اتصال نظام
        
        Args:
            system_name: اسم النظام
            
        Returns:
            bool: True إذا كان النظام متصل
        """
        # محاولة مطابقة الأسماء المختلفة
        possible_names = [
            system_name,
            system_name.replace("-", "_"),
            system_name.replace("_", "-"),
            f"{system_name}_system",
            f"{system_name}-system",
            "operating_system" if "operating" in system_name.lower() or "os" in system_name.lower() else None,
            "web_interface" if "web" in system_name.lower() or "interface" in system_name.lower() else None
        ]
        
        for name in possible_names:
            if name and name in self.connected_systems:
                status = self.get_system_status(name)
                if status == SystemStatus.CONNECTED:
                    return True
        
        return False
    
    async def disconnect_system(self, system_name: str) -> bool:
        """
        قطع اتصال نظام
        
        Args:
            system_name: اسم النظام
            
        Returns:
            bool: True إذا نجح قطع الاتصال
        """
        if system_name in self.connected_systems:
            self.connected_systems[system_name]["status"] = SystemStatus.DISCONNECTED
            logger.info(f"تم قطع اتصال النظام: {system_name}")
            return True
        return False
    
    def get_connection_summary(self) -> Dict[str, Any]:
        """
        الحصول على ملخص الاتصالات
        
        Returns:
            dict: ملخص الاتصالات
        """
        connected_count = sum(
            1 for sys_info in self.connected_systems.values()
            if sys_info.get("status") == SystemStatus.CONNECTED
        )
        
        return {
            "total_systems": len(self.connected_systems),
            "connected": connected_count,
            "disconnected": len(self.connected_systems) - connected_count,
            "status": self.status.value,
            "systems": {
                name: {
                    "status": info.get("status").value if isinstance(info.get("status"), SystemStatus) else str(info.get("status")),
                    "type": info.get("type", "unknown"),
                    "connected_at": info.get("connected_at").isoformat() if info.get("connected_at") else None
                }
                for name, info in self.connected_systems.items()
            }
        }


async def main():
    """اختبار موصل الأنظمة"""
    connector = SystemConnector()
    
    # ربط جميع الأنظمة
    results = await connector.connect_all_systems()
    
    # عرض النتائج
    print("\n📊 نتائج الربط:")
    for system_name, success in results.items():
        status = "✅" if success else "❌"
        print(f"  {status} {system_name}: {'متصل' if success else 'فشل'}")
    
    # عرض الملخص
    summary = connector.get_connection_summary()
    print(f"\n📈 الملخص:")
    print(f"  الأنظمة المربوطة: {summary['connected']}/{summary['total_systems']}")
    print(f"  الحالة العامة: {summary['status']}")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    asyncio.run(main())
