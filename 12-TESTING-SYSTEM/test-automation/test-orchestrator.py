"""
Test Orchestrator
test-orchestrator.py

منسق الاختبارات الرئيسي - يدير تنفيذ جميع أنواع الاختبارات
Main test orchestrator - manages execution of all test types
"""

import asyncio
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum
import json

# إعداد التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class TestType(Enum):
    """أنواع الاختبارات"""
    UNIT = "unit"
    INTEGRATION = "integration"
    SYSTEM = "system"
    PERFORMANCE = "performance"
    SECURITY = "security"
    E2E = "e2e"


class TestStatus(Enum):
    """حالات الاختبار"""
    PENDING = "pending"
    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"
    SKIPPED = "skipped"
    ERROR = "error"


class TestOrchestrator:
    """
    منسق الاختبارات الرئيسي
    يدير تنفيذ جميع أنواع الاختبارات مع التكامل مع نظام التشغيل
    """
    
    def __init__(self, project_root: Optional[Path] = None):
        """
        تهيئة منسق الاختبارات
        
        Args:
            project_root: مسار جذر المشروع
        """
        self.project_root = project_root or Path(__file__).parent.parent.parent
        self.test_results: Dict[str, Any] = {}
        self.running_tests: Dict[str, Dict] = {}
        self.os_integration = None  # سيتم تهيئته لاحقاً
        
    async def initialize(self):
        """تهيئة المنسق"""
        try:
            # استيراد طبقة التكامل مع نظام التشغيل
            from .os_integration import OSIntegrationLayer
            self.os_integration = OSIntegrationLayer(self.project_root)
            await self.os_integration.initialize()
            logger.info("✅ تم تهيئة منسق الاختبارات بنجاح")
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة منسق الاختبارات: {e}")
            raise
    
    async def run_all_tests(
        self,
        test_types: Optional[List[TestType]] = None,
        parallel: bool = True,
        timeout: int = 300
    ) -> Dict[str, Any]:
        """
        تشغيل جميع الاختبارات
        
        Args:
            test_types: أنواع الاختبارات المطلوبة (None = جميع الأنواع)
            parallel: تشغيل متوازي
            timeout: مهلة زمنية بالثواني
            
        Returns:
            نتائج الاختبارات
        """
        if test_types is None:
            test_types = list(TestType)
        
        logger.info(f"🚀 بدء تشغيل {len(test_types)} نوع اختبار...")
        
        # إعلام نظام التشغيل ببدء الاختبارات
        if self.os_integration:
            await self.os_integration.notify_test_start(test_types)
        
        results = {}
        
        if parallel:
            # تشغيل متوازي
            tasks = []
            for test_type in test_types:
                task = self._run_test_type(test_type, timeout)
                tasks.append(task)
            
            results_list = await asyncio.gather(*tasks, return_exceptions=True)
            
            for test_type, result in zip(test_types, results_list):
                if isinstance(result, Exception):
                    results[test_type.value] = {
                        "status": TestStatus.ERROR.value,
                        "error": str(result)
                    }
                else:
                    results[test_type.value] = result
        else:
            # تشغيل متسلسل
            for test_type in test_types:
                result = await self._run_test_type(test_type, timeout)
                results[test_type.value] = result
        
        # إعلام نظام التشغيل بانتهاء الاختبارات
        if self.os_integration:
            await self.os_integration.notify_test_complete(results)
        
        return results
    
    async def _run_test_type(
        self,
        test_type: TestType,
        timeout: int
    ) -> Dict[str, Any]:
        """
        تشغيل نوع اختبار محدد
        
        Args:
            test_type: نوع الاختبار
            timeout: مهلة زمنية
            
        Returns:
            نتائج الاختبار
        """
        test_id = f"{test_type.value}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        logger.info(f"📋 بدء اختبار: {test_type.value} (ID: {test_id})")
        
        # تسجيل بدء الاختبار
        self.running_tests[test_id] = {
            "type": test_type.value,
            "status": TestStatus.RUNNING.value,
            "start_time": datetime.now().isoformat()
        }
        
        # مراقبة من نظام التشغيل
        if self.os_integration:
            await self.os_integration.monitor_test(test_id, test_type.value)
        
        try:
            # تشغيل الاختبار حسب النوع
            if test_type == TestType.UNIT:
                result = await self._run_unit_tests()
            elif test_type == TestType.INTEGRATION:
                result = await self._run_integration_tests()
            elif test_type == TestType.SYSTEM:
                result = await self._run_system_tests()
            elif test_type == TestType.PERFORMANCE:
                result = await self._run_performance_tests()
            elif test_type == TestType.SECURITY:
                result = await self._run_security_tests()
            elif test_type == TestType.E2E:
                result = await self._run_e2e_tests()
            else:
                result = {"status": TestStatus.SKIPPED.value, "reason": "Unknown test type"}
            
            # تحديث النتائج
            result["test_id"] = test_id
            result["end_time"] = datetime.now().isoformat()
            result["duration"] = (
                datetime.fromisoformat(result["end_time"]) -
                datetime.fromisoformat(self.running_tests[test_id]["start_time"])
            ).total_seconds()
            
            self.running_tests[test_id].update(result)
            self.test_results[test_id] = result
            
            logger.info(f"✅ اكتمل اختبار: {test_type.value} - {result.get('status', 'unknown')}")
            
            return result
            
        except asyncio.TimeoutError:
            error_result = {
                "test_id": test_id,
                "status": TestStatus.ERROR.value,
                "error": f"Timeout after {timeout} seconds"
            }
            self.running_tests[test_id].update(error_result)
            logger.error(f"⏱️ انتهت مهلة اختبار: {test_type.value}")
            return error_result
            
        except Exception as e:
            error_result = {
                "test_id": test_id,
                "status": TestStatus.ERROR.value,
                "error": str(e)
            }
            self.running_tests[test_id].update(error_result)
            logger.error(f"❌ خطأ في اختبار {test_type.value}: {e}")
            return error_result
    
    async def _run_unit_tests(self) -> Dict[str, Any]:
        """تشغيل اختبارات الوحدات"""
        from ..unit_testing.test_runner import TestRunner
        
        runner = TestRunner(self.project_root)
        result = await runner.run_all()
        
        return {
            "status": TestStatus.PASSED.value if result.get("passed", False) else TestStatus.FAILED.value,
            "total": result.get("total", 0),
            "passed": result.get("passed", 0),
            "failed": result.get("failed", 0),
            "coverage": result.get("coverage", 0)
        }
    
    async def _run_integration_tests(self) -> Dict[str, Any]:
        """تشغيل اختبارات التكامل"""
        # سيتم تنفيذها لاحقاً
        return {
            "status": TestStatus.PENDING.value,
            "message": "Integration tests not yet implemented"
        }
    
    async def _run_system_tests(self) -> Dict[str, Any]:
        """تشغيل اختبارات النظام"""
        # سيتم تنفيذها لاحقاً
        return {
            "status": TestStatus.PENDING.value,
            "message": "System tests not yet implemented"
        }
    
    async def _run_performance_tests(self) -> Dict[str, Any]:
        """تشغيل اختبارات الأداء"""
        # سيتم تنفيذها لاحقاً
        return {
            "status": TestStatus.PENDING.value,
            "message": "Performance tests not yet implemented"
        }
    
    async def _run_security_tests(self) -> Dict[str, Any]:
        """تشغيل اختبارات الأمان"""
        # سيتم تنفيذها لاحقاً
        return {
            "status": TestStatus.PENDING.value,
            "message": "Security tests not yet implemented"
        }
    
    async def _run_e2e_tests(self) -> Dict[str, Any]:
        """تشغيل اختبارات E2E"""
        # سيتم تنفيذها لاحقاً
        return {
            "status": TestStatus.PENDING.value,
            "message": "E2E tests not yet implemented"
        }
    
    def get_test_status(self, test_id: str) -> Optional[Dict[str, Any]]:
        """الحصول على حالة اختبار محدد"""
        return self.running_tests.get(test_id) or self.test_results.get(test_id)
    
    def get_all_results(self) -> Dict[str, Any]:
        """الحصول على جميع النتائج"""
        return {
            "results": self.test_results,
            "running": self.running_tests,
            "summary": self._generate_summary()
        }
    
    def _generate_summary(self) -> Dict[str, Any]:
        """إنشاء ملخص النتائج"""
        total = len(self.test_results)
        passed = sum(1 for r in self.test_results.values() if r.get("status") == TestStatus.PASSED.value)
        failed = sum(1 for r in self.test_results.values() if r.get("status") == TestStatus.FAILED.value)
        
        return {
            "total": total,
            "passed": passed,
            "failed": failed,
            "success_rate": (passed / total * 100) if total > 0 else 0
        }
    
    async def shutdown(self):
        """إيقاف المنسق"""
        if self.os_integration:
            await self.os_integration.shutdown()
        logger.info("🛑 تم إيقاف منسق الاختبارات")


# مثال على الاستخدام
async def main():
    """مثال على استخدام المنسق"""
    orchestrator = TestOrchestrator()
    await orchestrator.initialize()
    
    # تشغيل جميع الاختبارات
    results = await orchestrator.run_all_tests()
    
    print(json.dumps(results, indent=2, ensure_ascii=False))
    
    await orchestrator.shutdown()


if __name__ == "__main__":
    asyncio.run(main())

