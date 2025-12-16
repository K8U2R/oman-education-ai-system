"""
Resource Allocator - مخصص الموارد
Manages system resource allocation and monitoring
"""

import logging
import psutil
from typing import Dict, Optional, List, Tuple
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class ResourceType(Enum):
    """Resource type enumeration"""
    CPU = "cpu"
    MEMORY = "memory"
    DISK = "disk"
    NETWORK = "network"
    GPU = "gpu"


@dataclass
class ResourceLimit:
    """Resource limit configuration"""
    resource_type: ResourceType
    max_usage_percent: float
    warning_threshold: float = 80.0
    critical_threshold: float = 95.0


@dataclass
class ResourceUsage:
    """Current resource usage"""
    resource_type: ResourceType
    current_usage: float
    max_available: float
    usage_percent: float
    timestamp: datetime
    status: str  # "normal", "warning", "critical"


class ResourceAllocator:
    """
    Resource Allocator Class
    Manages and monitors system resource allocation
    """
    
    def __init__(self):
        """Initialize Resource Allocator"""
        self.logger = logging.getLogger(__name__)
        self.resource_limits: Dict[ResourceType, ResourceLimit] = {}
        self.resource_usage_history: Dict[ResourceType, List[ResourceUsage]] = {}
        self._setup_default_limits()
        
    def _setup_default_limits(self) -> None:
        """Setup default resource limits"""
        self.resource_limits = {
            ResourceType.CPU: ResourceLimit(
                resource_type=ResourceType.CPU,
                max_usage_percent=80.0,
                warning_threshold=70.0,
                critical_threshold=90.0
            ),
            ResourceType.MEMORY: ResourceLimit(
                resource_type=ResourceType.MEMORY,
                max_usage_percent=80.0,
                warning_threshold=75.0,
                critical_threshold=90.0
            ),
            ResourceType.DISK: ResourceLimit(
                resource_type=ResourceType.DISK,
                max_usage_percent=85.0,
                warning_threshold=80.0,
                critical_threshold=95.0
            ),
        }
        
        # Initialize history
        for resource_type in ResourceType:
            self.resource_usage_history[resource_type] = []
    
    def set_resource_limit(
        self,
        resource_type: ResourceType,
        max_usage_percent: float,
        warning_threshold: Optional[float] = None,
        critical_threshold: Optional[float] = None
    ) -> None:
        """
        Set resource limit
        
        Args:
            resource_type: Type of resource
            max_usage_percent: Maximum allowed usage percentage
            warning_threshold: Warning threshold (default: 80% of max)
            critical_threshold: Critical threshold (default: 95% of max)
        """
        if warning_threshold is None:
            warning_threshold = max_usage_percent * 0.8
        if critical_threshold is None:
            critical_threshold = max_usage_percent * 0.95
        
        self.resource_limits[resource_type] = ResourceLimit(
            resource_type=resource_type,
            max_usage_percent=max_usage_percent,
            warning_threshold=warning_threshold,
            critical_threshold=critical_threshold
        )
        
        self.logger.info(
            f"📊 Set resource limit for {resource_type.value}: "
            f"max={max_usage_percent}%, warning={warning_threshold}%, critical={critical_threshold}%"
        )
    
    def get_cpu_usage(self) -> ResourceUsage:
        """Get current CPU usage"""
        try:
            cpu_percent = psutil.cpu_percent(interval=0.1)
            cpu_count = psutil.cpu_count()
            
            limit = self.resource_limits.get(ResourceType.CPU)
            status = self._get_status(cpu_percent, limit)
            
            usage = ResourceUsage(
                resource_type=ResourceType.CPU,
                current_usage=cpu_percent,
                max_available=100.0,
                usage_percent=cpu_percent,
                timestamp=datetime.now(),
                status=status
            )
            
            self._add_to_history(usage)
            return usage
            
        except Exception as e:
            self.logger.error(f"Error getting CPU usage: {e}")
            raise
    
    def get_memory_usage(self) -> ResourceUsage:
        """Get current memory usage"""
        try:
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            memory_total = memory.total
            memory_used = memory.used
            
            limit = self.resource_limits.get(ResourceType.MEMORY)
            status = self._get_status(memory_percent, limit)
            
            usage = ResourceUsage(
                resource_type=ResourceType.MEMORY,
                current_usage=memory_used,
                max_available=memory_total,
                usage_percent=memory_percent,
                timestamp=datetime.now(),
                status=status
            )
            
            self._add_to_history(usage)
            return usage
            
        except Exception as e:
            self.logger.error(f"Error getting memory usage: {e}")
            raise
    
    def get_disk_usage(self, path: str = "/") -> ResourceUsage:
        """
        Get current disk usage
        
        Args:
            path: Disk path to check
        """
        try:
            disk = psutil.disk_usage(path)
            disk_percent = (disk.used / disk.total) * 100
            disk_total = disk.total
            disk_used = disk.used
            
            limit = self.resource_limits.get(ResourceType.DISK)
            status = self._get_status(disk_percent, limit)
            
            usage = ResourceUsage(
                resource_type=ResourceType.DISK,
                current_usage=disk_used,
                max_available=disk_total,
                usage_percent=disk_percent,
                timestamp=datetime.now(),
                status=status
            )
            
            self._add_to_history(usage)
            return usage
            
        except Exception as e:
            self.logger.error(f"Error getting disk usage: {e}")
            raise
    
    def get_network_usage(self) -> Dict[str, ResourceUsage]:
        """Get current network usage"""
        try:
            net_io = psutil.net_io_counters()
            
            # Calculate bytes per second (simplified)
            bytes_sent = net_io.bytes_sent
            bytes_recv = net_io.bytes_recv
            
            # For network, we'll create separate usage objects
            # In a real system, you'd track rates over time
            sent_usage = ResourceUsage(
                resource_type=ResourceType.NETWORK,
                current_usage=bytes_sent,
                max_available=float('inf'),  # Network doesn't have a fixed max
                usage_percent=0.0,  # Would need rate calculation
                timestamp=datetime.now(),
                status="normal"
            )
            
            recv_usage = ResourceUsage(
                resource_type=ResourceType.NETWORK,
                current_usage=bytes_recv,
                max_available=float('inf'),
                usage_percent=0.0,
                timestamp=datetime.now(),
                status="normal"
            )
            
            return {
                'sent': sent_usage,
                'received': recv_usage
            }
            
        except Exception as e:
            self.logger.error(f"Error getting network usage: {e}")
            raise
    
    def get_all_resource_usage(self) -> Dict[ResourceType, ResourceUsage]:
        """Get usage for all resources"""
        return {
            ResourceType.CPU: self.get_cpu_usage(),
            ResourceType.MEMORY: self.get_memory_usage(),
            ResourceType.DISK: self.get_disk_usage(),
        }
    
    def check_resource_availability(
        self,
        resource_type: ResourceType,
        required_amount: Optional[float] = None
    ) -> Tuple[bool, str]:
        """
        Check if resources are available
        
        Args:
            resource_type: Type of resource to check
            required_amount: Required amount (percentage for CPU/Memory, bytes for Disk)
            
        Returns:
            Tuple of (is_available, message)
        """
        try:
            if resource_type == ResourceType.CPU:
                usage = self.get_cpu_usage()
                limit = self.resource_limits.get(ResourceType.CPU)
                
                if required_amount:
                    available = 100.0 - usage.usage_percent
                    if available < required_amount:
                        return False, f"Insufficient CPU: {available:.1f}% available, {required_amount}% required"
                
                if usage.usage_percent >= limit.max_usage_percent:
                    return False, f"CPU usage at limit: {usage.usage_percent:.1f}%"
                
            elif resource_type == ResourceType.MEMORY:
                usage = self.get_memory_usage()
                limit = self.resource_limits.get(ResourceType.MEMORY)
                
                if required_amount:
                    available_bytes = usage.max_available - usage.current_usage
                    if available_bytes < required_amount:
                        return False, f"Insufficient memory: {available_bytes / (1024**3):.2f}GB available"
                
                if usage.usage_percent >= limit.max_usage_percent:
                    return False, f"Memory usage at limit: {usage.usage_percent:.1f}%"
                
            elif resource_type == ResourceType.DISK:
                usage = self.get_disk_usage()
                limit = self.resource_limits.get(ResourceType.DISK)
                
                if required_amount:
                    available_bytes = usage.max_available - usage.current_usage
                    if available_bytes < required_amount:
                        return False, f"Insufficient disk space: {available_bytes / (1024**3):.2f}GB available"
                
                if usage.usage_percent >= limit.max_usage_percent:
                    return False, f"Disk usage at limit: {usage.usage_percent:.1f}%"
            
            return True, "Resources available"
            
        except Exception as e:
            self.logger.error(f"Error checking resource availability: {e}")
            return False, f"Error: {str(e)}"
    
    def _get_status(self, usage_percent: float, limit: Optional[ResourceLimit]) -> str:
        """Get status based on usage percentage"""
        if limit is None:
            return "normal"
        
        if usage_percent >= limit.critical_threshold:
            return "critical"
        elif usage_percent >= limit.warning_threshold:
            return "warning"
        else:
            return "normal"
    
    def _add_to_history(self, usage: ResourceUsage) -> None:
        """Add usage to history (keep last 100 entries)"""
        history = self.resource_usage_history[usage.resource_type]
        history.append(usage)
        
        # Keep only last 100 entries
        if len(history) > 100:
            history.pop(0)
    
    def get_resource_history(
        self,
        resource_type: ResourceType,
        limit: int = 50
    ) -> List[ResourceUsage]:
        """Get resource usage history"""
        history = self.resource_usage_history.get(resource_type, [])
        return history[-limit:]
    
    def get_resource_statistics(self) -> Dict[str, Any]:
        """Get overall resource statistics"""
        all_usage = self.get_all_resource_usage()
        
        stats = {
            'timestamp': datetime.now().isoformat(),
            'resources': {}
        }
        
        for resource_type, usage in all_usage.items():
            limit = self.resource_limits.get(resource_type)
            stats['resources'][resource_type.value] = {
                'usage_percent': usage.usage_percent,
                'status': usage.status,
                'limit': limit.max_usage_percent if limit else None,
                'warning_threshold': limit.warning_threshold if limit else None,
                'critical_threshold': limit.critical_threshold if limit else None
            }
        
        return stats

