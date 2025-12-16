"""
Health Monitoring Module
"""

import importlib.util
from pathlib import Path

_current_dir = Path(__file__).parent

def _load_module(name, filename):
    spec = importlib.util.spec_from_file_location(name, _current_dir / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

_system_health_check = _load_module('system_health_check', 'system-health-check.py')
_performance_monitor = _load_module('performance_monitor', 'performance-monitor.py')

SystemHealthCheck = _system_health_check.SystemHealthCheck
PerformanceMonitor = _performance_monitor.PerformanceMonitor

__all__ = ['SystemHealthCheck', 'PerformanceMonitor']

