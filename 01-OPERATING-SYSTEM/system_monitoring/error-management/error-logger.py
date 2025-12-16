"""
Error Logger - مسجل الأخطاء
Logs errors to files and systems
"""

import logging
import json
from typing import Dict, Optional
from pathlib import Path
from datetime import datetime
# Import will be handled by __init__.py
try:
    from .error_detector import DetectedError, ErrorSeverity
except ImportError:
    # Fallback for direct loading
    import importlib.util
    from pathlib import Path
    _current_dir = Path(__file__).parent
    _error_detector = importlib.util.spec_from_file_location('error_detector', _current_dir / 'error-detector.py')
    _error_detector_module = importlib.util.module_from_spec(_error_detector)
    _error_detector.loader.exec_module(_error_detector_module)
    DetectedError = _error_detector_module.DetectedError
    ErrorSeverity = _error_detector_module.ErrorSeverity


class ErrorLogger:
    """
    Error Logger Class
    Handles error logging to various destinations
    """
    
    def __init__(self, log_directory: Optional[str] = None):
        """
        Initialize Error Logger
        
        Args:
            log_directory: Directory for error logs
        """
        self.logger = logging.getLogger(__name__)
        self.log_directory = Path(log_directory) if log_directory else Path("logs")
        self.log_directory.mkdir(parents=True, exist_ok=True)
        
        # Setup file handler for errors
        error_log_file = self.log_directory / f"errors_{datetime.now().strftime('%Y%m%d')}.log"
        self.error_handler = logging.FileHandler(error_log_file, encoding='utf-8')
        self.error_handler.setLevel(logging.ERROR)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        self.error_handler.setFormatter(formatter)
        
        # JSON log file
        self.json_log_file = self.log_directory / f"errors_{datetime.now().strftime('%Y%m%d')}.jsonl"
        
    def log_error(self, error: DetectedError) -> None:
        """
        Log an error
        
        Args:
            error: DetectedError object to log
        """
        # Log to standard logger
        log_level = self._get_log_level(error.severity)
        self.logger.log(
            log_level,
            f"[{error.error_id}] {error.category.value.upper()}: {error.message}",
            extra={'error_id': error.error_id, 'source': error.source}
        )
        
        # Log to JSON file
        self._log_to_json(error)
        
        # Log critical errors to separate file
        if error.severity == ErrorSeverity.CRITICAL:
            self._log_critical_error(error)
    
    def _get_log_level(self, severity: ErrorSeverity) -> int:
        """Get logging level from severity"""
        mapping = {
            ErrorSeverity.LOW: logging.INFO,
            ErrorSeverity.MEDIUM: logging.WARNING,
            ErrorSeverity.HIGH: logging.ERROR,
            ErrorSeverity.CRITICAL: logging.CRITICAL
        }
        return mapping.get(severity, logging.ERROR)
    
    def _log_to_json(self, error: DetectedError) -> None:
        """Log error to JSON file"""
        try:
            error_data = {
                "error_id": error.error_id,
                "timestamp": error.timestamp.isoformat(),
                "category": error.category.value,
                "severity": error.severity.value,
                "message": error.message,
                "source": error.source,
                "details": error.details
            }
            
            with open(self.json_log_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(error_data, ensure_ascii=False) + '\n')
                
        except Exception as e:
            self.logger.error(f"Failed to log error to JSON: {e}")
    
    def _log_critical_error(self, error: DetectedError) -> None:
        """Log critical errors to separate file"""
        try:
            critical_log_file = self.log_directory / "critical_errors.log"
            
            with open(critical_log_file, 'a', encoding='utf-8') as f:
                f.write(f"[{error.timestamp.isoformat()}] {error.error_id}\n")
                f.write(f"Category: {error.category.value}\n")
                f.write(f"Message: {error.message}\n")
                f.write(f"Source: {error.source}\n")
                if error.details:
                    f.write(f"Details: {json.dumps(error.details, indent=2)}\n")
                f.write("-" * 80 + "\n\n")
                
        except Exception as e:
            self.logger.error(f"Failed to log critical error: {e}")
    
    def get_error_log_path(self) -> Path:
        """Get path to error log file"""
        return self.json_log_file

