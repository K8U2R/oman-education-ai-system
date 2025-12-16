"""
Test Runner
test-runner.py

منفذ اختبارات الوحدات الرئيسي
Main unit test runner
"""

import asyncio
import subprocess
import logging
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


class TestRunner:
    """
    منفذ اختبارات الوحدات
    يستخدم pytest لتنفيذ الاختبارات
    """
    
    def __init__(self, project_root: Optional[Path] = None):
        """
        تهيئة منفذ الاختبارات
        
        Args:
            project_root: مسار جذر المشروع
        """
        self.project_root = project_root or Path(__file__).parent.parent.parent
        self.test_dirs = [
            self.project_root / "01-OPERATING-SYSTEM" / "tests",
            self.project_root / "02-SYSTEM-INTEGRATION" / "tests",
            self.project_root / "06-DATABASE-SYSTEM" / "tests",
        ]
        
    async def run_all(self, coverage: bool = True) -> Dict[str, Any]:
        """
        تشغيل جميع اختبارات الوحدات
        
        Args:
            coverage: حساب التغطية
            
        Returns:
            نتائج الاختبارات
        """
        logger.info("🚀 بدء تشغيل اختبارات الوحدات...")
        
        results = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "errors": 0,
            "coverage": 0,
            "duration": 0,
            "tests": []
        }
        
        start_time = datetime.now()
        
        for test_dir in self.test_dirs:
            if test_dir.exists():
                dir_results = await self._run_tests_in_dir(test_dir, coverage)
                results["total"] += dir_results.get("total", 0)
                results["passed"] += dir_results.get("passed", 0)
                results["failed"] += dir_results.get("failed", 0)
                results["skipped"] += dir_results.get("skipped", 0)
                results["errors"] += dir_results.get("errors", 0)
                results["tests"].extend(dir_results.get("tests", []))
        
        end_time = datetime.now()
        results["duration"] = (end_time - start_time).total_seconds()
        
        # حساب معدل النجاح
        if results["total"] > 0:
            results["success_rate"] = (results["passed"] / results["total"]) * 100
        else:
            results["success_rate"] = 0
        
        logger.info(f"✅ اكتملت اختبارات الوحدات: {results['passed']}/{results['total']} نجح")
        
        return results
    
    async def _run_tests_in_dir(
        self,
        test_dir: Path,
        coverage: bool = True
    ) -> Dict[str, Any]:
        """
        تشغيل الاختبارات في مجلد محدد
        
        Args:
            test_dir: مجلد الاختبارات
            coverage: حساب التغطية
            
        Returns:
            نتائج الاختبارات
        """
        logger.info(f"📁 تشغيل الاختبارات في: {test_dir}")
        
        # بناء أمر pytest
        cmd = ["pytest", str(test_dir), "-v", "--tb=short"]
        
        if coverage:
            # حساب التغطية
            source_dir = test_dir.parent
            cmd.extend([
                "--cov", str(source_dir),
                "--cov-report", "json",
                "--cov-report", "term"
            ])
        
        try:
            # تشغيل pytest
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(self.project_root)
            )
            
            stdout, stderr = await process.communicate()
            
            # تحليل النتائج
            results = self._parse_pytest_output(stdout.decode(), stderr.decode())
            
            # إضافة معلومات المجلد
            results["test_dir"] = str(test_dir)
            
            return results
            
        except Exception as e:
            logger.error(f"❌ خطأ في تشغيل الاختبارات: {e}")
            return {
                "total": 0,
                "passed": 0,
                "failed": 0,
                "skipped": 0,
                "errors": 1,
                "error_message": str(e),
                "tests": []
            }
    
    def _parse_pytest_output(
        self,
        stdout: str,
        stderr: str
    ) -> Dict[str, Any]:
        """
        تحليل مخرجات pytest
        
        Args:
            stdout: المخرجات القياسية
            stderr: مخرجات الأخطاء
            
        Returns:
            نتائج منظمة
        """
        results = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "errors": 0,
            "tests": []
        }
        
        # تحليل المخرجات
        lines = stdout.split('\n')
        
        for line in lines:
            # البحث عن معلومات الاختبارات
            if "passed" in line.lower() and "failed" in line.lower():
                # مثال: "5 passed, 2 failed in 1.23s"
                parts = line.split()
                for i, part in enumerate(parts):
                    if part == "passed":
                        try:
                            results["passed"] = int(parts[i-1])
                        except:
                            pass
                    elif part == "failed":
                        try:
                            results["failed"] = int(parts[i-1])
                        except:
                            pass
            
            # البحث عن معلومات التغطية
            if "TOTAL" in line and "coverage" in stdout.lower():
                # استخراج نسبة التغطية
                try:
                    coverage_line = [l for l in lines if "TOTAL" in l][0]
                    parts = coverage_line.split()
                    for part in parts:
                        if "%" in part:
                            results["coverage"] = float(part.replace("%", ""))
                            break
                except:
                    pass
        
        results["total"] = results["passed"] + results["failed"] + results["skipped"]
        
        return results
    
    async def run_specific_test(
        self,
        test_path: str,
        coverage: bool = False
    ) -> Dict[str, Any]:
        """
        تشغيل اختبار محدد
        
        Args:
            test_path: مسار الاختبار
            coverage: حساب التغطية
            
        Returns:
            نتائج الاختبار
        """
        logger.info(f"🎯 تشغيل اختبار محدد: {test_path}")
        
        cmd = ["pytest", test_path, "-v"]
        
        if coverage:
            source_dir = Path(test_path).parent.parent
            cmd.extend([
                "--cov", str(source_dir),
                "--cov-report", "term"
            ])
        
        try:
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(self.project_root)
            )
            
            stdout, stderr = await process.communicate()
            
            return {
                "test_path": test_path,
                "stdout": stdout.decode(),
                "stderr": stderr.decode(),
                "return_code": process.returncode,
                "passed": process.returncode == 0
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في تشغيل الاختبار: {e}")
            return {
                "test_path": test_path,
                "error": str(e),
                "passed": False
            }


# مثال على الاستخدام
async def main():
    """مثال على استخدام منفذ الاختبارات"""
    runner = TestRunner()
    results = await runner.run_all(coverage=True)
    
    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
