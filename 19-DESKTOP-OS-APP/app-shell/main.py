"""
النقطة الرئيسية لتطبيق سطح المكتب
Main Entry Point for Desktop Application
"""

import sys
import os
from pathlib import Path

# إضافة مسار المشروع
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from PySide6.QtWidgets import QApplication
from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon

from app_config import AppConfig
from theming import ThemeManager
from auto_theme import AutoThemeDetector
from tray_integration import SystemTrayManager
from localization import LocalizationManager
from main_window import MainWindow


def main():
    """الدالة الرئيسية"""
    # إعداد الترميز UTF-8
    if sys.platform == 'win32':
        import io
        try:
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
            sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
        except Exception:
            pass
    
    # إنشاء التطبيق
    app = QApplication(sys.argv)
    app.setApplicationName("Oman Education AI System")
    app.setOrganizationName("Oman Education")
    
    # تحميل الإعدادات
    config = AppConfig()
    
    # تطبيق الثيمة
    theme_manager = ThemeManager()
    auto_theme_detector = AutoThemeDetector()
    localization = LocalizationManager(config.get("window.language", "ar"))
    
    # تحديد الثيم
    theme_setting = config.get("window.theme", "auto")
    if theme_setting == "auto" or config.get("window.auto_theme", True):
        detected_theme = auto_theme_detector.get_theme()
        theme_manager.set_theme(detected_theme)
        config.set("window.theme", detected_theme)
    else:
        theme_manager.set_theme(theme_setting)
    
    palette = app.palette()
    theme_manager.apply_to_palette(palette)
    app.setPalette(palette)
    
    # ربط تحديث الثيم التلقائي
    if config.get("window.auto_theme", True):
        auto_theme_detector.theme_detected.connect(theme_manager.set_theme)
    
    # إنشاء النافذة الرئيسية
    window = MainWindow(config, theme_manager, localization, project_root)
    
    # إعداد أيقونة النظام
    if config.get("notifications.show_system_tray", True):
        tray = SystemTrayManager(window)
        tray.show_window.connect(window.show)
        tray.show_window.connect(window.raise_)
        tray.quit_app.connect(app.quit)
        tray.show()
        
        if config.get("notifications.minimize_to_tray", True):
            window.set_close_to_tray(True, tray)
    
    # إظهار النافذة
    window.show()
    
    # تشغيل التطبيق
    sys.exit(app.exec())


if __name__ == "__main__":
    main()

