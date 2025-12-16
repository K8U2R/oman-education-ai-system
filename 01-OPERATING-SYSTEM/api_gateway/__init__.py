"""
API Gateway Module - وحدة بوابة API
FastAPI-based API Gateway for the Operating System
"""

from .fastapi_server import APIServer, create_app

__all__ = [
    'APIServer',
    'create_app',
]

__version__ = "1.0.0"
