"""
فحص الأذونات الأساسية للتشغيل
Permissions checker for desktop orchestrator
"""

import os
from pathlib import Path
from typing import Dict, List
import socket


class PermissionsChecker:
    """مدقق أذونات بسيط"""

    def __init__(self, project_root: Path):
        self.project_root = project_root

    def check_write_access(self, paths: List[Path]) -> Dict[str, bool]:
        """التحقق من إمكانية الكتابة على مسارات محددة"""
        results = {}
        for p in paths:
            try:
                p.mkdir(parents=True, exist_ok=True)
                test_file = p / ".perm_test"
                with open(test_file, "w", encoding="utf-8") as f:
                    f.write("ok")
                test_file.unlink(missing_ok=True)
                results[str(p)] = True
            except Exception:
                results[str(p)] = False
        return results

    def check_ports_access(self, ports: List[int]) -> Dict[int, bool]:
        """التحقق من إمكانية حجز المنافذ (محاولة bind مؤقتة)"""
        results = {}
        for port in ports:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            try:
                sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                sock.bind(("0.0.0.0", port))
                results[port] = True
            except Exception:
                results[port] = False
            finally:
                sock.close()
        return results

    def run_all(self, writable_paths: List[Path], required_ports: List[int]) -> Dict[str, dict]:
        """تشغيل جميع الفحوصات"""
        return {
            "write_access": self.check_write_access(writable_paths),
            "ports_access": self.check_ports_access(required_ports),
        }

