"""
System Integration Connector - موصل تكامل النظام
Connects 01-OPERATING-SYSTEM with 02-SYSTEM-INTEGRATION
"""

import asyncio
import logging
import httpx
from typing import Dict, Optional, Any, List
from datetime import datetime
from enum import Enum
import json


class ConnectionStatus(Enum):
    """Connection status"""
    DISCONNECTED = "disconnected"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    ERROR = "error"
    RECONNECTING = "reconnecting"


class SystemIntegrationConnector:
    """
    System Integration Connector Class
    Handles connection and communication with 02-SYSTEM-INTEGRATION
    """
    
    def __init__(
        self,
        integration_url: str = "http://localhost:8003",
        system_id: str = "01-OPERATING-SYSTEM",
        reconnect_interval: int = 30
    ):
        """
        Initialize System Integration Connector
        
        Args:
            integration_url: URL of 02-SYSTEM-INTEGRATION
            system_id: ID of this system
            reconnect_interval: Interval for reconnection attempts (seconds)
        """
        self.logger = logging.getLogger(__name__)
        self.integration_url = integration_url
        self.system_id = system_id
        self.reconnect_interval = reconnect_interval
        
        self.status = ConnectionStatus.DISCONNECTED
        self.client: Optional[httpx.AsyncClient] = None
        self.registered = False
        self.heartbeat_task: Optional[asyncio.Task] = None
        self.reconnect_task: Optional[asyncio.Task] = None
        
        # System information
        self.system_info = {
            "system_id": system_id,
            "name": "Operating System",
            "version": "1.0.0",
            "api_url": "http://localhost:8001",
            "capabilities": [
                "system_management",
                "process_scheduling",
                "resource_monitoring",
                "service_management",
                "health_monitoring",
                "performance_monitoring"
            ],
            "endpoints": {
                "status": "/api/v1/system/status",
                "health": "/api/v1/system/health",
                "services": "/api/v1/services",
                "monitoring": "/api/v1/monitoring"
            }
        }
    
    async def connect(self) -> bool:
        """
        Connect to 02-SYSTEM-INTEGRATION
        
        Returns:
            True if connected successfully
        """
        if self.status == ConnectionStatus.CONNECTED:
            self.logger.warning("Already connected to 02-SYSTEM-INTEGRATION")
            return True
        
        self.status = ConnectionStatus.CONNECTING
        self.logger.info(f"🔗 Connecting to 02-SYSTEM-INTEGRATION at {self.integration_url}...")
        
        try:
            # Create HTTP client
            self.client = httpx.AsyncClient(
                base_url=self.integration_url,
                timeout=30.0,
                headers={"Content-Type": "application/json"}
            )
            
            # Test connection
            response = await self.client.get("/health")
            
            if response.status_code == 200:
                self.status = ConnectionStatus.CONNECTED
                self.logger.info("✅ Connected to 02-SYSTEM-INTEGRATION")
                
                # Register this system
                await self.register_system()
                
                # Start heartbeat
                self.heartbeat_task = asyncio.create_task(self._heartbeat_loop())
                
                return True
            else:
                self.status = ConnectionStatus.ERROR
                self.logger.error(f"Connection failed: HTTP {response.status_code}")
                return False
                
        except httpx.ConnectError:
            self.status = ConnectionStatus.DISCONNECTED
            self.logger.warning(
                f"⚠️  Could not connect to 02-SYSTEM-INTEGRATION at {self.integration_url}. "
                f"Will retry in {self.reconnect_interval}s"
            )
            
            # Start reconnection task
            if self.reconnect_task is None or self.reconnect_task.done():
                self.reconnect_task = asyncio.create_task(self._reconnect_loop())
            
            return False
            
        except Exception as e:
            self.status = ConnectionStatus.ERROR
            self.logger.error(f"Error connecting to 02-SYSTEM-INTEGRATION: {e}", exc_info=True)
            return False
    
    async def register_system(self) -> bool:
        """
        Register this system with 02-SYSTEM-INTEGRATION
        
        Returns:
            True if registered successfully
        """
        if not self.client or self.status != ConnectionStatus.CONNECTED:
            return False
        
        try:
            self.logger.info("📝 Registering system with 02-SYSTEM-INTEGRATION...")
            
            response = await self.client.post(
                "/api/integration/systems/register",
                json=self.system_info
            )
            
            if response.status_code in [200, 201]:
                self.registered = True
                self.logger.info("✅ System registered successfully")
                return True
            else:
                self.logger.error(f"Registration failed: HTTP {response.status_code}")
                if response.text:
                    self.logger.error(f"Response: {response.text}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error registering system: {e}", exc_info=True)
            return False
    
    async def send_event(
        self,
        event_type: str,
        event_data: Dict[str, Any],
        priority: str = "normal"
    ) -> bool:
        """
        Send event to 02-SYSTEM-INTEGRATION
        
        Args:
            event_type: Type of event
            event_data: Event data
            priority: Event priority (low, normal, high, critical)
            
        Returns:
            True if sent successfully
        """
        if not self.client or self.status != ConnectionStatus.CONNECTED:
            return False
        
        try:
            event = {
                "source": self.system_id,
                "event_type": event_type,
                "data": event_data,
                "priority": priority,
                "timestamp": datetime.now().isoformat()
            }
            
            response = await self.client.post(
                "/api/integration/events",
                json=event
            )
            
            if response.status_code == 200:
                self.logger.debug(f"📢 Event sent: {event_type}")
                return True
            else:
                self.logger.warning(f"Failed to send event: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error sending event: {e}")
            return False
    
    async def get_connected_systems(self) -> List[Dict[str, Any]]:
        """
        Get list of connected systems from 02-SYSTEM-INTEGRATION
        
        Returns:
            List of connected systems
        """
        if not self.client or self.status != ConnectionStatus.CONNECTED:
            return []
        
        try:
            response = await self.client.get("/api/integration/systems")
            
            if response.status_code == 200:
                data = response.json()
                return data.get("systems", [])
            else:
                return []
                
        except Exception as e:
            self.logger.error(f"Error getting connected systems: {e}")
            return []
    
    async def _heartbeat_loop(self) -> None:
        """Send periodic heartbeat to maintain connection"""
        while self.status == ConnectionStatus.CONNECTED:
            try:
                await asyncio.sleep(30)  # Send heartbeat every 30 seconds
                
                if self.client:
                    response = await self.client.post(
                        f"/api/integration/systems/{self.system_id}/heartbeat",
                        json={"timestamp": datetime.now().isoformat()}
                    )
                    
                    if response.status_code != 200:
                        self.logger.warning("Heartbeat failed, connection may be lost")
                        self.status = ConnectionStatus.ERROR
                        break
                        
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Error in heartbeat: {e}")
                self.status = ConnectionStatus.ERROR
                break
    
    async def _reconnect_loop(self) -> None:
        """Periodically attempt to reconnect"""
        while self.status != ConnectionStatus.CONNECTED:
            try:
                await asyncio.sleep(self.reconnect_interval)
                
                if self.status != ConnectionStatus.CONNECTED:
                    self.logger.info("🔄 Attempting to reconnect...")
                    await self.connect()
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Error in reconnect loop: {e}")
                await asyncio.sleep(self.reconnect_interval)
    
    async def disconnect(self) -> None:
        """Disconnect from 02-SYSTEM-INTEGRATION"""
        self.logger.info("🔌 Disconnecting from 02-SYSTEM-INTEGRATION...")
        
        self.status = ConnectionStatus.DISCONNECTED
        
        # Cancel tasks
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
            try:
                await self.heartbeat_task
            except asyncio.CancelledError:
                pass
        
        if self.reconnect_task:
            self.reconnect_task.cancel()
            try:
                await self.reconnect_task
            except asyncio.CancelledError:
                pass
        
        # Close client
        if self.client:
            await self.client.aclose()
            self.client = None
        
        self.registered = False
        self.logger.info("✅ Disconnected from 02-SYSTEM-INTEGRATION")
    
    def get_status(self) -> Dict[str, Any]:
        """Get connection status"""
        return {
            "status": self.status.value,
            "integration_url": self.integration_url,
            "system_id": self.system_id,
            "registered": self.registered,
            "connected": self.status == ConnectionStatus.CONNECTED
        }

