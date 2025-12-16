"""
Backup Manager
backup-manager.py

مدير النسخ الاحتياطي - إدارة نسخ احتياطية لقواعد البيانات
Backup Manager - Manages database backups

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
import subprocess
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from pathlib import Path
from enum import Enum
from dataclasses import dataclass
import json
import gzip
import shutil

logger = logging.getLogger(__name__)


class BackupType(Enum):
    """نوع النسخ الاحتياطي"""
    FULL = "full"
    INCREMENTAL = "incremental"
    DIFFERENTIAL = "differential"


class BackupStatus(Enum):
    """حالة النسخ الاحتياطي"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class Backup:
    """نسخ احتياطي"""
    id: str
    type: BackupType
    database_name: str
    file_path: str
    size: int
    status: BackupStatus
    created_at: datetime
    completed_at: Optional[datetime] = None
    error: Optional[str] = None


class BackupManager:
    """
    مدير النسخ الاحتياطي
    يدير النسخ الاحتياطية لقواعد البيانات
    """
    
    def __init__(self, backup_dir: str = "backups"):
        """
        تهيئة مدير النسخ الاحتياطي
        
        Args:
            backup_dir: مجلد النسخ الاحتياطية
        """
        self.name = "Backup Manager"
        self.version = "1.0.0"
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        self.backups: Dict[str, Backup] = {}
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    async def create_backup(
        self,
        database_name: str,
        database_url: str,
        backup_type: BackupType = BackupType.FULL
    ) -> Backup:
        """
        إنشاء نسخ احتياطي
        
        Args:
            database_name: اسم قاعدة البيانات
            database_url: رابط قاعدة البيانات
            backup_type: نوع النسخ الاحتياطي
            
        Returns:
            Backup: النسخ الاحتياطي
        """
        backup_id = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        backup_file = self.backup_dir / f"{backup_id}.sql.gz"
        
        backup = Backup(
            id=backup_id,
            type=backup_type,
            database_name=database_name,
            file_path=str(backup_file),
            size=0,
            status=BackupStatus.IN_PROGRESS,
            created_at=datetime.now()
        )
        
        self.backups[backup_id] = backup
        
        try:
            # إنشاء النسخ الاحتياطي
            if database_url.startswith("postgresql://") or database_url.startswith("postgres://"):
                await self._backup_postgresql(database_url, backup_file)
            elif database_url.startswith("mongodb://"):
                await self._backup_mongodb(database_url, backup_file)
            else:
                raise Exception(f"نوع قاعدة البيانات غير مدعوم: {database_url}")
            
            # تحديث حالة النسخ الاحتياطي
            backup.status = BackupStatus.COMPLETED
            backup.completed_at = datetime.now()
            backup.size = backup_file.stat().st_size if backup_file.exists() else 0
            
            logger.info(f"✅ تم إنشاء النسخ الاحتياطي: {backup_id} ({backup.size / 1024 / 1024:.2f} MB)")
            
        except Exception as e:
            backup.status = BackupStatus.FAILED
            backup.error = str(e)
            logger.error(f"❌ فشل في إنشاء النسخ الاحتياطي {backup_id}: {e}")
        
        return backup
    
    async def _backup_postgresql(self, database_url: str, backup_file: Path):
        """نسخ احتياطي PostgreSQL"""
        try:
            # استخراج معلومات الاتصال
            import re
            match = re.match(r'postgres(ql)?://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', database_url)
            if not match:
                raise Exception("رابط قاعدة البيانات غير صحيح")
            
            user = match.group(2)
            password = match.group(3)
            host = match.group(4)
            port = match.group(5)
            database = match.group(6)
            
            # استخدام pg_dump
            env = {"PGPASSWORD": password}
            cmd = [
                "pg_dump",
                "-h", host,
                "-p", port,
                "-U", user,
                "-d", database,
                "--no-owner",
                "--no-acl"
            ]
            
            # تنفيذ النسخ الاحتياطي
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=env
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                raise Exception(f"فشل pg_dump: {stderr.decode()}")
            
            # ضغط الملف
            with gzip.open(backup_file, 'wb') as f:
                f.write(stdout)
            
        except FileNotFoundError:
            raise Exception("pg_dump غير مثبت - يرجى تثبيت PostgreSQL client tools")
        except Exception as e:
            raise Exception(f"خطأ في نسخ PostgreSQL: {e}")
    
    async def _backup_mongodb(self, database_url: str, backup_file: Path):
        """نسخ احتياطي MongoDB"""
        try:
            # استخدام mongodump
            import re
            match = re.match(r'mongodb://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', database_url)
            if not match:
                raise Exception("رابط قاعدة البيانات غير صحيح")
            
            user = match.group(1)
            password = match.group(2)
            host = match.group(3)
            port = match.group(4)
            database = match.group(5)
            
            # إنشاء مجلد مؤقت
            temp_dir = self.backup_dir / f"temp_{datetime.now().timestamp()}"
            temp_dir.mkdir(exist_ok=True)
            
            cmd = [
                "mongodump",
                f"--uri={database_url}",
                f"--db={database}",
                f"--out={temp_dir}"
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                raise Exception(f"فشل mongodump: {stderr.decode()}")
            
            # ضغط المجلد
            shutil.make_archive(str(backup_file).replace('.gz', ''), 'gztar', temp_dir)
            
            # حذف المجلد المؤقت
            shutil.rmtree(temp_dir)
            
        except FileNotFoundError:
            raise Exception("mongodump غير مثبت - يرجى تثبيت MongoDB tools")
        except Exception as e:
            raise Exception(f"خطأ في نسخ MongoDB: {e}")
    
    async def restore_backup(self, backup_id: str, database_url: str) -> bool:
        """
        استعادة نسخ احتياطي
        
        Args:
            backup_id: معرف النسخ الاحتياطي
            database_url: رابط قاعدة البيانات
            
        Returns:
            bool: True إذا نجحت الاستعادة
        """
        if backup_id not in self.backups:
            logger.error(f"النسخ الاحتياطي غير موجود: {backup_id}")
            return False
        
        backup = self.backups[backup_id]
        
        if backup.status != BackupStatus.COMPLETED:
            logger.error(f"النسخ الاحتياطي غير مكتمل: {backup_id}")
            return False
        
        backup_file = Path(backup.file_path)
        if not backup_file.exists():
            logger.error(f"ملف النسخ الاحتياطي غير موجود: {backup_file}")
            return False
        
        try:
            if database_url.startswith("postgresql://") or database_url.startswith("postgres://"):
                await self._restore_postgresql(database_url, backup_file)
            elif database_url.startswith("mongodb://"):
                await self._restore_mongodb(database_url, backup_file)
            else:
                raise Exception(f"نوع قاعدة البيانات غير مدعوم: {database_url}")
            
            logger.info(f"✅ تم استعادة النسخ الاحتياطي: {backup_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ فشل في استعادة النسخ الاحتياطي {backup_id}: {e}")
            return False
    
    async def _restore_postgresql(self, database_url: str, backup_file: Path):
        """استعادة PostgreSQL"""
        import re
        match = re.match(r'postgres(ql)?://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', database_url)
        if not match:
            raise Exception("رابط قاعدة البيانات غير صحيح")
        
        user = match.group(2)
        password = match.group(3)
        host = match.group(4)
        port = match.group(5)
        database = match.group(6)
        
        # فك الضغط
        temp_file = backup_file.with_suffix('.sql')
        with gzip.open(backup_file, 'rb') as f_in:
            with open(temp_file, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        # استعادة
        env = {"PGPASSWORD": password}
        cmd = [
            "psql",
            "-h", host,
            "-p", port,
            "-U", user,
            "-d", database,
            "-f", str(temp_file)
        ]
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env
        )
        
        stdout, stderr = await process.communicate()
        
        # حذف الملف المؤقت
        temp_file.unlink()
        
        if process.returncode != 0:
            raise Exception(f"فشل psql: {stderr.decode()}")
    
    async def _restore_mongodb(self, database_url: str, backup_file: Path):
        """استعادة MongoDB"""
        # تنفيذ mongorestore
        cmd = [
            "mongorestore",
            f"--uri={database_url}",
            f"--archive={backup_file}",
            "--gzip"
        ]
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            raise Exception(f"فشل mongorestore: {stderr.decode()}")
    
    def list_backups(self, database_name: Optional[str] = None) -> List[Backup]:
        """
        قائمة النسخ الاحتياطية
        
        Args:
            database_name: اسم قاعدة البيانات (None للكل)
            
        Returns:
            list: قائمة النسخ الاحتياطية
        """
        backups = list(self.backups.values())
        
        if database_name:
            backups = [b for b in backups if b.database_name == database_name]
        
        backups.sort(key=lambda b: b.created_at, reverse=True)
        return backups
    
    def cleanup_old_backups(self, days: int = 30):
        """
        تنظيف النسخ الاحتياطية القديمة
        
        Args:
            days: عدد الأيام للاحتفاظ
        """
        cutoff_date = datetime.now() - timedelta(days=days)
        
        for backup in list(self.backups.values()):
            if backup.created_at < cutoff_date:
                backup_file = Path(backup.file_path)
                if backup_file.exists():
                    backup_file.unlink()
                    logger.info(f"✅ تم حذف النسخ الاحتياطي القديم: {backup.id}")
                
                del self.backups[backup.id]


if __name__ == "__main__":
    async def main():
        manager = BackupManager()
        
        # مثال على إنشاء نسخ احتياطي
        backup = await manager.create_backup(
            database_name="test_db",
            database_url="postgresql://user:password@localhost:5432/test_db"
        )
        
        print(f"\n💾 النسخ الاحتياطي:")
        print(f"  ID: {backup.id}")
        print(f"  الحالة: {backup.status.value}")
        print(f"  الحجم: {backup.size / 1024 / 1024:.2f} MB")
    
    asyncio.run(main())
