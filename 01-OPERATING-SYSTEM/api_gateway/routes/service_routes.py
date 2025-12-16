"""
Service Routes - مسارات الخدمات
API routes for service management
"""

from fastapi import APIRouter, Request, HTTPException, Path
from typing import Dict, Any, List
from datetime import datetime

router = APIRouter()


@router.get("/list")
async def list_services(request: Request) -> Dict[str, Any]:
    """
    List all services
    
    Returns:
        List of all services
    """
    service_manager = request.app.state.service_manager
    
    if not service_manager:
        raise HTTPException(status_code=503, detail="Service manager not available")
    
    services = service_manager.get_all_services()
    
    return {
        "status": "success",
        "data": {
            "services": services,
            "count": len(services)
        },
        "timestamp": datetime.now().isoformat()
    }


@router.get("/{service_name}/status")
async def get_service_status(
    request: Request,
    service_name: str = Path(..., description="Service name")
) -> Dict[str, Any]:
    """
    Get service status
    
    Args:
        service_name: Name of the service
        
    Returns:
        Service status
    """
    service_manager = request.app.state.service_manager
    
    if not service_manager:
        raise HTTPException(status_code=503, detail="Service manager not available")
    
    status = service_manager.get_service_status(service_name)
    
    if status is None:
        raise HTTPException(status_code=404, detail=f"Service '{service_name}' not found")
    
    return {
        "status": "success",
        "data": {
            "service_name": service_name,
            "status": status.value if hasattr(status, "value") else str(status)
        },
        "timestamp": datetime.now().isoformat()
    }


@router.post("/{service_name}/start")
async def start_service(
    request: Request,
    service_name: str = Path(..., description="Service name")
) -> Dict[str, Any]:
    """
    Start a service
    
    Args:
        service_name: Name of the service
        
    Returns:
        Start result
    """
    service_manager = request.app.state.service_manager
    
    if not service_manager:
        raise HTTPException(status_code=503, detail="Service manager not available")
    
    success = await service_manager.start_service(service_name)
    
    if not success:
        raise HTTPException(status_code=400, detail=f"Failed to start service '{service_name}'")
    
    return {
        "status": "success",
        "message": f"Service '{service_name}' started successfully",
        "timestamp": datetime.now().isoformat()
    }


@router.post("/{service_name}/stop")
async def stop_service(
    request: Request,
    service_name: str = Path(..., description="Service name")
) -> Dict[str, Any]:
    """
    Stop a service
    
    Args:
        service_name: Name of the service
        
    Returns:
        Stop result
    """
    service_manager = request.app.state.service_manager
    
    if not service_manager:
        raise HTTPException(status_code=503, detail="Service manager not available")
    
    success = await service_manager.stop_service(service_name)
    
    if not success:
        raise HTTPException(status_code=400, detail=f"Failed to stop service '{service_name}'")
    
    return {
        "status": "success",
        "message": f"Service '{service_name}' stopped successfully",
        "timestamp": datetime.now().isoformat()
    }


@router.get("/running/list")
async def list_running_services(request: Request) -> Dict[str, Any]:
    """
    List running services
    
    Returns:
        List of running services
    """
    service_manager = request.app.state.service_manager
    
    if not service_manager:
        raise HTTPException(status_code=503, detail="Service manager not available")
    
    running = service_manager.get_running_services()
    
    return {
        "status": "success",
        "data": {
            "services": running,
            "count": len(running)
        },
        "timestamp": datetime.now().isoformat()
    }

