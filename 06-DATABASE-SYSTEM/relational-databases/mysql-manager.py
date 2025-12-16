"""
MySQL Manager
mysql-manager.py

مدير MySQL - إدارة قاعدة بيانات MySQL
MySQL Manager - Manages MySQL database

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from sqlalchemy import create_engine, text, MetaData
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import aiomysql

logger = logging.getLogger(__name__)


class MySQLManager:
    """
    مدير MySQL
    يدير اتصالات وعمليات قاعدة بيانات MySQL
    """
    
    def __init__(
        self,
        database_url: Optional[str] = None,
        async_database_url: Optional[str] = None,
        pool_size: int = 10
    ):
        """
        تهيئة مدير MySQL
        
        Args:
            database_url: رابط قاعدة البيانات (متزامن)
            async_database_url: رابط قاعدة البيانات (غير متزامن)
            pool_size: حجم تجمع الاتصالات
        """
        self.name = "MySQL Manager"
        self.version = "1.0.0"
        
        # URLs
        self.database_url = database_url or "mysql+pymysql://user:password@localhost:3306/oman_education"
        self.async_database_url = async_database_url or self.database_url.replace("mysql+pymysql://", "mysql+aiomysql://")
        
        # Engines
        self.engine = None
        self.async_engine = None
        self.async_session = None
        
        # Connection Pool
        self.pool: Optional[aiomysql.Pool] = None
        
        # Metadata
        self.metadata = MetaData()
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def initialize(self):
        """تهيئة الاتصال بقاعدة البيانات"""
        try:
            # تهيئة SQLAlchemy Engine (متزامن)
            self.engine = create_engine(
                self.database_url,
                pool_size=10,
                max_overflow=20,
                echo=False
            )
            
            # تهيئة Async Engine
            self.async_engine = create_async_engine(
                self.async_database_url,
                pool_size=10,
                max_overflow=20,
                echo=False
            )
            
            # تهيئة Async Session
            self.async_session = sessionmaker(
                self.async_engine,
                class_=AsyncSession,
                expire_on_commit=False
            )
            
            # تهيئة aiomysql Pool
            try:
                import re
                match = re.match(r'mysql\+pymysql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', self.database_url)
                if match:
                    user = match.group(1)
                    password = match.group(2)
                    host = match.group(3)
                    port = int(match.group(4))
                    database = match.group(5)
                    
                    self.pool = await aiomysql.create_pool(
                        host=host,
                        port=port,
                        user=user,
                        password=password,
                        db=database,
                        minsize=5,
                        maxsize=20
                    )
                    logger.info("✅ تم تهيئة aiomysql Pool")
            except Exception as pool_error:
                logger.warning(f"فشل في تهيئة aiomysql Pool: {pool_error}")
            
            # اختبار الاتصال
            await self.test_connection()
            
            logger.info("✅ تم تهيئة MySQL Manager بنجاح")
            
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة MySQL Manager: {e}")
            raise
    
    async def test_connection(self) -> bool:
        """
        اختبار الاتصال
        
        Returns:
            bool: True إذا نجح الاتصال
        """
        try:
            if self.pool:
                async with self.pool.acquire() as conn:
                    async with conn.cursor() as cur:
                        await cur.execute("SELECT 1")
                        result = await cur.fetchone()
                        return result[0] == 1
            elif self.async_engine:
                async with self.async_engine.connect() as conn:
                    result = await conn.execute(text("SELECT 1"))
                    return result.scalar() == 1
            return False
        except Exception as e:
            logger.error(f"❌ فشل اختبار الاتصال: {e}")
            return False
    
    async def execute_query(self, query: str, params: Optional[Dict] = None) -> List[Dict]:
        """
        تنفيذ استعلام
        
        Args:
            query: الاستعلام SQL
            params: معاملات الاستعلام
            
        Returns:
            list: النتائج
        """
        try:
            if self.pool:
                async with self.pool.acquire() as conn:
                    async with conn.cursor(aiomysql.DictCursor) as cur:
                        if params:
                            await cur.execute(query, tuple(params.values()))
                        else:
                            await cur.execute(query)
                        rows = await cur.fetchall()
                        return [dict(row) for row in rows]
            elif self.async_engine:
                async with self.async_engine.connect() as conn:
                    result = await conn.execute(text(query), params or {})
                    return [dict(row) for row in result]
            else:
                raise Exception("لا يوجد اتصال بقاعدة البيانات")
                
        except Exception as e:
            logger.error(f"❌ خطأ في تنفيذ الاستعلام: {e}")
            raise
    
    async def execute_command(self, command: str, params: Optional[Dict] = None) -> int:
        """
        تنفيذ أمر (INSERT, UPDATE, DELETE)
        
        Args:
            command: الأمر SQL
            params: معاملات الأمر
            
        Returns:
            int: عدد الصفوف المتأثرة
        """
        try:
            if self.pool:
                async with self.pool.acquire() as conn:
                    async with conn.cursor() as cur:
                        if params:
                            await cur.execute(command, tuple(params.values()))
                        else:
                            await cur.execute(command)
                        await conn.commit()
                        return cur.rowcount
            elif self.async_engine:
                async with self.async_engine.connect() as conn:
                    result = await conn.execute(text(command), params or {})
                    await conn.commit()
                    return result.rowcount
            else:
                raise Exception("لا يوجد اتصال بقاعدة البيانات")
                
        except Exception as e:
            logger.error(f"❌ خطأ في تنفيذ الأمر: {e}")
            raise
    
    async def create_table(self, table_name: str, columns: List[Dict]) -> bool:
        """
        إنشاء جدول
        
        Args:
            table_name: اسم الجدول
            columns: قائمة الأعمدة
            
        Returns:
            bool: True إذا نجح الإنشاء
        """
        try:
            # بناء SQL CREATE TABLE
            column_defs = []
            for col in columns:
                col_def = f"`{col['name']}` {col['type']}"
                if col.get('primary_key'):
                    col_def += " PRIMARY KEY"
                if col.get('auto_increment'):
                    col_def += " AUTO_INCREMENT"
                if col.get('not_null'):
                    col_def += " NOT NULL"
                if col.get('unique'):
                    col_def += " UNIQUE"
                if col.get('default'):
                    col_def += f" DEFAULT {col['default']}"
                column_defs.append(col_def)
            
            create_sql = f"CREATE TABLE IF NOT EXISTS `{table_name}` ({', '.join(column_defs)}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
            
            await self.execute_command(create_sql)
            logger.info(f"✅ تم إنشاء الجدول: {table_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في إنشاء الجدول {table_name}: {e}")
            return False
    
    async def insert(self, table_name: str, data: Dict) -> Optional[int]:
        """
        إدراج بيانات
        
        Args:
            table_name: اسم الجدول
            data: البيانات
            
        Returns:
            int: معرف السجل المُدرج
        """
        try:
            columns = ', '.join([f"`{k}`" for k in data.keys()])
            placeholders = ', '.join(['%s'] * len(data))
            values = list(data.values())
            
            query = f"INSERT INTO `{table_name}` ({columns}) VALUES ({placeholders})"
            
            if self.pool:
                async with self.pool.acquire() as conn:
                    async with conn.cursor() as cur:
                        await cur.execute(query, values)
                        await conn.commit()
                        return cur.lastrowid
            else:
                raise Exception("aiomysql Pool غير متاح")
                
        except Exception as e:
            logger.error(f"❌ خطأ في الإدراج: {e}")
            raise
    
    async def select(self, table_name: str, filters: Optional[Dict] = None, limit: Optional[int] = None) -> List[Dict]:
        """
        استعلام بيانات
        
        Args:
            table_name: اسم الجدول
            filters: شروط التصفية
            limit: الحد الأقصى
            
        Returns:
            list: النتائج
        """
        try:
            query = f"SELECT * FROM `{table_name}`"
            
            if filters:
                conditions = ' AND '.join([f"`{k}` = %s" for k in filters.keys()])
                query += f" WHERE {conditions}"
            
            if limit:
                query += f" LIMIT {limit}"
            
            if self.pool:
                async with self.pool.acquire() as conn:
                    async with conn.cursor(aiomysql.DictCursor) as cur:
                        if filters:
                            await cur.execute(query, tuple(filters.values()))
                        else:
                            await cur.execute(query)
                        rows = await cur.fetchall()
                        return [dict(row) for row in rows]
            else:
                raise Exception("aiomysql Pool غير متاح")
                
        except Exception as e:
            logger.error(f"❌ خطأ في الاستعلام: {e}")
            raise
    
    async def update(self, table_name: str, data: Dict, filters: Dict) -> int:
        """
        تحديث بيانات
        
        Args:
            table_name: اسم الجدول
            data: البيانات الجديدة
            filters: شروط التحديث
            
        Returns:
            int: عدد الصفوف المحدثة
        """
        try:
            set_clause = ', '.join([f"`{k}` = %s" for k in data.keys()])
            where_clause = ' AND '.join([f"`{k}` = %s" for k in filters.keys()])
            
            query = f"UPDATE `{table_name}` SET {set_clause} WHERE {where_clause}"
            params = list(data.values()) + list(filters.values())
            
            if self.pool:
                async with self.pool.acquire() as conn:
                    async with conn.cursor() as cur:
                        await cur.execute(query, params)
                        await conn.commit()
                        return cur.rowcount
            else:
                raise Exception("aiomysql Pool غير متاح")
                
        except Exception as e:
            logger.error(f"❌ خطأ في التحديث: {e}")
            raise
    
    async def delete(self, table_name: str, filters: Dict) -> int:
        """
        حذف بيانات
        
        Args:
            table_name: اسم الجدول
            filters: شروط الحذف
            
        Returns:
            int: عدد الصفوف المحذوفة
        """
        try:
            where_clause = ' AND '.join([f"`{k}` = %s" for k in filters.keys()])
            query = f"DELETE FROM `{table_name}` WHERE {where_clause}"
            
            if self.pool:
                async with self.pool.acquire() as conn:
                    async with conn.cursor() as cur:
                        await cur.execute(query, tuple(filters.values()))
                        await conn.commit()
                        return cur.rowcount
            else:
                raise Exception("aiomysql Pool غير متاح")
                
        except Exception as e:
            logger.error(f"❌ خطأ في الحذف: {e}")
            raise
    
    async def close(self):
        """إغلاق الاتصالات"""
        try:
            if self.pool:
                self.pool.close()
                await self.pool.wait_closed()
            
            if self.async_engine:
                await self.async_engine.dispose()
            
            if self.engine:
                self.engine.dispose()
            
            logger.info("✅ تم إغلاق MySQL Manager")
            
        except Exception as e:
            logger.error(f"❌ خطأ في إغلاق MySQL Manager: {e}")


if __name__ == "__main__":
    async def main():
        manager = MySQLManager()
        
        try:
            await manager.initialize()
            
            # اختبار الاتصال
            is_connected = await manager.test_connection()
            print(f"الاتصال: {'✅ متصل' if is_connected else '❌ غير متصل'}")
            
        except Exception as e:
            print(f"❌ خطأ: {e}")
        finally:
            await manager.close()
    
    asyncio.run(main())
