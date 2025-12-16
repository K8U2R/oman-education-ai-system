"""
Test Automation Module
أتمتة الاختبارات
"""

from .test_orchestrator import TestOrchestrator, TestType, TestStatus
from .os_integration import OSIntegrationLayer
from .result_collector import ResultCollector, TestResult

__all__ = [
    "TestOrchestrator",
    "TestType",
    "TestStatus",
    "OSIntegrationLayer",
    "ResultCollector",
    "TestResult",
]

