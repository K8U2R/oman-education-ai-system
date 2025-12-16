"""
Maintenance Routes - مسارات الصيانة
API routes for system maintenance operations
"""

from fastapi import APIRouter, Request, HTTPException, Path
from typing import Dict, Any, List
from datetime import datetime

router = APIRouter()


@router.get("/processes/list")
async def list_processes(request: Request) -> Dict[str, Any]:
    """
    List all processes
    
    Returns:
        List of all processes
    """
    process_scheduler = request.app.state.process_scheduler
    
    if not process_scheduler:
        raise HTTPException(status_code=503, detail="Process scheduler not available")
    
    running_processes = process_scheduler.get_running_processes()
    statistics = process_scheduler.get_statistics()
    
    return {
        "status": "success",
        "data": {
            "running_processes": running_processes,
            "statistics": statistics
        },
        "timestamp": datetime.now().isoformat()
    }


@router.post("/processes/submit")
async def submit_process(
    request: Request,
    process_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Submit a new process for execution
    
    Args:
        process_data: Process information (name, priority, etc.)
        
    Returns:
        Process submission result
    """
    process_scheduler = request.app.state.process_scheduler
    
    if not process_scheduler:
        raise HTTPException(status_code=503, detail="Process scheduler not available")
    
    # Extract process information
    name = process_data.get("name", "unnamed")
    priority_str = process_data.get("priority", "NORMAL").upper()
    
    # Map priority string to enum
    from system_core.process_scheduler import ProcessPriority
    priority_map = {
        "LOW": ProcessPriority.LOW,
        "NORMAL": ProcessPriority.NORMAL,
        "HIGH": ProcessPriority.HIGH,
        "CRITICAL": ProcessPriority.CRITICAL
    }
    priority = priority_map.get(priority_str, ProcessPriority.NORMAL)
    
    # For now, we'll create a simple async function
    # In production, this would be more sophisticated
    async def dummy_process():
        await asyncio.sleep(1)
        return {"result": "completed"}
    
    import asyncio
    pid = await process_scheduler.submit(
        func=dummy_process,
        name=name,
        priority=priority
    )
    
    return {
        "status": "success",
        "data": {
            "process_id": pid,
            "name": name,
            "priority": priority_str
        },
        "message": f"Process '{name}' submitted successfully",
        "timestamp": datetime.now().isoformat()
    }


@router.get("/processes/{pid}/status")
async def get_process_status(
    request: Request,
    pid: int = Path(..., description="Process ID")
) -> Dict[str, Any]:
    """
    Get process status
    
    Args:
        pid: Process ID
        
    Returns:
        Process status information
    """
    process_scheduler = request.app.state.process_scheduler
    
    if not process_scheduler:
        raise HTTPException(status_code=503, detail="Process scheduler not available")
    
    process_info = process_scheduler.get_process_info(pid)
    
    if not process_info:
        raise HTTPException(status_code=404, detail=f"Process {pid} not found")
    
    return {
        "status": "success",
        "data": process_info,
        "timestamp": datetime.now().isoformat()
    }


@router.post("/processes/{pid}/cancel")
async def cancel_process(
    request: Request,
    pid: int = Path(..., description="Process ID")
) -> Dict[str, Any]:
    """
    Cancel a running process
    
    Args:
        pid: Process ID
        
    Returns:
        Cancellation result
    """
    process_scheduler = request.app.state.process_scheduler
    
    if not process_scheduler:
        raise HTTPException(status_code=503, detail="Process scheduler not available")
    
    success = await process_scheduler.cancel_process(pid)
    
    if not success:
        raise HTTPException(status_code=400, detail=f"Failed to cancel process {pid}")
    
    return {
        "status": "success",
        "message": f"Process {pid} cancelled successfully",
        "timestamp": datetime.now().isoformat()
    }


@router.get("/cleanup/status")
async def get_cleanup_status(request: Request) -> Dict[str, Any]:
    """
    Get cleanup operations status
    
    Returns:
        Cleanup status
    """
    # Import cleanup manager
    from system_maintenance.cleanup_manager import CleanupManager
    
    cleanup = CleanupManager()
    history = cleanup.get_cleanup_history(limit=10)
    
    return {
        "status": "success",
        "data": {
            "history": history,
            "count": len(history)
        },
        "timestamp": datetime.now().isoformat()
    }


@router.post("/cleanup/temp-files")
async def cleanup_temp_files(
    request: Request,
    max_age_days: int = 7
) -> Dict[str, Any]:
    """
    Clean up temporary files
    
    Args:
        max_age_days: Maximum age of files to keep (days)
        
    Returns:
        Cleanup result
    """
    from system_maintenance.cleanup_manager import CleanupManager
    
    cleanup = CleanupManager()
    result = cleanup.cleanup_temp_files(max_age_days=max_age_days)
    
    return {
        "status": "success",
        "data": result,
        "message": f"Cleaned up {result['deleted']} files, freed {result['freed_mb']} MB",
        "timestamp": datetime.now().isoformat()
    }


@router.post("/cleanup/full")
async def perform_full_cleanup(request: Request) -> Dict[str, Any]:
    """
    Perform full system cleanup
    
    Returns:
        Full cleanup result
    """
    from system_maintenance.cleanup_manager import CleanupManager
    
    cleanup = CleanupManager()
    results = cleanup.perform_full_cleanup()
    
    total_deleted = sum(r["deleted"] for r in results.values())
    total_freed = sum(r["freed_mb"] for r in results.values())
    
    return {
        "status": "success",
        "data": results,
        "summary": {
            "total_deleted": total_deleted,
            "total_freed_mb": round(total_freed, 2)
        },
        "timestamp": datetime.now().isoformat()
    }

