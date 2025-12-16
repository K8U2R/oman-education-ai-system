"""
نظام التنبيهات
Notifications Widget
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QFrame, QPushButton
)
from PySide6.QtCore import Qt, QTimer, Signal
from PySide6.QtGui import QFont

from app_config import AppConfig
from pathlib import Path


class NotificationWidget(QFrame):
    """تنبيه واحد"""
    
    def __init__(self, title: str, message: str, notification_type: str = "info", parent=None):
        super().__init__(parent)
        self.notification_type = notification_type
        self.setup_ui(title, message)
        self.setFrameStyle(QFrame.Box)
        
        # ألوان حسب النوع
        colors = {
            "info": {"bg": "#252526", "border": "#4fc1ff", "text": "#4fc1ff"},
            "success": {"bg": "#252526", "border": "#4ec9b0", "text": "#4ec9b0"},
            "warning": {"bg": "#252526", "border": "#dcdcaa", "text": "#dcdcaa"},
            "error": {"bg": "#252526", "border": "#f48771", "text": "#f48771"}
        }
        
        color = colors.get(notification_type, colors["info"])
        self.setStyleSheet(f"""
            QFrame {{
                background-color: {color['bg']};
                border: 2px solid {color['border']};
                border-radius: 5px;
                padding: 10px;
            }}
        """)
    
    def setup_ui(self, title: str, message: str):
        """إعداد واجهة المستخدم"""
        layout = QVBoxLayout(self)
        
        # العنوان
        title_label = QLabel(title)
        title_label.setFont(QFont("Arial", 11, QFont.Bold))
        title_label.setStyleSheet(f"color: {self.get_color()};")
        layout.addWidget(title_label)
        
        # الرسالة
        message_label = QLabel(message)
        message_label.setFont(QFont("Arial", 10))
        message_label.setStyleSheet("color: #cccccc;")
        message_label.setWordWrap(True)
        layout.addWidget(message_label)
    
    def get_color(self) -> str:
        """الحصول على اللون حسب النوع"""
        colors = {
            "info": "#4fc1ff",
            "success": "#4ec9b0",
            "warning": "#dcdcaa",
            "error": "#f48771"
        }
        return colors.get(self.notification_type, "#cccccc")


class NotificationPanel(QWidget):
    """لوحة التنبيهات"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.notifications = []
        self.setup_ui()
        self.setup_timer()
    
    def setup_ui(self):
        """إعداد واجهة المستخدم"""
        layout = QVBoxLayout(self)
        layout.setSpacing(10)
        layout.setContentsMargins(10, 10, 10, 10)
        
        # العنوان
        title = QLabel("التنبيهات")
        title.setFont(QFont("Arial", 12, QFont.Bold))
        title.setStyleSheet("color: #cccccc;")
        layout.addWidget(title)
        
        # حاوية التنبيهات
        self.notifications_container = QWidget()
        self.notifications_layout = QVBoxLayout(self.notifications_container)
        self.notifications_layout.setSpacing(10)
        self.notifications_layout.addStretch()
        
        layout.addWidget(self.notifications_container)
    
    def setup_timer(self):
        """إعداد المؤقت لإزالة التنبيهات القديمة"""
        self.cleanup_timer = QTimer()
        self.cleanup_timer.timeout.connect(self.cleanup_old_notifications)
        self.cleanup_timer.start(5000)  # كل 5 ثوان
    
    def add_notification(self, title: str, message: str, notification_type: str = "info", duration: int = 5000):
        """إضافة تنبيه جديد"""
        notification = NotificationWidget(title, message, notification_type)
        self.notifications.append({
            "widget": notification,
            "duration": duration,
            "timestamp": 0
        })
        
        # إدراج قبل stretch
        count = self.notifications_layout.count()
        self.notifications_layout.insertWidget(count - 1, notification)
        
        # إزالة تلقائية بعد المدة
        if duration > 0:
            QTimer.singleShot(duration, lambda: self.remove_notification(notification))
    
    def remove_notification(self, notification: NotificationWidget):
        """إزالة تنبيه"""
        for item in self.notifications[:]:
            if item["widget"] == notification:
                self.notifications.remove(item)
                notification.deleteLater()
                break
    
    def cleanup_old_notifications(self):
        """تنظيف التنبيهات القديمة"""
        # يمكن إضافة منطق إضافي هنا
        pass
    
    def clear_all(self):
        """مسح جميع التنبيهات"""
        for item in self.notifications[:]:
            item["widget"].deleteLater()
        self.notifications.clear()

