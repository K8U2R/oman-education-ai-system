"""
لوحة التحكم الرئيسية
Dashboard Widget
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QGridLayout, QFrame, QPushButton, QProgressBar
)
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QFont

from pathlib import Path
import sys

# إضافة المسارات
project_root = Path(__file__).parent.parent.parent
app_shell_path = project_root / "19-DESKTOP-OS-APP" / "app-shell"
orchestrator_path = project_root / "19-DESKTOP-OS-APP" / "orchestrator"
integrations_path = project_root / "19-DESKTOP-OS-APP" / "integrations"
monitoring_path = project_root / "19-DESKTOP-OS-APP" / "monitoring"

sys.path.insert(0, str(app_shell_path))
sys.path.insert(0, str(orchestrator_path))
sys.path.insert(0, str(integrations_path))
sys.path.insert(0, str(monitoring_path))

from app_config import AppConfig
from orchestrator.startup_manager import StartupManager
from integrations.api_bridge import APIBridge
from monitoring.monitoring_ws_client import MonitoringWebSocketClient


class ServiceCard(QFrame):
    """بطاقة خدمة"""
    
    def __init__(self, service_name: str, status: str, parent=None):
        super().__init__(parent)
        self.service_name = service_name
        self.setup_ui(status)
        self.setFrameStyle(QFrame.Box)
        self.setStyleSheet("""
            QFrame {
                background-color: #252526;
                border: 1px solid #3e3e42;
                border-radius: 8px;
                padding: 10px;
            }
        """)
    
    def setup_ui(self, status: str):
        """إعداد واجهة البطاقة"""
        layout = QVBoxLayout(self)
        
        # اسم الخدمة
        name_label = QLabel(self.service_name.upper())
        name_label.setFont(QFont("Arial", 12, QFont.Bold))
        name_label.setStyleSheet("color: #cccccc;")
        layout.addWidget(name_label)
        
        # الحالة
        self.status_label = QLabel(status)
        self.status_label.setFont(QFont("Arial", 10))
        layout.addWidget(self.status_label)
        
        # شريط التقدم (للحالة)
        self.progress = QProgressBar()
        self.progress.setMaximum(100)
        self.progress.setMinimum(0)
        self.progress.setTextVisible(False)
        layout.addWidget(self.progress)
        
        self.update_status(status)
    
    def update_status(self, status: str):
        """تحديث الحالة"""
        self.status_label.setText(status)
        
        if status == "running":
            self.status_label.setStyleSheet("color: #4ec9b0;")
            self.progress.setValue(100)
            self.progress.setStyleSheet("QProgressBar::chunk { background-color: #4ec9b0; }")
        elif status == "starting":
            self.status_label.setStyleSheet("color: #dcdcaa;")
            self.progress.setValue(50)
            self.progress.setStyleSheet("QProgressBar::chunk { background-color: #dcdcaa; }")
        elif status == "stopping":
            self.status_label.setStyleSheet("color: #dcdcaa;")
            self.progress.setValue(25)
            self.progress.setStyleSheet("QProgressBar::chunk { background-color: #dcdcaa; }")
        elif status == "error":
            self.status_label.setStyleSheet("color: #f48771;")
            self.progress.setValue(0)
            self.progress.setStyleSheet("QProgressBar::chunk { background-color: #f48771; }")
        else:  # stopped
            self.status_label.setStyleSheet("color: #858585;")
            self.progress.setValue(0)
            self.progress.setStyleSheet("QProgressBar::chunk { background-color: #858585; }")


class DashboardWidget(QWidget):
    """لوحة التحكم الرئيسية"""
    
    def __init__(self, config: AppConfig, project_root: Path):
        super().__init__()
        self.config = config
        self.project_root = project_root
        self.startup_manager = StartupManager(project_root, config.config)
        self.api_bridge = APIBridge()
        self.last_ws_update = None

        # إعداد WebSocket لمراقبة الصحة
        backend_cfg = self.config.get("services.backend", {})
        backend_port = backend_cfg.get("port", 8000)
        ws_url = f"ws://localhost:{backend_port}/ws/monitoring"
        self.monitoring_ws = MonitoringWebSocketClient(ws_url, parent=self)
        self.monitoring_ws.monitoring_update.connect(self.on_monitoring_update)
        self.monitoring_ws.start()
        
        self.setup_ui()
        self.setup_timer()
        self.setup_connections()
        
        # تحديث أولي
        self.update_dashboard()
    
    def setup_ui(self):
        """إعداد واجهة المستخدم"""
        layout = QVBoxLayout(self)
        layout.setSpacing(20)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # العنوان
        title = QLabel("لوحة التحكم الرئيسية")
        title.setFont(QFont("Arial", 16, QFont.Bold))
        title.setStyleSheet("color: #cccccc;")
        layout.addWidget(title)
        
        # بطاقات الخدمات
        services_frame = QFrame()
        services_layout = QGridLayout(services_frame)
        services_layout.setSpacing(15)
        
        self.service_cards = {}
        services = self.config.get("services", {})
        
        row = 0
        col = 0
        for service_name in services.keys():
            card = ServiceCard(service_name, "stopped")
            self.service_cards[service_name] = card
            services_layout.addWidget(card, row, col)
            
            col += 1
            if col > 2:
                col = 0
                row += 1
        
        layout.addWidget(services_frame)
        
        # معلومات النظام
        info_frame = QFrame()
        info_layout = QVBoxLayout(info_frame)
        
        info_title = QLabel("معلومات النظام")
        info_title.setFont(QFont("Arial", 12, QFont.Bold))
        info_title.setStyleSheet("color: #cccccc;")
        info_layout.addWidget(info_title)
        
        self.system_info_label = QLabel("جاري التحميل...")
        self.system_info_label.setStyleSheet("color: #858585;")
        info_layout.addWidget(self.system_info_label)
        
        layout.addWidget(info_frame)
        
        layout.addStretch()
    
    def setup_timer(self):
        """إعداد المؤقت للتحديث"""
        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self.update_dashboard)
        interval = self.config.get("monitoring.update_interval", 2000)
        self.update_timer.start(interval)
    
    def setup_connections(self):
        """إعداد الاتصالات"""
        self.startup_manager.service_status_changed.connect(self.on_service_status_changed)
    
    def update_dashboard(self):
        """تحديث لوحة التحكم"""
        # تحديث حالات الخدمات
        statuses = self.startup_manager.get_all_statuses()
        for service_name, status in statuses.items():
            if service_name in self.service_cards:
                self.service_cards[service_name].update_status(status)
        
        # تحديث معلومات النظام
        self.update_system_info()
    
    def update_system_info(self):
        """تحديث معلومات النظام"""
        # أولوية لبيانات WebSocket إن توفرت
        if self.last_ws_update:
            data = self.last_ws_update.get("data", {})
            health = data.get("health", "unknown")
            self.system_info_label.setText(f"حالة النظام (WebSocket): {health}")
            return

        # رجوع احتياطي إلى API في حال عدم توفر WebSocket
        try:
            info = self.api_bridge.get_system_info()
            if info:
                self.system_info_label.setText(
                    f"الإصدار: {info.get('version', 'غير متاح')} | "
                    f"الحالة: {info.get('status', 'غير متاح')}"
                )
            else:
                self.system_info_label.setText("النظام غير متصل")
        except Exception:
            self.system_info_label.setText("النظام غير متصل")

    def on_monitoring_update(self, payload: dict):
        """استقبال تحديثات WebSocket من /ws/monitoring"""
        self.last_ws_update = payload
    
    def on_service_status_changed(self, service_name: str, status: str):
        """معالجة تغيير حالة الخدمة"""
        if service_name in self.service_cards:
            self.service_cards[service_name].update_status(status)

