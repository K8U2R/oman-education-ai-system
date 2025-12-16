"""
Circuit Breaker
circuit-breaker.py

قاطع الدائرة - حماية من الفشل المتكرر
Circuit Breaker - Protection from repeated failures
"""

import asyncio
import logging
from typing import Callable, Any, Optional
from datetime import datetime, timedelta
from enum import Enum

logger = logging.getLogger(__name__)


class CircuitState(Enum):
    """حالة قاطع الدائرة"""
    CLOSED = "closed"  # مغلق - يعمل بشكل طبيعي
    OPEN = "open"  # مفتوح - متوقف عن العمل
    HALF_OPEN = "half_open"  # نصف مفتوح - اختبار


class CircuitBreaker:
    """
    قاطع الدائرة
    يحمي من الفشل المتكرر في الاتصالات
    """
    
    def __init__(
        self,
        failure_threshold: int = 5,
        timeout: float = 60.0,
        expected_exception: type = Exception
    ):
        """
        تهيئة قاطع الدائرة
        
        Args:
            failure_threshold: عدد الأخطاء قبل الفتح
            timeout: الوقت بالثواني قبل محاولة إعادة الاتصال
            expected_exception: نوع الاستثناء المتوقع
        """
        self.name = "Circuit Breaker"
        self.version = "1.0.0"
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.expected_exception = expected_exception
        
        # الحالة
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time: Optional[datetime] = None
        self.success_count = 0
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def call(self, func: Callable, *args, **kwargs) -> Any:
        """
        استدعاء دالة مع حماية قاطع الدائرة
        
        Args:
            func: الدالة المراد استدعاؤها
            *args: وسائط الدالة
            **kwargs: وسائط الدالة المسماة
            
        Returns:
            نتيجة الدالة
            
        Raises:
            Exception: إذا كان القاطع مفتوحاً أو فشلت الدالة
        """
        # التحقق من الحالة
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitState.HALF_OPEN
                logger.info("🔄 تحول القاطع إلى حالة نصف مفتوح")
            else:
                raise Exception(f"قاطع الدائرة مفتوح - انتظر {self.timeout} ثانية")
        
        # محاولة الاستدعاء
        try:
            if asyncio.iscoroutinefunction(func):
                result = await func(*args, **kwargs)
            else:
                result = func(*args, **kwargs)
            
            # نجح الاستدعاء
            self._on_success()
            return result
            
        except self.expected_exception as e:
            # فشل الاستدعاء
            self._on_failure()
            raise
    
    def _on_success(self):
        """معالجة النجاح"""
        if self.state == CircuitState.HALF_OPEN:
            # نجح في حالة نصف مفتوح - إغلاق القاطع
            self.state = CircuitState.CLOSED
            self.failure_count = 0
            logger.info("✅ تم إغلاق قاطع الدائرة بعد النجاح")
        
        self.success_count += 1
    
    def _on_failure(self):
        """معالجة الفشل"""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            if self.state != CircuitState.OPEN:
                self.state = CircuitState.OPEN
                logger.warning(f"⚠️ تم فتح قاطع الدائرة بعد {self.failure_count} أخطاء")
    
    def _should_attempt_reset(self) -> bool:
        """التحقق من إمكانية إعادة المحاولة"""
        if self.last_failure_time is None:
            return True
        
        elapsed = (datetime.now() - self.last_failure_time).total_seconds()
        return elapsed >= self.timeout
    
    def reset(self):
        """إعادة تعيين قاطع الدائرة"""
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = None
        logger.info("🔄 تم إعادة تعيين قاطع الدائرة")
    
    def get_state(self) -> dict:
        """الحصول على حالة قاطع الدائرة"""
        return {
            "state": self.state.value,
            "failure_count": self.failure_count,
            "success_count": self.success_count,
            "last_failure_time": self.last_failure_time.isoformat() if self.last_failure_time else None
        }

