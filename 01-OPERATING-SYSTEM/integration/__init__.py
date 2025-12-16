"""
Integration Module - وحدة التكامل
Integration layer for connecting with other systems
"""

from .integration_bridge import IntegrationBridge
from .system_connector import SystemConnector
from .service_registry import ServiceRegistry, ServiceInfo, ServiceStatus
from .system_integration_connector import SystemIntegrationConnector
from .web_interface_connector import WebInterfaceConnector

# Import IntegrationManager
try:
    from .integration_manager import IntegrationManager
except ImportError as e:
    # IntegrationManager may not be available if dependencies are missing
    IntegrationManager = None
    _import_error = e

__all__ = [
    'IntegrationBridge',
    'SystemConnector',
    'ServiceRegistry',
    'ServiceInfo',
    'ServiceStatus',
    'SystemIntegrationConnector',
    'WebInterfaceConnector',
]

# Add IntegrationManager to __all__ if available
if IntegrationManager is not None:
    __all__.append('IntegrationManager')

