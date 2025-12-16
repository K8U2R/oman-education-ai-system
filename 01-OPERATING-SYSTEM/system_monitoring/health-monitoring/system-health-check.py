"""
System Health Check - فحص صحة النظام
Monitors overall system health status
"""

import logging
import psutil
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class HealthStatus(Enum):
    """Health status levels"""
    EXCELLENT = "excellent"
    GOOD = "good"
    WARNING = "warning"
    CRITICAL = "critical"
    UNKNOWN = "unknown"


@dataclass
class HealthMetric:
    """Health metric data"""
    name: str
    value: float
    status: HealthStatus
    threshold_warning: float
    threshold_critical: float
    unit: str = ""
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()


class SystemHealthCheck:
    """
    System Health Check Class
    Monitors and reports overall system health
    """
    
    def __init__(self):
        """Initialize System Health Check"""
        self.logger = logging.getLogger(__name__)
        self.metrics: Dict[str, HealthMetric] = {}
        self.health_history: List[Dict] = []
        
    def check_system_health(self) -> Dict[str, Any]:
        """
        Perform comprehensive system health check
        
        Returns:
            Dictionary with health status and metrics
        """
        self.logger.info("🏥 Performing system health check...")
        
        # Check various system components
        cpu_health = self._check_cpu_health()
        memory_health = self._check_memory_health()
        disk_health = self._check_disk_health()
        process_health = self._check_process_health()
        
        # Calculate overall health
        overall_status = self._calculate_overall_status([
            cpu_health, memory_health, disk_health, process_health
        ])
        
        health_report = {
            "timestamp": datetime.now().isoformat(),
            "overall_status": overall_status.value,
            "metrics": {
                "cpu": cpu_health,
                "memory": memory_health,
                "disk": disk_health,
                "processes": process_health
            },
            "recommendations": self._get_recommendations(overall_status)
        }
        
        # Store in history
        self.health_history.append(health_report)
        if len(self.health_history) > 100:
            self.health_history.pop(0)
        
        self.logger.info(f"✅ Health check complete: {overall_status.value}")
        
        return health_report
    
    def _check_cpu_health(self) -> Dict[str, Any]:
        """Check CPU health"""
        try:
            cpu_percent = psutil.cpu_percent(interval=0.5)
            cpu_count = psutil.cpu_count()
            cpu_freq = psutil.cpu_freq()
            
            status = self._get_status_from_value(
                cpu_percent,
                warning=70.0,
                critical=90.0,
                lower_is_better=True
            )
            
            return {
                "status": status.value,
                "usage_percent": cpu_percent,
                "core_count": cpu_count,
                "frequency_mhz": cpu_freq.current if cpu_freq else None,
                "status_code": status
            }
        except Exception as e:
            self.logger.error(f"Error checking CPU health: {e}")
            return {"status": HealthStatus.UNKNOWN.value, "error": str(e)}
    
    def _check_memory_health(self) -> Dict[str, Any]:
        """Check memory health"""
        try:
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            memory_available_gb = memory.available / (1024**3)
            memory_total_gb = memory.total / (1024**3)
            
            status = self._get_status_from_value(
                memory_percent,
                warning=75.0,
                critical=90.0,
                lower_is_better=True
            )
            
            return {
                "status": status.value,
                "usage_percent": memory_percent,
                "available_gb": round(memory_available_gb, 2),
                "total_gb": round(memory_total_gb, 2),
                "used_gb": round((memory.total - memory.available) / (1024**3), 2),
                "status_code": status
            }
        except Exception as e:
            self.logger.error(f"Error checking memory health: {e}")
            return {"status": HealthStatus.UNKNOWN.value, "error": str(e)}
    
    def _check_disk_health(self) -> Dict[str, Any]:
        """Check disk health"""
        try:
            disk = psutil.disk_usage('/')
            disk_percent = (disk.used / disk.total) * 100
            disk_free_gb = disk.free / (1024**3)
            disk_total_gb = disk.total / (1024**3)
            
            status = self._get_status_from_value(
                disk_percent,
                warning=80.0,
                critical=95.0,
                lower_is_better=True
            )
            
            return {
                "status": status.value,
                "usage_percent": round(disk_percent, 2),
                "free_gb": round(disk_free_gb, 2),
                "total_gb": round(disk_total_gb, 2),
                "status_code": status
            }
        except Exception as e:
            self.logger.error(f"Error checking disk health: {e}")
            return {"status": HealthStatus.UNKNOWN.value, "error": str(e)}
    
    def _check_process_health(self) -> Dict[str, Any]:
        """Check process health"""
        try:
            processes = psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent'])
            process_count = 0
            high_cpu_processes = []
            high_memory_processes = []
            
            for proc in processes:
                try:
                    process_count += 1
                    info = proc.info
                    
                    if info.get('cpu_percent', 0) > 50:
                        high_cpu_processes.append({
                            "pid": info['pid'],
                            "name": info['name'],
                            "cpu_percent": info['cpu_percent']
                        })
                    
                    if info.get('memory_percent', 0) > 10:
                        high_memory_processes.append({
                            "pid": info['pid'],
                            "name": info['name'],
                            "memory_percent": info['memory_percent']
                        })
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
            
            status = HealthStatus.GOOD
            if len(high_cpu_processes) > 5 or len(high_memory_processes) > 5:
                status = HealthStatus.WARNING
            if len(high_cpu_processes) > 10 or len(high_memory_processes) > 10:
                status = HealthStatus.CRITICAL
            
            return {
                "status": status.value,
                "total_processes": process_count,
                "high_cpu_count": len(high_cpu_processes),
                "high_memory_count": len(high_memory_processes),
                "status_code": status
            }
        except Exception as e:
            self.logger.error(f"Error checking process health: {e}")
            return {"status": HealthStatus.UNKNOWN.value, "error": str(e)}
    
    def _get_status_from_value(
        self,
        value: float,
        warning: float,
        critical: float,
        lower_is_better: bool = True
    ) -> HealthStatus:
        """Get status from metric value"""
        if lower_is_better:
            if value >= critical:
                return HealthStatus.CRITICAL
            elif value >= warning:
                return HealthStatus.WARNING
            elif value < 50:
                return HealthStatus.EXCELLENT
            else:
                return HealthStatus.GOOD
        else:
            if value <= critical:
                return HealthStatus.CRITICAL
            elif value <= warning:
                return HealthStatus.WARNING
            elif value > 80:
                return HealthStatus.EXCELLENT
            else:
                return HealthStatus.GOOD
    
    def _calculate_overall_status(self, metrics: List[Dict]) -> HealthStatus:
        """Calculate overall health status from metrics"""
        statuses = [m.get("status_code", HealthStatus.UNKNOWN) for m in metrics]
        
        if any(s == HealthStatus.CRITICAL for s in statuses):
            return HealthStatus.CRITICAL
        elif any(s == HealthStatus.WARNING for s in statuses):
            return HealthStatus.WARNING
        elif all(s == HealthStatus.EXCELLENT for s in statuses):
            return HealthStatus.EXCELLENT
        else:
            return HealthStatus.GOOD
    
    def _get_recommendations(self, status: HealthStatus) -> List[str]:
        """Get recommendations based on health status"""
        recommendations = []
        
        if status == HealthStatus.CRITICAL:
            recommendations.extend([
                "⚠️ System health is CRITICAL - Immediate action required",
                "Consider restarting the system",
                "Check for resource-intensive processes",
                "Free up disk space if needed",
                "Monitor system logs for errors"
            ])
        elif status == HealthStatus.WARNING:
            recommendations.extend([
                "⚠️ System health is WARNING - Monitor closely",
                "Consider closing unnecessary applications",
                "Check system resources usage",
                "Review recent system changes"
            ])
        elif status == HealthStatus.GOOD:
            recommendations.append("✅ System health is GOOD")
        else:
            recommendations.append("✅ System health is EXCELLENT")
        
        return recommendations
    
    def get_health_history(self, limit: int = 10) -> List[Dict]:
        """Get health check history"""
        return self.health_history[-limit:]
    
    def get_current_health_summary(self) -> Dict[str, Any]:
        """Get current health summary"""
        if not self.health_history:
            return {"status": "no_data", "message": "No health checks performed yet"}
        
        latest = self.health_history[-1]
        return {
            "overall_status": latest["overall_status"],
            "timestamp": latest["timestamp"],
            "key_metrics": {
                "cpu": latest["metrics"]["cpu"]["status"],
                "memory": latest["metrics"]["memory"]["status"],
                "disk": latest["metrics"]["disk"]["status"]
            }
        }

