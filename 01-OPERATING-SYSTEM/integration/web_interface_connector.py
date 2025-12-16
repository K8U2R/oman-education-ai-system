"""
Web Interface Connector - موصل واجهة الويب
Handles integration with 03-WEB-INTERFACE
"""

import logging
from typing import Dict, Optional, Any, List
from datetime import datetime
import httpx


class WebInterfaceConnector:
    """
    Web Interface Connector Class
    Manages connection and communication with 03-WEB-INTERFACE
    """
    
    def __init__(
        self,
        web_interface_url: str = "http://localhost:3000",
        api_url: str = "http://localhost:8001"
    ):
        """
        Initialize Web Interface Connector
        
        Args:
            web_interface_url: URL of 03-WEB-INTERFACE frontend
            api_url: URL of this system's API
        """
        self.logger = logging.getLogger(__name__)
        self.web_interface_url = web_interface_url
        self.api_url = api_url
        self.client: Optional[httpx.AsyncClient] = None
        
        # CORS configuration for this system
        self.allowed_origins = [
            web_interface_url,
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
        ]
    
    def get_cors_config(self) -> Dict[str, Any]:
        """
        Get CORS configuration for FastAPI
        
        Returns:
            CORS configuration dictionary
        """
        return {
            "allow_origins": self.allowed_origins,
            "allow_credentials": True,
            "allow_methods": ["*"],
            "allow_headers": ["*"],
        }
    
    async def notify_frontend(
        self,
        event_type: str,
        data: Dict[str, Any]
    ) -> bool:
        """
        Notify frontend about system events
        
        Args:
            event_type: Type of event
            data: Event data
            
        Returns:
            True if notified successfully
        """
        # In a real implementation, this would use WebSocket or SSE
        # For now, we'll just log it
        self.logger.info(f"📢 Frontend notification: {event_type}")
        return True
    
    async def get_frontend_status(self) -> Optional[Dict[str, Any]]:
        """
        Check if frontend is available
        
        Returns:
            Frontend status or None
        """
        try:
            if not self.client:
                self.client = httpx.AsyncClient(timeout=5.0)
            
            response = await self.client.get(f"{self.web_interface_url}/api/health")
            
            if response.status_code == 200:
                return {
                    "available": True,
                    "url": self.web_interface_url,
                    "status": "online"
                }
            else:
                return {
                    "available": False,
                    "url": self.web_interface_url,
                    "status": "offline"
                }
        except Exception as e:
            self.logger.debug(f"Frontend not available: {e}")
            return {
                "available": False,
                "url": self.web_interface_url,
                "status": "offline"
            }
    
    def get_api_endpoints_for_frontend(self) -> Dict[str, str]:
        """
        Get API endpoints information for frontend
        
        Returns:
            Dictionary of endpoint information
        """
        return {
            "base_url": self.api_url,
            "endpoints": {
                "system_status": f"{self.api_url}/api/v1/system/status",
                "system_health": f"{self.api_url}/api/v1/system/health",
                "monitoring_health": f"{self.api_url}/api/v1/monitoring/health",
                "monitoring_performance": f"{self.api_url}/api/v1/monitoring/performance",
                "services_list": f"{self.api_url}/api/v1/services/list",
                "websocket_status": f"{self.api_url}/ws/system-status",
                "websocket_monitoring": f"{self.api_url}/ws/monitoring",
                "websocket_events": f"{self.api_url}/ws/events",
            }
        }

