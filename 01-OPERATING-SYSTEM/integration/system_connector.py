"""
System Connector - موصل الأنظمة
Connects with other systems in the project
"""

import logging
from typing import Dict, Optional, Any
from pathlib import Path
import sys

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

logger = logging.getLogger(__name__)


class SystemConnector:
    """
    System Connector Class
    Manages connections to other systems
    """
    
    def __init__(self):
        """Initialize System Connector"""
        self.logger = logging.getLogger(__name__)
        self.project_root = project_root
        self.connected_systems: Dict[str, Dict[str, Any]] = {}
        
    def discover_systems(self) -> Dict[str, bool]:
        """
        Discover available systems in the project
        
        Returns:
            Dictionary of system names and their availability
        """
        systems = {
            "00-AI-CORE-SYSTEM": (project_root / "00-AI-CORE-SYSTEM").exists(),
            "02-SYSTEM-INTEGRATION": (project_root / "02-SYSTEM-INTEGRATION").exists(),
            "03-WEB-INTERFACE": (project_root / "03-WEB-INTERFACE").exists(),
            "04-AUTHENTICATION-SYSTEM": (project_root / "04-AUTHENTICATION-SYSTEM").exists(),
            "05-FEATURES-SYSTEM": (project_root / "05-FEATURES-SYSTEM").exists(),
            "06-DATABASE-SYSTEM": (project_root / "06-DATABASE-SYSTEM").exists(),
        }
        
        self.logger.info(f"Discovered systems: {sum(systems.values())}/{len(systems)} available")
        
        return systems
    
    def get_system_info(self, system_name: str) -> Optional[Dict[str, Any]]:
        """
        Get information about a system
        
        Args:
            system_name: Name of the system
            
        Returns:
            System information or None
        """
        system_path = project_root / system_name
        
        if not system_path.exists():
            return None
        
        return {
            "name": system_name,
            "path": str(system_path),
            "exists": True,
            "has_main": (system_path / "main.py").exists(),
            "has_readme": (system_path / "README.md").exists(),
        }

