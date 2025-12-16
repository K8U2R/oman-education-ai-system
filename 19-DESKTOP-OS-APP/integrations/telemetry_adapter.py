"""
محول التليمترية
Telemetry Adapter
"""

from typing import Dict, List, Any
from datetime import datetime
from pathlib import Path


class TelemetryAdapter:
    """محول لجمع المقاييس من الخدمات"""
    
    def __init__(self):
        self.metrics_cache: Dict[str, Any] = {}
        self.last_update: Dict[str, datetime] = {}
    
    def collect_metrics(self, service_name: str, metrics: Dict[str, Any]):
        """جمع مقاييس من خدمة"""
        self.metrics_cache[service_name] = metrics
        self.last_update[service_name] = datetime.now()
    
    def get_metrics(self, service_name: str = None) -> Dict[str, Any]:
        """الحصول على المقاييس"""
        if service_name:
            return self.metrics_cache.get(service_name, {})
        return self.metrics_cache.copy()
    
    def get_all_services_metrics(self) -> List[Dict[str, Any]]:
        """الحصول على مقاييس جميع الخدمات"""
        result = []
        for service_name, metrics in self.metrics_cache.items():
            result.append({
                "service": service_name,
                "metrics": metrics,
                "last_update": self.last_update.get(service_name)
            })
        return result

