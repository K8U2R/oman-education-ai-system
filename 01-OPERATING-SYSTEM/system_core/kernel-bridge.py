"""
Kernel Bridge - جسر النواة مع النظام المضيف
Bridge between the application kernel and host operating system
"""

import os
import sys
import platform
import logging
from typing import Dict, Any, Optional, List
from pathlib import Path
from enum import Enum


class OSType(Enum):
    """Operating system types"""
    WINDOWS = "windows"
    LINUX = "linux"
    MACOS = "macos"
    UNKNOWN = "unknown"


class KernelBridge:
    """
    Kernel Bridge Class
    Provides abstraction layer between application and host OS
    """
    
    def __init__(self):
        """Initialize Kernel Bridge"""
        self.logger = logging.getLogger(__name__)
        self.os_type = self._detect_os()
        self.system_info = self._get_system_info()
        self.paths = self._setup_paths()
        
    def _detect_os(self) -> OSType:
        """Detect host operating system"""
        system = platform.system().lower()
        
        if system == "windows":
            return OSType.WINDOWS
        elif system == "linux":
            return OSType.LINUX
        elif system == "darwin":
            return OSType.MACOS
        else:
            return OSType.UNKNOWN
    
    def _get_system_info(self) -> Dict[str, Any]:
        """Get system information"""
        return {
            "os": platform.system(),
            "os_version": platform.version(),
            "os_release": platform.release(),
            "architecture": platform.machine(),
            "processor": platform.processor(),
            "python_version": platform.python_version(),
            "platform": platform.platform()
        }
    
    def _setup_paths(self) -> Dict[str, Path]:
        """Setup system paths"""
        base_dir = Path(__file__).parent.parent.parent
        
        if self.os_type == OSType.WINDOWS:
            app_data = Path(os.getenv("APPDATA", base_dir))
            local_app_data = Path(os.getenv("LOCALAPPDATA", base_dir))
        elif self.os_type == OSType.LINUX:
            app_data = Path.home() / ".local" / "share"
            local_app_data = Path.home() / ".cache"
        elif self.os_type == OSType.MACOS:
            app_data = Path.home() / "Library" / "Application Support"
            local_app_data = Path.home() / "Library" / "Caches"
        else:
            app_data = base_dir
            local_app_data = base_dir
        
        paths = {
            "base": base_dir,
            "app_data": app_data / "oman-education-ai",
            "cache": local_app_data / "oman-education-ai" / "cache",
            "logs": base_dir / "logs",
            "temp": base_dir / "temp",
            "storage": base_dir / "storage",
            "config": base_dir / "config",
            "backups": base_dir / "backups"
        }
        
        # Create directories
        for path in paths.values():
            path.mkdir(parents=True, exist_ok=True)
        
        return paths
    
    def get_os_type(self) -> OSType:
        """Get operating system type"""
        return self.os_type
    
    def get_system_info(self) -> Dict[str, Any]:
        """Get system information"""
        return self.system_info.copy()
    
    def get_path(self, path_type: str) -> Optional[Path]:
        """
        Get system path
        
        Args:
            path_type: Type of path (base, app_data, cache, logs, temp, storage, config, backups)
            
        Returns:
            Path object or None if not found
        """
        return self.paths.get(path_type)
    
    def get_all_paths(self) -> Dict[str, Path]:
        """Get all system paths"""
        return self.paths.copy()
    
    def is_windows(self) -> bool:
        """Check if running on Windows"""
        return self.os_type == OSType.WINDOWS
    
    def is_linux(self) -> bool:
        """Check if running on Linux"""
        return self.os_type == OSType.LINUX
    
    def is_macos(self) -> bool:
        """Check if running on macOS"""
        return self.os_type == OSType.MACOS
    
    def get_environment_variable(self, name: str, default: Optional[str] = None) -> Optional[str]:
        """
        Get environment variable
        
        Args:
            name: Variable name
            default: Default value if not found
            
        Returns:
            Variable value or default
        """
        return os.getenv(name, default)
    
    def set_environment_variable(self, name: str, value: str) -> bool:
        """
        Set environment variable
        
        Args:
            name: Variable name
            value: Variable value
            
        Returns:
            True if set successfully
        """
        try:
            os.environ[name] = value
            return True
        except Exception as e:
            self.logger.error(f"Failed to set environment variable {name}: {e}")
            return False
    
    def execute_command(
        self,
        command: str,
        shell: bool = True,
        capture_output: bool = True
    ) -> Dict[str, Any]:
        """
        Execute system command
        
        Args:
            command: Command to execute
            shell: Use shell execution
            capture_output: Capture command output
            
        Returns:
            Dictionary with exit_code, stdout, stderr
        """
        import subprocess
        
        try:
            result = subprocess.run(
                command,
                shell=shell,
                capture_output=capture_output,
                text=True,
                timeout=30
            )
            
            return {
                "exit_code": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "success": result.returncode == 0
            }
        except subprocess.TimeoutExpired:
            return {
                "exit_code": -1,
                "stdout": "",
                "stderr": "Command timed out",
                "success": False
            }
        except Exception as e:
            self.logger.error(f"Error executing command: {e}")
            return {
                "exit_code": -1,
                "stdout": "",
                "stderr": str(e),
                "success": False
            }
    
    def get_file_separator(self) -> str:
        """Get file path separator for current OS"""
        return os.sep
    
    def normalize_path(self, path: str) -> str:
        """
        Normalize path for current OS
        
        Args:
            path: Path to normalize
            
        Returns:
            Normalized path
        """
        return os.path.normpath(path)
    
    def join_paths(self, *paths: str) -> str:
        """
        Join path components
        
        Args:
            *paths: Path components
            
        Returns:
            Joined path
        """
        return os.path.join(*paths)
    
    def get_home_directory(self) -> Path:
        """Get user home directory"""
        return Path.home()
    
    def get_current_directory(self) -> Path:
        """Get current working directory"""
        return Path.cwd()
    
    def change_directory(self, path: str) -> bool:
        """
        Change current directory
        
        Args:
            path: Target directory path
            
        Returns:
            True if changed successfully
        """
        try:
            os.chdir(path)
            return True
        except Exception as e:
            self.logger.error(f"Failed to change directory: {e}")
            return False
    
    def get_system_encoding(self) -> str:
        """Get system default encoding"""
        return sys.getdefaultencoding()
    
    def get_filesystem_encoding(self) -> str:
        """Get filesystem encoding"""
        return sys.getfilesystemencoding()
    
    def is_64bit(self) -> bool:
        """Check if running on 64-bit system"""
        return platform.machine().endswith('64')
    
    def get_processor_count(self) -> int:
        """Get number of CPU cores"""
        return os.cpu_count() or 1
    
    def get_system_summary(self) -> Dict[str, Any]:
        """Get comprehensive system summary"""
        return {
            "os_type": self.os_type.value,
            "system_info": self.system_info,
            "paths": {k: str(v) for k, v in self.paths.items()},
            "is_64bit": self.is_64bit(),
            "cpu_count": self.get_processor_count(),
            "encoding": self.get_system_encoding(),
            "filesystem_encoding": self.get_filesystem_encoding()
        }

