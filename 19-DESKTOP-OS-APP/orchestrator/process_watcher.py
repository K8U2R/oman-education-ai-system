"""
مراقب العمليات وإعادة التشغيل التلقائي
Process Watcher and Auto-Restart
"""

import time
from typing import Dict, Optional
from PySide6.QtCore import QObject, Signal, QTimer
from .startup_manager import StartupManager, ServiceStatus


class ProcessWatcher(QObject):
    """مراقب العمليات"""
    
    process_died = Signal(str)  # service_name
    process_restarted = Signal(str)  # service_name
    
    def __init__(self, startup_manager: StartupManager, check_interval: int = 5000):
        super().__init__()
        self.startup_manager = startup_manager
        self.check_interval = check_interval
        self.auto_restart = True
        self.restart_attempts: Dict[str, int] = {}
        self.max_restart_attempts = 3
        
        self.timer = QTimer()
        self.timer.timeout.connect(self.check_processes)
        self.timer.setInterval(check_interval)
    
    def start_watching(self):
        """بدء مراقبة العمليات"""
        self.timer.start()
    
    def stop_watching(self):
        """إيقاف مراقبة العمليات"""
        self.timer.stop()
    
    def check_processes(self):
        """التحقق من حالة جميع العمليات"""
        for service_name, service in self.startup_manager.services.items():
            if service.status == ServiceStatus.RUNNING and service.process:
                # التحقق من أن العملية ما زالت تعمل
                if service.process.poll() is not None:
                    # العملية توقفت
                    self.process_died.emit(service_name)
                    
                    if self.auto_restart:
                        self._attempt_restart(service_name)
    
    def _attempt_restart(self, service_name: str):
        """محاولة إعادة تشغيل خدمة"""
        attempts = self.restart_attempts.get(service_name, 0)
        
        if attempts < self.max_restart_attempts:
            attempts += 1
            self.restart_attempts[service_name] = attempts
            
            # إعادة التشغيل
            if self.startup_manager.start_service(service_name):
                self.restart_attempts[service_name] = 0  # إعادة تعيين عند النجاح
                self.process_restarted.emit(service_name)
        else:
            # تجاوز عدد المحاولات
            self.startup_manager.service_error.emit(
                service_name,
                f"فشل إعادة التشغيل بعد {self.max_restart_attempts} محاولات"
            )

