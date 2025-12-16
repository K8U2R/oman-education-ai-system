"""
Run Operating System
run_operating_system.py

نقطة البداية لتشغيل نظام التشغيل من الجذر
Entry point to run operating system from root
"""

import sys
import asyncio
from pathlib import Path

# إضافة مسار نظام التشغيل
os_path = Path(__file__).parent / "01-OPERATING-SYSTEM"
sys.path.insert(0, str(os_path))

# استيراد وتشغيل النظام
try:
    import importlib.util
    
    def load_module(module_name, file_path):
        """تحميل وحدة من مسار معين"""
        spec = importlib.util.spec_from_file_location(module_name, file_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module
    
    # تحميل operating_system
    os_module = load_module("operating_system", os_path / "operating_system.py")
    OperatingSystem = os_module.OperatingSystem
    
    async def main():
        """الدالة الرئيسية"""
        os = OperatingSystem()
        
        try:
            await os.start()
            
            # عرض الحالة
            status = os.get_status()
            print("\n" + "=" * 60)
            print("حالة نظام التشغيل:")
            print("=" * 60)
            print(f"  الاسم: {status['name']}")
            print(f"  الإصدار: {status['version']}")
            print(f"  الحالة: {'يعمل' if status['running'] else 'متوقف'}")
            print("=" * 60)
            
            # انتظار قليلاً
            print("\nالنظام يعمل... اضغط Ctrl+C للإيقاف")
            await asyncio.sleep(3600)  # انتظار ساعة (أو حتى Ctrl+C)
            
        except KeyboardInterrupt:
            print("\n\nتم إيقاف النظام بواسطة المستخدم")
        finally:
            await os.stop()
    
    if __name__ == "__main__":
        asyncio.run(main())
        
except Exception as e:
    print(f"خطأ في تشغيل نظام التشغيل: {e}")
    print(f"تأكد من وجود الملف في: {os_path / 'operating_system.py'}")
    sys.exit(1)

