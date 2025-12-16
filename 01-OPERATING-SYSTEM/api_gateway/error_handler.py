"""
Enhanced Error Handler for FastAPI
معالج محسّن للأخطاء في FastAPI
"""

import logging
import traceback
from typing import Optional, Dict, Any, List
from datetime import datetime
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class ErrorCategory:
    """Error categories"""
    API = "api"
    NETWORK = "network"
    VALIDATION = "validation"
    AUTHENTICATION = "authentication"
    AUTHORIZATION = "authorization"
    SYSTEM = "system"
    DATABASE = "database"
    EXTERNAL_SERVICE = "external_service"
    UNKNOWN = "unknown"


class EnhancedErrorResponse:
    """Enhanced error response with detailed information"""
    
    def __init__(
        self,
        error: str,
        message: str,
        status_code: int,
        category: str = ErrorCategory.UNKNOWN,
        details: Optional[str] = None,
        source: Optional[str] = None,
        action: Optional[str] = None,
        url: Optional[str] = None,
        method: Optional[str] = None,
        error_code: Optional[str] = None,
        stack_trace: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        help_url: Optional[str] = None,
        suggestions: Optional[List[str]] = None,
        timestamp: Optional[datetime] = None,
    ):
        self.error = error
        self.message = message
        self.status_code = status_code
        self.category = category
        self.details = details
        self.source = source
        self.action = action
        self.url = url
        self.method = method
        self.error_code = error_code
        self.stack_trace = stack_trace
        self.context = context
        self.help_url = help_url
        self.suggestions = suggestions or []
        self.timestamp = timestamp or datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        result = {
            "error": self.error,
            "message": self.message,
            "status_code": self.status_code,
            "category": self.category,
            "timestamp": self.timestamp.isoformat(),
        }
        
        if self.details:
            result["details"] = self.details
        if self.source:
            result["source"] = self.source
        if self.action:
            result["action"] = self.action
        if self.url:
            result["url"] = self.url
        if self.method:
            result["method"] = self.method
        if self.error_code:
            result["error_code"] = self.error_code
        if self.stack_trace:
            result["stack_trace"] = self.stack_trace
        if self.context:
            result["context"] = self.context
        if self.help_url:
            result["help_url"] = self.help_url
        if self.suggestions:
            result["suggestions"] = self.suggestions
        
        return result


class ErrorHandler:
    """Enhanced error handler for FastAPI"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def determine_category(self, error: Exception, status_code: Optional[int] = None) -> str:
        """Determine error category"""
        error_str = str(error).lower()
        error_type = type(error).__name__.lower()
        
        # Network errors
        if any(keyword in error_str for keyword in ['connection', 'network', 'timeout', 'refused', 'fetch']):
            return ErrorCategory.NETWORK
        
        # Authentication errors
        if status_code == 401 or 'unauthorized' in error_str or 'authentication' in error_str:
            return ErrorCategory.AUTHENTICATION
        
        # Authorization errors
        if status_code == 403 or 'forbidden' in error_str or 'authorization' in error_str:
            return ErrorCategory.AUTHORIZATION
        
        # Validation errors
        if status_code == 400 or status_code == 422 or 'validation' in error_str or 'invalid' in error_str:
            return ErrorCategory.VALIDATION
        
        # Database errors
        if any(keyword in error_type for keyword in ['database', 'sql', 'db', 'orm']):
            return ErrorCategory.DATABASE
        
        # External service errors
        if any(keyword in error_str for keyword in ['api', 'service', 'external', 'third-party']):
            return ErrorCategory.EXTERNAL_SERVICE
        
        # System errors
        if status_code and status_code >= 500:
            return ErrorCategory.SYSTEM
        
        # API errors
        if status_code and 400 <= status_code < 500:
            return ErrorCategory.API
        
        return ErrorCategory.UNKNOWN
    
    def get_suggestions(self, error: Exception, category: str, error_code: Optional[str] = None) -> List[str]:
        """Get suggestions for fixing the error"""
        suggestions = []
        
        if category == ErrorCategory.NETWORK:
            suggestions.extend([
                "التحقق من اتصال الإنترنت",
                "التحقق من أن الخادم يعمل",
                "محاولة إعادة المحاولة بعد بضع لحظات"
            ])
        
        elif category == ErrorCategory.AUTHENTICATION:
            suggestions.extend([
                "التحقق من بيانات تسجيل الدخول",
                "تسجيل الخروج وإعادة تسجيل الدخول",
                "التحقق من صلاحية الجلسة"
            ])
        
        elif category == ErrorCategory.AUTHORIZATION:
            suggestions.extend([
                "التحقق من الصلاحيات المطلوبة",
                "الاتصال بالمسؤول للحصول على الصلاحيات",
                "التحقق من إعدادات الحساب"
            ])
        
        elif category == ErrorCategory.VALIDATION:
            suggestions.extend([
                "التحقق من صحة البيانات المدخلة",
                "مراجعة متطلبات الحقول",
                "التحقق من تنسيق البيانات"
            ])
        
        elif category == ErrorCategory.EXTERNAL_SERVICE:
            if error_code == "gemini_api_disabled":
                suggestions.extend([
                    "تفعيل Gemini API من Google Cloud Console",
                    "التحقق من أن API Key مرتبط بالمشروع الصحيح",
                    "مراجعة ملف GEMINI_API_SETUP.md"
                ])
            elif error_code == "gemini_api_key_missing":
                suggestions.extend([
                    "إضافة GEMINI_API_KEY إلى ملف .env",
                    "التحقق من متغيرات البيئة",
                    "إعادة تشغيل الخادم بعد إضافة المفتاح"
                ])
            else:
                suggestions.extend([
                    "التحقق من حالة الخدمة الخارجية",
                    "مراجعة إعدادات التكامل",
                    "محاولة إعادة المحاولة لاحقاً"
                ])
        
        elif category == ErrorCategory.SYSTEM:
            suggestions.extend([
                "مراجعة سجلات الخادم",
                "التحقق من موارد النظام",
                "الاتصال بالدعم الفني"
            ])
        
        return suggestions
    
    def create_error_response(
        self,
        error: Exception,
        request: Optional[Request] = None,
        status_code: int = 500,
        error_code: Optional[str] = None,
        help_url: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> EnhancedErrorResponse:
        """Create enhanced error response"""
        
        # Extract information from request
        url = None
        method = None
        source = None
        action = None
        
        if request:
            url = str(request.url)
            method = request.method
            source = f"{request.url.path}"
            action = f"{method} {request.url.path}"
        
        # Determine category
        category = self.determine_category(error, status_code)
        
        # Get error message
        error_message = str(error)
        if hasattr(error, 'detail'):
            if isinstance(error.detail, dict):
                error_message = error.detail.get('message', error_message)
                error_code = error_code or error.detail.get('error')
                help_url = help_url or error.detail.get('help_url') or error.detail.get('activation_url')
                context = context or error.detail.get('context')
            elif isinstance(error.detail, str):
                error_message = error.detail
        
        # Get suggestions
        suggestions = self.get_suggestions(error, category, error_code)
        
        # Get stack trace (only in development)
        stack_trace = None
        import os
        if os.getenv("ENVIRONMENT", "development") == "development":
            stack_trace = ''.join(traceback.format_exception(type(error), error, error.__traceback__))
            # Limit stack trace to first 20 lines
            stack_trace = '\n'.join(stack_trace.split('\n')[:20])
        
        # Create response
        response = EnhancedErrorResponse(
            error=error_code or type(error).__name__,
            message=error_message,
            status_code=status_code,
            category=category,
            source=source,
            action=action,
            url=url,
            method=method,
            error_code=error_code,
            stack_trace=stack_trace,
            context=context,
            help_url=help_url,
            suggestions=suggestions,
        )
        
        return response
    
    async def handle_http_exception(
        self,
        request: Request,
        exc: HTTPException
    ) -> JSONResponse:
        """Handle HTTPException"""
        error_response = self.create_error_response(
            exc,
            request=request,
            status_code=exc.status_code,
            error_code=getattr(exc, 'error_code', None),
            help_url=getattr(exc, 'help_url', None),
            context=getattr(exc, 'context', None),
        )
        
        # Log error to error detector if available
        try:
            from fastapi import Request
            if hasattr(request.app.state, 'error_detector') and request.app.state.error_detector:
                error_detector = request.app.state.error_detector
                from system_monitoring.error_management.error_detector import ErrorCategory, ErrorSeverity
                
                # Map category to ErrorCategory enum
                category_map = {
                    "api": ErrorCategory.API,
                    "network": ErrorCategory.NETWORK,
                    "validation": ErrorCategory.VALIDATION,
                    "authentication": ErrorCategory.AUTHENTICATION,
                    "authorization": ErrorCategory.AUTHORIZATION,
                    "system": ErrorCategory.SYSTEM,
                    "database": ErrorCategory.DATABASE,
                    "external_service": ErrorCategory.EXTERNAL_SERVICE,
                }
                
                error_category = category_map.get(error_response.category, ErrorCategory.UNKNOWN)
                
                # Determine severity from status code
                if exc.status_code >= 500:
                    severity = ErrorSeverity.HIGH
                elif exc.status_code == 401 or exc.status_code == 403:
                    severity = ErrorSeverity.MEDIUM
                else:
                    severity = ErrorSeverity.LOW
                
                detected_error = error_detector.detect_error(
                    message=error_response.message,
                    source=error_response.source or "api",
                    details={
                        "error_code": error_response.error_code,
                        "status_code": exc.status_code,
                        "url": error_response.url,
                        "method": error_response.method,
                        "suggestions": error_response.suggestions,
                        "help_url": error_response.help_url,
                    },
                    category=error_category,
                    severity=severity
                )
                
                # Log to error logger if available
                if hasattr(request.app.state, 'error_logger') and request.app.state.error_logger:
                    request.app.state.error_logger.log_error(detected_error)
        except Exception as e:
            self.logger.warning(f"Failed to log error to error detector: {e}")
        
        # Log error
        self.logger.error(
            f"HTTP {exc.status_code}: {error_response.message}",
            extra={
                "error_code": error_response.error_code,
                "category": error_response.category,
                "url": error_response.url,
                "method": error_response.method,
            }
        )
        
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": error_response.to_dict()}
        )
    
    async def handle_validation_error(
        self,
        request: Request,
        exc: RequestValidationError
    ) -> JSONResponse:
        """Handle validation errors"""
        error_response = self.create_error_response(
            exc,
            request=request,
            status_code=422,
            error_code="validation_error",
        )
        
        # Add validation details
        if exc.errors():
            error_response.details = str(exc.errors())
            error_response.context = {"validation_errors": exc.errors()}
        
        self.logger.warning(
            f"Validation error: {error_response.message}",
            extra={
                "url": error_response.url,
                "method": error_response.method,
            }
        )
        
        return JSONResponse(
            status_code=422,
            content={"detail": error_response.to_dict()}
        )
    
    async def handle_generic_exception(
        self,
        request: Request,
        exc: Exception
    ) -> JSONResponse:
        """Handle generic exceptions"""
        error_response = self.create_error_response(
            exc,
            request=request,
            status_code=500,
        )
        
        # Log error to error detector if available
        try:
            if hasattr(request.app.state, 'error_detector') and request.app.state.error_detector:
                error_detector = request.app.state.error_detector
                from system_monitoring.error_management.error_detector import ErrorCategory, ErrorSeverity
                
                # Map category to ErrorCategory enum
                category_map = {
                    "api": ErrorCategory.API,
                    "network": ErrorCategory.NETWORK,
                    "validation": ErrorCategory.VALIDATION,
                    "authentication": ErrorCategory.AUTHENTICATION,
                    "authorization": ErrorCategory.AUTHORIZATION,
                    "system": ErrorCategory.SYSTEM,
                    "database": ErrorCategory.DATABASE,
                    "external_service": ErrorCategory.EXTERNAL_SERVICE,
                }
                
                error_category = category_map.get(error_response.category, ErrorCategory.SYSTEM)
                
                detected_error = error_detector.detect_error(
                    message=error_response.message,
                    source=error_response.source or "api",
                    details={
                        "error_code": error_response.error_code,
                        "status_code": 500,
                        "url": error_response.url,
                        "method": error_response.method,
                        "suggestions": error_response.suggestions,
                        "help_url": error_response.help_url,
                        "stack_trace": error_response.stack_trace,
                    },
                    category=error_category,
                    severity=ErrorSeverity.HIGH
                )
                
                # Log to error logger if available
                if hasattr(request.app.state, 'error_logger') and request.app.state.error_logger:
                    request.app.state.error_logger.log_error(detected_error)
        except Exception as e:
            self.logger.warning(f"Failed to log error to error detector: {e}")
        
        # Log error with full traceback
        self.logger.error(
            f"Unhandled exception: {error_response.message}",
            exc_info=True,
            extra={
                "error_code": error_response.error_code,
                "category": error_response.category,
                "url": error_response.url,
                "method": error_response.method,
            }
        )
        
        return JSONResponse(
            status_code=500,
            content={"detail": error_response.to_dict()}
        )


# Global error handler instance
error_handler = ErrorHandler()

