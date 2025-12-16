"""
Full Integration Example - مثال التكامل الكامل
Complete example of integrating with all systems
"""

import asyncio
import logging
from pathlib import Path
import sys

# Add paths
current_dir = Path(__file__).parent.parent
sys.path.insert(0, str(current_dir))

from api_gateway import APIServer
from integration import IntegrationManager
from event_system import EventBus, EventPublisher

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def main():
    """Main integration example"""
    
    logger.info("🚀 Starting Full Integration Example...")
    logger.info("=" * 60)
    
    # 1. Initialize Integration Manager
    logger.info("\n📡 Step 1: Initializing Integration Manager...")
    integration_manager = IntegrationManager(
        integration_url="http://localhost:8003",
        web_interface_url="http://localhost:3000"
    )
    
    init_result = await integration_manager.initialize()
    logger.info(f"✅ Integration Manager initialized: {init_result['status']}")
    
    # 2. Start API Server with integration
    logger.info("\n🌐 Step 2: Starting API Server...")
    server = APIServer(host="0.0.0.0", port=8001)
    
    # Store integration manager in app state
    server.app.state.integration_manager = integration_manager
    
    # Update CORS with web interface URLs
    from fastapi.middleware.cors import CORSMiddleware
    cors_config = integration_manager.web_interface.get_cors_config()
    
    # Add CORS middleware if not already added
    # (It's already in create_app, but we can update it)
    
    # 3. Publish initialization event
    logger.info("\n📢 Step 3: Publishing initialization event...")
    await integration_manager.publisher.publish_system_event("system_ready", {
        "api_url": "http://localhost:8001",
        "integrations": {
            "system_integration": init_result["results"].get("system_integration", {}),
            "web_interface": init_result["results"].get("web_interface", {})
        }
    })
    
    # 4. Start server
    logger.info("\n" + "=" * 60)
    logger.info("✅ All systems ready!")
    logger.info("=" * 60)
    logger.info("\n📡 API Server: http://localhost:8001")
    logger.info("📚 Swagger UI: http://localhost:8001/docs")
    logger.info("🔌 WebSocket: ws://localhost:8001/ws/system-status")
    logger.info("\n" + "=" * 60)
    
    try:
        await server.start()
    except KeyboardInterrupt:
        logger.info("\n\n🛑 Shutting down...")
        await integration_manager.shutdown()
        await server.stop()
        logger.info("✅ Shutdown complete")


if __name__ == "__main__":
    # Fix encoding for Windows
    if sys.platform == 'win32':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
    
    asyncio.run(main())

