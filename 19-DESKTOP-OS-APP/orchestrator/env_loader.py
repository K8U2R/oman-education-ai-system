"""
تحميل ملفات البيئة والتكوين
Environment and Configuration Loader
"""

import os
from pathlib import Path
from typing import Dict, Optional, List
from dotenv import load_dotenv

from .secrets_manager import SecretsManager


class EnvLoader:
    """محمل متغيرات البيئة"""
    
    def __init__(self, project_root: Path, required_keys: Optional[List[str]] = None):
        self.project_root = project_root
        self.required_keys = required_keys or []
        self.secrets_manager = SecretsManager(project_root)
        self.env_files = [
            project_root / ".env",
            project_root / ".env.local",
            project_root / ".env.development"
        ]
        self.loaded = False
        self.warnings: List[str] = []
    
    def load_all(self) -> Dict[str, str]:
        """تحميل جميع ملفات البيئة"""
        env_vars = {}
        
        # محاولة فك تشفير ملف مشفر إن وجد
        decrypted_env, warning = self.secrets_manager.decrypt_env_file()
        if warning:
            self.warnings.append(warning)
        if decrypted_env:
            self.env_files.insert(0, decrypted_env)

        for env_file in self.env_files:
            if env_file.exists():
                load_dotenv(env_file, override=False)
                # قراءة الملف مباشرة للحصول على القيم
                with open(env_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            key, value = line.split('=', 1)
                            env_vars[key.strip()] = value.strip()
        
        # تحقق من المتغيرات المطلوبة
        if self.required_keys:
            missing = [k for k, ok in self.check_required(self.required_keys).items() if not ok]
            if missing:
                self.warnings.append(f"مفاتيح بيئة مفقودة: {', '.join(missing)}")

        self.loaded = True
        return env_vars
    
    def get(self, key: str, default: Optional[str] = None) -> Optional[str]:
        """الحصول على متغير بيئة"""
        if not self.loaded:
            self.load_all()
        return os.getenv(key, default)
    
    def set(self, key: str, value: str):
        """تعيين متغير بيئة"""
        os.environ[key] = value
    
    def check_required(self, required_keys: list) -> Dict[str, bool]:
        """التحقق من وجود المتغيرات المطلوبة"""
        if not self.loaded:
            self.load_all()
        
        results = {}
        for key in required_keys:
            results[key] = key in os.environ and os.getenv(key) != ""
        return results

