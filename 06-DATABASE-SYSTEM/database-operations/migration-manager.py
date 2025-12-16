"""
Migration Manager
migration-manager.py

مدير الهجرات - إدارة هجرات قاعدة البيانات
Migration Manager - Manages database migrations

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from pathlib import Path
from enum import Enum
from dataclasses import dataclass
import json

logger = logging.getLogger(__name__)


class MigrationStatus(Enum):
    """حالة الهجرة"""
    PENDING = "pending"
    APPLIED = "applied"
    ROLLED_BACK = "rolled_back"
    FAILED = "failed"


@dataclass
class Migration:
    """هجرة"""
    id: str
    name: str
    version: str
    up_sql: str
    down_sql: str
    status: MigrationStatus
    applied_at: Optional[datetime] = None
    rolled_back_at: Optional[datetime] = None
    error: Optional[str] = None


class MigrationManager:
    """
    مدير الهجرات
    يدير هجرات قاعدة البيانات
    """
    
    def __init__(self, migrations_dir: str = "migrations"):
        """
        تهيئة مدير الهجرات
        
        Args:
            migrations_dir: مجلد الهجرات
        """
        self.name = "Migration Manager"
        self.version = "1.0.0"
        self.migrations_dir = Path(migrations_dir)
        self.migrations_dir.mkdir(exist_ok=True)
        self.migrations: Dict[str, Migration] = {}
        self.applied_migrations: List[str] = []
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    def create_migration(self, name: str, up_sql: str, down_sql: str = "") -> Migration:
        """
        إنشاء هجرة جديدة
        
        Args:
            name: اسم الهجرة
            up_sql: SQL للتنفيذ
            down_sql: SQL للتراجع
            
        Returns:
            Migration: الهجرة
        """
        migration_id = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{name}"
        version = datetime.now().strftime('%Y%m%d%H%M%S')
        
        migration = Migration(
            id=migration_id,
            name=name,
            version=version,
            up_sql=up_sql,
            down_sql=down_sql,
            status=MigrationStatus.PENDING
        )
        
        # حفظ الهجرة
        self._save_migration(migration)
        self.migrations[migration_id] = migration
        
        logger.info(f"✅ تم إنشاء هجرة: {migration_id}")
        return migration
    
    def _save_migration(self, migration: Migration):
        """حفظ الهجرة في ملف"""
        migration_file = self.migrations_dir / f"{migration.id}.json"
        
        data = {
            "id": migration.id,
            "name": migration.name,
            "version": migration.version,
            "up_sql": migration.up_sql,
            "down_sql": migration.down_sql,
            "status": migration.status.value,
            "applied_at": migration.applied_at.isoformat() if migration.applied_at else None,
            "rolled_back_at": migration.rolled_back_at.isoformat() if migration.rolled_back_at else None,
            "error": migration.error
        }
        
        with open(migration_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def load_migrations(self):
        """تحميل الهجرات من الملفات"""
        for migration_file in self.migrations_dir.glob("*.json"):
            try:
                with open(migration_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                migration = Migration(
                    id=data["id"],
                    name=data["name"],
                    version=data["version"],
                    up_sql=data["up_sql"],
                    down_sql=data.get("down_sql", ""),
                    status=MigrationStatus(data["status"]),
                    applied_at=datetime.fromisoformat(data["applied_at"]) if data.get("applied_at") else None,
                    rolled_back_at=datetime.fromisoformat(data["rolled_back_at"]) if data.get("rolled_back_at") else None,
                    error=data.get("error")
                )
                
                self.migrations[migration.id] = migration
                
                if migration.status == MigrationStatus.APPLIED:
                    self.applied_migrations.append(migration.id)
                    
            except Exception as e:
                logger.error(f"❌ خطأ في تحميل الهجرة {migration_file}: {e}")
    
    async def apply_migration(self, migration_id: str, db_manager) -> bool:
        """
        تطبيق هجرة
        
        Args:
            migration_id: معرف الهجرة
            db_manager: مدير قاعدة البيانات
            
        Returns:
            bool: True إذا نجح التطبيق
        """
        if migration_id not in self.migrations:
            logger.error(f"الهجرة غير موجودة: {migration_id}")
            return False
        
        migration = self.migrations[migration_id]
        
        if migration.status == MigrationStatus.APPLIED:
            logger.warning(f"الهجرة مطبقة بالفعل: {migration_id}")
            return True
        
        try:
            # تنفيذ SQL
            await db_manager.execute_command(migration.up_sql)
            
            migration.status = MigrationStatus.APPLIED
            migration.applied_at = datetime.now()
            migration.error = None
            
            self._save_migration(migration)
            self.applied_migrations.append(migration_id)
            
            logger.info(f"✅ تم تطبيق الهجرة: {migration_id}")
            return True
            
        except Exception as e:
            migration.status = MigrationStatus.FAILED
            migration.error = str(e)
            self._save_migration(migration)
            
            logger.error(f"❌ فشل في تطبيق الهجرة {migration_id}: {e}")
            return False
    
    async def rollback_migration(self, migration_id: str, db_manager) -> bool:
        """
        التراجع عن هجرة
        
        Args:
            migration_id: معرف الهجرة
            db_manager: مدير قاعدة البيانات
            
        Returns:
            bool: True إذا نجح التراجع
        """
        if migration_id not in self.migrations:
            logger.error(f"الهجرة غير موجودة: {migration_id}")
            return False
        
        migration = self.migrations[migration_id]
        
        if migration.status != MigrationStatus.APPLIED:
            logger.warning(f"الهجرة غير مطبقة: {migration_id}")
            return False
        
        if not migration.down_sql:
            logger.error(f"لا يوجد SQL للتراجع: {migration_id}")
            return False
        
        try:
            # تنفيذ SQL للتراجع
            await db_manager.execute_command(migration.down_sql)
            
            migration.status = MigrationStatus.ROLLED_BACK
            migration.rolled_back_at = datetime.now()
            
            self._save_migration(migration)
            if migration_id in self.applied_migrations:
                self.applied_migrations.remove(migration_id)
            
            logger.info(f"✅ تم التراجع عن الهجرة: {migration_id}")
            return True
            
        except Exception as e:
            migration.error = str(e)
            self._save_migration(migration)
            
            logger.error(f"❌ فشل في التراجع عن الهجرة {migration_id}: {e}")
            return False
    
    async def migrate(self, db_manager, target_version: Optional[str] = None) -> bool:
        """
        تطبيق جميع الهجرات المعلقة
        
        Args:
            db_manager: مدير قاعدة البيانات
            target_version: الإصدار المستهدف (None لجميع الهجرات)
            
        Returns:
            bool: True إذا نجح التطبيق
        """
        # ترتيب الهجرات حسب الإصدار
        pending_migrations = [
            m for m in self.migrations.values()
            if m.status == MigrationStatus.PENDING
        ]
        pending_migrations.sort(key=lambda m: m.version)
        
        if target_version:
            pending_migrations = [m for m in pending_migrations if m.version <= target_version]
        
        success = True
        for migration in pending_migrations:
            result = await self.apply_migration(migration.id, db_manager)
            if not result:
                success = False
                break
        
        return success
    
    def get_status(self) -> Dict:
        """الحصول على حالة الهجرات"""
        return {
            "total_migrations": len(self.migrations),
            "applied": len(self.applied_migrations),
            "pending": sum(1 for m in self.migrations.values() if m.status == MigrationStatus.PENDING),
            "failed": sum(1 for m in self.migrations.values() if m.status == MigrationStatus.FAILED)
        }


if __name__ == "__main__":
    manager = MigrationManager()
    
    # مثال على إنشاء هجرة
    migration = manager.create_migration(
        name="create_users_table",
        up_sql="""
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY,
            email VARCHAR(255) UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        down_sql="DROP TABLE IF EXISTS users;"
    )
    
    print(f"\n📦 الهجرة:")
    print(f"  ID: {migration.id}")
    print(f"  الاسم: {migration.name}")
    print(f"  الحالة: {migration.status.value}")
