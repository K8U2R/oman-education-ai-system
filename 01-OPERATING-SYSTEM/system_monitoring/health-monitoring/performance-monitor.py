"""
Performance Monitor - مراقبة الأداء
Monitors system performance metrics
"""

import logging
import time
import psutil
from typing import Dict, List, Optional, Callable
from dataclasses import dataclass
from datetime import datetime
from collections import deque
import threading


@dataclass
class PerformanceMetric:
    """Performance metric data"""
    name: str
    value: float
    timestamp: datetime
    unit: str = ""


class PerformanceMonitor:
    """
    Performance Monitor Class
    Continuously monitors and records performance metrics
    """
    
    def __init__(self, history_size: int = 1000):
        """
        Initialize Performance Monitor
        
        Args:
            history_size: Maximum number of metric records to keep
        """
        self.logger = logging.getLogger(__name__)
        self.history_size = history_size
        self.metrics: Dict[str, deque] = {}
        self.monitoring = False
        self.monitor_thread: Optional[threading.Thread] = None
        self.monitor_interval = 1.0  # seconds
        self.callbacks: Dict[str, List[Callable]] = {}
        self.lock = threading.Lock()
        
    def start_monitoring(self, interval: float = 1.0) -> None:
        """
        Start continuous performance monitoring
        
        Args:
            interval: Monitoring interval in seconds
        """
        if self.monitoring:
            self.logger.warning("Performance monitoring already running")
            return
        
        self.monitor_interval = interval
        self.monitoring = True
        self.monitor_thread = threading.Thread(target=self._monitoring_loop, daemon=True)
        self.monitor_thread.start()
        self.logger.info(f"✅ Started performance monitoring (interval: {interval}s)")
    
    def stop_monitoring(self) -> None:
        """Stop performance monitoring"""
        if not self.monitoring:
            return
        
        self.monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join(timeout=2.0)
        
        self.logger.info("🛑 Stopped performance monitoring")
    
    def _monitoring_loop(self) -> None:
        """Main monitoring loop"""
        while self.monitoring:
            try:
                self._collect_metrics()
                time.sleep(self.monitor_interval)
            except Exception as e:
                self.logger.error(f"Error in monitoring loop: {e}", exc_info=True)
                time.sleep(self.monitor_interval)
    
    def _collect_metrics(self) -> None:
        """Collect current performance metrics"""
        timestamp = datetime.now()
        
        # CPU metrics
        cpu_percent = psutil.cpu_percent(interval=None)
        self._add_metric("cpu_percent", cpu_percent, timestamp, "%")
        
        # Memory metrics
        memory = psutil.virtual_memory()
        self._add_metric("memory_percent", memory.percent, timestamp, "%")
        self._add_metric("memory_used_mb", memory.used / (1024**2), timestamp, "MB")
        self._add_metric("memory_available_mb", memory.available / (1024**2), timestamp, "MB")
        
        # Disk metrics
        try:
            disk = psutil.disk_usage('/')
            self._add_metric("disk_usage_percent", (disk.used / disk.total) * 100, timestamp, "%")
            self._add_metric("disk_free_gb", disk.free / (1024**3), timestamp, "GB")
        except Exception:
            pass  # May fail on some systems
        
        # Network metrics
        try:
            net_io = psutil.net_io_counters()
            self._add_metric("network_bytes_sent", net_io.bytes_sent, timestamp, "bytes")
            self._add_metric("network_bytes_recv", net_io.bytes_recv, timestamp, "bytes")
        except Exception:
            pass
    
    def _add_metric(self, name: str, value: float, timestamp: datetime, unit: str = "") -> None:
        """Add metric to history"""
        with self.lock:
            if name not in self.metrics:
                self.metrics[name] = deque(maxlen=self.history_size)
            
            metric = PerformanceMetric(
                name=name,
                value=value,
                timestamp=timestamp,
                unit=unit
            )
            
            self.metrics[name].append(metric)
            
            # Trigger callbacks
            if name in self.callbacks:
                for callback in self.callbacks[name]:
                    try:
                        callback(metric)
                    except Exception as e:
                        self.logger.error(f"Error in callback for {name}: {e}")
    
    def get_metric(self, name: str, count: int = 100) -> List[PerformanceMetric]:
        """
        Get metric history
        
        Args:
            name: Metric name
            count: Number of recent values to return
            
        Returns:
            List of performance metrics
        """
        with self.lock:
            if name not in self.metrics:
                return []
            
            metrics_list = list(self.metrics[name])
            return metrics_list[-count:]
    
    def get_current_metrics(self) -> Dict[str, float]:
        """Get current metric values"""
        with self.lock:
            return {
                name: metrics[-1].value if metrics else 0.0
                for name, metrics in self.metrics.items()
            }
    
    def get_metric_statistics(self, name: str) -> Optional[Dict[str, float]]:
        """
        Get statistics for a metric
        
        Args:
            name: Metric name
            
        Returns:
            Dictionary with min, max, avg, current values
        """
        with self.lock:
            if name not in self.metrics or not self.metrics[name]:
                return None
            
            values = [m.value for m in self.metrics[name]]
            
            return {
                "min": min(values),
                "max": max(values),
                "avg": sum(values) / len(values),
                "current": values[-1],
                "count": len(values)
            }
    
    def register_callback(self, metric_name: str, callback: Callable[[PerformanceMetric], None]) -> None:
        """
        Register callback for metric changes
        
        Args:
            metric_name: Name of metric to monitor
            callback: Callback function
        """
        if metric_name not in self.callbacks:
            self.callbacks[metric_name] = []
        
        self.callbacks[metric_name].append(callback)
        self.logger.info(f"Registered callback for metric: {metric_name}")
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get comprehensive performance summary"""
        current_metrics = self.get_current_metrics()
        statistics = {}
        
        for metric_name in current_metrics.keys():
            stats = self.get_metric_statistics(metric_name)
            if stats:
                statistics[metric_name] = stats
        
        return {
            "timestamp": datetime.now().isoformat(),
            "monitoring": self.monitoring,
            "current_metrics": current_metrics,
            "statistics": statistics,
            "metric_count": len(self.metrics)
        }

