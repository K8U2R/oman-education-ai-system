"""
Retry Manager
retry-manager.py

مدير إعادة المحاولة - إعادة المحاولة التلقائية
Retry Manager - Automatic retry mechanism
"""

import asyncio
import logging
from typing import Callable, Any, Optional, List
from datetime import datetime
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    RetryError
)

logger = logging.getLogger(__name__)


class RetryManager:
    """
    مدير إعادة المحاولة
    يدير إعادة المحاولة التلقائية للعمليات الفاشلة
    """
    
    def __init__(
        self,
        max_attempts: int = 3,
        initial_delay: float = 1.0,
        max_delay: float = 60.0,
        exponential_base: float = 2.0
    ):
        """
        تهيئة مدير إعادة المحاولة
        
        Args:
            max_attempts: الحد الأقصى للمحاولات
            initial_delay: التأخير الأولي بالثواني
            max_delay: الحد الأقصى للتأخير بالثواني
            exponential_base: الأساس الأسي للتأخير
        """
        self.name = "Retry Manager"
        self.version = "1.0.0"
        self.max_attempts = max_attempts
        self.initial_delay = initial_delay
        self.max_delay = max_delay
        self.exponential_base = exponential_base
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def execute_with_retry(
        self,
        func: Callable,
        *args,
        retry_exceptions: tuple = (Exception,),
        **kwargs
    ) -> Any:
        """
        تنفيذ دالة مع إعادة المحاولة
        
        Args:
            func: الدالة المراد تنفيذها
            *args: وسائط الدالة
            retry_exceptions: أنواع الاستثناءات التي يجب إعادة المحاولة عندها
            **kwargs: وسائط الدالة المسماة
            
        Returns:
            نتيجة الدالة
            
        Raises:
            Exception: إذا فشلت جميع المحاولات
        """
        last_exception = None
        
        for attempt in range(1, self.max_attempts + 1):
            try:
                if asyncio.iscoroutinefunction(func):
                    result = await func(*args, **kwargs)
                else:
                    result = func(*args, **kwargs)
                
                if attempt > 1:
                    logger.info(f"✅ نجحت المحاولة {attempt} بعد {attempt - 1} فشل")
                
                return result
                
            except retry_exceptions as e:
                last_exception = e
                
                if attempt < self.max_attempts:
                    delay = min(
                        self.initial_delay * (self.exponential_base ** (attempt - 1)),
                        self.max_delay
                    )
                    logger.warning(
                        f"⚠️ فشلت المحاولة {attempt}/{self.max_attempts}: {e}. "
                        f"إعادة المحاولة بعد {delay:.2f} ثانية..."
                    )
                    await asyncio.sleep(delay)
                else:
                    logger.error(f"❌ فشلت جميع المحاولات ({self.max_attempts})")
                    raise
        
        if last_exception:
            raise last_exception
    
    def get_stats(self) -> dict:
        """الحصول على الإحصائيات"""
        return {
            "max_attempts": self.max_attempts,
            "initial_delay": self.initial_delay,
            "max_delay": self.max_delay,
            "exponential_base": self.exponential_base
        }

