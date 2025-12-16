"""
Integration Example - مثال التكامل
Example of how to integrate 01-OPERATING-SYSTEM with other systems
"""

import asyncio
import logging
from pathlib import Path
import sys

# Add paths
current_dir = Path(__file__).parent.parent
sys.path.insert(0, str(current_dir))

from api_gateway import APIServer
from integration import IntegrationBridge, ServiceRegistry
from event_system import EventBus, EventPublisher, EventSubscriber

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def example_integration():
    """Example integration setup"""
    
    # 1. Initialize Event System
    logger.info("📢 Initializing Event System...")
    event_bus = EventBus()
    publisher = EventPublisher(event_bus, source="01-OPERATING-SYSTEM")
    subscriber = EventSubscriber(event_bus)
    
    # Subscribe to system events
    async def handle_system_event(event):
        logger.info(f"📥 Received event: {event.event_name} from {event.source}")
    
    subscriber.subscribe_system_events(handle_system_event)
    
    # 2. Initialize Service Registry
    logger.info("📋 Initializing Service Registry...")
    registry = ServiceRegistry()
    
    # Register this system
    registry.register_service(
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
    
    # 3. Connect to 02-SYSTEM-INTEGRATION
    logger.info("🔗 Connecting to 02-SYSTEM-INTEGRATION...")
    bridge = IntegrationBridge(integration_url="http://localhost:8003")
    
    connected = await bridge.connect()
    if connected:
        await bridge.register_system({
            "description": "Operating System Module",
            "capabilities": registry.get_service("01-OPERATING-SYSTEM").capabilities
        })
        
        # Publish initialization event
        await publisher.publish_system_event("initialized", {
            "components": 8,
            "timestamp": "2025-12-12"
        })
    
    # 4. Start API Server
    logger.info("🚀 Starting API Server...")
    server = APIServer(host="0.0.0.0", port=8001)
    
    # Store components in app state for routes
    server.app.state.event_bus = event_bus
    server.app.state.service_registry = registry
    server.app.state.integration_bridge = bridge
    
    # Start server (this will block)
    try:
        await server.start()
    except KeyboardInterrupt:
        logger.info("🛑 Shutting down...")
        await bridge.disconnect()
        await server.stop()


if __name__ == "__main__":
    asyncio.run(example_integration())

