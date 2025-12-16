"""
Integration Bridge - جسر التكامل
Bridge for connecting with 02-SYSTEM-INTEGRATION
"""

import logging
import httpx
from typing import Dict, Optional, Any
from datetime import datetime
from enum import Enum


class IntegrationStatus(Enum):
    """Integration status"""
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    UNKNOWN = "unknown"


class IntegrationBridge:
    """
    Integration Bridge Class
    Connects 01-OPERATING-SYSTEM with 02-SYSTEM-INTEGRATION
    """
    
    def __init__(self, integration_url: str = "http://localhost:8003"):
        """
        Initialize Integration Bridge
        
        Args:
            integration_url: URL of 02-SYSTEM-INTEGRATION
        """
        self.logger = logging.getLogger(__name__)
        self.integration_url = integration_url
        self.status = IntegrationStatus.UNKNOWN
        self.client = httpx.AsyncClient(timeout=30.0)
        
    async def connect(self) -> bool:
        """
        Connect to 02-SYSTEM-INTEGRATION
        
        Returns:
            True if connected successfully
        """
        try:
            response = await self.client.get(f"{self.integration_url}/health")
            
            if response.status_code == 200:
                self.status = IntegrationStatus.CONNECTED
                self.logger.info(f"✅ Connected to 02-SYSTEM-INTEGRATION at {self.integration_url}")
                return True
            else:
                self.status = IntegrationStatus.ERROR
                self.logger.error(f"Failed to connect: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.status = IntegrationStatus.DISCONNECTED
            self.logger.error(f"Error connecting to 02-SYSTEM-INTEGRATION: {e}")
            return False
    
    async def register_system(self, system_info: Dict[str, Any]) -> bool:
        """
        Register this system with 02-SYSTEM-INTEGRATION
        
        Args:
            system_info: System information
            
        Returns:
            True if registered successfully
        """
        try:
            response = await self.client.post(
                f"{self.integration_url}/api/integration/systems/register",
                json={
                    "system_id": "01-OPERATING-SYSTEM",
                    "name": "Operating System",
                    "version": "1.0.0",
                    "api_url": "http://localhost:8001",
                    "capabilities": [
                        "system_management",
                        "process_scheduling",
                        "resource_monitoring",
                        "service_management"
                    ],
                    **system_info
                }
            )
            
            if response.status_code in [200, 201]:
                self.logger.info("✅ Registered with 02-SYSTEM-INTEGRATION")
                return True
            else:
                self.logger.error(f"Registration failed: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error registering system: {e}")
            return False
    
    async def send_event(self, event_type: str, event_data: Dict[str, Any]) -> bool:
        """
        Send event to 02-SYSTEM-INTEGRATION
        
        Args:
            event_type: Type of event
            event_data: Event data
            
        Returns:
            True if sent successfully
        """
        try:
            response = await self.client.post(
                f"{self.integration_url}/api/integration/events",
                json={
                    "source": "01-OPERATING-SYSTEM",
                    "event_type": event_type,
                    "data": event_data,
                    "timestamp": datetime.now().isoformat()
                }
            )
            
            return response.status_code == 200
            
        except Exception as e:
            self.logger.error(f"Error sending event: {e}")
            return False
    
    async def disconnect(self) -> None:
        """Disconnect from 02-SYSTEM-INTEGRATION"""
        self.status = IntegrationStatus.DISCONNECTED
        await self.client.aclose()
        self.logger.info("Disconnected from 02-SYSTEM-INTEGRATION")
    
    def get_status(self) -> Dict[str, Any]:
        """Get integration status"""
        return {
            "status": self.status.value,
            "integration_url": self.integration_url,
            "connected": self.status == IntegrationStatus.CONNECTED
        }

