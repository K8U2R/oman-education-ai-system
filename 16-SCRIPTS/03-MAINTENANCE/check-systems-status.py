"""
التحقق من حالة جميع الأنظمة
Check All Systems Status

يختبر اتصال جميع الأنظمة للتأكد من أنها تعمل
"""

import sys
import io
from pathlib import Path

# إصلاح الترميز على Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import urllib.request
import urllib.error
import json
from typing import Dict, Tuple

# مسار المشروع (من الجذر)
script_dir = Path(__file__).parent
if script_dir.name == "03-MAINTENANCE":
    # إذا كان السكريبت في 16-SCRIPTS/03-MAINTENANCE
    project_root = script_dir.parent.parent
else:
    # إذا كان السكريبت في الجذر
    project_root = script_dir


def check_system(url: str, name: str, timeout: int = 5) -> Tuple[bool, str]:
    """
    التحقق من حالة نظام معين
    
    Args:
        url: رابط النظام
        name: اسم النظام
        timeout: مهلة الاتصال (ثواني)
    
    Returns:
        (نجح, رسالة)
    """
    try:
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'System-Status-Checker/1.0')
        
        with urllib.request.urlopen(req, timeout=timeout) as response:
            status_code = response.getcode()
            if status_code == 200:
                return True, f"✅ {name}: يعمل (HTTP {status_code})"
            else:
                return False, f"⚠️  {name}: استجابة غير متوقعة (HTTP {status_code})"
    except urllib.error.HTTPError as e:
        return False, f"❌ {name}: خطأ HTTP {e.code}"
    except urllib.error.URLError as e:
        return False, f"❌ {name}: خطأ في الاتصال ({str(e)})"
    except Exception as e:
        return False, f"❌ {name}: خطأ غير متوقع ({str(e)})"


def main():
    """الدالة الرئيسية"""
    print("=" * 60)
    print("🔍 فحص حالة جميع الأنظمة")
    print("=" * 60)
    print()
    
    # قائمة الأنظمة للتحقق منها
    systems = [
        ("http://localhost:8001/health", "01-OPERATING-SYSTEM", "نظام التشغيل"),
        ("http://localhost:8003/health", "02-SYSTEM-INTEGRATION", "نظام التكامل"),
        ("http://localhost:8000/health", "03-WEB-INTERFACE (Backend)", "واجهة الويب - Backend"),
        ("http://localhost:3000", "03-WEB-INTERFACE (Frontend)", "واجهة الويب - Frontend"),
    ]
    
    results = []
    total = len(systems)
    working = 0
    
    for url, system_id, system_name in systems:
        success, message = check_system(url, system_name)
        print(message)
        results.append((system_id, system_name, success))
        if success:
            working += 1
    
    print()
    print("=" * 60)
    print(f"📊 النتيجة: {working}/{total} أنظمة تعمل")
    print("=" * 60)
    
    # ملخص
    print()
    if working == total:
        print("✅ جميع الأنظمة تعمل بشكل صحيح!")
        return 0
    elif working == 0:
        print("❌ لا توجد أنظمة تعمل حالياً")
        print()
        print("💡 لتشغيل جميع الأنظمة:")
        print()
        print("   Windows:")
        print("   > 16-SCRIPTS\\02-DEPLOYMENT\\start-all-systems.bat")
        print()
        print("   Linux/Mac:")
        print("   $ ./16-SCRIPTS/02-DEPLOYMENT/start-all-systems.sh")
        print()
        print("   أو يدوياً:")
        print("   $ python 16-SCRIPTS/02-DEPLOYMENT/start-all-systems.py")
        print()
        print("📌 المنافذ المتوقعة:")
        print("   - Operating System: http://localhost:8001")
        print("   - Integration:       http://localhost:8003")
        print("   - Web Backend:       http://localhost:8000")
        print("   - Web Frontend:      http://localhost:3000")
        return 1
    else:
        print("⚠️  بعض الأنظمة لا تعمل")
        print()
        print("💡 الحلول:")
        print("   1. تأكد من تشغيل جميع الأنظمة")
        print("   2. استخدم: ./16-SCRIPTS/02-DEPLOYMENT/start-all-systems.sh")
        print("   3. تحقق من المنافذ (8001, 8003, 8000, 3000)")
        return 1


if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⚠️  تم إيقاف الفحص")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ خطأ غير متوقع: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

