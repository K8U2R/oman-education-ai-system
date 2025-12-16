"""
جسر التكامل
Integration Bridge
"""

import requests
from typing import Dict, Optional
from pathlib import Path


class IntegrationBridge:
    """جسر للاتصال بنظام التكامل"""
    
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.timeout = 5
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> Optional[Dict]:
        """إجراء طلب HTTP"""
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.request(method, url, timeout=self.timeout, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return None
    
    def get_status(self) -> Optional[Dict]:
        """الحصول على حالة نظام التكامل"""
        return self._make_request("GET", "/status")
    
    def trigger_integration(self, integration_name: str) -> Optional[Dict]:
        """تفعيل تكامل محدد"""
        return self._make_request("POST", f"/integrations/{integration_name}/trigger")

