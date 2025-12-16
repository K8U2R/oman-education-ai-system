"""
FastAPI Server - خادم FastAPI
Main API server for the Operating System
"""

import asyncio
import logging
import time
from collections import defaultdict, deque
from typing import Dict, Any, Optional
from datetime import datetime
from pathlib import Path
import sys
import os

# تحميل متغيرات البيئة من ملف .env في جذر المشروع (إذا كان موجوداً)
# Setup basic logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
_temp_logger = logging.getLogger(__name__)

try:
    from dotenv import load_dotenv

    # current_dir -> 01-OPERATING-SYSTEM/api_gateway
    # project_root -> oman-education-ai-system
    _current_file = Path(__file__).resolve()
    _project_root = _current_file.parent.parent.parent
    _env_path = _project_root / ".env"
    if _env_path.exists():
        load_dotenv(dotenv_path=_env_path, override=True)
        _temp_logger.info(f"✅ تم تحميل ملف .env من: {_env_path}")
        # التحقق من وجود GEMINI_API_KEY
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            _temp_logger.info(f"✅ تم العثور على GEMINI_API_KEY (الطول: {len(gemini_key)} حرف)")
        else:
            _temp_logger.warning("⚠️ GEMINI_API_KEY غير موجود في ملف .env")
    else:
        _temp_logger.warning(f"⚠️ ملف .env غير موجود في: {_env_path}")
except ImportError:
    _temp_logger.warning("⚠️ python-dotenv غير مثبت. سيتم الاعتماد على متغيرات البيئة في النظام فقط")
except Exception as e:
    _temp_logger.error(f"❌ خطأ في تحميل ملف .env: {e}")
    # في حالة عدم توفر python-dotenv، سيتم الاعتماد على متغيرات البيئة في النظام فقط
    pass

# Add parent directories to path
current_dir = Path(__file__).parent.parent
sys.path.insert(0, str(current_dir))

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from .middleware import LoggingMiddleware, AuthMiddleware
from .error_handler import error_handler
import uvicorn


class RateLimitMiddleware:
    """
    Middleware بسيط للحد من المعدل بالذاكرة (لكل IP)
    """

    def __init__(self, app: FastAPI, limit: int = 120, window_seconds: int = 60):
        self.app = app
        self.limit = max(limit, 1)
        self.window = max(window_seconds, 1)
        self.requests: Dict[str, deque] = defaultdict(deque)

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        client = scope.get("client")
        ip = client[0] if client else "unknown"

        now = time.time()
        window_start = now - self.window

        dq = self.requests[ip]
        while dq and dq[0] < window_start:
            dq.popleft()

        if len(dq) >= self.limit:
            response = JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Try again later."},
            )
            await response(scope, receive, send)
            return

        dq.append(now)
        await self.app(scope, receive, send)

# Import system components
from system_core import SystemInitializer, ServiceManager, ProcessScheduler, ResourceAllocator
from system_monitoring import SystemHealthCheck, PerformanceMonitor

logger = logging.getLogger(__name__)


class APIServer:
    """
    API Server Class
    Main FastAPI server for the Operating System
    """
    
    def __init__(self, host: str = "0.0.0.0", port: int = 8001):
        """
        Initialize API Server
        
        Args:
            host: Host to bind to
            port: Port to bind to
        """
        self.host = host
        self.port = port
        self.app = create_app()
        self.server: Optional[uvicorn.Server] = None
        self.is_running = False
        
        # Initialize system components
        self.initializer: Optional[SystemInitializer] = None
        self.service_manager: Optional[ServiceManager] = None
        self.scheduler: Optional[ProcessScheduler] = None
        self.resource_allocator: Optional[ResourceAllocator] = None
        self.health_check: Optional[SystemHealthCheck] = None
        self.performance_monitor: Optional[PerformanceMonitor] = None
        self.integration_manager = None
        
        # Initialize components
        self._initialize_components()
        
        # Setup routes
        self._setup_routes()
    
    def _initialize_components(self) -> None:
        """Initialize system components"""
        logger.info("Initializing system components for API server...")
        
        # Initialize system
        self.initializer = SystemInitializer()
        asyncio.create_task(self.initializer.initialize())
        
        # Initialize service manager
        self.service_manager = ServiceManager()
        
        # Initialize scheduler
        self.scheduler = ProcessScheduler(max_concurrent=10)
        asyncio.create_task(self.scheduler.start())
        
        # Initialize monitoring
        self.resource_allocator = ResourceAllocator()
        self.health_check = SystemHealthCheck()
        self.performance_monitor = PerformanceMonitor()
        self.performance_monitor.start_monitoring(interval=1.0)
        
        # Initialize integration manager (optional)
        try:
            from integration import IntegrationManager
            if IntegrationManager is not None:
                self.integration_manager = IntegrationManager()
                # Don't initialize here - let it be done explicitly if needed
                logger.info("Integration manager available")
        except (ImportError, AttributeError) as e:
            logger.warning(f"Integration manager not available: {e}")
            self.integration_manager = None
        except Exception as e:
            logger.warning(f"Integration manager not available: {e}")
            self.integration_manager = None
        
        # Initialize error detector and logger
        try:
            from system_monitoring.error_management.error_detector import ErrorDetector
            from system_monitoring.error_management.error_logger import ErrorLogger
            
            self.error_detector = ErrorDetector()
            self.error_logger = ErrorLogger()
            
            # Store in app state for access in routes
            self.app.state.error_detector = self.error_detector
            self.app.state.error_logger = self.error_logger
            
            logger.info("✅ Error management system initialized")
        except Exception as e:
            logger.warning(f"⚠️ Failed to initialize error management: {e}")
            self.error_detector = None
            self.error_logger = None
        
        logger.info("System components initialized successfully")
    
    def _setup_routes(self) -> None:
        """Setup API routes"""
        from .routes import (
            system_routes,
            monitoring_routes,
            service_routes,
            maintenance_routes,
            websocket_routes,
            info_routes,
            ai_routes,
            ai_intent_routes,
            auth_routes,
            user_personalization_routes,
            error_routes,
        )
        
        # Include routers
        self.app.include_router(info_routes.router, prefix="/api/v1", tags=["Info"])
        self.app.include_router(system_routes.router, prefix="/api/v1/system", tags=["System"])
        self.app.include_router(monitoring_routes.router, prefix="/api/v1/monitoring", tags=["Monitoring"])
        # Analytics routes (alias for monitoring, for frontend compatibility)
        self.app.include_router(monitoring_routes.router, prefix="/api/v1/analytics", tags=["Analytics"])
        self.app.include_router(service_routes.router, prefix="/api/v1/services", tags=["Services"])
        self.app.include_router(maintenance_routes.router, prefix="/api/v1", tags=["Maintenance"])
        self.app.include_router(websocket_routes.router, tags=["WebSocket"])
        self.app.include_router(ai_routes.router, tags=["AI"])  # AI chat/code routes
        self.app.include_router(ai_intent_routes.router, tags=["AI-Intent"])  # Advanced AI intent routes
        self.app.include_router(auth_routes.router)  # Auth routes (already has /api/v1/auth prefix)
        self.app.include_router(user_personalization_routes.router)  # User Personalization routes (already has /api/v1/user prefix)
        self.app.include_router(error_routes.router)  # Error routes (already has /api/v1/errors prefix)
        
        # Store server instance in app state
        self.app.state.server = self
        self.app.state.initializer = self.initializer
        self.app.state.service_manager = self.service_manager
        self.app.state.scheduler = self.scheduler
        self.app.state.resource_allocator = self.resource_allocator
        self.app.state.health_check = self.health_check
        self.app.state.performance_monitor = self.performance_monitor
        self.app.state.integration_manager = self.integration_manager
    
    async def start(self) -> None:
        """Start the API server"""
        if self.is_running:
            logger.warning("Server is already running")
            return
        
        logger.info(f"🚀 API Server starting on http://{self.host}:{self.port}")
        
        ssl_cert = os.getenv("SSL_CERTFILE")
        ssl_key = os.getenv("SSL_KEYFILE")

        config = uvicorn.Config(
            app=self.app,
            host=self.host,
            port=self.port,
            log_level="info",
            access_log=True,
            ssl_certfile=ssl_cert if ssl_cert else None,
            ssl_keyfile=ssl_key if ssl_key else None,
        )
        
        self.server = uvicorn.Server(config)
        self.is_running = True
        
        await self.server.serve()
    
    async def stop(self) -> None:
        """Stop the API server"""
        logger.info("🛑 Stopping API server...")
        
        if self.performance_monitor:
            self.performance_monitor.stop_monitoring()
        
        if self.scheduler:
            await self.scheduler.stop()
        
        if self.initializer:
            await self.initializer.shutdown()
        
        # Shutdown integration manager
        if self.integration_manager:
            await self.integration_manager.shutdown()
        
        if self.server:
            self.server.should_exit = True
        
        self.is_running = False
        logger.info("✅ API server stopped")


def create_app() -> FastAPI:
    """
    Create FastAPI application
    
    Returns:
        FastAPI application instance
    """
    app = FastAPI(
        title="Oman Education AI - Operating System API",
        description="API Gateway for the Operating System Module",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # إعداد CORS من متغير بيئة ALLOWED_ORIGINS (قائمة مفصولة بفواصل)
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
    origins_list = [o.strip() for o in allowed_origins.split(",") if o.strip()]
    if not origins_list:
        origins_list = ["*"]
    allow_all = "*" in origins_list

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if allow_all else origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Logging middleware
    app.add_middleware(LoggingMiddleware)
    
    # Auth middleware (disabled by default for development)
    # Uncomment to enable authentication:
    # app.add_middleware(AuthMiddleware, require_auth=True)

    # Rate Limit middleware بسيط بالذاكرة
    rate_limit_per_min = int(os.getenv("RATE_LIMIT_PER_MINUTE", "120"))
    app.add_middleware(RateLimitMiddleware, limit=rate_limit_per_min, window_seconds=60)
    
    # Enhanced Error Handlers
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        return await error_handler.handle_http_exception(request, exc)
    
    @app.exception_handler(StarletteHTTPException)
    async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException):
        return await error_handler.handle_http_exception(request, exc)
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return await error_handler.handle_validation_error(request, exc)
    
    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        return await error_handler.handle_generic_exception(request, exc)
    
    # Root endpoint
    @app.get("/")
    async def root():
        """الصفحة الرئيسية - Main Page"""
        return {
            "name": "Oman Education AI - Operating System API",
            "version": "1.0.0",
            "status": "running",
            "description": "نظام تشغيل متكامل ومتقدم لإدارة وتشغيل تطبيق سطح المكتب التعليمي الذكي",
            "endpoints": {
                "docs": "/docs",
                "redoc": "/redoc",
                "health": "/api/v1/system/health",
                "status": "/api/v1/system/status",
                "websocket": {
                    "system_status": "/ws/system-status",
                    "monitoring": "/ws/monitoring",
                    "events": "/ws/events"
                }
            },
            "api_version": "v1",
            "base_url": "/api/v1",
            "timestamp": datetime.now().isoformat()
        }
    
    # Health check endpoint
    @app.get("/health")
    async def health():
        return {"status": "healthy", "timestamp": datetime.now().isoformat()}
    
    return app


async def main():
    """Main function to run the server"""
    server = APIServer(host="0.0.0.0", port=8001)
    
    try:
        await server.start()
    except KeyboardInterrupt:
        logger.info("\n🛑 Shutting down server...")
        await server.stop()
    except Exception as e:
        logger.error(f"Error running server: {e}", exc_info=True)
        await server.stop()
        raise


def run_server():
    """Run the server (entry point for -m flag and direct import)"""
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("\n🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"Error running server: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run_server()
