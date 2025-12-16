"""
System Routes - مسارات النظام
API routes for system management
"""

from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from typing import Dict, Any
from datetime import datetime

router = APIRouter()


@router.get("/status")
async def get_system_status(request: Request) -> Dict[str, Any]:
    """
    Get system status
    
    Returns:
        System status information
    """
    server = request.app.state.server
    
    if not server or not server.initializer:
        raise HTTPException(status_code=503, detail="System not initialized")
    
    status = server.initializer.get_status()
    
    return {
        "status": "running",
        "initialized": status["initialized"],
        "components": len(status.get("components", {})),
        "uptime_seconds": (
            (datetime.now() - server.start_time).total_seconds()
            if server.start_time else 0
        ),
        "timestamp": datetime.now().isoformat()
    }


@router.get("/health")
async def get_system_health(request: Request) -> Dict[str, Any]:
    """
    Get system health check
    
    Returns:
        System health information
    """
    health_check = request.app.state.health_check
    
    if not health_check:
        raise HTTPException(status_code=503, detail="Health check not available")
    
    health_report = health_check.check_system_health()
    
    return {
        "status": "healthy",
        "health_report": health_report,
        "timestamp": datetime.now().isoformat()
    }


@router.get("/info")
async def get_system_info(request: Request) -> Dict[str, Any]:
    """
    Get system information
    
    Returns:
        System information
    """
    initializer = request.app.state.initializer
    
    if not initializer:
        raise HTTPException(status_code=503, detail="System not initialized")
    
    status = initializer.get_status()
    
    return {
        "name": "Oman Education AI Operating System",
        "version": "1.0.0",
        "initialized": status["initialized"],
        "components": {
            name: info.get("status", "unknown")
            for name, info in status.get("components", {}).items()
        },
        "initialization_order": status.get("initialization_order", []),
        "timestamp": datetime.now().isoformat()
    }


@router.post("/shutdown")
async def shutdown_system(request: Request, background_tasks: BackgroundTasks) -> Dict[str, str]:
    """
    Shutdown the system gracefully
    
    Returns:
        Shutdown confirmation
    """
    server = request.app.state.server
    
    if not server:
        raise HTTPException(status_code=503, detail="Server not available")
    
    # Schedule shutdown
    background_tasks.add_task(server.stop)
    
    return {
        "message": "System shutdown initiated",
        "timestamp": datetime.now().isoformat()
    }

