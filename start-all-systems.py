"""
تشغيل جميع الأنظمة معاً
Start All Systems Together

هذا السكريبت يشغل جميع أنظمة المشروع:
1. نظام التشغيل (01-OPERATING-SYSTEM)
2. نظام التكامل (02-SYSTEM-INTEGRATION)
3. واجهة الويب - Backend (03-WEB-INTERFACE/backend-api)
4. واجهة الويب - Frontend (03-WEB-INTERFACE/frontend-architecture)
"""

import asyncio
import subprocess
import sys
import time
import webbrowser
from pathlib import Path
from typing import List, Optional
import signal
import os

# مسار المشروع (من الجذر)
script_dir = Path(__file__).parent
if script_dir.name == "02-DEPLOYMENT":
    # إذا كان السكريبت في 16-SCRIPTS/02-DEPLOYMENT
    project_root = script_dir.parent.parent
else:
    # إذا كان السكريبت في الجذر
    project_root = script_dir

# العمليات الجارية
processes: List[subprocess.Popen] = []


def signal_handler(sig, frame):
    """معالج إشارة الإيقاف"""
    print("\n\n⚠️  تم إيقاف جميع الأنظمة...")
    for process in processes:
        try:
            process.terminate()
        except:
            pass
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)


def start_operating_system() -> Optional[subprocess.Popen]:
    """تشغيل نظام التشغيل"""
    print("🚀 بدء تشغيل نظام التشغيل (01-OPERATING-SYSTEM)...")
    
    os_path = project_root / "01-OPERATING-SYSTEM" / "api_server.py"
    
    if not os_path.exists():
        print(f"⚠️  ملف نظام التشغيل غير موجود: {os_path}")
        return None
    
    try:
        process = subprocess.Popen(
            [sys.executable, str(os_path)],
            cwd=str(project_root / "01-OPERATING-SYSTEM"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print("✅ تم تشغيل نظام التشغيل على http://localhost:8003")
        return process
    except Exception as e:
        print(f"❌ خطأ في تشغيل نظام التشغيل: {e}")
        return None


def start_integration_system() -> Optional[subprocess.Popen]:
    """تشغيل نظام التكامل"""
    print("🔗 بدء تشغيل نظام التكامل (02-SYSTEM-INTEGRATION)...")
    
    integration_path = project_root / "02-SYSTEM-INTEGRATION" / "integration-orchestrator" / "main.py"
    
    if not integration_path.exists():
        print(f"⚠️  ملف نظام التكامل غير موجود: {integration_path}")
        return None
    
    try:
        process = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"],
            cwd=str(project_root / "02-SYSTEM-INTEGRATION" / "integration-orchestrator"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print("✅ تم تشغيل نظام التكامل على http://localhost:8001")
        return process
    except Exception as e:
        print(f"❌ خطأ في تشغيل نظام التكامل: {e}")
        return None


def start_web_backend() -> Optional[subprocess.Popen]:
    """تشغيل واجهة الويب - Backend"""
    print("🌐 بدء تشغيل واجهة الويب - Backend (03-WEB-INTERFACE/backend-api)...")
    
    backend_path = project_root / "03-WEB-INTERFACE" / "backend-api" / "app.py"
    
    if not backend_path.exists():
        print(f"⚠️  ملف Backend غير موجود: {backend_path}")
        return None
    
    try:
        process = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
            cwd=str(project_root / "03-WEB-INTERFACE" / "backend-api"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print("✅ تم تشغيل Backend على http://localhost:8000")
        print("   📚 API Docs: http://localhost:8000/docs")
        return process
    except Exception as e:
        print(f"❌ خطأ في تشغيل Backend: {e}")
        return None


def start_web_frontend() -> Optional[subprocess.Popen]:
    """تشغيل واجهة الويب - Frontend"""
    print("🎨 بدء تشغيل واجهة الويب - Frontend (03-WEB-INTERFACE/frontend-architecture)...")
    
    frontend_dir = project_root / "03-WEB-INTERFACE" / "frontend-architecture"
    
    if not frontend_dir.exists():
        print(f"⚠️  مجلد Frontend غير موجود: {frontend_dir}")
        return None
    
    # التحقق من وجود node_modules
    if not (frontend_dir / "node_modules").exists():
        print("📦 تثبيت تبعيات Frontend...")
        try:
            subprocess.run(
                ["npm", "install", "--legacy-peer-deps"],
                cwd=str(frontend_dir),
                check=True
            )
        except Exception as e:
            print(f"⚠️  خطأ في تثبيت التبعيات: {e}")
            print("💡 حاول يدوياً: cd 03-WEB-INTERFACE/frontend-architecture && npm install")
            return None
    
    try:
        # استخدام npm start
        if sys.platform == "win32":
            process = subprocess.Popen(
                ["npm.cmd", "start"],
                cwd=str(frontend_dir),
                shell=True
            )
        else:
            process = subprocess.Popen(
                ["npm", "start"],
                cwd=str(frontend_dir)
            )
        
        print("✅ تم تشغيل Frontend على http://localhost:3000")
        return process
    except Exception as e:
        print(f"❌ خطأ في تشغيل Frontend: {e}")
        return None


def wait_for_service(url: str, timeout: int = 30):
    """انتظار حتى يصبح الخدمة جاهزة"""
    import urllib.request
    import urllib.error
    
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            urllib.request.urlopen(url, timeout=2)
            return True
        except:
            time.sleep(1)
    return False


def main():
    """الدالة الرئيسية"""
    print("=" * 60)
    print("🚀 تشغيل جميع أنظمة المشروع")
    print("=" * 60)
    print()
    
    # تشغيل الأنظمة بالترتيب
    os_process = start_operating_system()
    if os_process:
        processes.append(os_process)
        time.sleep(2)  # انتظار قليل
    
    integration_process = start_integration_system()
    if integration_process:
        processes.append(integration_process)
        time.sleep(2)
    
    backend_process = start_web_backend()
    if backend_process:
        processes.append(backend_process)
        time.sleep(3)  # انتظار أطول للـ backend
    
    frontend_process = start_web_frontend()
    if frontend_process:
        processes.append(frontend_process)
        time.sleep(5)  # انتظار أطول للـ frontend
    
    print()
    print("=" * 60)
    print("✅ جميع الأنظمة تعمل!")
    print("=" * 60)
    print()
    print("🌐 الروابط:")
    print("   - Frontend:        http://localhost:3000")
    print("   - Backend API:     http://localhost:8000")
    print("   - API Docs:        http://localhost:8000/docs")
    print("   - Integration:     http://localhost:8001")
    print("   - Operating System: http://localhost:8003")
    print()
    print("💡 اضغط Ctrl+C لإيقاف جميع الأنظمة")
    print()
    
    # فتح المتصفح تلقائياً بعد 10 ثواني
    time.sleep(10)
    try:
        webbrowser.open("http://localhost:3000")
        print("🌐 تم فتح المتصفح تلقائياً")
    except:
        pass
    
    # انتظار حتى يتم إيقاف الأنظمة
    try:
        while True:
            time.sleep(1)
            # التحقق من أن العمليات ما زالت تعمل
            for i, process in enumerate(processes):
                if process.poll() is not None:
                    print(f"⚠️  عملية {i+1} توقفت")
    except KeyboardInterrupt:
        pass
    finally:
        print("\n🛑 إيقاف جميع الأنظمة...")
        for process in processes:
            try:
                process.terminate()
                process.wait(timeout=5)
            except:
                try:
                    process.kill()
                except:
                    pass
        print("✅ تم إيقاف جميع الأنظمة")


if __name__ == "__main__":
    main()

