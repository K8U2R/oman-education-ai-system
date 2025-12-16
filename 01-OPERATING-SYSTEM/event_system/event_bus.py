"""
Event Bus - حافلة الأحداث
Central event bus for system-wide event distribution
"""

import asyncio
import logging
from typing import Dict, List, Callable, Any, Optional
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from collections import defaultdict


class EventType(Enum):
    """Event types"""
    SYSTEM = "system"
    SERVICE = "service"
    MONITORING = "monitoring"
    PROCESS = "process"
    ERROR = "error"
    ALERT = "alert"


@dataclass
class Event:
    """Event data class"""
    event_type: EventType
    event_name: str
    data: Dict[str, Any]
    timestamp: datetime
    source: str = "system"
    
    def __post_init__(self):
        if not isinstance(self.timestamp, datetime):
            self.timestamp = datetime.now()


class EventBus:
    """
    Event Bus Class
    Central event distribution system
    """
    
    def __init__(self):
        """Initialize Event Bus"""
        self.logger = logging.getLogger(__name__)
        self.subscribers: Dict[str, List[Callable]] = defaultdict(list)
        self.event_history: List[Event] = []
        self.max_history = 1000
        self.lock = asyncio.Lock()
        
    def subscribe(self, event_name: str, callback: Callable) -> None:
        """
        Subscribe to an event
        
        Args:
            event_name: Name of the event (e.g., "system.initialized")
            callback: Callback function to call when event is published
        """
        self.subscribers[event_name].append(callback)
        self.logger.info(f"Subscribed to event: {event_name}")
    
    def unsubscribe(self, event_name: str, callback: Callable) -> None:
        """
        Unsubscribe from an event
        
        Args:
            event_name: Name of the event
            callback: Callback function to remove
        """
        if callback in self.subscribers[event_name]:
            self.subscribers[event_name].remove(callback)
            self.logger.info(f"Unsubscribed from event: {event_name}")
    
    async def publish(
        self,
        event_type: EventType,
        event_name: str,
        data: Dict[str, Any],
        source: str = "system"
    ) -> None:
        """
        Publish an event
        
        Args:
            event_type: Type of event
            event_name: Name of the event
            data: Event data
            source: Source of the event
        """
        async with self.lock:
            # Create event
            event = Event(
                event_type=event_type,
                event_name=event_name,
                data=data,
                timestamp=datetime.now(),
                source=source
            )
            
            # Add to history
            self.event_history.append(event)
            if len(self.event_history) > self.max_history:
                self.event_history.pop(0)
            
            # Get subscribers
            subscribers = self.subscribers.get(event_name, [])
            
            # Also check for wildcard subscribers (e.g., "system.*")
            wildcard_key = f"{event_name.split('.')[0]}.*"
            subscribers.extend(self.subscribers.get(wildcard_key, []))
            
            self.logger.info(
                f"📢 Publishing event: {event_name} "
                f"(type: {event_type.value}, subscribers: {len(subscribers)})"
            )
            
            # Notify subscribers
            for callback in subscribers:
                try:
                    if asyncio.iscoroutinefunction(callback):
                        await callback(event)
                    else:
                        callback(event)
                except Exception as e:
                    self.logger.error(
                        f"Error in event subscriber for {event_name}: {e}",
                        exc_info=True
                    )
    
    def get_event_history(
        self,
        event_name: Optional[str] = None,
        limit: int = 100
    ) -> List[Event]:
        """
        Get event history
        
        Args:
            event_name: Filter by event name (optional)
            limit: Maximum number of events to return
            
        Returns:
            List of events
        """
        if event_name:
            events = [e for e in self.event_history if e.event_name == event_name]
        else:
            events = self.event_history
        
        return events[-limit:]
    
    def get_subscribers(self, event_name: str) -> List[Callable]:
        """Get list of subscribers for an event"""
        return self.subscribers.get(event_name, []).copy()
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get event bus statistics"""
        event_counts = {}
        for event in self.event_history:
            event_counts[event.event_name] = event_counts.get(event.event_name, 0) + 1
        
        return {
            "total_events": len(self.event_history),
            "total_subscribers": sum(len(subs) for subs in self.subscribers.values()),
            "events_by_name": event_counts,
            "subscribed_events": list(self.subscribers.keys())
        }


# Global event bus instance
_global_event_bus: Optional[EventBus] = None


def get_event_bus() -> EventBus:
    """Get global event bus instance"""
    global _global_event_bus
    if _global_event_bus is None:
        _global_event_bus = EventBus()
    return _global_event_bus

