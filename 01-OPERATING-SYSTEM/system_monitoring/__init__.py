"""
System Monitoring Module - مراقبة النظام
"""

import importlib.util
from pathlib import Path

# Load modules with hyphenated folder/file names
_current_dir = Path(__file__).parent

def _load_module(name, file_path):
    """Load module from file path"""
    spec = importlib.util.spec_from_file_location(name, file_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

# Load health monitoring modules
_system_health_check = _load_module(
    'system_health_check',
    _current_dir / 'health-monitoring' / 'system-health-check.py'
)
_performance_monitor = _load_module(
    'performance_monitor',
    _current_dir / 'health-monitoring' / 'performance-monitor.py'
)

# Load error management modules - need to load detector first
_error_detector = _load_module(
    'error_detector',
    _current_dir / 'error-management' / 'error-detector.py'
)

# Set up module for relative imports
import sys
_error_management_module = type(sys.modules[__name__])('error_management')
sys.modules['system_monitoring.error_management'] = _error_management_module
sys.modules['system_monitoring.error_management.error_detector'] = _error_detector

_error_logger = _load_module(
    'error_logger',
    _current_dir / 'error-management' / 'error-logger.py'
)
sys.modules['system_monitoring.error_management.error_logger'] = _error_logger

# Export classes
SystemHealthCheck = _system_health_check.SystemHealthCheck
PerformanceMonitor = _performance_monitor.PerformanceMonitor
ErrorDetector = _error_detector.ErrorDetector
ErrorLogger = _error_logger.ErrorLogger

__all__ = [
    'SystemHealthCheck',
    'PerformanceMonitor',
    'ErrorDetector',
    'ErrorLogger',
]

