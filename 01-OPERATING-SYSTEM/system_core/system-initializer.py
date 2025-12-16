"""
System Initializer - مُهيئ النظام الأساسي
Initializes and configures the entire operating system
"""

import os
import sys
import logging
import asyncio
from typing import Dict, Any, Optional, List
from pathlib import Path
from datetime import datetime
import json


class SystemInitializer:
    """
    System Initializer Class
    Responsible for initializing all system components in the correct order
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize the System Initializer
        
        Args:
            config_path: Path to configuration file (optional)
        """
        self.config_path = config_path or self._get_default_config_path()
        self.logger = self._setup_logger()
        self.components: Dict[str, Any] = {}
        self.initialization_order: List[str] = []
        self.config: Dict[str, Any] = {}
        self.is_initialized = False
        
    def _get_default_config_path(self) -> str:
        """Get default configuration file path"""
        base_dir = Path(__file__).parent.parent
        return str(base_dir / "config" / "system_config.json")
    
    def _setup_logger(self) -> logging.Logger:
        """Setup logging system"""
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        
        # Create logs directory if it doesn't exist
        log_dir = Path(__file__).parent.parent.parent / "logs"
        log_dir.mkdir(exist_ok=True)
        
        # File handler
        file_handler = logging.FileHandler(
            log_dir / f"system_{datetime.now().strftime('%Y%m%d')}.log",
            encoding='utf-8'
        )
        file_handler.setLevel(logging.DEBUG)
        
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        
        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        
        return logger
    
    async def initialize(self) -> Dict[str, Any]:
        """
        Initialize all system components
        
        Returns:
            Dictionary containing initialization status and component info
        """
        if self.is_initialized:
            self.logger.warning("System already initialized")
            return {"status": "already_initialized", "components": self.components}
        
        self.logger.info("🚀 Starting system initialization...")
        start_time = datetime.now()
        
        try:
            # Step 1: Load configuration
            await self._load_configuration()
            
            # Step 2: Initialize logging system
            await self._init_logging()
            
            # Step 3: Initialize process manager
            await self._init_process_manager()
            
            # Step 4: Initialize memory manager
            await self._init_memory_manager()
            
            # Step 5: Initialize filesystem
            await self._init_filesystem()
            
            # Step 6: Initialize dependency resolver
            await self._init_dependency_resolver()
            
            # Step 7: Initialize kernel bridge
            await self._init_kernel_bridge()
            
            # Step 8: Initialize service manager
            await self._init_service_manager()
            
            elapsed_time = (datetime.now() - start_time).total_seconds()
            self.is_initialized = True
            
            self.logger.info(f"✅ System initialized successfully in {elapsed_time:.2f} seconds")
            
            return {
                "status": "initialized",
                "components": self.components,
                "initialization_time": elapsed_time,
                "initialization_order": self.initialization_order
            }
            
        except Exception as e:
            self.logger.error(f"❌ System initialization failed: {e}", exc_info=True)
            raise SystemInitializationError(f"Failed to initialize system: {e}")
    
    async def _load_configuration(self) -> None:
        """Load system configuration"""
        self.logger.info("📋 Loading system configuration...")
        
        try:
            config_file = Path(self.config_path)
            if config_file.exists():
                with open(config_file, 'r', encoding='utf-8') as f:
                    self.config = json.load(f)
            else:
                self.logger.warning(f"Config file not found: {self.config_path}, using defaults")
                self.config = self._get_default_config()
            
            self.components['configuration'] = {
                'status': 'loaded',
                'path': self.config_path,
                'config': self.config
            }
            self.initialization_order.append('configuration')
            
        except Exception as e:
            self.logger.error(f"Failed to load configuration: {e}")
            self.config = self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration"""
        return {
            "system": {
                "name": "Oman Education AI OS",
                "version": "1.0.0",
                "language": "ar",
                "timezone": "Asia/Muscat"
            },
            "performance": {
                "max_memory_mb": 2048,
                "max_cpu_percent": 80,
                "enable_caching": True
            },
            "security": {
                "enable_firewall": True,
                "enable_antivirus": True,
                "encryption_enabled": True
            },
            "logging": {
                "level": "INFO",
                "max_file_size_mb": 10,
                "backup_count": 5
            }
        }
    
    async def _init_logging(self) -> None:
        """Initialize logging system"""
        self.logger.info("📝 Initializing logging system...")
        self.components['logging'] = {'status': 'active'}
        self.initialization_order.append('logging')
        await asyncio.sleep(0.1)  # Simulate async operation
    
    async def _init_process_manager(self) -> None:
        """Initialize process manager"""
        self.logger.info("⚙️ Initializing process manager...")
        self.components['process_manager'] = {'status': 'active'}
        self.initialization_order.append('process_manager')
        await asyncio.sleep(0.1)
    
    async def _init_memory_manager(self) -> None:
        """Initialize memory manager"""
        self.logger.info("💾 Initializing memory manager...")
        self.components['memory_manager'] = {'status': 'active'}
        self.initialization_order.append('memory_manager')
        await asyncio.sleep(0.1)
    
    async def _init_filesystem(self) -> None:
        """Initialize filesystem"""
        self.logger.info("📁 Initializing filesystem...")
        
        # Create necessary directories
        base_dir = Path(__file__).parent.parent.parent
        directories = ['logs', 'cache', 'temp', 'storage', 'backups']
        
        for directory in directories:
            dir_path = base_dir / directory
            dir_path.mkdir(exist_ok=True)
        
        self.components['filesystem'] = {
            'status': 'active',
            'directories_created': directories
        }
        self.initialization_order.append('filesystem')
        await asyncio.sleep(0.1)
    
    async def _init_dependency_resolver(self) -> None:
        """Initialize dependency resolver"""
        self.logger.info("🔗 Initializing dependency resolver...")
        self.components['dependency_resolver'] = {'status': 'active'}
        self.initialization_order.append('dependency_resolver')
        await asyncio.sleep(0.1)
    
    async def _init_kernel_bridge(self) -> None:
        """Initialize kernel bridge"""
        self.logger.info("🌉 Initializing kernel bridge...")
        self.components['kernel_bridge'] = {'status': 'active'}
        self.initialization_order.append('kernel_bridge')
        await asyncio.sleep(0.1)
    
    async def _init_service_manager(self) -> None:
        """Initialize service manager"""
        self.logger.info("🔧 Initializing service manager...")
        self.components['service_manager'] = {'status': 'active'}
        self.initialization_order.append('service_manager')
        await asyncio.sleep(0.1)
    
    async def shutdown(self) -> None:
        """Shutdown system gracefully"""
        self.logger.info("🛑 Shutting down system...")
        
        # Shutdown components in reverse order
        for component in reversed(self.initialization_order):
            self.logger.info(f"Shutting down {component}...")
            await asyncio.sleep(0.05)
        
        self.is_initialized = False
        self.logger.info("✅ System shutdown complete")
    
    def get_status(self) -> Dict[str, Any]:
        """Get current system status"""
        return {
            "initialized": self.is_initialized,
            "components": self.components,
            "initialization_order": self.initialization_order,
            "config": self.config
        }


class SystemInitializationError(Exception):
    """Custom exception for system initialization errors"""
    pass

