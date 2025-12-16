"""
Communication Bridge
جسر التواصل
"""

__version__ = "1.0.0"

from .message_broker import MessageBroker

# المكونات الأخرى قيد التطوير
# from .event_bus_manager import EventBusManager
# from .websocket_manager import WebSocketManager

__all__ = [
    "MessageBroker",
    # "EventBusManager",  # قيد التطوير
    # "WebSocketManager"  # قيد التطوير
]
