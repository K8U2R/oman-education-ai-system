"""
MongoDB Manager
mongodb-manager.py

مدير MongoDB - إدارة قاعدة بيانات MongoDB
MongoDB Manager - Manages MongoDB database

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection

logger = logging.getLogger(__name__)


class MongoDBManager:
    """
    مدير MongoDB
    يدير اتصالات وعمليات قاعدة بيانات MongoDB
    """
    
    def __init__(
        self,
        connection_string: Optional[str] = None,
        database_name: str = "oman_education"
    ):
        """
        تهيئة مدير MongoDB
        
        Args:
            connection_string: سلسلة الاتصال
            database_name: اسم قاعدة البيانات
        """
        self.name = "MongoDB Manager"
        self.version = "1.0.0"
        self.connection_string = connection_string or "mongodb://localhost:27017"
        self.database_name = database_name
        
        # Clients
        self.client: Optional[AsyncIOMotorClient] = None
        self.sync_client: Optional[MongoClient] = None
        self.database: Optional[AsyncIOMotorDatabase] = None
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def initialize(self):
        """تهيئة الاتصال بقاعدة البيانات"""
        try:
            # تهيئة Async Client
            self.client = AsyncIOMotorClient(
                self.connection_string,
                serverSelectionTimeoutMS=5000
            )
            
            # تهيئة Sync Client
            self.sync_client = MongoClient(
                self.connection_string,
                serverSelectionTimeoutMS=5000
            )
            
            # الحصول على قاعدة البيانات
            self.database = self.client[self.database_name]
            
            # اختبار الاتصال
            await self.test_connection()
            
            logger.info(f"✅ تم تهيئة MongoDB Manager - قاعدة البيانات: {self.database_name}")
            
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة MongoDB Manager: {e}")
            raise
    
    async def test_connection(self) -> bool:
        """
        اختبار الاتصال
        
        Returns:
            bool: True إذا نجح الاتصال
        """
        try:
            if self.client:
                await self.client.admin.command('ping')
                return True
            return False
        except Exception as e:
            logger.error(f"❌ فشل اختبار الاتصال: {e}")
            return False
    
    def get_collection(self, collection_name: str) -> AsyncIOMotorCollection:
        """
        الحصول على مجموعة
        
        Args:
            collection_name: اسم المجموعة
            
        Returns:
            AsyncIOMotorCollection: المجموعة
        """
        if not self.database:
            raise Exception("قاعدة البيانات غير مهيأة")
        return self.database[collection_name]
    
    async def insert_one(self, collection_name: str, document: Dict) -> str:
        """
        إدراج وثيقة واحدة
        
        Args:
            collection_name: اسم المجموعة
            document: الوثيقة
            
        Returns:
            str: معرف الوثيقة
        """
        try:
            collection = self.get_collection(collection_name)
            
            # إضافة timestamps
            document['created_at'] = datetime.now()
            document['updated_at'] = datetime.now()
            
            result = await collection.insert_one(document)
            logger.info(f"✅ تم إدراج وثيقة في {collection_name}: {result.inserted_id}")
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"❌ خطأ في الإدراج: {e}")
            raise
    
    async def insert_many(self, collection_name: str, documents: List[Dict]) -> List[str]:
        """
        إدراج عدة وثائق
        
        Args:
            collection_name: اسم المجموعة
            documents: قائمة الوثائق
            
        Returns:
            list: قائمة معرفات الوثائق
        """
        try:
            collection = self.get_collection(collection_name)
            
            # إضافة timestamps
            now = datetime.now()
            for doc in documents:
                doc['created_at'] = now
                doc['updated_at'] = now
            
            result = await collection.insert_many(documents)
            logger.info(f"✅ تم إدراج {len(result.inserted_ids)} وثيقة في {collection_name}")
            return [str(id) for id in result.inserted_ids]
            
        except Exception as e:
            logger.error(f"❌ خطأ في الإدراج المتعدد: {e}")
            raise
    
    async def find_one(self, collection_name: str, filter: Dict) -> Optional[Dict]:
        """
        البحث عن وثيقة واحدة
        
        Args:
            collection_name: اسم المجموعة
            filter: شروط البحث
            
        Returns:
            dict: الوثيقة أو None
        """
        try:
            collection = self.get_collection(collection_name)
            document = await collection.find_one(filter)
            
            if document and '_id' in document:
                document['_id'] = str(document['_id'])
            
            return document
            
        except Exception as e:
            logger.error(f"❌ خطأ في البحث: {e}")
            raise
    
    async def find_many(
        self,
        collection_name: str,
        filter: Optional[Dict] = None,
        limit: Optional[int] = None,
        skip: int = 0,
        sort: Optional[List[tuple]] = None
    ) -> List[Dict]:
        """
        البحث عن عدة وثائق
        
        Args:
            collection_name: اسم المجموعة
            filter: شروط البحث
            limit: الحد الأقصى
            skip: عدد الوثائق للتخطي
            sort: قائمة الحقول للترتيب
            
        Returns:
            list: قائمة الوثائق
        """
        try:
            collection = self.get_collection(collection_name)
            cursor = collection.find(filter or {})
            
            if sort:
                cursor = cursor.sort(sort)
            
            if skip:
                cursor = cursor.skip(skip)
            
            if limit:
                cursor = cursor.limit(limit)
            
            documents = await cursor.to_list(length=limit or 1000)
            
            # تحويل ObjectId إلى string
            for doc in documents:
                if '_id' in doc:
                    doc['_id'] = str(doc['_id'])
            
            return documents
            
        except Exception as e:
            logger.error(f"❌ خطأ في البحث المتعدد: {e}")
            raise
    
    async def update_one(
        self,
        collection_name: str,
        filter: Dict,
        update: Dict,
        upsert: bool = False
    ) -> bool:
        """
        تحديث وثيقة واحدة
        
        Args:
            collection_name: اسم المجموعة
            filter: شروط البحث
            update: التحديثات
            upsert: إنشاء الوثيقة إذا لم تكن موجودة
            
        Returns:
            bool: True إذا نجح التحديث
        """
        try:
            collection = self.get_collection(collection_name)
            
            # إضافة updated_at
            update['$set'] = update.get('$set', {})
            update['$set']['updated_at'] = datetime.now()
            
            result = await collection.update_one(filter, update, upsert=upsert)
            logger.info(f"✅ تم تحديث وثيقة في {collection_name}: {result.modified_count}")
            return result.modified_count > 0 or result.upserted_id is not None
            
        except Exception as e:
            logger.error(f"❌ خطأ في التحديث: {e}")
            raise
    
    async def update_many(
        self,
        collection_name: str,
        filter: Dict,
        update: Dict
    ) -> int:
        """
        تحديث عدة وثائق
        
        Args:
            collection_name: اسم المجموعة
            filter: شروط البحث
            update: التحديثات
            
        Returns:
            int: عدد الوثائق المحدثة
        """
        try:
            collection = self.get_collection(collection_name)
            
            # إضافة updated_at
            update['$set'] = update.get('$set', {})
            update['$set']['updated_at'] = datetime.now()
            
            result = await collection.update_many(filter, update)
            logger.info(f"✅ تم تحديث {result.modified_count} وثيقة في {collection_name}")
            return result.modified_count
            
        except Exception as e:
            logger.error(f"❌ خطأ في التحديث المتعدد: {e}")
            raise
    
    async def delete_one(self, collection_name: str, filter: Dict) -> bool:
        """
        حذف وثيقة واحدة
        
        Args:
            collection_name: اسم المجموعة
            filter: شروط البحث
            
        Returns:
            bool: True إذا نجح الحذف
        """
        try:
            collection = self.get_collection(collection_name)
            result = await collection.delete_one(filter)
            logger.info(f"✅ تم حذف وثيقة من {collection_name}")
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحذف: {e}")
            raise
    
    async def delete_many(self, collection_name: str, filter: Dict) -> int:
        """
        حذف عدة وثائق
        
        Args:
            collection_name: اسم المجموعة
            filter: شروط البحث
            
        Returns:
            int: عدد الوثائق المحذوفة
        """
        try:
            collection = self.get_collection(collection_name)
            result = await collection.delete_many(filter)
            logger.info(f"✅ تم حذف {result.deleted_count} وثيقة من {collection_name}")
            return result.deleted_count
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحذف المتعدد: {e}")
            raise
    
    async def create_index(self, collection_name: str, index_fields: List[tuple], unique: bool = False) -> bool:
        """
        إنشاء فهرس
        
        Args:
            collection_name: اسم المجموعة
            index_fields: قائمة حقول الفهرس
            unique: فهرس فريد
            
        Returns:
            bool: True إذا نجح الإنشاء
        """
        try:
            collection = self.get_collection(collection_name)
            await collection.create_index(index_fields, unique=unique)
            logger.info(f"✅ تم إنشاء فهرس في {collection_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ خطأ في إنشاء الفهرس: {e}")
            return False
    
    async def get_collection_stats(self, collection_name: str) -> Dict:
        """
        الحصول على إحصائيات المجموعة
        
        Args:
            collection_name: اسم المجموعة
            
        Returns:
            dict: الإحصائيات
        """
        try:
            collection = self.get_collection(collection_name)
            stats = await collection.count_documents({})
            
            return {
                "collection_name": collection_name,
                "document_count": stats,
                "database": self.database_name
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على الإحصائيات: {e}")
            return {}
    
    async def close(self):
        """إغلاق الاتصالات"""
        try:
            if self.client:
                self.client.close()
            
            if self.sync_client:
                self.sync_client.close()
            
            logger.info("✅ تم إغلاق MongoDB Manager")
            
        except Exception as e:
            logger.error(f"❌ خطأ في إغلاق MongoDB Manager: {e}")


if __name__ == "__main__":
    async def main():
        manager = MongoDBManager()
        
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
