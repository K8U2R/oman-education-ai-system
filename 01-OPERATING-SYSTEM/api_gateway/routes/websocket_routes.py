"""
WebSocket Routes - مسارات WebSocket
Real-time WebSocket endpoints for live updates
"""

import asyncio
import json
import logging
from typing import Dict, Any
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request

router = APIRouter()

logger = logging.getLogger(__name__)

# Store active WebSocket connections
active_connections: Dict[str, WebSocket] = {}


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.connection_id_counter = 0
    
    async def connect(self, websocket: WebSocket, connection_id: str) -> None:
        """Accept WebSocket connection"""
        await websocket.accept()
        self.active_connections[connection_id] = websocket
        logger.info(f"✅ WebSocket connected: {connection_id}")
    
    def disconnect(self, connection_id: str) -> None:
        """Remove WebSocket connection"""
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
            logger.info(f"🔌 WebSocket disconnected: {connection_id}")
    
    async def send_personal_message(self, message: Dict[str, Any], connection_id: str) -> None:
        """Send message to specific connection"""
        if connection_id in self.active_connections:
            websocket = self.active_connections[connection_id]
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error sending message to {connection_id}: {e}")
                self.disconnect(connection_id)
    
    async def broadcast(self, message: Dict[str, Any]) -> None:
        """Broadcast message to all connections"""
        disconnected = []
        for connection_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to {connection_id}: {e}")
                disconnected.append(connection_id)
        
        # Remove disconnected connections
        for connection_id in disconnected:
            self.disconnect(connection_id)
    
    def get_connection_count(self) -> int:
        """Get number of active connections"""
        return len(self.active_connections)


# Global connection manager
manager = ConnectionManager()


@router.websocket("/ws/system-status")
async def system_status_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time system status updates
    
    Sends system status updates every second
    """
    connection_id = f"status_{datetime.now().timestamp()}"
    
    try:
        await manager.connect(websocket, connection_id)
        
        # Send initial status
        try:
            from system_core import SystemInitializer
            initializer = SystemInitializer()
            status = initializer.get_status()
        except Exception as e:
            logger.warning(f"Could not get system status: {e}")
            status = {"initialized": False, "components": {}}
        
        await websocket.send_json({
            "type": "initial_status",
            "data": {
                "initialized": status["initialized"],
                "components": len(status.get("components", {})),
                "timestamp": datetime.now().isoformat()
            }
        })
        
        # Send periodic updates
        while True:
            await asyncio.sleep(1)  # Update every second
            
            # Get current status
            status = initializer.get_status()
            
            # Get resource usage if available
            try:
                from system_core import ResourceAllocator
                allocator = ResourceAllocator()
                resources = allocator.get_all_resource_usage()
                
                resource_data = {}
                for name, usage in resources.items():
                    if hasattr(usage, 'usage_percent'):
                        resource_data[name.value] = {
                            "usage_percent": usage.usage_percent,
                            "status": usage.status
                        }
            except Exception as e:
                logger.debug(f"Could not get resource usage: {e}")
                resource_data = {}
            
            await websocket.send_json({
                "type": "status_update",
                "data": {
                    "initialized": status["initialized"],
                    "components": len(status.get("components", {})),
                    "resources": resource_data,
                    "timestamp": datetime.now().isoformat()
                }
            })
            
    except WebSocketDisconnect:
        manager.disconnect(connection_id)
        logger.info(f"WebSocket disconnected: {connection_id}")
    except Exception as e:
        logger.error(f"Error in WebSocket: {e}", exc_info=True)
        manager.disconnect(connection_id)


@router.websocket("/ws/monitoring")
async def monitoring_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time monitoring updates
    
    Sends monitoring metrics every second
    """
    connection_id = f"monitoring_{datetime.now().timestamp()}"
    
    try:
        await manager.connect(websocket, connection_id)
        
        # Get performance monitor
        try:
            from system_monitoring import PerformanceMonitor
            monitor = PerformanceMonitor()
            monitor.start_monitoring(interval=1.0)
        except Exception as e:
            logger.error(f"Could not start performance monitor: {e}")
            await websocket.close()
            return
        
        try:
            while True:
                await asyncio.sleep(1)  # Update every second
                
                # Get current metrics
                current_metrics = monitor.get_current_metrics()
                
                # Get health check
                try:
                    from system_monitoring import SystemHealthCheck
                    health_check = SystemHealthCheck()
                    health_report = health_check.check_system_health()
                except Exception as e:
                    logger.debug(f"Could not get health report: {e}")
                    health_report = {"overall_status": "unknown"}
                
                await websocket.send_json({
                    "type": "monitoring_update",
                    "data": {
                        "metrics": current_metrics,
                        "health": health_report.get("overall_status", "unknown"),
                        "timestamp": datetime.now().isoformat()
                    }
                })
        finally:
            monitor.stop_monitoring()
            
    except WebSocketDisconnect:
        manager.disconnect(connection_id)
        logger.info(f"WebSocket disconnected: {connection_id}")
    except Exception as e:
        logger.error(f"Error in monitoring WebSocket: {e}", exc_info=True)
        manager.disconnect(connection_id)


@router.websocket("/ws/events")
async def events_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time system events
    
    Sends system events as they occur
    """
    connection_id = f"events_{datetime.now().timestamp()}"
    
    try:
        await manager.connect(websocket, connection_id)
        
        # Subscribe to events
        try:
            from event_system import EventBus, EventSubscriber
            event_bus = EventBus()
            subscriber = EventSubscriber(event_bus)
        except Exception as e:
            logger.error(f"Could not initialize event system: {e}")
            await websocket.close()
            return
        
        async def event_handler(event):
            """Handle events and send via WebSocket"""
            await websocket.send_json({
                "type": "event",
                "data": {
                    "event_type": event.event_type.value,
                    "event_name": event.event_name,
                    "data": event.data,
                    "source": event.source,
                    "timestamp": event.timestamp.isoformat()
                }
            })
        
        # Subscribe to all system events
        subscriber.subscribe_system_events(event_handler)
        subscriber.subscribe_service_events(event_handler)
        subscriber.subscribe_monitoring_events(event_handler)
        
        # Keep connection alive
        while True:
            await asyncio.sleep(1)
            # Send ping to keep connection alive
            await websocket.send_json({
                "type": "ping",
                "timestamp": datetime.now().isoformat()
            })
            
    except WebSocketDisconnect:
        manager.disconnect(connection_id)
        subscriber.unsubscribe_all()
        logger.info(f"WebSocket disconnected: {connection_id}")
    except Exception as e:
        logger.error(f"Error in events WebSocket: {e}", exc_info=True)
        manager.disconnect(connection_id)


@router.get("/ws/connections")
async def get_websocket_connections() -> Dict[str, Any]:
    """
    Get information about active WebSocket connections
    
    Returns:
        Information about active connections
    """
    return {
        "active_connections": manager.get_connection_count(),
        "timestamp": datetime.now().isoformat()
    }

