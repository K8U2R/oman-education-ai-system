"""
ثيم تلقائي حسب نظام التشغيل
Auto Theme based on OS
"""

from PySide6.QtCore import QObject, Signal
import sys


class AutoThemeDetector(QObject):
    """مكتشف الثيم التلقائي"""
    
    theme_detected = Signal(str)  # theme_name
    
    def __init__(self):
        super().__init__()
        self.current_theme = self.detect_system_theme()
    
    def detect_system_theme(self) -> str:
        """
        اكتشاف ثيم نظام التشغيل
        
        Returns:
            "dark" أو "light"
        """
        if sys.platform == "win32":
            try:
                import winreg
                # قراءة إعدادات Windows
                key = winreg.OpenKey(
                    winreg.HKEY_CURRENT_USER,
                    r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"
                )
                try:
                    apps_use_light_theme = winreg.QueryValueEx(key, "AppsUseLightTheme")[0]
                    winreg.CloseKey(key)
                    return "light" if apps_use_light_theme else "dark"
                except FileNotFoundError:
                    winreg.CloseKey(key)
                    return "dark"  # افتراضي
            except Exception:
                return "dark"  # افتراضي في حالة الخطأ
        elif sys.platform == "darwin":  # macOS
            # يمكن إضافة كشف macOS هنا
            return "dark"  # افتراضي
        else:  # Linux
            # يمكن إضافة كشف Linux هنا
            return "dark"  # افتراضي
    
    def get_theme(self) -> str:
        """الحصول على الثيم الحالي"""
        return self.current_theme
    
    def update_theme(self):
        """تحديث الثيم من النظام"""
        new_theme = self.detect_system_theme()
        if new_theme != self.current_theme:
            self.current_theme = new_theme
            self.theme_detected.emit(new_theme)

