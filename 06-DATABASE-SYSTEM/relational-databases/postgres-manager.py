"""
PostgreSQL Manager
postgres-manager.py

مدير PostgreSQL - إدارة قاعدة بيانات PostgreSQL
PostgreSQL Manager - Manages PostgreSQL database

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
from pathlib import Path
import asyncpg
from sqlalchemy import create_engine, text, MetaData, Table, Column, String, Integer, DateTime, JSON
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)


class PostgresManager:
    """
    مدير PostgreSQL
    يدير اتصالات وعمليات قاعدة بيانات PostgreSQL
    """
    
    def __init__(
        self,
        database_url: Optional[str] = None,
        async_database_url: Optional[str] = None,
        pool_size: int = 10
    ):
        """
        تهيئة مدير PostgreSQL
        
        Args:
            database_url: رابط قاعدة البيانات (متزامن)
            async_database_url: رابط قاعدة البيانات (غير متزامن)
            pool_size: حجم تجمع الاتصالات
        """
        self.name = "PostgreSQL Manager"
        self.version = "1.0.0"
        
        # URLs
        self.database_url = database_url or "postgresql://user:password@localhost:5432/oman_education"
        self.async_database_url = async_database_url or self.database_url.replace("postgresql://", "postgresql+asyncpg://")
        
        # Engines
        self.engine = None
        self.async_engine = None
        self.async_session = None
        
        # AsyncPG Pool
        self.async_pool: Optional[asyncpg.Pool] = None
        
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
            
            # تهيئة AsyncPG Pool
            try:
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
                        min_size=5,
                        max_size=20
                    )
                    logger.info("✅ تم تهيئة AsyncPG Pool")
            except Exception as pool_error:
                logger.warning(f"فشل في تهيئة AsyncPG Pool: {pool_error}")
            
            # اختبار الاتصال
            await self.test_connection()
            
            logger.info("✅ تم تهيئة PostgreSQL Manager بنجاح")
            
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة PostgreSQL Manager: {e}")
            raise
    
    async def test_connection(self) -> bool:
        """
        اختبار الاتصال
        
        Returns:
            bool: True إذا نجح الاتصال
        """
        try:
            if self.async_pool:
                async with self.async_pool.acquire() as conn:
                    result = await conn.fetchval("SELECT 1")
                    return result == 1
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
            if self.async_pool:
                async with self.async_pool.acquire() as conn:
                    if params:
                        rows = await conn.fetch(query, *params.values())
                    else:
                        rows = await conn.fetch(query)
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
            if self.async_pool:
                async with self.async_pool.acquire() as conn:
                    if params:
                        result = await conn.execute(command, *params.values())
                    else:
                        result = await conn.execute(command)
                    return int(result.split()[-1]) if result else 0
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
                col_def = f"{col['name']} {col['type']}"
                if col.get('primary_key'):
                    col_def += " PRIMARY KEY"
                if col.get('not_null'):
                    col_def += " NOT NULL"
                if col.get('unique'):
                    col_def += " UNIQUE"
                column_defs.append(col_def)
            
            create_sql = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(column_defs)})"
            
            await self.execute_command(create_sql)
            logger.info(f"✅ تم إنشاء الجدول: {table_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في إنشاء الجدول {table_name}: {e}")
            return False
    
    async def insert(self, table_name: str, data: Dict) -> Optional[str]:
        """
        إدراج بيانات
        
        Args:
            table_name: اسم الجدول
            data: البيانات
            
        Returns:
            str: معرف السجل المُدرج
        """
        try:
            columns = ', '.join(data.keys())
            placeholders = ', '.join([f'${i+1}' for i in range(len(data))])
            values = list(data.values())
            
            query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders}) RETURNING id"
            
            if self.async_pool:
                async with self.async_pool.acquire() as conn:
                    result = await conn.fetchval(query, *values)
                    return str(result) if result else None
            else:
                raise Exception("AsyncPG Pool غير متاح")
                
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
            query = f"SELECT * FROM {table_name}"
            
            if filters:
                conditions = ' AND '.join([f"{k} = ${i+1}" for i, k in enumerate(filters.keys())])
                query += f" WHERE {conditions}"
            
            if limit:
                query += f" LIMIT {limit}"
            
            if self.async_pool:
                async with self.async_pool.acquire() as conn:
                    if filters:
                        rows = await conn.fetch(query, *filters.values())
                    else:
                        rows = await conn.fetch(query)
                    return [dict(row) for row in rows]
            else:
                raise Exception("AsyncPG Pool غير متاح")
                
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
            set_clause = ', '.join([f"{k} = ${i+1}" for i, k in enumerate(data.keys())])
            where_clause = ' AND '.join([f"{k} = ${i+len(data)+1}" for k in filters.keys()])
            
            query = f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}"
            params = list(data.values()) + list(filters.values())
            
            if self.async_pool:
                async with self.async_pool.acquire() as conn:
                    result = await conn.execute(query, *params)
                    return int(result.split()[-1]) if result else 0
            else:
                raise Exception("AsyncPG Pool غير متاح")
                
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
            where_clause = ' AND '.join([f"{k} = ${i+1}" for i, k in enumerate(filters.keys())])
            query = f"DELETE FROM {table_name} WHERE {where_clause}"
            
            if self.async_pool:
                async with self.async_pool.acquire() as conn:
                    result = await conn.execute(query, *filters.values())
                    return int(result.split()[-1]) if result else 0
            else:
                raise Exception("AsyncPG Pool غير متاح")
                
        except Exception as e:
            logger.error(f"❌ خطأ في الحذف: {e}")
            raise
    
    async def get_table_info(self, table_name: str) -> Dict:
        """
        الحصول على معلومات الجدول
        
        Args:
            table_name: اسم الجدول
            
        Returns:
            dict: معلومات الجدول
        """
        try:
            query = """
                SELECT 
                    column_name, 
                    data_type, 
                    is_nullable,
                    column_default
                FROM information_schema.columns
                WHERE table_name = $1
                ORDER BY ordinal_position
            """
            
            if self.async_pool:
                async with self.async_pool.acquire() as conn:
                    rows = await conn.fetch(query, table_name)
                    return {
                        "table_name": table_name,
                        "columns": [dict(row) for row in rows]
                    }
            else:
                raise Exception("AsyncPG Pool غير متاح")
                
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على معلومات الجدول: {e}")
            return {}
    
    async def close(self):
        """إغلاق الاتصالات"""
        try:
            if self.async_pool:
                await self.async_pool.close()
            
            if self.async_engine:
                await self.async_engine.dispose()
            
            if self.engine:
                self.engine.dispose()
            
            logger.info("✅ تم إغلاق PostgreSQL Manager")
            
        except Exception as e:
            logger.error(f"❌ خطأ في إغلاق PostgreSQL Manager: {e}")


if __name__ == "__main__":
    async def main():
        manager = PostgresManager()
        
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
