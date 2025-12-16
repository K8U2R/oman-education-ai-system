"""
مشغل الواجهة الأمامية
Frontend Launcher
"""

import webbrowser
from pathlib import Path
from typing import Optional


class FrontendLauncher:
    """مشغل الواجهة الأمامية"""
    
    def __init__(self, frontend_url: str = "http://localhost:3000"):
        self.frontend_url = frontend_url
    
    def open_in_browser(self) -> bool:
        """فتح الواجهة في المتصفح"""
        try:
            webbrowser.open(self.frontend_url)
            return True
        except Exception:
            return False
    
    def get_url(self) -> str:
        """الحصول على رابط الواجهة"""
        return self.frontend_url

