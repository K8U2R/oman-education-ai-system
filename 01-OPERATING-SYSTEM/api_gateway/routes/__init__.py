"""
API Routes - مسارات API
All API route modules
"""

from . import system_routes
from . import monitoring_routes
from . import service_routes
from . import maintenance_routes
from . import websocket_routes
from . import info_routes
from . import ai_routes
from . import auth_routes
from . import user_personalization_routes
from . import error_routes

__all__ = [
    'system_routes',
    'monitoring_routes',
    'service_routes',
    'maintenance_routes',
    'websocket_routes',
    'info_routes',
    'ai_routes',
    'auth_routes',
    'user_personalization_routes',
    'error_routes',
]
