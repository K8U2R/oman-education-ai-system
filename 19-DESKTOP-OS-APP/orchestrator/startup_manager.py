"""
مدير التشغيل والإيقاف
Startup and Shutdown Manager
"""

import subprocess
import sys
import os
from pathlib import Path
from typing import Dict, List, Optional, Callable
from enum import Enum
from PySide6.QtCore import QObject, Signal, QThread

from .port_checker import PortChecker
from .error_handler import ErrorHandler, retry_on_error


class ServiceStatus(Enum):
    """حالة الخدمة"""
    STOPPED = "stopped"
    STARTING = "starting"
    RUNNING = "running"
    STOPPING = "stopping"
    ERROR = "error"


class ServiceInfo:
    """معلومات الخدمة"""
    
    def __init__(self, name: str, config: dict):
        self.name = name
        self.enabled = config.get("enabled", True)
        self.port = config.get("port", 0)
        self.path = Path(config.get("path", ""))
        self.command = config.get("command", [])
        self.auto_start = config.get("auto_start", False)
        self.status = ServiceStatus.STOPPED
        self.process: Optional[subprocess.Popen] = None
        self.pid: Optional[int] = None
        self.error_message: Optional[str] = None


class StartupManager(QObject):
    """مدير تشغيل وإيقاف جميع الخدمات"""
    
    service_status_changed = Signal(str, str)  # name, status
    service_output = Signal(str, str)  # name, output
    service_error = Signal(str, str)  # name, error
    
    def __init__(self, project_root: Path, config: dict):
        super().__init__()
        self.project_root = project_root
        self.config = config
        self.services: Dict[str, ServiceInfo] = {}
        self.error_handler = ErrorHandler(max_retries=3, base_delay=1.0)
        self._initialize_services()
    
    def _initialize_services(self):
        """تهيئة الخدمات من الإعدادات"""
        services_config = self.config.get("services", {})
        for name, service_config in services_config.items():
            self.services[name] = ServiceInfo(name, service_config)
    
    def start_service(self, service_name: str) -> bool:
        """تشغيل خدمة محددة"""
        if service_name not in self.services:
            self.service_error.emit(service_name, f"الخدمة {service_name} غير موجودة")
            return False
        
        service = self.services[service_name]
        
        if not service.enabled:
            self.service_error.emit(service_name, f"الخدمة {service_name} معطلة")
            return False
        
        if service.status == ServiceStatus.RUNNING:
            self.service_output.emit(service_name, "الخدمة تعمل بالفعل")
            return True
        
        try:
            self.service_status_changed.emit(service_name, ServiceStatus.STARTING.value)
            
            # بناء المسار الكامل
            service_path = self.project_root / service.path
            if not service_path.exists():
                self.service_error.emit(service_name, f"المسار غير موجود: {service_path}")
                service.status = ServiceStatus.ERROR
                self.service_status_changed.emit(service_name, ServiceStatus.ERROR.value)
                return False

            # فحص المنفذ إن وجد مع إعادة المحاولة
            if service.port:
                def check_and_release_port():
                    if not PortChecker.is_port_available(service.port):
                        return PortChecker.kill_process_on_port(service.port)
                    return True
                
                result, error = self.error_handler.retry(
                    check_and_release_port,
                    f"فحص وتحرير المنفذ {service.port}"
                )
                
                if error or (result is False and not PortChecker.is_port_available(service.port)):
                    self.service_error.emit(
                        service_name,
                        f"المنفذ {service.port} مستخدم ولا يمكن تحريره بعد {self.error_handler.max_retries} محاولات"
                    )
                    service.status = ServiceStatus.ERROR
                    self.service_status_changed.emit(service_name, ServiceStatus.ERROR.value)
                    return False
            
            # بناء الأمر
            if sys.platform == "win32" and service.command[0] == "npm":
                command = ["npm.cmd"] + service.command[1:]
            else:
                command = service.command.copy()
            
            # تشغيل العملية
            process = subprocess.Popen(
                command,
                cwd=str(service_path),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            
            service.process = process
            service.pid = process.pid
            service.status = ServiceStatus.RUNNING
            service.error_message = None
            
            self.service_status_changed.emit(service_name, ServiceStatus.RUNNING.value)
            self.service_output.emit(service_name, f"تم تشغيل الخدمة بنجاح (PID: {process.pid})")
            
            return True
            
        except Exception as e:
            error_msg = f"خطأ في تشغيل الخدمة: {str(e)}"
            self.service_error.emit(service_name, error_msg)
            service.status = ServiceStatus.ERROR
            service.error_message = error_msg
            self.service_status_changed.emit(service_name, ServiceStatus.ERROR.value)
            return False
    
    def stop_service(self, service_name: str) -> bool:
        """إيقاف خدمة محددة"""
        if service_name not in self.services:
            return False
        
        service = self.services[service_name]
        
        if service.status == ServiceStatus.STOPPED:
            return True
        
        try:
            self.service_status_changed.emit(service_name, ServiceStatus.STOPPING.value)
            
            if service.process:
                service.process.terminate()
                try:
                    service.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    service.process.kill()
                    service.process.wait()
                
                service.process = None
                service.pid = None
            
            service.status = ServiceStatus.STOPPED
            self.service_status_changed.emit(service_name, ServiceStatus.STOPPED.value)
            self.service_output.emit(service_name, "تم إيقاف الخدمة")
            
            return True
            
        except Exception as e:
            error_msg = f"خطأ في إيقاف الخدمة: {str(e)}"
            self.service_error.emit(service_name, error_msg)
            return False
    
    def restart_service(self, service_name: str) -> bool:
        """إعادة تشغيل خدمة محددة"""
        self.stop_service(service_name)
        import time
        time.sleep(1)
        return self.start_service(service_name)
    
    def start_all_services(self) -> Dict[str, bool]:
        """تشغيل جميع الخدمات الممكنة"""
        results = {}
        for name, service in self.services.items():
            if service.auto_start and service.enabled:
                results[name] = self.start_service(name)
        return results
    
    def stop_all_services(self) -> Dict[str, bool]:
        """إيقاف جميع الخدمات"""
        results = {}
        for name in self.services:
            results[name] = self.stop_service(name)
        return results
    
    def get_service_status(self, service_name: str) -> Optional[ServiceStatus]:
        """الحصول على حالة خدمة محددة"""
        if service_name in self.services:
            service = self.services[service_name]
            # التحقق من أن العملية ما زالت تعمل
            if service.process and service.process.poll() is not None:
                service.status = ServiceStatus.STOPPED
                self.service_status_changed.emit(service_name, ServiceStatus.STOPPED.value)
            return service.status
        return None
    
    def get_all_statuses(self) -> Dict[str, str]:
        """الحصول على حالات جميع الخدمات"""
        statuses = {}
        for name in self.services:
            status = self.get_service_status(name)
            statuses[name] = status.value if status else ServiceStatus.STOPPED.value
        return statuses

