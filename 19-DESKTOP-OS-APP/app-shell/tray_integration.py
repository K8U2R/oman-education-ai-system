"""
تكامل أيقونة النظام
System Tray Integration
"""

from PySide6.QtWidgets import QSystemTrayIcon, QMenu, QApplication, QStyle
from PySide6.QtGui import QIcon, QAction
from PySide6.QtCore import QObject, Signal
from pathlib import Path


class SystemTrayManager(QObject):
    """مدير أيقونة النظام"""
    
    show_window = Signal()
    quit_app = Signal()
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.tray_icon = QSystemTrayIcon(parent)
        self.setup_tray()
    
    def setup_tray(self):
        """إعداد أيقونة النظام"""
        # إنشاء أيقونة بسيطة (يمكن استبدالها بأيقونة حقيقية)
        icon_path = Path(__file__).parent.parent / "assets" / "icon.png"
        
        if icon_path.exists():
            self.tray_icon.setIcon(QIcon(str(icon_path)))
        else:
            # استخدام أيقونة افتراضية من الـ QApplication
            app_style = QApplication.instance().style() if QApplication.instance() else None
            if app_style:
                self.tray_icon.setIcon(app_style.standardIcon(QStyle.SP_ComputerIcon))
        
        # إنشاء قائمة السياق
        menu = QMenu()
        
        show_action = QAction("إظهار النافذة", self)
        show_action.triggered.connect(self.show_window.emit)
        menu.addAction(show_action)
        
        menu.addSeparator()
        
        quit_action = QAction("خروج", self)
        quit_action.triggered.connect(self.quit_app.emit)
        menu.addAction(quit_action)
        
        self.tray_icon.setContextMenu(menu)
        self.tray_icon.activated.connect(self.on_tray_activated)
    
    def on_tray_activated(self, reason):
        """معالجة تفعيل أيقونة النظام"""
        if reason == QSystemTrayIcon.DoubleClick:
            self.show_window.emit()
    
    def show(self):
        """إظهار أيقونة النظام"""
        self.tray_icon.show()
    
    def hide(self):
        """إخفاء أيقونة النظام"""
        self.tray_icon.hide()
    
    def set_tooltip(self, text: str):
        """تعيين نص التلميح"""
        self.tray_icon.setToolTip(text)
    
    def show_message(self, title: str, message: str, icon=QSystemTrayIcon.Information, duration=3000):
        """عرض رسالة من أيقونة النظام"""
        if self.tray_icon.isSystemTrayAvailable():
            self.tray_icon.showMessage(title, message, icon, duration)
    
    def show_notification(self, title: str, message: str, notification_type: str = "info"):
        """عرض إشعار حسب النوع"""
        icon_map = {
            "info": QSystemTrayIcon.Information,
            "success": QSystemTrayIcon.Information,
            "warning": QSystemTrayIcon.Warning,
            "error": QSystemTrayIcon.Critical
        }
        icon = icon_map.get(notification_type, QSystemTrayIcon.Information)
        self.show_message(title, message, icon, 5000)

