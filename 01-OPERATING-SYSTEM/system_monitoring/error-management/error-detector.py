"""
Error Detector - كاشف الأخطاء
Detects and classifies system errors
"""

import logging
import re
from typing import Dict, List, Optional, Pattern
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class ErrorSeverity(Enum):
    """Error severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ErrorCategory(Enum):
    """Error categories"""
    SYSTEM = "system"
    NETWORK = "network"
    MEMORY = "memory"
    DISK = "disk"
    APPLICATION = "application"
    SECURITY = "security"
    UNKNOWN = "unknown"


@dataclass
class DetectedError:
    """Detected error information"""
    error_id: str
    message: str
    category: ErrorCategory
    severity: ErrorSeverity
    timestamp: datetime
    source: str
    details: Optional[Dict] = None
    
    def __post_init__(self):
        if self.details is None:
            self.details = {}


class ErrorDetector:
    """
    Error Detector Class
    Detects and classifies errors from various sources
    """
    
    def __init__(self):
        """Initialize Error Detector"""
        self.logger = logging.getLogger(__name__)
        self.detected_errors: List[DetectedError] = []
        self.error_patterns: Dict[ErrorCategory, List[Pattern]] = self._setup_error_patterns()
        self.error_count = 0
        
    def _setup_error_patterns(self) -> Dict[ErrorCategory, List[Pattern]]:
        """Setup error detection patterns"""
        patterns = {
            ErrorCategory.MEMORY: [
                re.compile(r'memory.*error', re.IGNORECASE),
                re.compile(r'out of memory', re.IGNORECASE),
                re.compile(r'memory.*leak', re.IGNORECASE),
            ],
            ErrorCategory.DISK: [
                re.compile(r'disk.*full', re.IGNORECASE),
                re.compile(r'no space.*device', re.IGNORECASE),
                re.compile(r'disk.*error', re.IGNORECASE),
            ],
            ErrorCategory.NETWORK: [
                re.compile(r'network.*error', re.IGNORECASE),
                re.compile(r'connection.*refused', re.IGNORECASE),
                re.compile(r'timeout', re.IGNORECASE),
                re.compile(r'failed to fetch', re.IGNORECASE),
                re.compile(r'connection.*error', re.IGNORECASE),
            ],
            ErrorCategory.SECURITY: [
                re.compile(r'unauthorized', re.IGNORECASE),
                re.compile(r'access.*denied', re.IGNORECASE),
                re.compile(r'security.*violation', re.IGNORECASE),
            ],
            ErrorCategory.AUTHENTICATION: [
                re.compile(r'authentication.*failed', re.IGNORECASE),
                re.compile(r'invalid.*credentials', re.IGNORECASE),
                re.compile(r'login.*failed', re.IGNORECASE),
                re.compile(r'session.*expired', re.IGNORECASE),
            ],
            ErrorCategory.AUTHORIZATION: [
                re.compile(r'forbidden', re.IGNORECASE),
                re.compile(r'permission.*denied', re.IGNORECASE),
                re.compile(r'insufficient.*permissions', re.IGNORECASE),
            ],
            ErrorCategory.VALIDATION: [
                re.compile(r'validation.*error', re.IGNORECASE),
                re.compile(r'invalid.*input', re.IGNORECASE),
                re.compile(r'missing.*required', re.IGNORECASE),
            ],
            ErrorCategory.API: [
                re.compile(r'api.*error', re.IGNORECASE),
                re.compile(r'endpoint.*not.*found', re.IGNORECASE),
                re.compile(r'http.*error', re.IGNORECASE),
            ],
            ErrorCategory.EXTERNAL_SERVICE: [
                re.compile(r'gemini.*api', re.IGNORECASE),
                re.compile(r'external.*service', re.IGNORECASE),
                re.compile(r'third.*party', re.IGNORECASE),
            ],
            ErrorCategory.DATABASE: [
                re.compile(r'database.*error', re.IGNORECASE),
                re.compile(r'sql.*error', re.IGNORECASE),
                re.compile(r'connection.*pool', re.IGNORECASE),
            ],
            ErrorCategory.SYSTEM: [
                re.compile(r'system.*error', re.IGNORECASE),
                re.compile(r'fatal.*error', re.IGNORECASE),
                re.compile(r'kernel.*panic', re.IGNORECASE),
            ],
        }
        return patterns
    
    def detect_error(
        self,
        message: str,
        source: str = "unknown",
        details: Optional[Dict] = None,
        category: Optional[ErrorCategory] = None,
        severity: Optional[ErrorSeverity] = None
    ) -> Optional[DetectedError]:
        """
        Detect and classify an error
        
        Args:
            message: Error message
            source: Error source
            details: Additional error details
            category: Optional pre-determined category (if provided, skips classification)
            severity: Optional pre-determined severity (if provided, skips severity determination)
            
        Returns:
            DetectedError object or None
        """
        # Classify error (if category not provided)
        if category is None:
            category = self._classify_error(message)
        
        # Determine severity (if not provided)
        if severity is None:
            severity = self._determine_severity(message, category)
        
        # Create error object
        error_id = f"ERR_{self.error_count:06d}"
        self.error_count += 1
        
        error = DetectedError(
            error_id=error_id,
            message=message,
            category=category,
            severity=severity,
            timestamp=datetime.now(),
            source=source,
            details=details or {}
        )
        
        self.detected_errors.append(error)
        
        # Keep only last 1000 errors
        if len(self.detected_errors) > 1000:
            self.detected_errors.pop(0)
        
        self.logger.warning(
            f"🔍 Detected {severity.value.upper()} error [{category.value}]: {message[:100]}"
        )
        
        return error
    
    def _classify_error(self, message: str) -> ErrorCategory:
        """Classify error into category"""
        message_lower = message.lower()
        
        for category, patterns in self.error_patterns.items():
            for pattern in patterns:
                if pattern.search(message):
                    return category
        
        return ErrorCategory.UNKNOWN
    
    def _determine_severity(self, message: str, category: ErrorCategory) -> ErrorSeverity:
        """Determine error severity"""
        message_lower = message.lower()
        
        # Critical keywords
        critical_keywords = ['fatal', 'critical', 'panic', 'crash', 'corrupt']
        if any(keyword in message_lower for keyword in critical_keywords):
            return ErrorSeverity.CRITICAL
        
        # High severity keywords
        high_keywords = ['error', 'failed', 'exception', 'unable']
        if any(keyword in message_lower for keyword in high_keywords):
            return ErrorSeverity.HIGH
        
        # Medium severity keywords
        medium_keywords = ['warning', 'caution', 'issue']
        if any(keyword in message_lower for keyword in medium_keywords):
            return ErrorSeverity.MEDIUM
        
        return ErrorSeverity.LOW
    
    def get_errors(
        self,
        category: Optional[ErrorCategory] = None,
        severity: Optional[ErrorSeverity] = None,
        limit: int = 100
    ) -> List[DetectedError]:
        """
        Get detected errors with filters
        
        Args:
            category: Filter by category
            severity: Filter by severity
            limit: Maximum number of errors to return
            
        Returns:
            List of detected errors
        """
        errors = self.detected_errors
        
        if category:
            errors = [e for e in errors if e.category == category]
        
        if severity:
            errors = [e for e in errors if e.severity == severity]
        
        return errors[-limit:]
    
    def get_error_statistics(self) -> Dict[str, Any]:
        """Get error statistics"""
        total = len(self.detected_errors)
        
        by_category = {}
        by_severity = {}
        
        for error in self.detected_errors:
            # Count by category
            cat = error.category.value
            by_category[cat] = by_category.get(cat, 0) + 1
            
            # Count by severity
            sev = error.severity.value
            by_severity[sev] = by_severity.get(sev, 0) + 1
        
        return {
            "total_errors": total,
            "by_category": by_category,
            "by_severity": by_severity,
            "recent_errors": len([e for e in self.detected_errors if 
                                 (datetime.now() - e.timestamp).total_seconds() < 3600])
        }
    
    def clear_errors(self) -> None:
        """Clear all detected errors"""
        self.detected_errors.clear()
        self.logger.info("Cleared all detected errors")

