"""
مدير الجلسات - حفظ واستعادة حالة الخدمات
Session Manager - Save and Restore Service States
"""

import json
from pathlib import Path
from typing import Dict, Optional
from datetime import datetime
from PySide6.QtCore import QObject, Signal


class SessionManager(QObject):
    """مدير الجلسات"""
    
    session_loaded = Signal(dict)  # session_data
    session_saved = Signal(str)  # session_file
    
    def __init__(self, project_root: Path):
        super().__init__()
        self.project_root = project_root
        self.sessions_dir = project_root / "19-DESKTOP-OS-APP" / "sessions"
        self.sessions_dir.mkdir(exist_ok=True)
        self.current_session_file: Optional[Path] = None
    
    def save_session(self, services_state: Dict[str, dict], session_name: str = None) -> Path:
        """
        حفظ حالة الجلسة
        
        Args:
            services_state: حالة الخدمات
            session_name: اسم الجلسة (اختياري)
        
        Returns:
            مسار ملف الجلسة
        """
        if session_name is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            session_name = f"session_{timestamp}"
        
        session_file = self.sessions_dir / f"{session_name}.json"
        
        session_data = {
            "name": session_name,
            "timestamp": datetime.now().isoformat(),
            "services": services_state,
            "version": "1.0.0"
        }
        
        try:
            with open(session_file, 'w', encoding='utf-8') as f:
                json.dump(session_data, f, indent=2, ensure_ascii=False)
            
            self.current_session_file = session_file
            self.session_saved.emit(str(session_file))
            return session_file
        except Exception as e:
            raise Exception(f"فشل حفظ الجلسة: {str(e)}")
    
    def load_session(self, session_file: Path = None) -> Optional[Dict]:
        """
        تحميل حالة الجلسة
        
        Args:
            session_file: مسار ملف الجلسة (اختياري - يستخدم آخر جلسة)
        
        Returns:
            بيانات الجلسة أو None
        """
        if session_file is None:
            # البحث عن آخر جلسة
            session_files = sorted(
                self.sessions_dir.glob("session_*.json"),
                key=lambda p: p.stat().st_mtime,
                reverse=True
            )
            if not session_files:
                return None
            session_file = session_files[0]
        
        if not session_file.exists():
            return None
        
        try:
            with open(session_file, 'r', encoding='utf-8') as f:
                session_data = json.load(f)
            
            self.current_session_file = session_file
            self.session_loaded.emit(session_data)
            return session_data
        except Exception as e:
            raise Exception(f"فشل تحميل الجلسة: {str(e)}")
    
    def get_available_sessions(self) -> list:
        """الحصول على قائمة الجلسات المتاحة"""
        sessions = []
        for session_file in sorted(
            self.sessions_dir.glob("session_*.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True
        ):
            try:
                with open(session_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    sessions.append({
                        "file": session_file,
                        "name": data.get("name", session_file.stem),
                        "timestamp": data.get("timestamp"),
                        "services_count": len(data.get("services", {}))
                    })
            except Exception:
                continue
        
        return sessions
    
    def delete_session(self, session_file: Path) -> bool:
        """حذف جلسة"""
        try:
            if session_file.exists():
                session_file.unlink()
                if self.current_session_file == session_file:
                    self.current_session_file = None
                return True
            return False
        except Exception:
            return False
    
    def auto_save(self, services_state: Dict[str, dict]):
        """حفظ تلقائي للجلسة"""
        try:
            self.save_session(services_state, "autosave")
        except Exception:
            pass  # فشل الحفظ التلقائي لا يجب أن يعطل التطبيق

