"""
Event Subscriber - مشترك الأحداث
Helper class for subscribing to events
"""

import logging
from typing import Callable, Dict, Any
from .event_bus import EventBus, Event, get_event_bus


class EventSubscriber:
    """
    Event Subscriber Class
    Convenience class for subscribing to events
    """
    
    def __init__(self, event_bus: EventBus = None):
        """
        Initialize Event Subscriber
        
        Args:
            event_bus: Event bus instance (uses global if None)
        """
        self.logger = logging.getLogger(__name__)
        self.event_bus = event_bus or get_event_bus()
        self.subscriptions: Dict[str, Callable] = {}
    
    def subscribe(
        self,
        event_name: str,
        callback: Callable[[Event], Any],
        auto_unsubscribe: bool = False
    ) -> None:
        """
        Subscribe to an event
        
        Args:
            event_name: Event name to subscribe to
            callback: Callback function
            auto_unsubscribe: Whether to auto-unsubscribe after first event
        """
        def wrapped_callback(event: Event):
            try:
                result = callback(event)
                if auto_unsubscribe:
                    self.unsubscribe(event_name)
                return result
            except Exception as e:
                self.logger.error(f"Error in event callback: {e}", exc_info=True)
        
        self.event_bus.subscribe(event_name, wrapped_callback)
        self.subscriptions[event_name] = wrapped_callback
        
        self.logger.info(f"✅ Subscribed to event: {event_name}")
    
    def unsubscribe(self, event_name: str) -> None:
        """
        Unsubscribe from an event
        
        Args:
            event_name: Event name to unsubscribe from
        """
        if event_name in self.subscriptions:
            callback = self.subscriptions[event_name]
            self.event_bus.unsubscribe(event_name, callback)
            del self.subscriptions[event_name]
            self.logger.info(f"🚫 Unsubscribed from event: {event_name}")
    
    def unsubscribe_all(self) -> None:
        """Unsubscribe from all events"""
        for event_name in list(self.subscriptions.keys()):
            self.unsubscribe(event_name)
    
    def subscribe_system_events(self, callback: Callable[[Event], Any]) -> None:
        """Subscribe to all system events"""
        self.subscribe("system.*", callback)
    
    def subscribe_service_events(self, callback: Callable[[Event], Any]) -> None:
        """Subscribe to all service events"""
        self.subscribe("service.*", callback)
    
    def subscribe_monitoring_events(self, callback: Callable[[Event], Any]) -> None:
        """Subscribe to all monitoring events"""
        self.subscribe("monitoring.*", callback)

