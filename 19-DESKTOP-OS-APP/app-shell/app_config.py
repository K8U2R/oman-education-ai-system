"""
إعدادات التطبيق
Application Configuration
"""

from pathlib import Path
from typing import Dict, Any
import json
import os


class AppConfig:
    """إعدادات التطبيق الرئيسية"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent.parent.parent
        self.config_dir = self.project_root / "19-DESKTOP-OS-APP" / "config"
        self.config_dir.mkdir(exist_ok=True)
        
        self.config_file = self.config_dir / "app_config.json"
        self.default_config = {
            "app": {
                "version": "1.0.0",
                "update": {
                    "manifest_url": "19-DESKTOP-OS-APP/packaging/installer-config/update_manifest.json",
                    "auto_check": False,
                    "channel": "stable"
                }
            },
            "window": {
                "width": 1400,
                "height": 900,
                "min_width": 1000,
                "min_height": 700,
                "theme": "auto",  # dark, light, auto
                "language": "ar",  # ar, en
                "auto_theme": True  # اكتشاف تلقائي للثيم
            },
            "services": {
                "backend": {
                    "enabled": True,
                    "port": 8000,
                    "path": "01-OPERATING-SYSTEM/api_gateway",
                    "command": ["python", "-m", "uvicorn", "fastapi_server:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
                    "auto_start": True
                },
                "frontend": {
                    "enabled": True,
                    "port": 3000,
                    "path": "03-WEB-INTERFACE/frontend",
                    "command": ["npm", "run", "dev"],
                    "auto_start": True
                },
                "integration": {
                    "enabled": True,
                    "port": 8001,
                    "path": "02-SYSTEM-INTEGRATION/integration-orchestrator",
                    "command": ["python", "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8001"],
                    "auto_start": False
                }
            },
            "monitoring": {
                "update_interval": 2000,  # milliseconds
                "health_check_interval": 5000,
                "log_refresh_interval": 1000
            },
            "notifications": {
                "enabled": True,
                "show_system_tray": True,
                "minimize_to_tray": True
            }
        }
        
        self.config = self.load_config()
    
    def load_config(self) -> Dict[str, Any]:
        """تحميل الإعدادات من الملف"""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                    # دمج مع الإعدادات الافتراضية
                    return self._merge_config(self.default_config, config)
            except Exception as e:
                print(f"خطأ في تحميل الإعدادات: {e}")
                return self.default_config.copy()
        else:
            self.save_config(self.default_config)
            return self.default_config.copy()
    
    def save_config(self, config: Dict[str, Any] = None):
        """حفظ الإعدادات إلى الملف"""
        if config is None:
            config = self.config
        
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            self.config = config
        except Exception as e:
            print(f"خطأ في حفظ الإعدادات: {e}")
    
    def _merge_config(self, default: Dict, user: Dict) -> Dict:
        """دمج الإعدادات الافتراضية مع إعدادات المستخدم"""
        result = default.copy()
        for key, value in user.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = self._merge_config(result[key], value)
            else:
                result[key] = value
        return result
    
    def get(self, key_path: str, default=None):
        """الحصول على قيمة إعداد باستخدام مسار مفصول بنقاط"""
        keys = key_path.split('.')
        value = self.config
        for key in keys:
            if isinstance(value, dict) and key in value:
                value = value[key]
            else:
                return default
        return value
    
    def set(self, key_path: str, value: Any):
        """تعيين قيمة إعداد باستخدام مسار مفصول بنقاط"""
        keys = key_path.split('.')
        config = self.config
        for key in keys[:-1]:
            if key not in config:
                config[key] = {}
            config = config[key]
        config[keys[-1]] = value
        self.save_config()

