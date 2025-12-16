"""
Oman Education AI System - Operating System Module
نظام التعليم الذكي العُماني - وحدة نظام التشغيل

This module provides a comprehensive operating system layer for the desktop application.
"""

__version__ = "1.0.0"
__author__ = "Oman Education AI Team"

from .system_core.system_initializer import SystemInitializer
from .system_core.service_manager import ServiceManager

__all__ = [
    'SystemInitializer',
    'ServiceManager',
]

