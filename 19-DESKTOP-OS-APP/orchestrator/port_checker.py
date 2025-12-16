"""
فحص المنافذ وتحريرها
Port Checker and Releaser
"""

import socket
import subprocess
import sys
from typing import List, Tuple, Optional
from pathlib import Path


class PortChecker:
    """مدقق المنافذ"""
    
    @staticmethod
    def is_port_available(port: int, host: str = "localhost") -> bool:
        """التحقق من أن المنفذ متاح"""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1)
                result = s.connect_ex((host, port))
                return result != 0  # True إذا كان المنفذ متاحاً
        except Exception:
            return True
    
    @staticmethod
    def get_port_process(port: int) -> Optional[Tuple[int, str]]:
        """الحصول على معلومات العملية التي تستخدم المنفذ"""
        try:
            if sys.platform == "win32":
                # Windows
                result = subprocess.run(
                    ["netstat", "-ano"],
                    capture_output=True,
                    text=True
                )
                
                for line in result.stdout.split('\n'):
                    if f":{port}" in line and "LISTENING" in line:
                        parts = line.split()
                        if len(parts) > 4:
                            pid = int(parts[-1])
                            return (pid, f"Process {pid}")
            else:
                # Linux/Mac
                result = subprocess.run(
                    ["lsof", "-i", f":{port}"],
                    capture_output=True,
                    text=True
                )
                
                for line in result.stdout.split('\n')[1:]:
                    if line.strip():
                        parts = line.split()
                        if len(parts) > 1:
                            pid = int(parts[1])
                            return (pid, parts[0])
        except Exception as e:
            print(f"خطأ في فحص المنفذ: {e}")
        
        return None
    
    @staticmethod
    def kill_process_on_port(port: int) -> bool:
        """إنهاء العملية التي تستخدم المنفذ"""
        process_info = PortChecker.get_port_process(port)
        if not process_info:
            return False
        
        pid, name = process_info
        
        try:
            if sys.platform == "win32":
                subprocess.run(["taskkill", "/F", "/PID", str(pid)], check=True)
            else:
                subprocess.run(["kill", "-9", str(pid)], check=True)
            
            return True
        except Exception as e:
            print(f"خطأ في إنهاء العملية: {e}")
            return False
    
    @staticmethod
    def check_ports(ports: List[int]) -> Dict[int, bool]:
        """التحقق من حالة عدة منافذ"""
        results = {}
        for port in ports:
            results[port] = PortChecker.is_port_available(port)
        return results
    
    @staticmethod
    def find_free_port(start_port: int = 8000, max_attempts: int = 100) -> Optional[int]:
        """العثور على منفذ حر"""
        for port in range(start_port, start_port + max_attempts):
            if PortChecker.is_port_available(port):
                return port
        return None

