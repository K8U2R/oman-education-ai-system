"""
Integration Orchestrator Main
main.py

منسق التكامل الرئيسي - نقطة الدخول الرئيسية
Main Integration Orchestrator - Main entry point

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
import sys
import importlib.util
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, status, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from typing import Optional
from datetime import datetime

# إضافة المسارات للاستيراد
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.insert(0, str(current_dir))
sys.path.insert(0, str(parent_dir))


def load_module(module_name: str, file_path: Path):
    """تحميل وحدة من مسار معين"""
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"لا يمكن تحميل الوحدة: {file_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


# تحميل المكونات باستخدام importlib (لأن أسماء الملفات تحتوي على شرطات)
config_module = load_module("config", current_dir / "config.py")
settings = config_module.settings

system_connector_module = load_module("system_connector", current_dir / "system-connector.py")
SystemConnector = system_connector_module.SystemConnector

api_gateway_module = load_module("api_gateway_manager", current_dir / "api-gateway-manager.py")
ApiGatewayManager = api_gateway_module.ApiGatewayManager

# تحميل من مجلدات أخرى
message_broker_module = load_module("message_broker", parent_dir / "communication-bridge" / "message-broker.py")
MessageBroker = message_broker_module.MessageBroker

dependency_manager_module = load_module("dependency_manager", parent_dir / "system-coordination" / "dependency-manager.py")
DependencyManager = dependency_manager_module.DependencyManager

# تحميل Operating System Bridge
os_bridge_module = load_module("operating_system_bridge", current_dir / "operating_system_bridge.py")
OperatingSystemBridge = os_bridge_module.OperatingSystemBridge

# تحميل Circuit Breaker
circuit_breaker_module = load_module("circuit_breaker", current_dir / "circuit-breaker.py")
CircuitBreaker = circuit_breaker_module.CircuitBreaker

# تحميل Retry Manager
retry_manager_module = load_module("retry_manager", current_dir / "retry-manager.py")
RetryManager = retry_manager_module.RetryManager

# تحميل Event Handler
event_handler_module = load_module("event_handler", current_dir / "event-handler.py")
EventHandler = event_handler_module.EventHandler
EventType = event_handler_module.EventType

# إعداد التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# المتغيرات العالمية
system_connector: Optional[SystemConnector] = None
api_gateway: Optional[ApiGatewayManager] = None
message_broker: Optional[MessageBroker] = None
dependency_manager: Optional[DependencyManager] = None
os_bridge: Optional[OperatingSystemBridge] = None
circuit_breaker: Optional[CircuitBreaker] = None
retry_manager: Optional[RetryManager] = None
event_handler: Optional[EventHandler] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    إدارة دورة حياة التطبيق
    """
    # بدء التشغيل
    logger.info("🚀 بدء تشغيل منسق التكامل...")
    
    global system_connector, api_gateway, message_broker, dependency_manager, os_bridge
    global circuit_breaker, retry_manager, event_handler
    
    try:
        # 1. تهيئة معالج الأحداث
        event_handler = EventHandler()
        
        # 2. تهيئة قاطع الدائرة
        circuit_breaker = CircuitBreaker(
            failure_threshold=5,
            timeout=60.0
        )
        
        # 3. تهيئة مدير إعادة المحاولة
        retry_manager = RetryManager(
            max_attempts=3,
            initial_delay=1.0,
            max_delay=60.0
        )
        
        # 4. تهيئة موصل الأنظمة
        project_root = parent_dir.parent
        system_connector = SystemConnector(project_root)
        await system_connector.connect_all_systems()
        
        # إصدار حدث ربط الأنظمة
        await event_handler.emit(
            EventType.SYSTEM_STARTED,
            "system_connector",
            {"systems": system_connector.get_connection_summary()}
        )
        
        # 5. تهيئة مدير التبعيات
        dependency_manager = DependencyManager()
        dependency_manager.register_system_dependencies()
        await dependency_manager.check_all_dependencies(system_connector)
        
        # 6. تهيئة وسيط الرسائل
        message_broker = MessageBroker()
        await message_broker.start()
        
        # 7. تهيئة بوابة API
        api_gateway = ApiGatewayManager()
        api_gateway.register_operating_system_routes(settings.OPERATING_SYSTEM_URL)
        api_gateway.register_web_interface_routes(settings.WEB_INTERFACE_URL)
        api_gateway.register_ai_core_routes(settings.AI_CORE_URL)
        
        # 8. تهيئة جسر نظام التشغيل
        os_bridge = OperatingSystemBridge(project_root, settings.OPERATING_SYSTEM_URL)
        await os_bridge.initialize()
        
        logger.info("✅ تم تهيئة جميع مكونات التكامل بنجاح")
        yield
        
    except Exception as e:
        logger.error(f"❌ فشل في تهيئة مكونات التكامل: {e}", exc_info=True)
        raise
        
    finally:
        # التنظيف عند الإيقاف
        logger.info("🛑 إيقاف منسق التكامل...")
        
        # إصدار حدث إيقاف
        if event_handler:
            await event_handler.emit(
                EventType.SYSTEM_STOPPED,
                "integration_orchestrator",
                {"timestamp": datetime.now().isoformat()}
            )
        
        if os_bridge:
            await os_bridge.shutdown()
        if message_broker:
            await message_broker.stop()
        logger.info("✅ تم إيقاف جميع المكونات")


# إنشاء تطبيق FastAPI
app = FastAPI(
    title="System Integration Orchestrator",
    description="منسق التكامل الرئيسي بين أنظمة التعليم الذكي",
    version="1.0.0",
    lifespan=lifespan
)

# إعداد CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """الصفحة الرئيسية"""
    return {
        "message": "مرحباً بكم في منسق تكامل الأنظمة",
        "version": "1.0.0",
        "status": "نشط",
        "service": settings.SERVICE_NAME
    }


@app.get("/health")
async def health_check():
    """فحص صحة النظام"""
    components_status = {
        "system_connector": system_connector is not None,
        "api_gateway": api_gateway is not None,
        "message_broker": message_broker is not None and message_broker.is_healthy() if message_broker else False,
        "dependency_manager": dependency_manager is not None,
        "os_bridge": os_bridge is not None,
        "circuit_breaker": circuit_breaker is not None,
        "retry_manager": retry_manager is not None,
        "event_handler": event_handler is not None
    }
    
    all_healthy = all(components_status.values())
    
    return {
        "status": "healthy" if all_healthy else "unhealthy",
        "components": components_status,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/integration/status")
async def integration_status():
    """حالة التكامل"""
    if not system_connector:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"error": "System connector not initialized"}
        )
    
    connection_summary = system_connector.get_connection_summary()
    
    dependency_summary = {}
    if dependency_manager:
        dependency_summary = dependency_manager.get_dependency_summary()
    
    # الحصول على حالة Operating System عبر الجسر
    os_status = None
    if os_bridge:
        try:
            os_status = await os_bridge.get_status()
        except Exception as e:
            logger.warning(f"خطأ في الحصول على حالة OS: {e}")
    
    return {
        "connections": connection_summary,
        "dependencies": dependency_summary,
        "operating_system": os_status,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/integration/routes")
async def get_routes():
    """الحصول على جميع المسارات"""
    if not api_gateway:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"error": "API Gateway not initialized"}
        )
    
    return {
        "routes": api_gateway.get_all_routes(),
        "stats": api_gateway.get_stats()
    }


@app.get("/api/integration/stats")
async def get_stats():
    """الحصول على الإحصائيات"""
    stats = {
        "system_connector": system_connector.get_connection_summary() if system_connector else None,
        "api_gateway": api_gateway.get_stats() if api_gateway else None,
        "message_broker": {
            "initialized": message_broker is not None,
            "healthy": message_broker.is_healthy() if message_broker else False,
            "subscribers_count": len(message_broker.subscribers) if message_broker else 0
        } if message_broker else None,
        "dependency_manager": dependency_manager.get_dependency_summary() if dependency_manager else None,
        "os_bridge": {
            "initialized": os_bridge is not None,
            "api_url": settings.OPERATING_SYSTEM_URL if os_bridge else None
        } if os_bridge else None,
        "circuit_breaker": circuit_breaker.get_state() if circuit_breaker else None,
        "retry_manager": retry_manager.get_stats() if retry_manager else None,
        "event_handler": event_handler.get_stats() if event_handler else None
    }
    
    return stats


@app.get("/api/integration/events")
async def get_events(limit: int = 100, event_type: Optional[str] = None):
    """الحصول على سجل الأحداث"""
    if not event_handler:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Event Handler not initialized"
        )
    
    event_type_enum = None
    if event_type:
        try:
            event_type_enum = EventType[event_type.upper()]
        except KeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid event type: {event_type}"
            )
    
    events = event_handler.get_event_history(event_type_enum, limit)
    
    return {
        "events": [event.to_dict() for event in events],
        "count": len(events),
        "timestamp": datetime.now().isoformat()
    }


# مسارات Operating System عبر API Gateway
@app.api_route("/api/integration/os/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_os_request(path: str, request: Request):
    """توجيه الطلبات إلى Operating System"""
    if not api_gateway:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="API Gateway not initialized"
        )
    
    # بناء المسار الكامل
    full_path = f"/api/integration/os/{path}"
    
    # إذا كان المسار مسجل، استخدم proxy
    if full_path in api_gateway.routes:
        try:
            # استخدام Circuit Breaker و Retry Manager
            if circuit_breaker and retry_manager:
                async def proxy_call():
                    return await api_gateway.proxy_request(
                        full_path,
                        request.method,
                        request
                    )
                
                result = await retry_manager.execute_with_retry(
                    circuit_breaker.call,
                    proxy_call
                )
                return result
            else:
                return await api_gateway.proxy_request(
                    full_path,
                    request.method,
                    request
                )
        except Exception as e:
            logger.error(f"خطأ في توجيه الطلب: {e}")
            # إصدار حدث خطأ
            if event_handler:
                await event_handler.emit(
                    EventType.ERROR_OCCURRED,
                    "api_gateway",
                    {"path": full_path, "error": str(e)}
                )
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"خطأ في توجيه الطلب: {str(e)}"
            )
    else:
        # محاولة توجيه مباشر
        target_url = f"{settings.OPERATING_SYSTEM_URL}/{path}"
        try:
            import httpx
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.request(
                    method=request.method,
                    url=target_url,
                    headers=dict(request.headers),
                    content=await request.body(),
                    params=dict(request.query_params)
                )
                return Response(
                    content=response.content,
                    status_code=response.status_code,
                    headers=dict(response.headers)
                )
        except Exception as e:
            logger.error(f"خطأ في توجيه الطلب: {e}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"خطأ في توجيه الطلب: {str(e)}"
            )


# مسارات مباشرة عبر OS Bridge
@app.get("/api/integration/os/direct/health")
async def os_health_direct():
    """الحصول على صحة OS مباشرة"""
    if not os_bridge:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OS Bridge not initialized"
        )
    
    try:
        if retry_manager:
            result = await retry_manager.execute_with_retry(
                os_bridge.get_health
            )
        else:
            result = await os_bridge.get_health()
        return result
    except Exception as e:
        logger.error(f"خطأ في الحصول على صحة OS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/integration/os/direct/status")
async def os_status_direct():
    """الحصول على حالة OS مباشرة"""
    if not os_bridge:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OS Bridge not initialized"
        )
    
    try:
        if retry_manager:
            result = await retry_manager.execute_with_retry(
                os_bridge.get_status
            )
        else:
            result = await os_bridge.get_status()
        return result
    except Exception as e:
        logger.error(f"خطأ في الحصول على حالة OS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/integration/os/direct/services")
async def os_services_direct():
    """الحصول على خدمات OS مباشرة"""
    if not os_bridge:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OS Bridge not initialized"
        )
    
    try:
        if retry_manager:
            result = await retry_manager.execute_with_retry(
                os_bridge.get_services
            )
        else:
            result = await os_bridge.get_services()
        return result
    except Exception as e:
        logger.error(f"خطأ في الحصول على خدمات OS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/integration/os/direct/resources")
async def os_resources_direct():
    """الحصول على موارد OS مباشرة"""
    if not os_bridge:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OS Bridge not initialized"
        )
    
    try:
        if retry_manager:
            result = await retry_manager.execute_with_retry(
                os_bridge.get_resources
            )
        else:
            result = await os_bridge.get_resources()
        return result
    except Exception as e:
        logger.error(f"خطأ في الحصول على موارد OS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/integration/os/direct/metrics")
async def os_metrics_direct():
    """الحصول على مقاييس OS مباشرة"""
    if not os_bridge:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OS Bridge not initialized"
        )
    
    try:
        if retry_manager:
            result = await retry_manager.execute_with_retry(
                os_bridge.get_metrics
            )
        else:
            result = await os_bridge.get_metrics()
        return result
    except Exception as e:
        logger.error(f"خطأ في الحصول على مقاييس OS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/api/integration/os/direct/start")
async def os_start_direct():
    """بدء OS مباشرة"""
    if not os_bridge:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OS Bridge not initialized"
        )
    
    try:
        if retry_manager:
            result = await retry_manager.execute_with_retry(
                os_bridge.start_system
            )
        else:
            result = await os_bridge.start_system()
        
        # إصدار حدث
        if event_handler:
            await event_handler.emit(
                EventType.SYSTEM_STARTED,
                "os_bridge",
                {"action": "start", "result": result}
            )
        
        return result
    except Exception as e:
        logger.error(f"خطأ في بدء OS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/api/integration/os/direct/stop")
async def os_stop_direct():
    """إيقاف OS مباشرة"""
    if not os_bridge:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OS Bridge not initialized"
        )
    
    try:
        if retry_manager:
            result = await retry_manager.execute_with_retry(
                os_bridge.stop_system
            )
        else:
            result = await os_bridge.stop_system()
        
        # إصدار حدث
        if event_handler:
            await event_handler.emit(
                EventType.SYSTEM_STOPPED,
                "os_bridge",
                {"action": "stop", "result": result}
            )
        
        return result
    except Exception as e:
        logger.error(f"خطأ في إيقاف OS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


if __name__ == "__main__":
    import uvicorn
    
    # إضافة المسار للاستيراد
    import sys
    from pathlib import Path
    current_dir = Path(__file__).parent
    parent_dir = current_dir.parent
    sys.path.insert(0, str(parent_dir))
    
    # تشغيل التطبيق
    uvicorn.run(
        app,
        host=settings.HOST,
        port=settings.PORT,
        log_level="info",
        reload=settings.DEBUG
    )
