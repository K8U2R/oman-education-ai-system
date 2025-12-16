"""
مساعد ذكي عربي للتعلم والبناء العملي
النقطة الرئيسية لتشغيل النظام الكامل

Main Entry Point - تشغيل جميع أنظمة المشروع
Main Entry Point - Start All Project Systems
"""

import sys
import io
import subprocess
import time
import signal
import os
import webbrowser
from pathlib import Path
from typing import List, Optional
from threading import Thread

# إعداد الترميز UTF-8 لنظام Windows
if sys.platform == 'win32':
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
    except Exception:
        pass

# إضافة مسار المشروع إلى Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# تحميل متغيرات البيئة (إن وجدت)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# العمليات الجارية
processes: List[subprocess.Popen] = []


def signal_handler(sig, frame):
    """معالج إشارة الإيقاف"""
    print("\n\n⚠️  تم إيقاف جميع الأنظمة...")
    cleanup_processes()
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)


def cleanup_processes():
    """إيقاف جميع العمليات"""
    for process in processes:
        try:
            if process.poll() is None:  # ما زالت تعمل
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
        except Exception:
            pass
    processes.clear()


def check_port(port: int) -> bool:
    """التحقق من أن المنفذ متاح"""
    import socket
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)
            result = s.connect_ex(('localhost', port))
            return result != 0  # True إذا كان المنفذ متاحاً
    except Exception:
        return True


def wait_for_service(url: str, timeout: int = 30) -> bool:
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


def start_backend() -> Optional[subprocess.Popen]:
    """تشغيل Backend Server (FastAPI)"""
    print("\n🚀 بدء تشغيل Backend Server...")
    print("=" * 60)
    
    backend_path = project_root / "01-OPERATING-SYSTEM" / "api_gateway"
    fastapi_server = backend_path / "fastapi_server.py"
    
    if not fastapi_server.exists():
        print(f"❌ ملف Backend غير موجود: {fastapi_server}")
        return None
    
    # التحقق من المنفذ
    if not check_port(8000):
        print("⚠️  المنفذ 8000 مستخدم بالفعل!")
        print("💡 حاول إيقاف العملية التي تستخدم المنفذ أو استخدم منفذ آخر")
        return None
    
    try:
        # تشغيل FastAPI Server
        process = subprocess.Popen(
            [
                sys.executable, "-m", "uvicorn",
                "fastapi_server:app",
                "--reload",
                "--host", "0.0.0.0",
                "--port", "8000"
            ],
            cwd=str(backend_path),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        
        print("✅ تم تشغيل Backend Server")
        print("   📍 API: http://localhost:8000")
        print("   📚 API Docs: http://localhost:8000/docs")
        print("   📖 ReDoc: http://localhost:8000/redoc")
        
        # انتظار قليل للتحقق من أن الخدمة تعمل
        time.sleep(3)
        if process.poll() is not None:
            print("❌ فشل تشغيل Backend Server")
            stdout, stderr = process.communicate()
            if stderr:
                print(f"   الخطأ: {stderr[:200]}")
            return None
        
        return process
        
    except Exception as e:
        print(f"❌ خطأ في تشغيل Backend Server: {e}")
        return None


def start_frontend() -> Optional[subprocess.Popen]:
    """تشغيل Frontend Server (React/Vite)"""
    print("\n🎨 بدء تشغيل Frontend Server...")
    print("=" * 60)
    
    frontend_path = project_root / "03-WEB-INTERFACE" / "frontend"
    
    if not frontend_path.exists():
        print(f"❌ مجلد Frontend غير موجود: {frontend_path}")
        return None
    
    # التحقق من وجود package.json
    package_json = frontend_path / "package.json"
    if not package_json.exists():
        print(f"❌ ملف package.json غير موجود: {package_json}")
        return None
    
    # التحقق من المنفذ
    if not check_port(3000):
        print("⚠️  المنفذ 3000 مستخدم بالفعل!")
        print("💡 حاول إيقاف العملية التي تستخدم المنفذ أو استخدم منفذ آخر")
        return None
    
    # التحقق من node_modules
    node_modules = frontend_path / "node_modules"
    if not node_modules.exists():
        print("📦 تثبيت تبعيات Frontend...")
        print("   (قد يستغرق هذا بضع دقائق)")
        try:
            install_process = subprocess.run(
                ["npm", "install"],
                cwd=str(frontend_path),
                check=True,
                capture_output=True,
                text=True
            )
            print("✅ تم تثبيت التبعيات بنجاح")
        except subprocess.CalledProcessError as e:
            print(f"❌ فشل تثبيت التبعيات: {e}")
            print("💡 حاول يدوياً: cd 03-WEB-INTERFACE/frontend && npm install")
            return None
        except FileNotFoundError:
            print("❌ npm غير مثبت أو غير موجود في PATH")
            print("💡 يرجى تثبيت Node.js من https://nodejs.org/")
            return None
    
    try:
        # تشغيل Frontend Server
        if sys.platform == "win32":
            process = subprocess.Popen(
                ["npm.cmd", "run", "dev"],
                cwd=str(frontend_path),
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
        else:
            process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=str(frontend_path),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
        
        print("✅ تم تشغيل Frontend Server")
        print("   📍 Frontend: http://localhost:3000")
        print("   ⏳ جاري التحميل... (قد يستغرق بضع ثوان)")
        
        # انتظار قليل للتحقق من أن الخدمة تعمل
        time.sleep(5)
        if process.poll() is not None:
            print("❌ فشل تشغيل Frontend Server")
            stdout, stderr = process.communicate()
            if stderr:
                print(f"   الخطأ: {stderr[:200]}")
            return None
        
        return process
        
    except Exception as e:
        print(f"❌ خطأ في تشغيل Frontend Server: {e}")
        return None


def open_browser(url: str, delay: int = 5):
    """فتح المتصفح بعد تأخير"""
    def _open():
        time.sleep(delay)
        try:
            webbrowser.open(url)
            print(f"🌐 تم فتح المتصفح على {url}")
        except Exception:
            pass
    
    thread = Thread(target=_open, daemon=True)
    thread.start()


def show_menu():
    """عرض قائمة الاختيار"""
    print("\n" + "=" * 60)
    print("🚀 نظام التعليم الذكي العُماني")
    print("=" * 60)
    print("\nاختر خياراً:")
    print("  1. تشغيل جميع الأنظمة (Backend + Frontend)")
    print("  2. تشغيل Backend فقط")
    print("  3. تشغيل Frontend فقط")
    print("  4. تشغيل واجهة سطح المكتب (GUI)")
    print("  5. خروج")
    print("\n" + "=" * 60)


def main():
    """الدالة الرئيسية"""
    try:
        while True:
            show_menu()
            
            try:
                choice = input("\nاختيارك (1-5): ").strip()
            except (EOFError, KeyboardInterrupt):
                print("\n\n⚠️  تم إيقاف النظام")
                cleanup_processes()
                sys.exit(0)
            
            if choice == "1":
                # تشغيل جميع الأنظمة
                print("\n🚀 تشغيل جميع الأنظمة...")
                print("=" * 60)
                
                backend_process = start_backend()
                if backend_process:
                    processes.append(backend_process)
                    time.sleep(2)
                
                frontend_process = start_frontend()
                if frontend_process:
                    processes.append(frontend_process)
                    time.sleep(3)
                
                if processes:
                    print("\n" + "=" * 60)
                    print("✅ جميع الأنظمة تعمل!")
                    print("=" * 60)
                    print("\n🌐 الروابط:")
                    if backend_process:
                        print("   - Backend API:     http://localhost:8000")
                        print("   - API Docs:        http://localhost:8000/docs")
                    if frontend_process:
                        print("   - Frontend:        http://localhost:3000")
                    print("\n💡 اضغط Ctrl+C لإيقاف جميع الأنظمة")
                    print("=" * 60)
                    
                    # فتح المتصفح تلقائياً
                    if frontend_process:
                        open_browser("http://localhost:3000", delay=8)
                    elif backend_process:
                        open_browser("http://localhost:8000/docs", delay=5)
                    
                    # انتظار حتى يتم إيقاف الأنظمة
                    try:
                        while True:
                            time.sleep(1)
                            # التحقق من أن العمليات ما زالت تعمل
                            for i, process in enumerate(processes):
                                if process.poll() is not None:
                                    print(f"\n⚠️  عملية {i+1} توقفت")
                    except KeyboardInterrupt:
                        print("\n\n🛑 إيقاف جميع الأنظمة...")
                        cleanup_processes()
                        print("✅ تم إيقاف جميع الأنظمة")
                else:
                    print("\n❌ لم يتم تشغيل أي نظام")
                    print("💡 تحقق من الأخطاء أعلاه")
                
                input("\nاضغط Enter للعودة إلى القائمة...")
                cleanup_processes()
            
            elif choice == "2":
                # تشغيل Backend فقط
                backend_process = start_backend()
                if backend_process:
                    processes.append(backend_process)
                    print("\n💡 اضغط Ctrl+C لإيقاف Backend")
                    try:
                        while True:
                            time.sleep(1)
                            if backend_process.poll() is not None:
                                print("\n⚠️  Backend توقف")
                                break
                    except KeyboardInterrupt:
                        print("\n\n🛑 إيقاف Backend...")
                        cleanup_processes()
                        print("✅ تم إيقاف Backend")
                else:
                    print("\n❌ فشل تشغيل Backend")
                
                input("\nاضغط Enter للعودة إلى القائمة...")
                cleanup_processes()
            
            elif choice == "3":
                # تشغيل Frontend فقط
                frontend_process = start_frontend()
                if frontend_process:
                    processes.append(frontend_process)
                    print("\n💡 اضغط Ctrl+C لإيقاف Frontend")
                    open_browser("http://localhost:3000", delay=5)
                    try:
                        while True:
                            time.sleep(1)
                            if frontend_process.poll() is not None:
                                print("\n⚠️  Frontend توقف")
                                break
                    except KeyboardInterrupt:
                        print("\n\n🛑 إيقاف Frontend...")
                        cleanup_processes()
                        print("✅ تم إيقاف Frontend")
                else:
                    print("\n❌ فشل تشغيل Frontend")
                
                input("\nاضغط Enter للعودة إلى القائمة...")
                cleanup_processes()
            
            elif choice == "4":
                # تشغيل GUI
                cleanup_processes()
                launch_gui()
                input("\nاضغط Enter للعودة إلى القائمة...")
            
            elif choice == "5":
                # خروج
                print("\n👋 مع السلامة!")
                cleanup_processes()
                sys.exit(0)
            
            else:
                print("\n❌ اختيار غير صحيح. يرجى اختيار رقم من 1 إلى 5")
                time.sleep(1)
    
    except KeyboardInterrupt:
        print("\n\n⚠️  تم إيقاف النظام بواسطة المستخدم")
        cleanup_processes()
        sys.exit(0)
    
    except Exception as e:
        print(f"\n❌ خطأ غير متوقع: {e}")
        import traceback
        traceback.print_exc()
        cleanup_processes()
        sys.exit(1)


def launch_gui():
    """تشغيل واجهة سطح المكتب"""
    try:
        gui_path = project_root / "01-OPERATING-SYSTEM" / "gui" / "main_window.py"
        
        if not gui_path.exists():
            print(f"⚠️  ملف واجهة سطح المكتب غير موجود")
            print(f"   المسار المتوقع: {gui_path}")
            print("\n💡 بدلاً من ذلك، سيتم تشغيل API Server...")
            print("   لتشغيل GUI لاحقاً، أنشئ مجلد gui/ وملف main_window.py")
            print()
            backend_process = start_backend()
            if backend_process:
                processes.append(backend_process)
                print("\n💡 اضغط Ctrl+C لإيقاف Backend")
                try:
                    while True:
                        time.sleep(1)
                        if backend_process.poll() is not None:
                            break
                except KeyboardInterrupt:
                    cleanup_processes()
            return
        
        # استيراد وتشغيل الواجهة
        import importlib.util
        
        spec = importlib.util.spec_from_file_location("main_window", gui_path)
        if spec is None or spec.loader is None:
            raise ImportError("تعذر تحميل واجهة سطح المكتب")
        
        module = importlib.util.module_from_spec(spec)
        sys.modules["main_window"] = module
        spec.loader.exec_module(module)
        
        # تشغيل الواجهة
        if hasattr(module, 'MainWindow'):
            app = module.MainWindow()
            app.run()
        elif hasattr(module, 'main'):
            module.main()
        else:
            raise AttributeError("لا يمكن العثور على MainWindow أو main في الوحدة")
        
    except ImportError as e:
        print(f"❌ خطأ في الاستيراد: {e}")
        print("\n💡 تأكد من:")
        print("   1. تثبيت جميع التبعيات: pip install -r requirements.txt")
        print("   2. تثبيت tkinter (عادة مدمج في Python)")
    
    except Exception as e:
        print(f"❌ خطأ في تشغيل واجهة سطح المكتب: {e}")
        print(f"\n📁 المسار: {gui_path}")
        print("\n💡 حاول:")
        print("   1. تشغيل مباشرة: python 01-OPERATING-SYSTEM/gui/main_window.py")
        print("   2. التحقق من وجود جميع الملفات المطلوبة")


if __name__ == "__main__":
    main()
