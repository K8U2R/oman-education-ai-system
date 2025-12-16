"""
Error Routes - مسارات الأخطاء
API routes for viewing and managing errors
"""

from fastapi import APIRouter, Request, HTTPException, Query
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/errors", tags=["Errors"])


class ErrorFilter(BaseModel):
    """Error filter parameters"""
    category: Optional[str] = None
    severity: Optional[str] = None
    source: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 100
    offset: int = 0


class ErrorStats(BaseModel):
    """Error statistics"""
    total: int
    by_category: Dict[str, int]
    by_severity: Dict[str, int]
    by_source: Dict[str, int]
    recent_count: int
    critical_count: int


@router.get("/", response_model=Dict[str, Any])
async def get_errors(
    request: Request,
    category: Optional[str] = Query(None, description="Filter by category"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    source: Optional[str] = Query(None, description="Filter by source"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of errors"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
) -> Dict[str, Any]:
    """
    Get list of errors with filters
    
    Returns:
        List of errors with pagination
    """
    try:
        # Get error detector from app state if available
        error_detector = getattr(request.app.state, 'error_detector', None)
        
        if not error_detector:
            # Return empty list if error detector not available
            return {
                "errors": [],
                "total": 0,
                "limit": limit,
                "offset": offset,
                "message": "Error detector not available"
            }
        
        # Get errors with filters
        from system_monitoring.error_management.error_detector import ErrorCategory, ErrorSeverity
        
        category_filter = None
        if category:
            try:
                category_filter = ErrorCategory[category.upper()]
            except KeyError:
                pass
        
        severity_filter = None
        if severity:
            try:
                severity_filter = ErrorSeverity[severity.upper()]
            except KeyError:
                pass
        
        errors = error_detector.get_errors(
            category=category_filter,
            severity=severity_filter,
            limit=limit + offset
        )
        
        # Apply source filter
        if source:
            errors = [e for e in errors if source.lower() in e.source.lower()]
        
        # Apply pagination
        total = len(errors)
        errors = errors[offset:offset + limit]
        
        # Convert to dict
        errors_data = []
        for error in errors:
            error_dict = {
                "error_id": error.error_id,
                "message": error.message,
                "category": error.category.value,
                "severity": error.severity.value,
                "timestamp": error.timestamp.isoformat(),
                "source": error.source,
                "details": error.details,
            }
            errors_data.append(error_dict)
        
        return {
            "errors": errors_data,
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "failed_to_get_errors",
                "message": f"Failed to retrieve errors: {str(e)}"
            }
        )


@router.get("/stats", response_model=Dict[str, Any])
async def get_error_statistics(request: Request) -> Dict[str, Any]:
    """
    Get error statistics
    
    Returns:
        Error statistics
    """
    try:
        error_detector = getattr(request.app.state, 'error_detector', None)
        
        if not error_detector:
            return {
                "total": 0,
                "by_category": {},
                "by_severity": {},
                "by_source": {},
                "recent_count": 0,
                "critical_count": 0,
                "message": "Error detector not available"
            }
        
        stats = error_detector.get_error_statistics()
        
        # Calculate by source
        by_source = {}
        for error in error_detector.detected_errors:
            source = error.source
            by_source[source] = by_source.get(source, 0) + 1
        
        # Calculate recent errors (last hour)
        one_hour_ago = datetime.now() - timedelta(hours=1)
        recent_count = len([
            e for e in error_detector.detected_errors
            if e.timestamp >= one_hour_ago
        ])
        
        # Calculate critical errors
        from system_monitoring.error_management.error_detector import ErrorSeverity
        critical_count = len([
            e for e in error_detector.detected_errors
            if e.severity == ErrorSeverity.CRITICAL
        ])
        
        return {
            "total": stats["total_errors"],
            "by_category": stats["by_category"],
            "by_severity": stats["by_severity"],
            "by_source": by_source,
            "recent_count": recent_count,
            "critical_count": critical_count,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "failed_to_get_stats",
                "message": f"Failed to retrieve error statistics: {str(e)}"
            }
        )


@router.get("/{error_id}", response_model=Dict[str, Any])
async def get_error_by_id(request: Request, error_id: str) -> Dict[str, Any]:
    """
    Get specific error by ID
    
    Args:
        error_id: Error ID
    
    Returns:
        Error details
    """
    try:
        error_detector = getattr(request.app.state, 'error_detector', None)
        
        if not error_detector:
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "error_detector_unavailable",
                    "message": "Error detector not available"
                }
            )
        
        # Find error by ID
        error = None
        for e in error_detector.detected_errors:
            if e.error_id == error_id:
                error = e
                break
        
        if not error:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "error_not_found",
                    "message": f"Error with ID {error_id} not found"
                }
            )
        
        return {
            "error_id": error.error_id,
            "message": error.message,
            "category": error.category.value,
            "severity": error.severity.value,
            "timestamp": error.timestamp.isoformat(),
            "source": error.source,
            "details": error.details,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "failed_to_get_error",
                "message": f"Failed to retrieve error: {str(e)}"
            }
        )


@router.delete("/", response_model=Dict[str, Any])
async def clear_errors(
    request: Request,
    category: Optional[str] = Query(None, description="Clear errors by category"),
    severity: Optional[str] = Query(None, description="Clear errors by severity"),
) -> Dict[str, Any]:
    """
    Clear errors
    
    Args:
        category: Clear errors by category (optional)
        severity: Clear errors by severity (optional)
    
    Returns:
        Success message
    """
    try:
        error_detector = getattr(request.app.state, 'error_detector', None)
        
        if not error_detector:
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "error_detector_unavailable",
                    "message": "Error detector not available"
                }
            )
        
        if category or severity:
            # Filter and remove specific errors
            from system_monitoring.error_management.error_detector import ErrorCategory, ErrorSeverity
            
            category_filter = None
            if category:
                try:
                    category_filter = ErrorCategory[category.upper()]
                except KeyError:
                    pass
            
            severity_filter = None
            if severity:
                try:
                    severity_filter = ErrorSeverity[severity.upper()]
                except KeyError:
                    pass
            
            # Remove filtered errors
            original_count = len(error_detector.detected_errors)
            error_detector.detected_errors = [
                e for e in error_detector.detected_errors
                if (not category_filter or e.category != category_filter) and
                   (not severity_filter or e.severity != severity_filter)
            ]
            removed_count = original_count - len(error_detector.detected_errors)
            
            return {
                "message": f"Cleared {removed_count} errors",
                "removed_count": removed_count,
                "remaining_count": len(error_detector.detected_errors)
            }
        else:
            # Clear all errors
            count = len(error_detector.detected_errors)
            error_detector.clear_errors()
            
            return {
                "message": f"Cleared all {count} errors",
                "removed_count": count,
                "remaining_count": 0
            }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "failed_to_clear_errors",
                "message": f"Failed to clear errors: {str(e)}"
            }
        )

