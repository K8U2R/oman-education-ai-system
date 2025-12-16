"""
Testing System (12-TESTING-SYSTEM)
نظام الاختبار والتكامل

نظام اختبار متكامل وآلي يغطي جميع طبقات المشروع
"""

__version__ = "1.0.0"
__author__ = "Oman Education AI System Team"

# استيراد المكونات الرئيسية
from .test_automation.test_orchestrator import TestOrchestrator, TestType, TestStatus
from .test_automation.os_integration import OSIntegrationLayer
from .test_automation.result_collector import ResultCollector, TestResult
from .unit_testing.test_runner import TestRunner

__all__ = [
    "TestOrchestrator",
    "TestType",
    "TestStatus",
    "OSIntegrationLayer",
    "ResultCollector",
    "TestResult",
    "TestRunner",
]
