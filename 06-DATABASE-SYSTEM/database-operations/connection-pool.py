"""
Connection Pool
connection-pool.py

تجمع الاتصالات - إدارة اتصالات قاعدة البيانات بكفاءة
Connection Pool - Efficient database connection management

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, Optional, Any, List
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass
from contextlib import asynccontextmanager
import asyncpg
from sqlalchemy.pool import QueuePool
from sqlalchemy import create_engine, pool

logger = logging.getLogger(__name__)


class ConnectionStatus(Enum):
    """حالة الاتصال"""
    IDLE = "idle"
    IN_USE = "in_use"
    ERROR = "error"
    CLOSED = "closed"


@dataclass
class ConnectionInfo:
    """معلومات الاتصال"""
    id: str
    status: ConnectionStatus
    created_at: datetime
    last_used: Optional[datetime] = None
    use_count: int = 0
    error_count: int = 0


class ConnectionPool:
    """
    تجمع الاتصالات
    يدير اتصالات قاعدة البيانات بكفاءة
    """
    
    def __init__(
        self,
        database_url: str,
        pool_size: int = 10,
        max_overflow: int = 20,
        pool_timeout: int = 30,
        pool_recycle: int = 3600
    ):
        """
        تهيئة تجمع الاتصالات
        
        Args:
            database_url: رابط قاعدة البيانات
            pool_size: حجم التجمع
            max_overflow: الحد الأقصى للاتصالات الإضافية
            pool_timeout: مهلة انتظار الاتصال (بالثواني)
            pool_recycle: إعادة تدوير الاتصال (بالثواني)
        """
        self.name = "Connection Pool"
        self.version = "1.0.0"
        self.database_url = database_url
        self.pool_size = pool_size
        self.max_overflow = max_overflow
        self.pool_timeout = pool_timeout
        self.pool_recycle = pool_recycle
        
        # Engine (SQLAlchemy)
        self.engine = None
        
        # AsyncPG Pool (للاتصالات غير المتزامنة)
        self.async_pool: Optional[asyncpg.Pool] = None
        
        # إحصائيات
        self.stats = {
            "total_connections": 0,
            "active_connections": 0,
            "idle_connections": 0,
            "failed_connections": 0,
            "total_queries": 0
        }
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def initialize(self):
        """تهيئة تجمع الاتصالات"""
        try:
            # تهيئة SQLAlchemy Engine
            self.engine = create_engine(
                self.database_url,
                poolclass=QueuePool,
                pool_size=self.pool_size,
                max_overflow=self.max_overflow,
                pool_timeout=self.pool_timeout,
                pool_recycle=self.pool_recycle,
                echo=False
            )
            
            # تهيئة AsyncPG Pool (إذا كان PostgreSQL)
            if self.database_url.startswith("postgresql://") or self.database_url.startswith("postgres://"):
                try:
                    # استخراج معلومات الاتصال
                    import re
                    match = re.match(r'postgres(ql)?://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', self.database_url)
                    if match:
                        user = match.group(2)
                        password = match.group(3)
                        host = match.group(4)
                        port = int(match.group(5))
                        database = match.group(6)
                        
                        self.async_pool = await asyncpg.create_pool(
                            host=host,
                            port=port,
                            user=user,
                            password=password,
                            database=database,
                            min_size=self.pool_size,
                            max_size=self.pool_size + self.max_overflow
                        )
                        logger.info("✅ تم تهيئة AsyncPG Pool")
                except Exception as asyncpg_error:
                    logger.warning(f"فشل في تهيئة AsyncPG Pool: {asyncpg_error}")
            
            logger.info("✅ تم تهيئة تجمع الاتصالات بنجاح")
            
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة تجمع الاتصالات: {e}")
            raise
    
    async def close(self):
        """إغلاق تجمع الاتصالات"""
        try:
            if self.async_pool:
                await self.async_pool.close()
            
            if self.engine:
                self.engine.dispose()
            
            logger.info("✅ تم إغلاق تجمع الاتصالات")
            
        except Exception as e:
            logger.error(f"❌ خطأ في إغلاق تجمع الاتصالات: {e}")
    
    @asynccontextmanager
    async def get_connection(self):
        """
        الحصول على اتصال من التجمع
        
        Usage:
            async with pool.get_connection() as conn:
                result = await conn.execute("SELECT * FROM users")
        """
        connection = None
        try:
            if self.async_pool:
                # استخدام AsyncPG
                connection = await self.async_pool.acquire()
                self.stats["active_connections"] += 1
                self.stats["total_queries"] += 1
                yield connection
            else:
                # استخدام SQLAlchemy
                connection = self.engine.connect()
                self.stats["active_connections"] += 1
                self.stats["total_queries"] += 1
                yield connection
                connection.close()
                
        except Exception as e:
            self.stats["failed_connections"] += 1
            logger.error(f"❌ خطأ في الحصول على اتصال: {e}")
            raise
        finally:
            if connection:
                if self.async_pool:
                    await self.async_pool.release(connection)
                self.stats["active_connections"] = max(0, self.stats["active_connections"] - 1)
    
    def get_sync_connection(self):
        """
        الحصول على اتصال متزامن
        
        Returns:
            Connection: اتصال قاعدة البيانات
        """
        try:
            return self.engine.connect()
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على اتصال متزامن: {e}")
            raise
    
    def get_stats(self) -> Dict[str, Any]:
        """
        الحصول على إحصائيات التجمع
        
        Returns:
            dict: الإحصائيات
        """
        pool_info = {}
        if self.engine:
            pool_info = {
                "size": self.engine.pool.size(),
                "checked_in": self.engine.pool.checkedin(),
                "checked_out": self.engine.pool.checkedout(),
                "overflow": self.engine.pool.overflow(),
                "invalid": self.engine.pool.invalid()
            }
        
        return {
            **self.stats,
            "pool_info": pool_info,
            "pool_size": self.pool_size,
            "max_overflow": self.max_overflow
        }
    
    def is_healthy(self) -> bool:
        """
        التحقق من صحة تجمع الاتصالات
        
        Returns:
            bool: True إذا كان التجمع سليماً
        """
        try:
            if self.engine:
                # اختبار الاتصال
                with self.engine.connect() as conn:
                    conn.execute("SELECT 1")
                return True
            return False
        except Exception:
            return False


if __name__ == "__main__":
    async def main():
        # مثال على الاستخدام
        pool = ConnectionPool(
            database_url="postgresql://user:password@localhost:5432/testdb",
            pool_size=5
        )
        
        await pool.initialize()
        
        # استخدام الاتصال
        async with pool.get_connection() as conn:
            if hasattr(conn, 'execute'):
                result = await conn.execute("SELECT 1")
                print(f"Result: {result}")
        
        # عرض الإحصائيات
        stats = pool.get_stats()
        print(f"\n📊 إحصائيات التجمع:")
        print(f"  الاتصالات النشطة: {stats['active_connections']}")
        print(f"  إجمالي الاستعلامات: {stats['total_queries']}")
        
        await pool.close()
    
    asyncio.run(main())
