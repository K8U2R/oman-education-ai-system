"""
جسر API
API Bridge
"""

import requests
from typing import Dict, Optional, Any
from pathlib import Path


class APIBridge:
    """جسر للاتصال بـ FastAPI"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.timeout = 5
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> Optional[Dict[str, Any]]:
        """إجراء طلب HTTP"""
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.request(method, url, timeout=self.timeout, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return None
    
    def get_system_info(self) -> Optional[Dict[str, Any]]:
        """الحصول على معلومات النظام"""
        return self._make_request("GET", "/api/v1/info")
    
    def get_health(self) -> Optional[Dict[str, Any]]:
        """الحصول على حالة الصحة"""
        return self._make_request("GET", "/api/v1/health")
    
    def check_service_status(self, service_name: str) -> bool:
        """التحقق من حالة خدمة"""
        health = self.get_health()
        if health:
            return health.get(service_name, {}).get("status") == "healthy"
        return False
    
    def get_metrics(self) -> Optional[Dict[str, Any]]:
        """الحصول على المقاييس من FastAPI"""
        return self._make_request("GET", "/api/v1/monitoring/performance")
    
    def get_resources(self) -> Optional[Dict[str, Any]]:
        """الحصول على استخدام الموارد"""
        return self._make_request("GET", "/api/v1/monitoring/resources")

