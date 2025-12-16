"""
لوحة المقاييس
Metrics Panel Widget
"""

import psutil
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QProgressBar,
    QGroupBox, QGridLayout, QFrame
)
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QFont

from pathlib import Path
import sys

# إضافة المسارات
project_root = Path(__file__).parent.parent.parent
app_shell_path = project_root / "19-DESKTOP-OS-APP" / "app-shell"
integrations_path = project_root / "19-DESKTOP-OS-APP" / "integrations"

sys.path.insert(0, str(app_shell_path))
sys.path.insert(0, str(integrations_path))

from app_config import AppConfig
from integrations.api_bridge import APIBridge


class MetricWidget(QFrame):
    """مقياس واحد"""
    
    def __init__(self, title: str, parent=None):
        super().__init__(parent)
        self.title = title
        self.setup_ui()
        self.setFrameStyle(QFrame.Box)
        self.setStyleSheet("""
            QFrame {
                background-color: #252526;
                border: 1px solid #3e3e42;
                border-radius: 8px;
                padding: 15px;
            }
        """)
    
    def setup_ui(self):
        """إعداد واجهة المستخدم"""
        layout = QVBoxLayout(self)
        
        # العنوان
        title_label = QLabel(self.title)
        title_label.setFont(QFont("Arial", 10))
        title_label.setStyleSheet("color: #858585;")
        layout.addWidget(title_label)
        
        # القيمة
        self.value_label = QLabel("0%")
        self.value_label.setFont(QFont("Arial", 18, QFont.Bold))
        self.value_label.setStyleSheet("color: #cccccc;")
        layout.addWidget(self.value_label)
        
        # شريط التقدم
        self.progress = QProgressBar()
        self.progress.setMaximum(100)
        self.progress.setMinimum(0)
        self.progress.setTextVisible(False)
        layout.addWidget(self.progress)
    
    def update_value(self, value: float, color: str = "#4ec9b0"):
        """تحديث القيمة"""
        self.value_label.setText(f"{value:.1f}%")
        self.progress.setValue(int(value))
        self.progress.setStyleSheet(f"QProgressBar::chunk {{ background-color: {color}; }}")


class MetricsPanelWidget(QWidget):
    """لوحة المقاييس"""
    
    def __init__(self, config: AppConfig, project_root: Path):
        super().__init__()
        self.config = config
        self.project_root = project_root
        self.api_bridge = APIBridge()
        
        self.setup_ui()
        self.setup_timer()
        self.update_metrics()
    
    def setup_ui(self):
        """إعداد واجهة المستخدم"""
        layout = QVBoxLayout(self)
        layout.setSpacing(20)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # العنوان
        title = QLabel("المقاييس")
        title.setFont(QFont("Arial", 16, QFont.Bold))
        title.setStyleSheet("color: #cccccc;")
        layout.addWidget(title)
        
        # المقاييس
        metrics_group = QGroupBox("مقاييس النظام")
        metrics_layout = QGridLayout(metrics_group)
        metrics_layout.setSpacing(15)
        
        # CPU
        self.cpu_metric = MetricWidget("استخدام المعالج (CPU)")
        metrics_layout.addWidget(self.cpu_metric, 0, 0)
        
        # RAM
        self.ram_metric = MetricWidget("استخدام الذاكرة (RAM)")
        metrics_layout.addWidget(self.ram_metric, 0, 1)
        
        # Disk
        self.disk_metric = MetricWidget("استخدام القرص (Disk)")
        metrics_layout.addWidget(self.disk_metric, 1, 0)
        
        # Network (سيتم إضافته لاحقاً)
        self.network_metric = MetricWidget("الشبكة (Network)")
        metrics_layout.addWidget(self.network_metric, 1, 1)
        
        layout.addWidget(metrics_group)
        
        # معلومات إضافية
        info_group = QGroupBox("معلومات إضافية")
        info_layout = QVBoxLayout(info_group)
        
        self.info_label = QLabel("جاري التحميل...")
        self.info_label.setStyleSheet("color: #858585;")
        info_layout.addWidget(self.info_label)
        
        layout.addWidget(info_group)
        
        layout.addStretch()
    
    def setup_timer(self):
        """إعداد المؤقت للتحديث"""
        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self.update_metrics)
        interval = self.config.get("monitoring.update_interval", 2000)
        self.update_timer.start(interval)
    
    def update_metrics(self):
        """تحديث المقاييس"""
        try:
            # محاولة الحصول على المقاييس من API أولاً
            api_metrics = self.api_bridge.get_metrics()
            api_resources = self.api_bridge.get_resources()
            
            # CPU - استخدام interval=0.0 لتفادي الانتظار في الـ UI thread
            if api_resources and "cpu" in api_resources:
                cpu_percent = api_resources["cpu"].get("percent", psutil.cpu_percent(interval=0.0))
            else:
                cpu_percent = psutil.cpu_percent(interval=0.0)
            cpu_color = "#4ec9b0" if cpu_percent < 70 else "#dcdcaa" if cpu_percent < 90 else "#f48771"
            self.cpu_metric.update_value(cpu_percent, cpu_color)
            
            # RAM
            if api_resources and "memory" in api_resources:
                ram_percent = api_resources["memory"].get("percent", 0)
                ram_total = api_resources["memory"].get("total", 0)
            else:
                ram = psutil.virtual_memory()
                ram_percent = ram.percent
                ram_total = ram.total
            ram_color = "#4ec9b0" if ram_percent < 70 else "#dcdcaa" if ram_percent < 90 else "#f48771"
            self.ram_metric.update_value(ram_percent, ram_color)
            
            # Disk
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            disk_color = "#4ec9b0" if disk_percent < 70 else "#dcdcaa" if disk_percent < 90 else "#f48771"
            self.disk_metric.update_value(disk_percent, disk_color)
            
            # Network
            net_io = psutil.net_io_counters()
            self.network_metric.value_label.setText(f"↑ {net_io.bytes_sent // 1024 // 1024} MB\n↓ {net_io.bytes_recv // 1024 // 1024} MB")
            
            # معلومات إضافية من API إن وجدت
            if api_metrics:
                info_text = (
                    f"المعالج: {psutil.cpu_count()} نواة\n"
                    f"الذاكرة: {ram_total // 1024 // 1024 // 1024} GB إجمالي\n"
                    f"القرص: {disk.total // 1024 // 1024 // 1024} GB إجمالي\n"
                    f"API Status: متصل"
                )
            else:
                info_text = (
                    f"المعالج: {psutil.cpu_count()} نواة\n"
                    f"الذاكرة: {ram_total // 1024 // 1024 // 1024} GB إجمالي\n"
                    f"القرص: {disk.total // 1024 // 1024 // 1024} GB إجمالي\n"
                    f"API Status: غير متصل"
                )
            self.info_label.setText(info_text)
            
        except Exception as e:
            self.info_label.setText(f"خطأ في تحديث المقاييس: {str(e)}")

