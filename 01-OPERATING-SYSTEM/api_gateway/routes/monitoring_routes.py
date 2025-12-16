"""
Monitoring Routes - مسارات المراقبة
API routes for system monitoring
"""

from fastapi import APIRouter, Request, HTTPException, Body
from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()


class PerformanceReport(BaseModel):
    """Performance report from frontend"""
    timestamp: str
    page: str
    userAgent: Optional[str] = None
    viewport: Optional[Dict[str, int]] = None
    connection: Optional[Dict[str, Any]] = None
    metrics: Optional[list] = None
    webVitals: Optional[Dict[str, float]] = None


@router.get("/health")
async def get_health_check(request: Request) -> Dict[str, Any]:
    """
    Get system health check
    
    Returns:
        Health check results
    """
    health_check = request.app.state.health_check
    
    if not health_check:
        raise HTTPException(status_code=503, detail="Health check not available")
    
    health_report = health_check.check_system_health()
    
    return {
        "status": "success",
        "data": health_report,
        "timestamp": datetime.now().isoformat()
    }


@router.get("/performance")
async def get_performance_metrics(request: Request) -> Dict[str, Any]:
    """
    Get performance metrics
    
    Returns:
        Performance metrics
    """
    performance_monitor = request.app.state.performance_monitor
    
    if not performance_monitor:
        raise HTTPException(status_code=503, detail="Performance monitor not available")
    
    summary = performance_monitor.get_performance_summary()
    
    return {
        "status": "success",
        "data": summary,
        "timestamp": datetime.now().isoformat()
    }


@router.get("/resources")
async def get_resource_usage(request: Request) -> Dict[str, Any]:
    """
    Get resource usage
    
    Returns:
        Resource usage information
    """
    resource_allocator = request.app.state.resource_allocator
    
    if not resource_allocator:
        raise HTTPException(status_code=503, detail="Resource allocator not available")
    
    all_usage = resource_allocator.get_all_resource_usage()
    statistics = resource_allocator.get_resource_statistics()
    
    return {
        "status": "success",
        "data": {
            "usage": {
                "cpu": {
                    "percent": all_usage.get("cpu", {}).usage_percent if hasattr(all_usage.get("cpu"), "usage_percent") else 0,
                    "status": all_usage.get("cpu", {}).status if hasattr(all_usage.get("cpu"), "status") else "unknown"
                },
                "memory": {
                    "percent": all_usage.get("memory", {}).usage_percent if hasattr(all_usage.get("memory"), "usage_percent") else 0,
                    "status": all_usage.get("memory", {}).status if hasattr(all_usage.get("memory"), "status") else "unknown"
                },
                "disk": {
                    "percent": all_usage.get("disk", {}).usage_percent if hasattr(all_usage.get("disk"), "usage_percent") else 0,
                    "status": all_usage.get("disk", {}).status if hasattr(all_usage.get("disk"), "status") else "unknown"
                }
            },
            "statistics": statistics
        },
        "timestamp": datetime.now().isoformat()
    }


@router.post("/performance")
async def receive_performance_report(
    request: Request,
    report: PerformanceReport = Body(...)
) -> Dict[str, Any]:
    """
    Receive performance report from frontend
    
    This endpoint accepts performance metrics from the frontend
    and can store them for analysis.
    
    Args:
        report: Performance report data from frontend
    
    Returns:
        Success confirmation
    """
    # يمكن حفظ البيانات في قاعدة بيانات أو ملف لاحقاً
    # For now, just acknowledge receipt
    
    # Log performance data if needed
    import logging
    logger = logging.getLogger(__name__)
    
    if report.webVitals:
        logger.info(f"Performance report received: {report.page} - FCP: {report.webVitals.get('fcp')}, LCP: {report.webVitals.get('lcp')}")
    
    return {
        "status": "success",
        "message": "Performance report received",
        "timestamp": datetime.now().isoformat()
    }

