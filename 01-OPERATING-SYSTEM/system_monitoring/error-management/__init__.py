"""
Error Management Module
"""

import importlib.util
from pathlib import Path

_current_dir = Path(__file__).parent

def _load_module(name, filename):
    spec = importlib.util.spec_from_file_location(name, _current_dir / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

_error_detector = _load_module('error_detector', 'error-detector.py')
_error_logger = _load_module('error_logger', 'error-logger.py')

ErrorDetector = _error_detector.ErrorDetector
ErrorLogger = _error_logger.ErrorLogger

__all__ = ['ErrorDetector', 'ErrorLogger']

