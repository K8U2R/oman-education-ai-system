"""
Integration Orchestrator
منسق التكامل
"""

__version__ = "1.0.0"
__author__ = "Oman Education AI System"

# استيراد المكونات الرئيسية
from .system_connector import SystemConnector
from .api_gateway_manager import ApiGatewayManager

# المكونات الأخرى قيد التطوير
# from .data_synchronizer import DataSynchronizer
# from .integration_validator import IntegrationValidator

__all__ = [
    "SystemConnector",
    "ApiGatewayManager",
    # "DataSynchronizer",  # قيد التطوير
    # "IntegrationValidator"  # قيد التطوير
]
