"""
مركز التحكم
Controls Center Widget
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QPushButton, QGroupBox, QGridLayout, QMessageBox
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QFont

from pathlib import Path
import sys

# إضافة المسارات
project_root = Path(__file__).parent.parent.parent
app_shell_path = project_root / "19-DESKTOP-OS-APP" / "app-shell"
orchestrator_path = project_root / "19-DESKTOP-OS-APP" / "orchestrator"

sys.path.insert(0, str(app_shell_path))
sys.path.insert(0, str(orchestrator_path))

from app_config import AppConfig
from orchestrator.startup_manager import StartupManager
from PySide6.QtCore import QObject, Signal


class ControlsCenterWidget(QWidget):
    """مركز التحكم"""
    
    def __init__(self, config: AppConfig, project_root: Path, tray_manager=None):
        super().__init__()
        self.config = config
        self.project_root = project_root
        self.startup_manager = StartupManager(project_root, config.config)
        self.tray_manager = tray_manager  # SystemTrayManager
        
        self.setup_ui()
        self.setup_connections()
    
    def setup_ui(self):
        """إعداد واجهة المستخدم"""
        layout = QVBoxLayout(self)
        layout.setSpacing(20)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # العنوان
        title = QLabel("مركز التحكم")
        title.setFont(QFont("Arial", 16, QFont.Bold))
        title.setStyleSheet("color: #cccccc;")
        layout.addWidget(title)
        
        # أزرار التحكم العامة
        general_group = QGroupBox("تحكم عام")
        general_layout = QHBoxLayout(general_group)
        
        self.start_all_btn = QPushButton("▶ تشغيل الكل")
        self.start_all_btn.setStyleSheet("""
            QPushButton {
                background-color: #4ec9b0;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #5dd9c4;
            }
        """)
        general_layout.addWidget(self.start_all_btn)
        
        self.stop_all_btn = QPushButton("⏹ إيقاف الكل")
        self.stop_all_btn.setStyleSheet("""
            QPushButton {
                background-color: #f48771;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #ff9a85;
            }
        """)
        general_layout.addWidget(self.stop_all_btn)
        
        self.restart_all_btn = QPushButton("🔄 إعادة تشغيل الكل")
        self.restart_all_btn.setStyleSheet("""
            QPushButton {
                background-color: #dcdcaa;
                color: #1e1e1e;
                padding: 10px;
                border-radius: 5px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #e8e8b8;
            }
        """)
        general_layout.addWidget(self.restart_all_btn)
        
        layout.addWidget(general_group)
        
        # تحكم فردي بالخدمات
        services_group = QGroupBox("تحكم فردي")
        services_layout = QGridLayout(services_group)
        services_layout.setColumnStretch(0, 1)
        services_layout.setColumnStretch(1, 3)
        
        # لا نستخدم أزرار تقليدية، بل نصوص تفاعلية (روابط) لتشغيل/إيقاف/إعادة التشغيل
        services = self.config.get("services", {})
        
        row = 0
        for service_name, service_config in services.items():
            # اسم الخدمة
            name_label = QLabel(service_name.upper())
            name_label.setStyleSheet("color: #cccccc; font-weight: bold;")
            services_layout.addWidget(name_label, row, 0)
            
            # نصوص التحكم كروابط قابلة للنقر
            actions_label = QLabel()
            actions_label.setTextFormat(Qt.RichText)
            actions_label.setTextInteractionFlags(Qt.TextBrowserInteraction)
            actions_label.setOpenExternalLinks(False)
            actions_label.setStyleSheet("""
                QLabel {
                    color: #cccccc;
                }
                a {
                    color: #4fc1ff;
                    text-decoration: none;
                    padding: 0 4px;
                }
                a:hover {
                    text-decoration: underline;
                }
            """)
            actions_label.setText(
                f"<a href='start:{service_name}'>تشغيل</a> | "
                f"<a href='stop:{service_name}'>إيقاف</a> | "
                f"<a href='restart:{service_name}'>إعادة تشغيل</a>"
            )
            actions_label.linkActivated.connect(self.on_service_action_link)
            
            services_layout.addWidget(actions_label, row, 1, alignment=Qt.AlignRight)
            
            row += 1
        
        layout.addWidget(services_group)
        
        layout.addStretch()
    
    def setup_connections(self):
        """إعداد الاتصالات"""
        self.start_all_btn.clicked.connect(self.start_all_services)
        self.stop_all_btn.clicked.connect(self.stop_all_services)
        self.restart_all_btn.clicked.connect(self.restart_all_services)
        
        # ربط إشارات StartupManager لإشعارات النظام
        if self.tray_manager:
            self.startup_manager.service_status_changed.connect(
                lambda name, status: self.on_service_status_changed(name, status)
            )
            self.startup_manager.service_error.connect(
                lambda name, error: self.on_service_error(name, error)
            )
    
    def start_service(self, service_name: str):
        """تشغيل خدمة"""
        success = self.startup_manager.start_service(service_name)
        if success and self.tray_manager:
            self.tray_manager.show_notification(
                "خدمة تم تشغيلها",
                f"تم تشغيل {service_name} بنجاح",
                "success"
            )
        elif not success:
            QMessageBox.warning(self, "خطأ", f"فشل تشغيل الخدمة: {service_name}")
            if self.tray_manager:
                self.tray_manager.show_notification(
                    "فشل تشغيل الخدمة",
                    f"فشل تشغيل {service_name}",
                    "error"
                )
    
    def stop_service(self, service_name: str):
        """إيقاف خدمة"""
        success = self.startup_manager.stop_service(service_name)
        if success and self.tray_manager:
            self.tray_manager.show_notification(
                "خدمة تم إيقافها",
                f"تم إيقاف {service_name}",
                "info"
            )
        elif not success:
            QMessageBox.warning(self, "خطأ", f"فشل إيقاف الخدمة: {service_name}")
    
    def restart_service(self, service_name: str):
        """إعادة تشغيل خدمة"""
        success = self.startup_manager.restart_service(service_name)
        if success and self.tray_manager:
            self.tray_manager.show_notification(
                "خدمة تم إعادة تشغيلها",
                f"تم إعادة تشغيل {service_name} بنجاح",
                "success"
            )
        elif not success:
            QMessageBox.warning(self, "خطأ", f"فشل إعادة تشغيل الخدمة: {service_name}")
    
    def start_all_services(self):
        """تشغيل جميع الخدمات"""
        results = self.startup_manager.start_all_services()
        failed = [name for name, success in results.items() if not success]
        if failed:
            QMessageBox.warning(self, "تحذير", f"فشل تشغيل الخدمات: {', '.join(failed)}")
    
    def stop_all_services(self):
        """إيقاف جميع الخدمات"""
        results = self.startup_manager.stop_all_services()
        failed = [name for name, success in results.items() if not success]
        if failed:
            QMessageBox.warning(self, "تحذير", f"فشل إيقاف الخدمات: {', '.join(failed)}")
    
    def restart_all_services(self):
        """إعادة تشغيل جميع الخدمات"""
        self.stop_all_services()
        import time
        time.sleep(2)
        self.start_all_services()
    
    def on_service_action_link(self, link: str):
        """
        معالجة النقر على روابط التحكم الفردي
        link يكون بالشكل: action:service_name (start|stop|restart)
        """
        try:
            action, service_name = link.split(":", 1)
        except ValueError:
            return
        
        if action == "start":
            self.start_service(service_name)
        elif action == "stop":
            self.stop_service(service_name)
        elif action == "restart":
            self.restart_service(service_name)
    
    def on_service_status_changed(self, service_name: str, status: str):
        """معالجة تغيير حالة الخدمة"""
        if self.tray_manager and status in ["error", "stopped"]:
            notification_type = "error" if status == "error" else "warning"
            self.tray_manager.show_notification(
                f"تغيير حالة الخدمة",
                f"{service_name}: {status}",
                notification_type
            )
    
    def on_service_error(self, service_name: str, error: str):
        """معالجة خطأ في الخدمة"""
        if self.tray_manager:
            self.tray_manager.show_notification(
                f"خطأ في {service_name}",
                error[:100],  # أول 100 حرف
                "error"
            )

