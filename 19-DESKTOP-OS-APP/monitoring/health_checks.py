"""
فحوصات الجاهزية
Health Checks
"""

import requests
from typing import Dict, Optional
from PySide6.QtCore import QObject, Signal, QTimer


class HealthChecker(QObject):
    """مدقق الصحة"""
    
    health_status_changed = Signal(str, str, dict)  # service_name, status, details
    
    def __init__(self, services_config: dict, check_interval: int = 5000, fast_interval: int = 2000):
        super().__init__()
        self.services_config = services_config
        self.base_interval = check_interval
        self.fast_interval = fast_interval
        self.failure_streak = 0
        self.health_status: Dict[str, Dict] = {}
        
        self.timer = QTimer()
        self.timer.timeout.connect(self.check_all_services)
        self.timer.setInterval(check_interval)
    
    def start_checking(self):
        """بدء فحوصات الصحة"""
        self.timer.start()
        self.check_all_services()
    
    def stop_checking(self):
        """إيقاف فحوصات الصحة"""
        self.timer.stop()
    
    def check_all_services(self):
        """فحص جميع الخدمات مع ضبط تكرار الفحص"""
        any_issue = False
        for service_name, config in self.services_config.items():
            if config.get("enabled", True):
                status = self.check_service(service_name, config)
                if status in {"unhealthy", "down", "timeout", "error"}:
                    any_issue = True

        # ضبط تردد الفحص: أسرع عند وجود مشاكل، أبطأ عند الاستقرار
        target_interval = self.fast_interval if any_issue else self.base_interval
        if self.timer.interval() != target_interval:
            self.timer.setInterval(target_interval)
    
    def check_service(self, service_name: str, config: dict) -> str:
        """فحص خدمة محددة"""
        port = config.get("port", 0)
        if port == 0:
            return "unknown"
        
        base_url = f"http://localhost:{port}"
        status = "unknown"
        details: Dict = {}

        # تحديد نقاط الفحص حسب نوع الخدمة
        if service_name == "frontend":
            # Frontend (React/Vite) - فحص بسيط للمنفذ
            endpoints = ["/"]  # الصفحة الرئيسية
        elif service_name == "integration":
            # Integration System - نفس Backend
            endpoints = ["/health", "/ready", "/api/v1/info", "/status"]
        else:
            # Backend (FastAPI) - فحص شامل
            endpoints = ["/health", "/ready", "/api/v1/info"]

        for ep in endpoints:
            try:
                response = requests.get(f"{base_url}{ep}", timeout=2, allow_redirects=True)
                if response.status_code in [200, 301, 302]:
                    if service_name == "frontend":
                        # Frontend يعمل إذا استجاب المنفذ
                        status = "healthy"
                        details = {"endpoint": ep, "type": "frontend"}
                    else:
                        status = "healthy" if ep != "/api/v1/info" else "available"
                        details = response.json() if response.headers.get("content-type", "").startswith("application/json") else {"endpoint": ep}
                    break
                else:
                    status = "unhealthy"
                    details = {"endpoint": ep, "status_code": response.status_code}
            except requests.exceptions.ConnectionError:
                status = "down"
                details = {"endpoint": ep, "error": "Connection refused"}
            except requests.exceptions.Timeout:
                status = "timeout"
                details = {"endpoint": ep, "error": "Request timeout"}
            except Exception as e:
                status = "error"
                details = {"endpoint": ep, "error": str(e)}
        
        # تحديث الحالة
        old_status = self.health_status.get(service_name, {}).get("status")
        self.health_status[service_name] = {
            "status": status,
            "details": details,
            "timestamp": details.get("timestamp")
        }
        
        # إرسال إشارة إذا تغيرت الحالة
        if old_status != status:
            self.health_status_changed.emit(service_name, status, details)

        return status
    
    def get_service_health(self, service_name: str) -> Optional[Dict]:
        """الحصول على صحة خدمة محددة"""
        return self.health_status.get(service_name)
    
    def get_all_health(self) -> Dict[str, Dict]:
        """الحصول على صحة جميع الخدمات"""
        return self.health_status.copy()

