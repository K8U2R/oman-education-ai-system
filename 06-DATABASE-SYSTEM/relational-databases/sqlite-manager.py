"""
SQLite Manager
sqlite-manager.py

مدير SQLite - إدارة قاعدة بيانات SQLite
SQLite Manager - Manages SQLite database

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from pathlib import Path
from sqlalchemy import create_engine, text, MetaData
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import aiosqlite

logger = logging.getLogger(__name__)


class SQLiteManager:
    """
    مدير SQLite
    يدير اتصالات وعمليات قاعدة بيانات SQLite
    """
    
    def __init__(
        self,
        database_path: str = "oman_education.db",
        pool_size: int = 10
    ):
        """
        تهيئة مدير SQLite
        
        Args:
            database_path: مسار ملف قاعدة البيانات
            pool_size: حجم تجمع الاتصالات
        """
        self.name = "SQLite Manager"
        self.version = "1.0.0"
        self.database_path = Path(database_path)
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        
        # URLs
        self.database_url = f"sqlite:///{self.database_path}"
        self.async_database_url = f"sqlite+aiosqlite:///{self.database_path}"
        
        # Engines
        self.engine = None
        self.async_engine = None
        self.async_session = None
        
        # Connection
        self.connection: Optional[aiosqlite.Connection] = None
        
        # Metadata
        self.metadata = MetaData()
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def initialize(self):
        """تهيئة الاتصال بقاعدة البيانات"""
        try:
            # تهيئة SQLAlchemy Engine (متزامن)
            self.engine = create_engine(
                self.database_url,
                pool_pre_ping=True,
                echo=False
            )
            
            # تهيئة Async Engine
            self.async_engine = create_async_engine(
                self.async_database_url,
                pool_pre_ping=True,
                echo=False
            )
            
            # تهيئة Async Session
            self.async_session = sessionmaker(
                self.async_engine,
                class_=AsyncSession,
                expire_on_commit=False
            )
            
            # تهيئة aiosqlite Connection
            try:
                self.connection = await aiosqlite.connect(str(self.database_path))
                self.connection.row_factory = aiosqlite.Row
                logger.info("✅ تم تهيئة aiosqlite Connection")
            except Exception as conn_error:
                logger.warning(f"فشل في تهيئة aiosqlite Connection: {conn_error}")
            
            # اختبار الاتصال
            await self.test_connection()
            
            logger.info(f"✅ تم تهيئة SQLite Manager - الملف: {self.database_path}")
            
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة SQLite Manager: {e}")
            raise
    
    async def test_connection(self) -> bool:
        """
        اختبار الاتصال
        
        Returns:
            bool: True إذا نجح الاتصال
        """
        try:
            if self.connection:
                async with self.connection.execute("SELECT 1") as cursor:
                    result = await cursor.fetchone()
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
            if self.connection:
                async with self.connection.execute(query, tuple(params.values()) if params else ()) as cursor:
                    rows = await cursor.fetchall()
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
            if self.connection:
                cursor = await self.connection.execute(command, tuple(params.values()) if params else ())
                await self.connection.commit()
                return cursor.rowcount
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
                if col.get('auto_increment'):
                    col_def += " AUTOINCREMENT"
                if col.get('not_null'):
                    col_def += " NOT NULL"
                if col.get('unique'):
                    col_def += " UNIQUE"
                if col.get('default'):
                    col_def += f" DEFAULT {col['default']}"
                column_defs.append(col_def)
            
            create_sql = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(column_defs)})"
            
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
            columns = ', '.join(data.keys())
            placeholders = ', '.join(['?'] * len(data))
            values = list(data.values())
            
            query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
            
            if self.connection:
                cursor = await self.connection.execute(query, values)
                await self.connection.commit()
                return cursor.lastrowid
            else:
                raise Exception("aiosqlite Connection غير متاح")
                
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
                conditions = ' AND '.join([f"{k} = ?" for k in filters.keys()])
                query += f" WHERE {conditions}"
            
            if limit:
                query += f" LIMIT {limit}"
            
            if self.connection:
                async with self.connection.execute(query, tuple(filters.values()) if filters else ()) as cursor:
                    rows = await cursor.fetchall()
                    return [dict(row) for row in rows]
            else:
                raise Exception("aiosqlite Connection غير متاح")
                
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
            set_clause = ', '.join([f"{k} = ?" for k in data.keys()])
            where_clause = ' AND '.join([f"{k} = ?" for k in filters.keys()])
            
            query = f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}"
            params = list(data.values()) + list(filters.values())
            
            if self.connection:
                cursor = await self.connection.execute(query, params)
                await self.connection.commit()
                return cursor.rowcount
            else:
                raise Exception("aiosqlite Connection غير متاح")
                
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
            where_clause = ' AND '.join([f"{k} = ?" for k in filters.keys()])
            query = f"DELETE FROM {table_name} WHERE {where_clause}"
            
            if self.connection:
                cursor = await self.connection.execute(query, tuple(filters.values()))
                await self.connection.commit()
                return cursor.rowcount
            else:
                raise Exception("aiosqlite Connection غير متاح")
                
        except Exception as e:
            logger.error(f"❌ خطأ في الحذف: {e}")
            raise
    
    async def close(self):
        """إغلاق الاتصالات"""
        try:
            if self.connection:
                await self.connection.close()
            
            if self.async_engine:
                await self.async_engine.dispose()
            
            if self.engine:
                self.engine.dispose()
            
            logger.info("✅ تم إغلاق SQLite Manager")
            
        except Exception as e:
            logger.error(f"❌ خطأ في إغلاق SQLite Manager: {e}")


if __name__ == "__main__":
    async def main():
        manager = SQLiteManager()
        
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
