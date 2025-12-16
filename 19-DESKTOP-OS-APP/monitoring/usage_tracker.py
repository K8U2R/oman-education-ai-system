"""
تتبع الاستخدام والجلسات
Usage Tracker
"""

from typing import Dict, List
from datetime import datetime, timedelta
from collections import defaultdict


class UsageTracker:
    """متتبع الاستخدام"""
    
    def __init__(self):
        self.sessions: List[Dict] = []
        self.usage_stats: Dict[str, Dict] = defaultdict(lambda: {
            "total_time": timedelta(0),
            "start_count": 0,
            "last_start": None
        })
    
    def start_session(self, service_name: str):
        """بدء جلسة استخدام"""
        session = {
            "service": service_name,
            "start_time": datetime.now(),
            "end_time": None,
            "duration": None
        }
        self.sessions.append(session)
        
        stats = self.usage_stats[service_name]
        stats["start_count"] += 1
        stats["last_start"] = datetime.now()
        
        return session
    
    def end_session(self, service_name: str):
        """إنهاء جلسة استخدام"""
        # البحث عن آخر جلسة غير منتهية
        for session in reversed(self.sessions):
            if session["service"] == service_name and session["end_time"] is None:
                session["end_time"] = datetime.now()
                session["duration"] = session["end_time"] - session["start_time"]
                
                stats = self.usage_stats[service_name]
                stats["total_time"] += session["duration"]
                
                return session
        return None
    
    def get_service_stats(self, service_name: str) -> Dict:
        """الحصول على إحصائيات خدمة"""
        return self.usage_stats.get(service_name, {
            "total_time": timedelta(0),
            "start_count": 0,
            "last_start": None
        })
    
    def get_all_stats(self) -> Dict[str, Dict]:
        """الحصول على جميع الإحصائيات"""
        return dict(self.usage_stats)
    
    def get_recent_sessions(self, hours: int = 24) -> List[Dict]:
        """الحصول على الجلسات الأخيرة"""
        cutoff = datetime.now() - timedelta(hours=hours)
        return [s for s in self.sessions if s["start_time"] >= cutoff]

