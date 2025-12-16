"""
Integration Manager - مدير التكامل
Manages all integrations with other systems
"""

import asyncio
import logging
from typing import Dict, Optional, Any
from datetime import datetime

from .system_integration_connector import SystemIntegrationConnector
from .web_interface_connector import WebInterfaceConnector
from .service_registry import ServiceRegistry
from event_system import EventBus, EventPublisher, EventSubscriber


class IntegrationManager:
    """
    Integration Manager Class
    Central manager for all system integrations
    """
    
    def __init__(
        self,
        integration_url: str = "http://localhost:8003",
        web_interface_url: str = "http://localhost:3000"
    ):
        """
        Initialize Integration Manager
        
        Args:
            integration_url: URL of 02-SYSTEM-INTEGRATION
            web_interface_url: URL of 03-WEB-INTERFACE
        """
        self.logger = logging.getLogger(__name__)
        
        # Connectors
        self.system_integration = SystemIntegrationConnector(integration_url)
        self.web_interface = WebInterfaceConnector(web_interface_url)
        self.service_registry = ServiceRegistry()
        
        # Event system
        self.event_bus = EventBus()
        self.publisher = EventPublisher(self.event_bus, source="integration_manager")
        self.subscriber = EventSubscriber(self.event_bus)
        
        # State
        self.initialized = False
        
    async def initialize(self) -> Dict[str, Any]:
        """
        Initialize all integrations
        
        Returns:
            Dictionary with initialization results
        """
        if self.initialized:
            return {"status": "already_initialized"}
        
        self.logger.info("🔗 Initializing integration manager...")
        results = {}
        
        # Connect to 02-SYSTEM-INTEGRATION
        try:
            connected = await self.system_integration.connect()
            results["system_integration"] = {
                "connected": connected,
                "status": self.system_integration.get_status()
            }
        except Exception as e:
            self.logger.error(f"Error connecting to 02-SYSTEM-INTEGRATION: {e}")
            results["system_integration"] = {"connected": False, "error": str(e)}
        
        # Check 03-WEB-INTERFACE
        try:
            frontend_status = await self.web_interface.get_frontend_status()
            results["web_interface"] = frontend_status
        except Exception as e:
            self.logger.error(f"Error checking 03-WEB-INTERFACE: {e}")
            results["web_interface"] = {"available": False, "error": str(e)}
        
        # Register this system in service registry
        self.service_registry.register_service(
            service_id="01-OPERATING-SYSTEM",
            name="Operating System",
            version="1.0.0",
            endpoint="http://localhost:8001",
            capabilities=[
                "system_management",
                "process_scheduling",
                "resource_monitoring",
                "service_management"
            ]
        )
        
        # Subscribe to events and forward them
        self.subscriber.subscribe_system_events(self._forward_system_event)
        self.subscriber.subscribe_service_events(self._forward_service_event)
        self.subscriber.subscribe_monitoring_events(self._forward_monitoring_event)
        
        self.initialized = True
        self.logger.info("✅ Integration manager initialized")
        
        # Publish initialization event
        await self.publisher.publish_system_event("integration_initialized", {
            "results": results,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "status": "initialized",
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _forward_system_event(self, event) -> None:
        """Forward system events to 02-SYSTEM-INTEGRATION"""
        if self.system_integration.status.value == "connected":
            await self.system_integration.send_event(
                event.event_name,
                event.data,
                priority="normal"
            )
    
    async def _forward_service_event(self, event) -> None:
        """Forward service events to 02-SYSTEM-INTEGRATION"""
        if self.system_integration.status.value == "connected":
            await self.system_integration.send_event(
                event.event_name,
                event.data,
                priority="normal"
            )
    
    async def _forward_monitoring_event(self, event) -> None:
        """Forward monitoring events to 02-SYSTEM-INTEGRATION"""
        if self.system_integration.status.value == "connected":
            priority = "high" if "alert" in event.event_name.lower() else "normal"
            await self.system_integration.send_event(
                event.event_name,
                event.data,
                priority=priority
            )
    
    async def shutdown(self) -> None:
        """Shutdown all integrations"""
        self.logger.info("🛑 Shutting down integration manager...")
        
        # Disconnect from 02-SYSTEM-INTEGRATION
        await self.system_integration.disconnect()
        
        # Unsubscribe from events
        self.subscriber.unsubscribe_all()
        
        self.initialized = False
        self.logger.info("✅ Integration manager shut down")
    
    def get_status(self) -> Dict[str, Any]:
        """Get integration status"""
        return {
            "initialized": self.initialized,
            "system_integration": self.system_integration.get_status(),
            "web_interface": {
                "url": self.web_interface.web_interface_url,
                "cors_config": self.web_interface.get_cors_config()
            },
            "service_registry": self.service_registry.get_statistics(),
            "timestamp": datetime.now().isoformat()
        }

