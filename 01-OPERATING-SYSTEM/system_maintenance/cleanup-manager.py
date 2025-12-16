"""
Cleanup Manager - مدير التنظيف
Manages system cleanup operations
"""

import logging
import os
from typing import List, Dict
from pathlib import Path
from datetime import datetime, timedelta


class CleanupManager:
    """
    Cleanup Manager Class
    Handles system cleanup tasks
    """
    
    def __init__(self):
        """Initialize Cleanup Manager"""
        self.logger = logging.getLogger(__name__)
        self.cleanup_history: List[Dict] = []
        
    def cleanup_temp_files(self, max_age_days: int = 7) -> Dict[str, int]:
        """
        Clean up temporary files
        
        Args:
            max_age_days: Maximum age of files to keep (days)
            
        Returns:
            Dictionary with cleanup statistics
        """
        self.logger.info(f"Cleaning up temporary files (older than {max_age_days} days)...")
        
        temp_dir = Path("temp")
        if not temp_dir.exists():
            return {"deleted": 0, "freed_mb": 0}
        
        cutoff_date = datetime.now() - timedelta(days=max_age_days)
        deleted_count = 0
        freed_bytes = 0
        
        try:
            for file_path in temp_dir.rglob("*"):
                if file_path.is_file():
                    file_mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
                    
                    if file_mtime < cutoff_date:
                        try:
                            file_size = file_path.stat().st_size
                            file_path.unlink()
                            deleted_count += 1
                            freed_bytes += file_size
                        except Exception as e:
                            self.logger.warning(f"Failed to delete {file_path}: {e}")
        
        except Exception as e:
            self.logger.error(f"Error during temp file cleanup: {e}")
        
        freed_mb = freed_bytes / (1024 * 1024)
        
        result = {
            "deleted": deleted_count,
            "freed_mb": round(freed_mb, 2)
        }
        
        self.logger.info(f"✅ Cleaned up {deleted_count} files, freed {freed_mb:.2f} MB")
        
        self.cleanup_history.append({
            "type": "temp_files",
            "timestamp": datetime.now().isoformat(),
            "result": result
        })
        
        return result
    
    def cleanup_cache(self, max_age_days: int = 30) -> Dict[str, int]:
        """
        Clean up cache files
        
        Args:
            max_age_days: Maximum age of cache files to keep
            
        Returns:
            Dictionary with cleanup statistics
        """
        self.logger.info(f"Cleaning up cache files (older than {max_age_days} days)...")
        
        cache_dir = Path("cache")
        if not cache_dir.exists():
            return {"deleted": 0, "freed_mb": 0}
        
        cutoff_date = datetime.now() - timedelta(days=max_age_days)
        deleted_count = 0
        freed_bytes = 0
        
        try:
            for file_path in cache_dir.rglob("*"):
                if file_path.is_file():
                    file_mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
                    
                    if file_mtime < cutoff_date:
                        try:
                            file_size = file_path.stat().st_size
                            file_path.unlink()
                            deleted_count += 1
                            freed_bytes += file_size
                        except Exception as e:
                            self.logger.warning(f"Failed to delete {file_path}: {e}")
        
        except Exception as e:
            self.logger.error(f"Error during cache cleanup: {e}")
        
        freed_mb = freed_bytes / (1024 * 1024)
        
        result = {
            "deleted": deleted_count,
            "freed_mb": round(freed_mb, 2)
        }
        
        self.logger.info(f"✅ Cleaned up {deleted_count} cache files, freed {freed_mb:.2f} MB")
        
        self.cleanup_history.append({
            "type": "cache",
            "timestamp": datetime.now().isoformat(),
            "result": result
        })
        
        return result
    
    def cleanup_old_logs(self, max_age_days: int = 90) -> Dict[str, int]:
        """
        Clean up old log files
        
        Args:
            max_age_days: Maximum age of log files to keep
            
        Returns:
            Dictionary with cleanup statistics
        """
        self.logger.info(f"Cleaning up old log files (older than {max_age_days} days)...")
        
        logs_dir = Path("logs")
        if not logs_dir.exists():
            return {"deleted": 0, "freed_mb": 0}
        
        cutoff_date = datetime.now() - timedelta(days=max_age_days)
        deleted_count = 0
        freed_bytes = 0
        
        try:
            for file_path in logs_dir.glob("*.log"):
                if file_path.is_file():
                    file_mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
                    
                    if file_mtime < cutoff_date:
                        try:
                            file_size = file_path.stat().st_size
                            file_path.unlink()
                            deleted_count += 1
                            freed_bytes += file_size
                        except Exception as e:
                            self.logger.warning(f"Failed to delete {file_path}: {e}")
        
        except Exception as e:
            self.logger.error(f"Error during log cleanup: {e}")
        
        freed_mb = freed_bytes / (1024 * 1024)
        
        result = {
            "deleted": deleted_count,
            "freed_mb": round(freed_mb, 2)
        }
        
        self.logger.info(f"✅ Cleaned up {deleted_count} log files, freed {freed_mb:.2f} MB")
        
        return result
    
    def perform_full_cleanup(self) -> Dict[str, Dict[str, int]]:
        """Perform full system cleanup"""
        self.logger.info("🧹 Performing full system cleanup...")
        
        results = {
            "temp_files": self.cleanup_temp_files(),
            "cache": self.cleanup_cache(),
            "logs": self.cleanup_old_logs()
        }
        
        total_freed = sum(r["freed_mb"] for r in results.values())
        total_deleted = sum(r["deleted"] for r in results.values())
        
        self.logger.info(
            f"✅ Full cleanup complete: {total_deleted} files deleted, "
            f"{total_freed:.2f} MB freed"
        )
        
        return results
    
    def get_cleanup_history(self, limit: int = 50) -> List[Dict]:
        """Get cleanup history"""
        return self.cleanup_history[-limit:]

