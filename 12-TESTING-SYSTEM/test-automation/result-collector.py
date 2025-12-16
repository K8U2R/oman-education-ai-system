"""
Result Collector
result-collector.py

جامع نتائج الاختبارات - يجمع وينظم نتائج جميع الاختبارات
Test result collector - collects and organizes all test results
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass, asdict

# إعداد التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class TestResult:
    """نتيجة اختبار واحدة"""
    test_id: str
    test_type: str
    status: str
    duration: float
    start_time: str
    end_time: str
    details: Dict[str, Any]
    metrics: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class ResultCollector:
    """
    جامع نتائج الاختبارات
    يجمع وينظم نتائج جميع الاختبارات
    """
    
    def __init__(self, output_dir: Optional[Path] = None):
        """
        تهيئة جامع النتائج
        
        Args:
            output_dir: مجلد حفظ النتائج
        """
        self.output_dir = output_dir or Path(__file__).parent.parent / "test-reports"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        self.results: List[TestResult] = []
        self.summary: Dict[str, Any] = {}
        
    def add_result(self, result: TestResult):
        """
        إضافة نتيجة اختبار
        
        Args:
            result: نتيجة الاختبار
        """
        self.results.append(result)
        logger.debug(f"✅ تمت إضافة نتيجة: {result.test_id}")
    
    def collect_from_orchestrator(self, orchestrator_results: Dict[str, Any]):
        """
        جمع النتائج من المنسق
        
        Args:
            orchestrator_results: نتائج المنسق
        """
        for test_type, result_data in orchestrator_results.items():
            if isinstance(result_data, dict) and "test_id" in result_data:
                result = TestResult(
                    test_id=result_data.get("test_id", ""),
                    test_type=test_type,
                    status=result_data.get("status", "unknown"),
                    duration=result_data.get("duration", 0),
                    start_time=result_data.get("start_time", ""),
                    end_time=result_data.get("end_time", ""),
                    details=result_data,
                    metrics=result_data.get("metrics"),
                    error=result_data.get("error")
                )
                self.add_result(result)
    
    def generate_summary(self) -> Dict[str, Any]:
        """
        إنشاء ملخص النتائج
        
        Returns:
            ملخص النتائج
        """
        total = len(self.results)
        
        if total == 0:
            return {
                "total": 0,
                "message": "لا توجد نتائج"
            }
        
        passed = sum(1 for r in self.results if r.status == "passed")
        failed = sum(1 for r in self.results if r.status == "failed")
        error = sum(1 for r in self.results if r.status == "error")
        skipped = sum(1 for r in self.results if r.status == "skipped")
        
        total_duration = sum(r.duration for r in self.results)
        
        # تجميع حسب النوع
        by_type = {}
        for result in self.results:
            if result.test_type not in by_type:
                by_type[result.test_type] = {"total": 0, "passed": 0, "failed": 0}
            by_type[result.test_type]["total"] += 1
            if result.status == "passed":
                by_type[result.test_type]["passed"] += 1
            elif result.status == "failed":
                by_type[result.test_type]["failed"] += 1
        
        self.summary = {
            "total": total,
            "passed": passed,
            "failed": failed,
            "error": error,
            "skipped": skipped,
            "success_rate": (passed / total * 100) if total > 0 else 0,
            "total_duration": total_duration,
            "average_duration": total_duration / total if total > 0 else 0,
            "by_type": by_type,
            "timestamp": datetime.now().isoformat()
        }
        
        return self.summary
    
    def save_results(self, filename: Optional[str] = None) -> Path:
        """
        حفظ النتائج في ملف
        
        Args:
            filename: اسم الملف (اختياري)
            
        Returns:
            مسار الملف المحفوظ
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"test_results_{timestamp}.json"
        
        file_path = self.output_dir / filename
        
        # إنشاء ملخص
        summary = self.generate_summary()
        
        # تجميع البيانات
        data = {
            "summary": summary,
            "results": [asdict(r) for r in self.results]
        }
        
        # حفظ في ملف JSON
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"💾 تم حفظ النتائج في: {file_path}")
        
        return file_path
    
    def load_results(self, filename: str) -> Dict[str, Any]:
        """
        تحميل النتائج من ملف
        
        Args:
            filename: اسم الملف
            
        Returns:
            البيانات المحملة
        """
        file_path = self.output_dir / filename
        
        if not file_path.exists():
            logger.error(f"❌ الملف غير موجود: {file_path}")
            return {}
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # إعادة بناء النتائج
        self.results = [
            TestResult(**r) for r in data.get("results", [])
        ]
        self.summary = data.get("summary", {})
        
        logger.info(f"📂 تم تحميل النتائج من: {file_path}")
        
        return data
    
    def get_failed_tests(self) -> List[TestResult]:
        """الحصول على الاختبارات الفاشلة"""
        return [r for r in self.results if r.status in ["failed", "error"]]
    
    def get_passed_tests(self) -> List[TestResult]:
        """الحصول على الاختبارات الناجحة"""
        return [r for r in self.results if r.status == "passed"]
    
    def get_tests_by_type(self, test_type: str) -> List[TestResult]:
        """الحصول على الاختبارات حسب النوع"""
        return [r for r in self.results if r.test_type == test_type]


# مثال على الاستخدام
def main():
    """مثال على استخدام جامع النتائج"""
    collector = ResultCollector()
    
    # إضافة نتائج تجريبية
    result1 = TestResult(
        test_id="test_001",
        test_type="unit",
        status="passed",
        duration=1.23,
        start_time=datetime.now().isoformat(),
        end_time=datetime.now().isoformat(),
        details={"total": 10, "passed": 10}
    )
    
    result2 = TestResult(
        test_id="test_002",
        test_type="integration",
        status="failed",
        duration=5.67,
        start_time=datetime.now().isoformat(),
        end_time=datetime.now().isoformat(),
        details={"total": 5, "passed": 3, "failed": 2},
        error="Connection timeout"
    )
    
    collector.add_result(result1)
    collector.add_result(result2)
    
    # إنشاء ملخص
    summary = collector.generate_summary()
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    
    # حفظ النتائج
    file_path = collector.save_results()
    print(f"✅ تم حفظ النتائج في: {file_path}")


if __name__ == "__main__":
    main()

