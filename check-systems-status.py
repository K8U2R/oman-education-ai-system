"""
التحقق من حالة جميع الأنظمة
Check All Systems Status

يختبر اتصال جميع الأنظمة للتأكد من أنها تعمل
"""

import sys
import io

# إصلاح الترميز على Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import urllib.request
import urllib.error
import json
from typing import Dict, Tuple

# روابط الأنظمة
SYSTEMS = {
    "Operating System": "http://localhost:8003/api/status",
    "Integration System": "http://localhost:8001/health",
    "Web Backend": "http://localhost:8000/api/health",
    "Web Frontend": "http://localhost:3000",
    "API Docs": "http://localhost:8000/docs"
}


def check_system(name: str, url: str) -> Tuple[bool, str]:
    """
    التحقق من حالة نظام معين
    
    Returns:
        (نجح/فشل, رسالة)
    """
    try:
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'System-Checker')
        
        with urllib.request.urlopen(req, timeout=3) as response:
            status_code = response.getcode()
            if status_code == 200:
                try:
                    data = json.loads(response.read().decode())
                    return True, f"✅ يعمل (Status: {status_code})"
                except:
                    return True, f"✅ يعمل (Status: {status_code})"
            else:
                return False, f"⚠️  Status: {status_code}"
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return False, "❌ غير موجود (404)"
        return False, f"❌ خطأ HTTP: {e.code}"
    except urllib.error.URLError:
        return False, "❌ غير متاح (لا يمكن الاتصال)"
    except Exception as e:
        return False, f"❌ خطأ: {str(e)[:50]}"


def main():
    """الدالة الرئيسية"""
    print("=" * 60)
    print("🔍 التحقق من حالة جميع الأنظمة")
    print("=" * 60)
    print()
    
    results = {}
    
    for name, url in SYSTEMS.items():
        print(f"فحص {name}...", end=" ")
        success, message = check_system(name, url)
        results[name] = {"success": success, "message": message, "url": url}
        print(message)
    
    print()
    print("=" * 60)
    print("📊 ملخص النتائج:")
    print("=" * 60)
    
    working = sum(1 for r in results.values() if r["success"])
    total = len(results)
    
    for name, result in results.items():
        status_icon = "✅" if result["success"] else "❌"
        print(f"{status_icon} {name:20s} - {result['message']}")
        print(f"   URL: {result['url']}")
    
    print()
    print(f"النتيجة: {working}/{total} أنظمة تعمل")
    
    if working == total:
        print("🎉 جميع الأنظمة تعمل بشكل صحيح!")
    elif working > 0:
        print("⚠️  بعض الأنظمة لا تعمل")
    else:
        print("❌ لا توجد أنظمة تعمل - يرجى تشغيلها أولاً")


if __name__ == "__main__":
    main()

