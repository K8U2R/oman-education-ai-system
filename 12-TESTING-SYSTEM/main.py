"""
Main Entry Point for Testing System
main.py

نقطة البداية الرئيسية لنظام الاختبار
"""

import asyncio
import logging
import sys
from pathlib import Path

# إضافة مسار المشروع
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from test_automation.test_orchestrator import TestOrchestrator, TestType
from test_automation.result_collector import ResultCollector
import json

# إعداد التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def main():
    """الدالة الرئيسية"""
    print("🧪 نظام الاختبار والتكامل")
    print("=" * 50)
    
    try:
        # تهيئة المنسق
        orchestrator = TestOrchestrator(project_root=project_root)
        await orchestrator.initialize()
        
        # تهيئة جامع النتائج
        collector = ResultCollector()
        
        # تشغيل جميع الاختبارات
        print("\n🚀 بدء تشغيل جميع الاختبارات...")
        results = await orchestrator.run_all_tests(
            test_types=[TestType.UNIT],  # ابدأ باختبارات الوحدات
            parallel=False
        )
        
        # جمع النتائج
        collector.collect_from_orchestrator(results)
        
        # إنشاء ملخص
        summary = collector.generate_summary()
        
        print("\n📊 ملخص النتائج:")
        print(json.dumps(summary, indent=2, ensure_ascii=False))
        
        # حفظ النتائج
        report_path = collector.save_results()
        print(f"\n💾 تم حفظ التقرير في: {report_path}")
        
        # إيقاف المنسق
        await orchestrator.shutdown()
        
        print("\n✅ اكتمل تنفيذ الاختبارات!")
        
    except KeyboardInterrupt:
        print("\n⚠️ تم إيقاف الاختبارات بواسطة المستخدم")
    except Exception as e:
        logger.error(f"❌ خطأ في تنفيذ الاختبارات: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())

