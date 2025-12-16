"""
System Core Module - النواة الأساسية للنظام
"""

import importlib.util
from pathlib import Path

# Load modules with hyphenated names
_current_dir = Path(__file__).parent

def _load_module(name, filename):
    """Load module from file with hyphenated name"""
    file_path = _current_dir / filename
    spec = importlib.util.spec_from_file_location(name, file_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

# Load all modules
_system_initializer = _load_module('system_initializer', 'system-initializer.py')
_service_manager = _load_module('service_manager', 'service-manager.py')
_process_scheduler = _load_module('process_scheduler', 'process-scheduler.py')
_resource_allocator = _load_module('resource_allocator', 'resource-allocator.py')
_dependency_resolver = _load_module('dependency_resolver', 'dependency-resolver.py')
_kernel_bridge = _load_module('kernel_bridge', 'kernel-bridge.py')

# Export classes
SystemInitializer = _system_initializer.SystemInitializer
ServiceManager = _service_manager.ServiceManager
ProcessScheduler = _process_scheduler.ProcessScheduler
ResourceAllocator = _resource_allocator.ResourceAllocator
DependencyResolver = _dependency_resolver.DependencyResolver
KernelBridge = _kernel_bridge.KernelBridge

__all__ = [
    'SystemInitializer',
    'ServiceManager',
    'ProcessScheduler',
    'ResourceAllocator',
    'DependencyResolver',
    'KernelBridge',
]

