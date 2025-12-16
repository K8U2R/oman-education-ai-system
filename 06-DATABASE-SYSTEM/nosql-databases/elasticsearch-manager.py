"""
Elasticsearch Manager
elasticsearch-manager.py

مدير Elasticsearch - إدارة البحث والتحليل
Elasticsearch Manager - Manages search and analytics

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from elasticsearch import AsyncElasticsearch
from elasticsearch.helpers import async_bulk

logger = logging.getLogger(__name__)


class ElasticsearchManager:
    """
    مدير Elasticsearch
    يدير عمليات البحث والتحليل في Elasticsearch
    """
    
    def __init__(
        self,
        hosts: List[str] = None,
        cloud_id: Optional[str] = None,
        api_key: Optional[str] = None
    ):
        """
        تهيئة مدير Elasticsearch
        
        Args:
            hosts: قائمة المضيفين
            cloud_id: معرف السحابة
            api_key: مفتاح API
        """
        self.name = "Elasticsearch Manager"
        self.version = "1.0.0"
        self.hosts = hosts or ["localhost:9200"]
        self.cloud_id = cloud_id
        self.api_key = api_key
        
        # Client
        self.client: Optional[AsyncElasticsearch] = None
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def initialize(self):
        """تهيئة الاتصال بـ Elasticsearch"""
        try:
            # إعدادات الاتصال
            connection_params = {}
            
            if self.cloud_id:
                connection_params["cloud_id"] = self.cloud_id
            else:
                connection_params["hosts"] = self.hosts
            
            if self.api_key:
                connection_params["api_key"] = self.api_key
            
            # تهيئة Client
            self.client = AsyncElasticsearch(**connection_params)
            
            # اختبار الاتصال
            await self.test_connection()
            
            logger.info("✅ تم تهيئة Elasticsearch Manager بنجاح")
            
        except Exception as e:
            logger.error(f"❌ فشل في تهيئة Elasticsearch Manager: {e}")
            raise
    
    async def test_connection(self) -> bool:
        """
        اختبار الاتصال
        
        Returns:
            bool: True إذا نجح الاتصال
        """
        try:
            if self.client:
                info = await self.client.info()
                return info is not None
            return False
        except Exception as e:
            logger.error(f"❌ فشل اختبار الاتصال: {e}")
            return False
    
    async def create_index(self, index_name: str, mappings: Optional[Dict] = None, settings: Optional[Dict] = None) -> bool:
        """
        إنشاء فهرس
        
        Args:
            index_name: اسم الفهرس
            mappings: تعيينات الحقول
            settings: إعدادات الفهرس
            
        Returns:
            bool: True إذا نجح الإنشاء
        """
        try:
            if not self.client:
                raise Exception("Elasticsearch client غير مهيأ")
            
            body = {}
            if mappings:
                body["mappings"] = mappings
            if settings:
                body["settings"] = settings
            
            await self.client.indices.create(index=index_name, body=body)
            logger.info(f"✅ تم إنشاء الفهرس: {index_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في إنشاء الفهرس {index_name}: {e}")
            return False
    
    async def delete_index(self, index_name: str) -> bool:
        """
        حذف فهرس
        
        Args:
            index_name: اسم الفهرس
            
        Returns:
            bool: True إذا نجح الحذف
        """
        try:
            if not self.client:
                raise Exception("Elasticsearch client غير مهيأ")
            
            await self.client.indices.delete(index=index_name)
            logger.info(f"✅ تم حذف الفهرس: {index_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في حذف الفهرس {index_name}: {e}")
            return False
    
    async def index_document(self, index_name: str, document: Dict, doc_id: Optional[str] = None) -> bool:
        """
        فهرسة وثيقة
        
        Args:
            index_name: اسم الفهرس
            document: الوثيقة
            doc_id: معرف الوثيقة (اختياري)
            
        Returns:
            bool: True إذا نجحت الفهرسة
        """
        try:
            if not self.client:
                raise Exception("Elasticsearch client غير مهيأ")
            
            # إضافة timestamp
            document['indexed_at'] = datetime.now().isoformat()
            
            params = {"index": index_name, "body": document}
            if doc_id:
                params["id"] = doc_id
            
            await self.client.index(**params)
            logger.info(f"✅ تم فهرسة وثيقة في {index_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ خطأ في فهرسة الوثيقة: {e}")
            return False
    
    async def bulk_index(self, index_name: str, documents: List[Dict]) -> bool:
        """
        فهرسة عدة وثائق
        
        Args:
            index_name: اسم الفهرس
            documents: قائمة الوثائق
            
        Returns:
            bool: True إذا نجحت الفهرسة
        """
        try:
            if not self.client:
                raise Exception("Elasticsearch client غير مهيأ")
            
            actions = []
            for doc in documents:
                action = {
                    "_index": index_name,
                    "_source": doc
                }
                if "id" in doc:
                    action["_id"] = doc.pop("id")
                actions.append(action)
            
            await async_bulk(self.client, actions)
            logger.info(f"✅ تم فهرسة {len(documents)} وثيقة في {index_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ خطأ في الفهرسة المتعددة: {e}")
            return False
    
    async def search(self, index_name: str, query: Dict, size: int = 10, from_: int = 0) -> Dict:
        """
        بحث في الفهرس
        
        Args:
            index_name: اسم الفهرس
            query: استعلام البحث
            size: عدد النتائج
            from_: نقطة البداية
            
        Returns:
            dict: نتائج البحث
        """
        try:
            if not self.client:
                raise Exception("Elasticsearch client غير مهيأ")
            
            body = {
                "query": query,
                "size": size,
                "from": from_
            }
            
            result = await self.client.search(index=index_name, body=body)
            
            return {
                "total": result["hits"]["total"]["value"],
                "hits": [hit["_source"] for hit in result["hits"]["hits"]],
                "took": result["took"]
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في البحث: {e}")
            return {"total": 0, "hits": [], "took": 0}
    
    async def get_document(self, index_name: str, doc_id: str) -> Optional[Dict]:
        """
        الحصول على وثيقة
        
        Args:
            index_name: اسم الفهرس
            doc_id: معرف الوثيقة
            
        Returns:
            dict: الوثيقة أو None
        """
        try:
            if not self.client:
                raise Exception("Elasticsearch client غير مهيأ")
            
            result = await self.client.get(index=index_name, id=doc_id)
            return result["_source"]
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على الوثيقة: {e}")
            return None
    
    async def update_document(self, index_name: str, doc_id: str, updates: Dict) -> bool:
        """
        تحديث وثيقة
        
        Args:
            index_name: اسم الفهرس
            doc_id: معرف الوثيقة
            updates: التحديثات
            
        Returns:
            bool: True إذا نجح التحديث
        """
        try:
            if not self.client:
                raise Exception("Elasticsearch client غير مهيأ")
            
            await self.client.update(
                index=index_name,
                id=doc_id,
                body={"doc": updates}
            )
            logger.info(f"✅ تم تحديث الوثيقة {doc_id} في {index_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ خطأ في التحديث: {e}")
            return False
    
    async def delete_document(self, index_name: str, doc_id: str) -> bool:
        """
        حذف وثيقة
        
        Args:
            index_name: اسم الفهرس
            doc_id: معرف الوثيقة
            
        Returns:
            bool: True إذا نجح الحذف
        """
        try:
            if not self.client:
                raise Exception("Elasticsearch client غير مهيأ")
            
            await self.client.delete(index=index_name, id=doc_id)
            logger.info(f"✅ تم حذف الوثيقة {doc_id} من {index_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحذف: {e}")
            return False
    
    async def get_stats(self) -> Dict:
        """
        الحصول على إحصائيات
        
        Returns:
            dict: الإحصائيات
        """
        try:
            if not self.client:
                return {}
            
            cluster_health = await self.client.cluster.health()
            cluster_stats = await self.client.cluster.stats()
            
            return {
                "cluster_name": cluster_health.get("cluster_name"),
                "status": cluster_health.get("status"),
                "number_of_nodes": cluster_health.get("number_of_nodes"),
                "number_of_data_nodes": cluster_health.get("number_of_data_nodes"),
                "active_primary_shards": cluster_health.get("active_primary_shards"),
                "active_shards": cluster_health.get("active_shards")
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على الإحصائيات: {e}")
            return {}
    
    async def close(self):
        """إغلاق الاتصال"""
        try:
            if self.client:
                await self.client.close()
            
            logger.info("✅ تم إغلاق Elasticsearch Manager")
            
        except Exception as e:
            logger.error(f"❌ خطأ في إغلاق Elasticsearch Manager: {e}")


if __name__ == "__main__":
    async def main():
        manager = ElasticsearchManager()
        
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
