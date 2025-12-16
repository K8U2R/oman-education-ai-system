"""
Event Publisher - ناشر الأحداث
Helper class for publishing events
"""

import logging
from typing import Dict, Any
from .event_bus import EventBus, EventType, get_event_bus


class EventPublisher:
    """
    Event Publisher Class
    Convenience class for publishing events
    """
    
    def __init__(self, event_bus: EventBus = None, source: str = "system"):
        """
        Initialize Event Publisher
        
        Args:
            event_bus: Event bus instance (uses global if None)
            source: Source identifier for events
        """
        self.logger = logging.getLogger(__name__)
        self.event_bus = event_bus or get_event_bus()
        self.source = source
    
    async def publish_system_event(self, event_name: str, data: Dict[str, Any]) -> None:
        """
        Publish a system event
        
        Args:
            event_name: Event name (e.g., "initialized", "shutdown")
            data: Event data
        """
        await self.event_bus.publish(
            EventType.SYSTEM,
            f"system.{event_name}",
            data,
            source=self.source
        )
    
    async def publish_service_event(self, event_name: str, data: Dict[str, Any]) -> None:
        """
        Publish a service event
        
        Args:
            event_name: Event name (e.g., "started", "stopped")
            data: Event data
        """
        await self.event_bus.publish(
            EventType.SERVICE,
            f"service.{event_name}",
            data,
            source=self.source
        )
    
    async def publish_monitoring_event(self, event_name: str, data: Dict[str, Any]) -> None:
        """
        Publish a monitoring event
        
        Args:
            event_name: Event name (e.g., "alert", "health_check")
            data: Event data
        """
        await self.event_bus.publish(
            EventType.MONITORING,
            f"monitoring.{event_name}",
            data,
            source=self.source
        )
    
    async def publish_process_event(self, event_name: str, data: Dict[str, Any]) -> None:
        """
        Publish a process event
        
        Args:
            event_name: Event name (e.g., "started", "completed")
            data: Event data
        """
        await self.event_bus.publish(
            EventType.PROCESS,
            f"process.{event_name}",
            data,
            source=self.source
        )
    
    async def publish_error_event(self, event_name: str, data: Dict[str, Any]) -> None:
        """
        Publish an error event
        
        Args:
            event_name: Event name (e.g., "detected", "recovered")
            data: Event data
        """
        await self.event_bus.publish(
            EventType.ERROR,
            f"error.{event_name}",
            data,
            source=self.source
        )
    
    async def publish_alert_event(self, event_name: str, data: Dict[str, Any]) -> None:
        """
        Publish an alert event
        
        Args:
            event_name: Event name (e.g., "generated", "acknowledged")
            data: Event data
        """
        await self.event_bus.publish(
            EventType.ALERT,
            f"alert.{event_name}",
            data,
            source=self.source
        )

