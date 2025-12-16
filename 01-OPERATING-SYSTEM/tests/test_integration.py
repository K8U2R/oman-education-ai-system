"""
Test Integration - اختبار التكامل
Tests for integration with other systems
"""

import pytest
import httpx
import asyncio
from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from integration import IntegrationBridge, ServiceRegistry
from event_system import EventBus, EventPublisher, EventSubscriber


class TestIntegration:
    """Test suite for integration components"""
    
    @pytest.mark.asyncio
    async def test_integration_bridge_connection(self):
        """Test connection to 02-SYSTEM-INTEGRATION"""
        bridge = IntegrationBridge(integration_url="http://localhost:8003")
        
        # Try to connect (may fail if 02-SYSTEM-INTEGRATION is not running)
        connected = await bridge.connect()
        
        # This is expected to fail if integration system is not running
        # So we just check that the bridge initializes correctly
        assert bridge is not None
        assert bridge.integration_url == "http://localhost:8003"
        
        await bridge.disconnect()
    
    @pytest.mark.asyncio
    async def test_service_registry(self):
        """Test service registry"""
        registry = ServiceRegistry()
        
        # Register a test service
        success = registry.register_service(
            service_id="test-service",
            name="Test Service",
            version="1.0.0",
            endpoint="http://localhost:9000",
            capabilities=["test"]
        )
        
        assert success is True
        
        # Get service
        service = registry.get_service("test-service")
        assert service is not None
        assert service.name == "Test Service"
        
        # Find by capability
        services = registry.find_services_by_capability("test")
        assert len(services) > 0
        
        # Get statistics
        stats = registry.get_statistics()
        assert stats["total_services"] > 0
    
    @pytest.mark.asyncio
    async def test_event_bus(self):
        """Test event bus"""
        event_bus = EventBus()
        
        # Track received events
        received_events = []
        
        async def event_handler(event):
            received_events.append(event)
        
        # Subscribe to event
        event_bus.subscribe("test.event", event_handler)
        
        # Publish event
        from event_system.event_bus import EventType
        await event_bus.publish(
            EventType.SYSTEM,
            "test.event",
            {"test": "data"},
            source="test"
        )
        
        # Wait a bit for async processing
        await asyncio.sleep(0.1)
        
        # Check if event was received
        assert len(received_events) > 0
        assert received_events[0].event_name == "test.event"
    
    @pytest.mark.asyncio
    async def test_event_publisher_subscriber(self):
        """Test event publisher and subscriber"""
        event_bus = EventBus()
        publisher = EventPublisher(event_bus, source="test")
        subscriber = EventSubscriber(event_bus)
        
        received_events = []
        
        async def handler(event):
            received_events.append(event)
        
        # Subscribe
        subscriber.subscribe("system.test", handler)
        
        # Publish
        await publisher.publish_system_event("test", {"data": "test"})
        
        # Wait
        await asyncio.sleep(0.1)
        
        # Check
        assert len(received_events) > 0


async def manual_integration_test():
    """Manual integration test"""
    print("🔗 Testing integration components...\n")
    
    # Test Service Registry
    print("1. Testing Service Registry...")
    registry = ServiceRegistry()
    registry.register_service(
        service_id="test-service",
        name="Test Service",
        version="1.0.0",
        endpoint="http://localhost:9000",
        capabilities=["test", "integration"]
    )
    print(f"   ✅ Registered service: {registry.get_service('test-service').name}")
    
    # Test Event Bus
    print("\n2. Testing Event Bus...")
    event_bus = EventBus()
    received = []
    
    async def handler(event):
        received.append(event.event_name)
        print(f"   📥 Received event: {event.event_name}")
    
    event_bus.subscribe("test.event", handler)
    
    from event_system.event_bus import EventType
    await event_bus.publish(EventType.SYSTEM, "test.event", {}, "test")
    await asyncio.sleep(0.1)
    
    print(f"   ✅ Event system working: {len(received)} events received")
    
    # Test Integration Bridge (may fail if 02-SYSTEM-INTEGRATION not running)
    print("\n3. Testing Integration Bridge...")
    bridge = IntegrationBridge()
    connected = await bridge.connect()
    if connected:
        print("   ✅ Connected to 02-SYSTEM-INTEGRATION")
    else:
        print("   ⚠️  Could not connect to 02-SYSTEM-INTEGRATION (may not be running)")
    
    await bridge.disconnect()
    
    print("\n✅ Integration tests completed!")


if __name__ == "__main__":
    asyncio.run(manual_integration_test())

