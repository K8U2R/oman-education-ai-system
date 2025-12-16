"""
Authentication Middleware - وسيط المصادقة
Basic authentication middleware for API Gateway
"""

import logging
from typing import Callable
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger(__name__)

# Simple API key storage (in production, use environment variables or database)
API_KEYS = {
    "dev-key-123": "development",
    "prod-key-456": "production"
}


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Authentication Middleware
    Validates API keys for protected endpoints
    """
    
    def __init__(self, app, require_auth: bool = False):
        """
        Initialize Auth Middleware
        
        Args:
            app: FastAPI application
            require_auth: Whether to require authentication (default: False for development)
        """
        super().__init__(app)
        self.require_auth = require_auth
        self.security = HTTPBearer(auto_error=False)
        
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request and validate authentication
        
        Args:
            request: HTTP request
            call_next: Next middleware/handler
            
        Returns:
            HTTP response
        """
        # Skip auth for public endpoints
        public_paths = ["/", "/health", "/docs", "/redoc", "/openapi.json"]
        if any(request.url.path.startswith(path) for path in public_paths):
            return await call_next(request)
        
        # If auth is not required, skip validation
        if not self.require_auth:
            return await call_next(request)
        
        # Check for API key in header
        api_key = request.headers.get("X-API-Key") or request.headers.get("Authorization")
        
        if api_key:
            # Remove "Bearer " prefix if present
            if api_key.startswith("Bearer "):
                api_key = api_key[7:]
            
            if api_key in API_KEYS:
                # Add user info to request state
                request.state.authenticated = True
                request.state.api_key = api_key
                request.state.user_role = API_KEYS[api_key]
                return await call_next(request)
        
        # No valid API key found
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_api_key(request: Request) -> str:
    """
    Get API key from request
    
    Args:
        request: HTTP request
        
    Returns:
        API key
    """
    return getattr(request.state, "api_key", None)


def require_auth(request: Request) -> bool:
    """
    Check if request is authenticated
    
    Args:
        request: HTTP request
        
    Returns:
        True if authenticated
    """
    return getattr(request.state, "authenticated", False)

