"""
إدارة الأسرار والبيئة
Secrets Management Utilities
"""

from pathlib import Path
from typing import Dict, List, Tuple, Optional
import os
import tempfile


class SecretsManager:
    """أدوات إدارة الأسرار"""

    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.encrypted_env = project_root / ".env.encrypted"
        self.master_key_env = "ENV_MASTER_KEY"

    def _fernet(self):
        """محاولة استيراد Fernet"""
        try:
            from cryptography.fernet import Fernet  # type: ignore
            return Fernet
        except Exception:
            return None

    def decrypt_env_file(self) -> Tuple[Optional[Path], Optional[str]]:
        """
        فك تشفير ملف .env.encrypted إذا كان المفتاح متوفرًا في متغير ENV_MASTER_KEY.
        Returns:
            (path_to_decrypted_file, warning_message_if_any)
        """
        if not self.encrypted_env.exists():
            return None, None

        fernet_cls = self._fernet()
        if fernet_cls is None:
            return None, "مطلوب حزمة cryptography لفك تشفير .env.encrypted"

        master_key = os.getenv(self.master_key_env)
        if not master_key:
            return None, f"متغير {self.master_key_env} غير موجود؛ تخطينا فك تشفير .env.encrypted"

        try:
            cipher = fernet_cls(master_key.encode())
            data = self.encrypted_env.read_bytes()
            decrypted = cipher.decrypt(data)
            tmp_file = Path(tempfile.mkstemp(prefix="decrypted_env_", suffix=".env")[1])
            tmp_file.write_bytes(decrypted)
            return tmp_file, None
        except Exception as e:
            return None, f"فشل فك التشفير: {e}"

    def load_required_keys(self, env_vars: Dict[str, str], required: List[str]) -> Dict[str, bool]:
        """التحقق من توفر المفاتيح المطلوبة"""
        results = {}
        for key in required:
            results[key] = key in env_vars and env_vars[key] != ""
        return results

