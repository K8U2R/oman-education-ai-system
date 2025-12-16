"""
Redis Manager
redis-manager.py

مدير Redis - إدارة تخزين مؤقت Redis
Redis Manager - Manages Redis caching

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
import json
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
import redis.asyncio as aioredis
import redis

logger = logging.getLogger(__name__)


class RedisManager:
    """
    مدير Redis
    يدير تخزين مؤقت Redis للوصول السريع للبيانات
    """
    
    def __init__(
        self,
        connection_url: Optional[str] = None,
        default_ttl: int = 3600
    ):
        """
        تهيئة مدير Redis
        
        Args:
            connection_url: رابط الاتصال
            default_ttl: مدة الصلاحية الافتراضية (بالثواني)
        """
        self.name = "Redis Manager"
        self.version = "1.0.0"
        self.connection_url = connection_url or "redis://localhost:6379/0"
        self.default_ttl = default_ttl
        
        # Clients
        self.async_client: Optional[aioredis.Redis] = None
        self.sync_client: Optional[redis.Redis] = None
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def initialize(self):
        """تهيئة الاتصال بـ Redis"""
        try:
            # تهيئة Async Client
            self.async_client = await aioredis.from_url(
                self.connection_url,
                encoding="utf-8",
                decode_responses=True
            )
            
            # تهيئة Sync Client
            self.sync_client = redis.from_url(
                self.connection_url,
                encoding="utf-8",
                decode_responses=True
            )
            
            # اختبار الاتصال
            await self.test_connection()
            
            logger.info("✅ تم تهيئة Redis Manager بنجاح")
            
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة Redis Manager: {e}")
            raise
    
    async def test_connection(self) -> bool:
        """
        اختبار الاتصال
        
        Returns:
            bool: True إذا نجح الاتصال
        """
        try:
            if self.async_client:
                await self.async_client.ping()
                return True
            return False
        except Exception as e:
            logger.error(f"❌ فشل اختبار الاتصال: {e}")
            return False
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """
        تعيين قيمة
        
        Args:
            key: المفتاح
            value: القيمة
            ttl: مدة الصلاحية (بالثواني)
            
        Returns:
            bool: True إذا نجح التعيين
        """
        try:
            # تحويل القيمة إلى JSON إذا كانت dict أو list
            if isinstance(value, (dict, list)):
                value = json.dumps(value, ensure_ascii=False)
            
            ttl = ttl or self.default_ttl
            
            if self.async_client:
                await self.async_client.setex(key, ttl, value)
                return True
            return False
            
        except Exception as e:
            logger.error(f"❌ خطأ في تعيين القيمة: {e}")
            return False
    
    async def get(self, key: str) -> Optional[Any]:
        """
        الحصول على قيمة
        
        Args:
            key: المفتاح
            
        Returns:
            القيمة أو None
        """
        try:
            if self.async_client:
                value = await self.async_client.get(key)
                
                if value is None:
                    return None
                
                # محاولة تحويل JSON
                try:
                    return json.loads(value)
                except (json.JSONDecodeError, TypeError):
                    return value
            
            return None
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على القيمة: {e}")
            return None
    
    async def delete(self, *keys: str) -> int:
        """
        حذف مفاتيح
        
        Args:
            *keys: المفاتيح
            
        Returns:
            int: عدد المفاتيح المحذوفة
        """
        try:
            if self.async_client:
                return await self.async_client.delete(*keys)
            return 0
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحذف: {e}")
            return 0
    
    async def exists(self, key: str) -> bool:
        """
        التحقق من وجود مفتاح
        
        Args:
            key: المفتاح
            
        Returns:
            bool: True إذا كان المفتاح موجوداً
        """
        try:
            if self.async_client:
                return await self.async_client.exists(key) > 0
            return False
            
        except Exception as e:
            logger.error(f"❌ خطأ في التحقق: {e}")
            return False
    
    async def expire(self, key: str, ttl: int) -> bool:
        """
        تعيين مدة الصلاحية لمفتاح
        
        Args:
            key: المفتاح
            ttl: مدة الصلاحية (بالثواني)
            
        Returns:
            bool: True إذا نجح التعيين
        """
        try:
            if self.async_client:
                return await self.async_client.expire(key, ttl)
            return False
            
        except Exception as e:
            logger.error(f"❌ خطأ في تعيين مدة الصلاحية: {e}")
            return False
    
    async def get_ttl(self, key: str) -> int:
        """
        الحصول على مدة الصلاحية المتبقية
        
        Args:
            key: المفتاح
            
        Returns:
            int: مدة الصلاحية المتبقية (بالثواني) أو -1 إذا لم يكن موجوداً
        """
        try:
            if self.async_client:
                return await self.async_client.ttl(key)
            return -1
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على مدة الصلاحية: {e}")
            return -1
    
    async def increment(self, key: str, amount: int = 1) -> int:
        """
        زيادة قيمة مفتاح
        
        Args:
            key: المفتاح
            amount: المقدار
            
        Returns:
            int: القيمة الجديدة
        """
        try:
            if self.async_client:
                return await self.async_client.incrby(key, amount)
            return 0
            
        except Exception as e:
            logger.error(f"❌ خطأ في الزيادة: {e}")
            return 0
    
    async def decrement(self, key: str, amount: int = 1) -> int:
        """
        تقليل قيمة مفتاح
        
        Args:
            key: المفتاح
            amount: المقدار
            
        Returns:
            int: القيمة الجديدة
        """
        try:
            if self.async_client:
                return await self.async_client.decrby(key, amount)
            return 0
            
        except Exception as e:
            logger.error(f"❌ خطأ في التقليل: {e}")
            return 0
    
    async def set_hash(self, key: str, field: str, value: Any) -> bool:
        """
        تعيين حقل في hash
        
        Args:
            key: مفتاح Hash
            field: اسم الحقل
            value: القيمة
            
        Returns:
            bool: True إذا نجح التعيين
        """
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value, ensure_ascii=False)
            
            if self.async_client:
                await self.async_client.hset(key, field, value)
                return True
            return False
            
        except Exception as e:
            logger.error(f"❌ خطأ في تعيين Hash: {e}")
            return False
    
    async def get_hash(self, key: str, field: Optional[str] = None) -> Union[Dict, Any, None]:
        """
        الحصول على hash
        
        Args:
            key: مفتاح Hash
            field: اسم الحقل (None للحصول على الكل)
            
        Returns:
            dict أو قيمة الحقل
        """
        try:
            if self.async_client:
                if field:
                    value = await self.async_client.hget(key, field)
                    if value:
                        try:
                            return json.loads(value)
                        except (json.JSONDecodeError, TypeError):
                            return value
                    return None
                else:
                    hash_data = await self.async_client.hgetall(key)
                    return dict(hash_data) if hash_data else {}
            return None
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على Hash: {e}")
            return None
    
    async def push_list(self, key: str, *values: Any, left: bool = False) -> int:
        """
        إضافة قيم إلى قائمة
        
        Args:
            key: مفتاح القائمة
            *values: القيم
            left: True للإضافة من اليسار (lpush)
            
        Returns:
            int: طول القائمة الجديدة
        """
        try:
            # تحويل القيم إلى JSON
            json_values = [json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else str(v) for v in values]
            
            if self.async_client:
                if left:
                    return await self.async_client.lpush(key, *json_values)
                else:
                    return await self.async_client.rpush(key, *json_values)
            return 0
            
        except Exception as e:
            logger.error(f"❌ خطأ في إضافة القائمة: {e}")
            return 0
    
    async def get_list(self, key: str, start: int = 0, end: int = -1) -> List[Any]:
        """
        الحصول على قائمة
        
        Args:
            key: مفتاح القائمة
            start: الفهرس البدء
            end: الفهرس النهاية
            
        Returns:
            list: القائمة
        """
        try:
            if self.async_client:
                values = await self.async_client.lrange(key, start, end)
                
                # محاولة تحويل JSON
                result = []
                for v in values:
                    try:
                        result.append(json.loads(v))
                    except (json.JSONDecodeError, TypeError):
                        result.append(v)
                
                return result
            return []
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على القائمة: {e}")
            return []
    
    async def get_keys(self, pattern: str = "*") -> List[str]:
        """
        الحصول على قائمة المفاتيح
        
        Args:
            pattern: نمط البحث
            
        Returns:
            list: قائمة المفاتيح
        """
        try:
            if self.async_client:
                keys = []
                async for key in self.async_client.scan_iter(match=pattern):
                    keys.append(key)
                return keys
            return []
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على المفاتيح: {e}")
            return []
    
    async def get_stats(self) -> Dict:
        """
        الحصول على إحصائيات Redis
        
        Returns:
            dict: الإحصائيات
        """
        try:
            if self.async_client:
                info = await self.async_client.info()
                return {
                    "connected_clients": info.get('connected_clients', 0),
                    "used_memory": info.get('used_memory_human', '0B'),
                    "total_keys": await self.async_client.dbsize(),
                    "uptime_seconds": info.get('uptime_in_seconds', 0)
                }
            return {}
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على الإحصائيات: {e}")
            return {}
    
    async def close(self):
        """إغلاق الاتصالات"""
        try:
            if self.async_client:
                await self.async_client.close()
            
            if self.sync_client:
                self.sync_client.close()
            
            logger.info("✅ تم إغلاق Redis Manager")
            
        except Exception as e:
            logger.error(f"❌ خطأ في إغلاق Redis Manager: {e}")


if __name__ == "__main__":
    async def main():
        manager = RedisManager()
        
        try:
            await manager.initialize()
            
            # اختبار الاتصال
            is_connected = await manager.test_connection()
            print(f"الاتصال: {'✅ متصل' if is_connected else '❌ غير متصل'}")
            
            # اختبار Set/Get
            await manager.set("test_key", {"name": "test", "value": 123}, ttl=60)
            value = await manager.get("test_key")
            print(f"القيمة: {value}")
            
        except Exception as e:
            print(f"❌ خطأ: {e}")
        finally:
            await manager.close()
    
    asyncio.run(main())
