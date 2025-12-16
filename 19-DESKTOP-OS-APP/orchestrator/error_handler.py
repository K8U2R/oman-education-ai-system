"""
معالج الأخطاء مع Retry Logic
Error Handler with Retry Logic
"""

import time
import logging
from typing import Callable, Optional, Any, TypeVar, Tuple
from functools import wraps
from enum import Enum

T = TypeVar('T')


class RetryStrategy(Enum):
    """استراتيجية إعادة المحاولة"""
    LINEAR = "linear"  # زيادة خطية
    EXPONENTIAL = "exponential"  # زيادة أسية
    FIXED = "fixed"  # ثابت


class ErrorHandler:
    """معالج الأخطاء مع إعادة المحاولة"""
    
    def __init__(self, max_retries: int = 3, base_delay: float = 1.0, 
                 strategy: RetryStrategy = RetryStrategy.EXPONENTIAL):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.strategy = strategy
        self.logger = logging.getLogger(__name__)
    
    def calculate_delay(self, attempt: int) -> float:
        """حساب التأخير حسب الاستراتيجية"""
        if self.strategy == RetryStrategy.FIXED:
            return self.base_delay
        elif self.strategy == RetryStrategy.LINEAR:
            return self.base_delay * attempt
        else:  # EXPONENTIAL
            return self.base_delay * (2 ** (attempt - 1))
    
    def retry(self, func: Callable[[], T], error_message: str = "فشلت العملية") -> Tuple[Optional[T], Optional[Exception]]:
        """
        تنفيذ دالة مع إعادة المحاولة
        
        Returns:
            Tuple[result, error]: النتيجة والخطأ إن وجد
        """
        last_error = None
        
        for attempt in range(1, self.max_retries + 1):
            try:
                result = func()
                if attempt > 1:
                    self.logger.info(f"نجحت العملية بعد {attempt} محاولات")
                return result, None
            except Exception as e:
                last_error = e
                if attempt < self.max_retries:
                    delay = self.calculate_delay(attempt)
                    self.logger.warning(
                        f"{error_message} (محاولة {attempt}/{self.max_retries}): {str(e)}. "
                        f"إعادة المحاولة بعد {delay:.1f} ثانية..."
                    )
                    time.sleep(delay)
                else:
                    self.logger.error(f"{error_message} بعد {self.max_retries} محاولات: {str(e)}")
        
        return None, last_error
    
    def retry_async(self, func: Callable, error_message: str = "فشلت العملية"):
        """تنفيذ دالة async مع إعادة المحاولة"""
        import asyncio
        
        async def wrapper():
            last_error = None
            
            for attempt in range(1, self.max_retries + 1):
                try:
                    result = await func()
                    if attempt > 1:
                        self.logger.info(f"نجحت العملية بعد {attempt} محاولات")
                    return result, None
                except Exception as e:
                    last_error = e
                    if attempt < self.max_retries:
                        delay = self.calculate_delay(attempt)
                        self.logger.warning(
                            f"{error_message} (محاولة {attempt}/{self.max_retries}): {str(e)}. "
                            f"إعادة المحاولة بعد {delay:.1f} ثانية..."
                        )
                        await asyncio.sleep(delay)
                    else:
                        self.logger.error(f"{error_message} بعد {self.max_retries} محاولات: {str(e)}")
            
            return None, last_error
        
        return wrapper()


def retry_on_error(max_retries: int = 3, delay: float = 1.0, 
                   strategy: RetryStrategy = RetryStrategy.EXPONENTIAL):
    """
    Decorator لإعادة المحاولة عند الخطأ
    
    Usage:
        @retry_on_error(max_retries=3, delay=1.0)
        def my_function():
            ...
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            handler = ErrorHandler(max_retries, delay, strategy)
            result, error = handler.retry(
                lambda: func(*args, **kwargs),
                f"فشل تنفيذ {func.__name__}"
            )
            if error:
                raise error
            return result
        return wrapper
    return decorator

