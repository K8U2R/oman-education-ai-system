"""
Dependency Manager
dependency-manager.py

مدير التبعيات - إدارة التبعيات بين الأنظمة
Dependency Manager - Manages dependencies between systems

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, List, Set, Optional, Any
from datetime import datetime
from enum import Enum
from dataclasses import dataclass

logger = logging.getLogger(__name__)


class DependencyStatus(Enum):
    """حالة التبعية"""
    SATISFIED = "satisfied"
    UNSATISFIED = "unsatisfied"
    CHECKING = "checking"
    ERROR = "error"


@dataclass
class Dependency:
    """تبعية"""
    name: str
    required_by: str
    required_system: str
    status: DependencyStatus = DependencyStatus.UNSATISFIED
    checked_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """تحويل التبعية إلى dict"""
        return {
            "name": self.name,
            "required_by": self.required_by,
            "required_system": self.required_system,
            "status": self.status.value,
            "checked_at": self.checked_at.isoformat() if self.checked_at else None
        }


class DependencyManager:
    """
    مدير التبعيات
    يدير التبعيات بين الأنظمة المختلفة
    
    Dependency Manager
    Manages dependencies between different systems
    """
    
    def __init__(self):
        """تهيئة مدير التبعيات"""
        self.name = "Dependency Manager"
        self.version = "1.0.0"
        
        # التبعيات المسجلة
        self.dependencies: Dict[str, Dependency] = {}
        
        # خريطة التبعيات (النظام → قائمة التبعيات)
        self.system_dependencies: Dict[str, List[str]] = {}
        
        # حالة الأنظمة
        self.system_status: Dict[str, bool] = {}
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    def register_dependency(
        self,
        name: str,
        required_by: str,
        required_system: str
    ) -> bool:
        """
        تسجيل تبعية جديدة
        
        Args:
            name: اسم التبعية
            required_by: النظام الذي يحتاجها
            required_system: النظام المطلوب
            
        Returns:
            bool: True إذا نجح التسجيل
        """
        try:
            dependency = Dependency(
                name=name,
                required_by=required_by,
                required_system=required_system,
                status=DependencyStatus.UNSATISFIED
            )
            
            self.dependencies[name] = dependency
            
            # إضافة إلى خريطة التبعيات
            if required_by not in self.system_dependencies:
                self.system_dependencies[required_by] = []
            self.system_dependencies[required_by].append(name)
            
            logger.info(f"✅ تم تسجيل تبعية: {name} ({required_by} → {required_system})")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في تسجيل التبعية {name}: {e}")
            return False
    
    async def check_dependency(self, dependency_name: str, system_connector: Any) -> bool:
        """
        فحص تبعية
        
        Args:
            dependency_name: اسم التبعية
            system_connector: موصل الأنظمة للتحقق من الاتصال
            
        Returns:
            bool: True إذا كانت التبعية محققة
        """
        if dependency_name not in self.dependencies:
            logger.warning(f"التبعية غير موجودة: {dependency_name}")
            return False
        
        dependency = self.dependencies[dependency_name]
        dependency.status = DependencyStatus.CHECKING
        dependency.checked_at = datetime.now()
        
        try:
            # التحقق من اتصال النظام المطلوب
            if system_connector and hasattr(system_connector, 'is_system_connected'):
                is_connected = system_connector.is_system_connected(dependency.required_system)
                
                if is_connected:
                    dependency.status = DependencyStatus.SATISFIED
                    self.system_status[dependency.required_system] = True
                    logger.info(f"✅ التبعية محققة: {dependency_name}")
                    return True
                else:
                    dependency.status = DependencyStatus.UNSATISFIED
                    self.system_status[dependency.required_system] = False
                    logger.warning(f"⚠️ التبعية غير محققة: {dependency_name}")
                    return False
            else:
                # افتراض أن التبعية محققة إذا لم يكن هناك موصل
                dependency.status = DependencyStatus.SATISFIED
                logger.info(f"✅ التبعية محققة (بدون فحص): {dependency_name}")
                return True
                
        except Exception as e:
            logger.error(f"❌ خطأ في فحص التبعية {dependency_name}: {e}")
            dependency.status = DependencyStatus.ERROR
            return False
    
    async def check_all_dependencies(self, system_connector: Any) -> Dict[str, bool]:
        """
        فحص جميع التبعيات
        
        Args:
            system_connector: موصل الأنظمة
            
        Returns:
            dict: نتائج فحص التبعيات
        """
        logger.info("🔍 بدء فحص جميع التبعيات...")
        
        results = {}
        for dependency_name in self.dependencies:
            results[dependency_name] = await self.check_dependency(dependency_name, system_connector)
        
        satisfied_count = sum(results.values())
        logger.info(f"✅ اكتمل فحص التبعيات: {satisfied_count}/{len(results)} محققة")
        
        return results
    
    def get_dependencies_for_system(self, system_name: str) -> List[Dependency]:
        """
        الحصول على تبعيات نظام معين
        
        Args:
            system_name: اسم النظام
            
        Returns:
            list: قائمة التبعيات
        """
        if system_name in self.system_dependencies:
            return [
                self.dependencies[dep_name]
                for dep_name in self.system_dependencies[system_name]
                if dep_name in self.dependencies
            ]
        return []
    
    def get_unsatisfied_dependencies(self) -> List[Dependency]:
        """
        الحصول على التبعيات غير المحققة
        
        Returns:
            list: قائمة التبعيات غير المحققة
        """
        return [
            dep for dep in self.dependencies.values()
            if dep.status == DependencyStatus.UNSATISFIED
        ]
    
    def can_system_start(self, system_name: str) -> bool:
        """
        التحقق من إمكانية بدء نظام
        
        Args:
            system_name: اسم النظام
            
        Returns:
            bool: True إذا كان يمكن بدء النظام
        """
        dependencies = self.get_dependencies_for_system(system_name)
        
        if not dependencies:
            return True  # لا توجد تبعيات
        
        # التحقق من أن جميع التبعيات محققة
        return all(
            dep.status == DependencyStatus.SATISFIED
            for dep in dependencies
        )
    
    def get_dependency_summary(self) -> Dict[str, Any]:
        """
        الحصول على ملخص التبعيات
        
        Returns:
            dict: ملخص التبعيات
        """
        total = len(self.dependencies)
        satisfied = sum(
            1 for dep in self.dependencies.values()
            if dep.status == DependencyStatus.SATISFIED
        )
        unsatisfied = sum(
            1 for dep in self.dependencies.values()
            if dep.status == DependencyStatus.UNSATISFIED
        )
        
        return {
            "total_dependencies": total,
            "satisfied": satisfied,
            "unsatisfied": unsatisfied,
            "systems": {
                system: {
                    "dependencies_count": len(deps),
                    "can_start": self.can_system_start(system)
                }
                for system, deps in self.system_dependencies.items()
            }
        }
    
    def register_system_dependencies(self):
        """تسجيل التبعيات الأساسية للأنظمة"""
        # تبعيات واجهة الويب
        self.register_dependency(
            name="web_interface_os",
            required_by="03-WEB-INTERFACE",
            required_system="01-OPERATING-SYSTEM"
        )
        
        # تبعيات نظام التشغيل (لا توجد حالياً)
        # يمكن إضافتها لاحقاً
        
        # تبعيات نواة الذكاء الاصطناعي
        self.register_dependency(
            name="ai_core_os",
            required_by="00-AI-CORE-SYSTEM",
            required_system="01-OPERATING-SYSTEM"
        )
        
        logger.info("✅ تم تسجيل التبعيات الأساسية")


async def main():
    """اختبار مدير التبعيات"""
    manager = DependencyManager()
    
    # تسجيل التبعيات
    manager.register_system_dependencies()
    
    # عرض التبعيات
    print("\n📋 التبعيات المسجلة:")
    for dep in manager.dependencies.values():
        print(f"  {dep.name}: {dep.required_by} → {dep.required_system} ({dep.status.value})")
    
    # عرض الملخص
    summary = manager.get_dependency_summary()
    print(f"\n📊 الملخص:")
    print(f"  إجمالي التبعيات: {summary['total_dependencies']}")
    print(f"  المحققة: {summary['satisfied']}")
    print(f"  غير المحققة: {summary['unsatisfied']}")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    asyncio.run(main())
