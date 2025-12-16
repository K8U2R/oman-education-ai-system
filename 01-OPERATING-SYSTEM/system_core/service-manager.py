"""
Service Manager - مدير الخدمات
Manages system services lifecycle and dependencies
"""

import asyncio
import logging
from typing import Dict, List, Optional, Callable, Any
from enum import Enum
from dataclasses import dataclass
from datetime import datetime


class ServiceStatus(Enum):
    """Service status enumeration"""
    STOPPED = "stopped"
    STARTING = "starting"
    RUNNING = "running"
    STOPPING = "stopping"
    FAILED = "failed"
    DISABLED = "disabled"


@dataclass
class Service:
    """Service data class"""
    name: str
    description: str
    status: ServiceStatus
    dependencies: List[str]
    start_func: Optional[Callable] = None
    stop_func: Optional[Callable] = None
    restart_func: Optional[Callable] = None
    priority: int = 5  # 1-10, higher is more important
    auto_start: bool = True
    created_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()


class ServiceManager:
    """
    Service Manager Class
    Manages the lifecycle of all system services
    """
    
    def __init__(self):
        """Initialize Service Manager"""
        self.logger = logging.getLogger(__name__)
        self.services: Dict[str, Service] = {}
        self.service_tasks: Dict[str, asyncio.Task] = {}
        self.startup_order: List[str] = []
        self.is_running = False
        
    async def register_service(
        self,
        name: str,
        description: str,
        start_func: Callable,
        stop_func: Optional[Callable] = None,
        restart_func: Optional[Callable] = None,
        dependencies: Optional[List[str]] = None,
        priority: int = 5,
        auto_start: bool = True
    ) -> bool:
        """
        Register a new service
        
        Args:
            name: Service name
            description: Service description
            start_func: Function to start the service
            stop_func: Function to stop the service
            restart_func: Function to restart the service
            dependencies: List of service names this service depends on
            priority: Service priority (1-10)
            auto_start: Whether to auto-start on system boot
            
        Returns:
            True if registered successfully
        """
        if name in self.services:
            self.logger.warning(f"Service '{name}' already registered")
            return False
        
        service = Service(
            name=name,
            description=description,
            status=ServiceStatus.STOPPED,
            dependencies=dependencies or [],
            start_func=start_func,
            stop_func=stop_func,
            restart_func=restart_func,
            priority=priority,
            auto_start=auto_start
        )
        
        self.services[name] = service
        self.logger.info(f"✅ Registered service: {name}")
        return True
    
    async def start_service(self, name: str) -> bool:
        """
        Start a service
        
        Args:
            name: Service name
            
        Returns:
            True if started successfully
        """
        if name not in self.services:
            self.logger.error(f"Service '{name}' not found")
            return False
        
        service = self.services[name]
        
        if service.status == ServiceStatus.RUNNING:
            self.logger.warning(f"Service '{name}' is already running")
            return True
        
        # Check dependencies
        for dep_name in service.dependencies:
            if dep_name not in self.services:
                self.logger.error(f"Dependency '{dep_name}' not found for service '{name}'")
                return False
            
            dep_service = self.services[dep_name]
            if dep_service.status != ServiceStatus.RUNNING:
                self.logger.info(f"Starting dependency '{dep_name}' for service '{name}'")
                await self.start_service(dep_name)
        
        try:
            service.status = ServiceStatus.STARTING
            self.logger.info(f"🚀 Starting service: {name}")
            
            if service.start_func:
                if asyncio.iscoroutinefunction(service.start_func):
                    await service.start_func()
                else:
                    service.start_func()
            
            service.status = ServiceStatus.RUNNING
            self.logger.info(f"✅ Service '{name}' started successfully")
            return True
            
        except Exception as e:
            service.status = ServiceStatus.FAILED
            self.logger.error(f"❌ Failed to start service '{name}': {e}", exc_info=True)
            return False
    
    async def stop_service(self, name: str) -> bool:
        """
        Stop a service
        
        Args:
            name: Service name
            
        Returns:
            True if stopped successfully
        """
        if name not in self.services:
            self.logger.error(f"Service '{name}' not found")
            return False
        
        service = self.services[name]
        
        if service.status == ServiceStatus.STOPPED:
            self.logger.warning(f"Service '{name}' is already stopped")
            return True
        
        try:
            service.status = ServiceStatus.STOPPING
            self.logger.info(f"🛑 Stopping service: {name}")
            
            # Stop dependent services first
            dependent_services = [
                svc_name for svc_name, svc in self.services.items()
                if name in svc.dependencies and svc.status == ServiceStatus.RUNNING
            ]
            
            for dep_name in dependent_services:
                await self.stop_service(dep_name)
            
            if service.stop_func:
                if asyncio.iscoroutinefunction(service.stop_func):
                    await service.stop_func()
                else:
                    service.stop_func()
            
            service.status = ServiceStatus.STOPPED
            self.logger.info(f"✅ Service '{name}' stopped successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"❌ Failed to stop service '{name}': {e}", exc_info=True)
            return False
    
    async def restart_service(self, name: str) -> bool:
        """
        Restart a service
        
        Args:
            name: Service name
            
        Returns:
            True if restarted successfully
        """
        self.logger.info(f"🔄 Restarting service: {name}")
        
        if name not in self.services:
            return False
        
        service = self.services[name]
        
        if service.restart_func:
            try:
                if asyncio.iscoroutinefunction(service.restart_func):
                    await service.restart_func()
                else:
                    service.restart_func()
                return True
            except Exception as e:
                self.logger.error(f"Failed to restart service '{name}': {e}")
                return False
        else:
            # Default restart: stop then start
            await self.stop_service(name)
            await asyncio.sleep(0.5)  # Brief pause
            return await self.start_service(name)
    
    async def start_all_services(self) -> Dict[str, bool]:
        """
        Start all auto-start services in dependency order
        
        Returns:
            Dictionary of service names and their start status
        """
        self.logger.info("🚀 Starting all services...")
        results = {}
        
        # Sort services by priority and dependencies
        sorted_services = self._get_startup_order()
        
        for service_name in sorted_services:
            service = self.services[service_name]
            if service.auto_start:
                results[service_name] = await self.start_service(service_name)
        
        self.is_running = True
        return results
    
    async def stop_all_services(self) -> Dict[str, bool]:
        """
        Stop all running services
        
        Returns:
            Dictionary of service names and their stop status
        """
        self.logger.info("🛑 Stopping all services...")
        results = {}
        
        # Stop in reverse order
        sorted_services = reversed(self._get_startup_order())
        
        for service_name in sorted_services:
            service = self.services[service_name]
            if service.status == ServiceStatus.RUNNING:
                results[service_name] = await self.stop_service(service_name)
        
        self.is_running = False
        return results
    
    def _get_startup_order(self) -> List[str]:
        """Calculate service startup order based on dependencies and priority"""
        if self.startup_order:
            return self.startup_order
        
        # Topological sort based on dependencies
        visited = set()
        temp_visited = set()
        order = []
        
        def visit(name: str):
            if name in temp_visited:
                raise ValueError(f"Circular dependency detected involving '{name}'")
            if name in visited:
                return
            
            temp_visited.add(name)
            
            service = self.services[name]
            for dep in service.dependencies:
                if dep in self.services:
                    visit(dep)
            
            temp_visited.remove(name)
            visited.add(name)
            order.append(name)
        
        # Sort by priority first, then visit
        sorted_by_priority = sorted(
            self.services.keys(),
            key=lambda x: self.services[x].priority,
            reverse=True
        )
        
        for service_name in sorted_by_priority:
            if service_name not in visited:
                visit(service_name)
        
        self.startup_order = order
        return order
    
    def get_service_status(self, name: str) -> Optional[ServiceStatus]:
        """Get service status"""
        if name in self.services:
            return self.services[name].status
        return None
    
    def get_all_services(self) -> Dict[str, Dict[str, Any]]:
        """Get information about all services"""
        return {
            name: {
                'description': service.description,
                'status': service.status.value,
                'dependencies': service.dependencies,
                'priority': service.priority,
                'auto_start': service.auto_start,
                'created_at': service.created_at.isoformat()
            }
            for name, service in self.services.items()
        }
    
    def get_running_services(self) -> List[str]:
        """Get list of running service names"""
        return [
            name for name, service in self.services.items()
            if service.status == ServiceStatus.RUNNING
        ]

