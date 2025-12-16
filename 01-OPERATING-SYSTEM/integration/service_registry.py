"""
Service Registry - سجل الخدمات
Service discovery and registration system
"""

import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class ServiceStatus(Enum):
    """Service status"""
    REGISTERED = "registered"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"


@dataclass
class ServiceInfo:
    """Service information"""
    service_id: str
    name: str
    version: str
    endpoint: str
    status: ServiceStatus
    capabilities: List[str]
    registered_at: datetime
    last_heartbeat: Optional[datetime] = None
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class ServiceRegistry:
    """
    Service Registry Class
    Manages service registration and discovery
    """
    
    def __init__(self):
        """Initialize Service Registry"""
        self.logger = logging.getLogger(__name__)
        self.services: Dict[str, ServiceInfo] = {}
        
    def register_service(
        self,
        service_id: str,
        name: str,
        version: str,
        endpoint: str,
        capabilities: List[str],
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Register a service
        
        Args:
            service_id: Unique service identifier
            name: Service name
            version: Service version
            endpoint: Service endpoint URL
            capabilities: List of service capabilities
            metadata: Additional metadata
            
        Returns:
            True if registered successfully
        """
        if service_id in self.services:
            self.logger.warning(f"Service {service_id} already registered, updating...")
        
        service_info = ServiceInfo(
            service_id=service_id,
            name=name,
            version=version,
            endpoint=endpoint,
            status=ServiceStatus.REGISTERED,
            capabilities=capabilities,
            registered_at=datetime.now(),
            metadata=metadata or {}
        )
        
        self.services[service_id] = service_info
        
        self.logger.info(
            f"✅ Registered service: {name} ({service_id}) "
            f"at {endpoint}"
        )
        
        return True
    
    def unregister_service(self, service_id: str) -> bool:
        """
        Unregister a service
        
        Args:
            service_id: Service identifier
            
        Returns:
            True if unregistered successfully
        """
        if service_id not in self.services:
            return False
        
        service = self.services[service_id]
        del self.services[service_id]
        
        self.logger.info(f"🚫 Unregistered service: {service.name} ({service_id})")
        
        return True
    
    def update_service_status(self, service_id: str, status: ServiceStatus) -> bool:
        """
        Update service status
        
        Args:
            service_id: Service identifier
            status: New status
            
        Returns:
            True if updated successfully
        """
        if service_id not in self.services:
            return False
        
        self.services[service_id].status = status
        self.services[service_id].last_heartbeat = datetime.now()
        
        return True
    
    def get_service(self, service_id: str) -> Optional[ServiceInfo]:
        """
        Get service information
        
        Args:
            service_id: Service identifier
            
        Returns:
            Service information or None
        """
        return self.services.get(service_id)
    
    def find_services_by_capability(self, capability: str) -> List[ServiceInfo]:
        """
        Find services by capability
        
        Args:
            capability: Capability to search for
            
        Returns:
            List of services with the capability
        """
        return [
            service for service in self.services.values()
            if capability in service.capabilities
        ]
    
    def get_all_services(self) -> List[ServiceInfo]:
        """Get all registered services"""
        return list(self.services.values())
    
    def get_active_services(self) -> List[ServiceInfo]:
        """Get all active services"""
        return [
            service for service in self.services.values()
            if service.status == ServiceStatus.ACTIVE
        ]
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get registry statistics"""
        status_counts = {}
        for service in self.services.values():
            status = service.status.value
            status_counts[status] = status_counts.get(status, 0) + 1
        
        return {
            "total_services": len(self.services),
            "active_services": len(self.get_active_services()),
            "services_by_status": status_counts
        }

