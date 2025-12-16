"""
Test Bridge Connection
test_bridge.py

اختبار الربط بين الأنظمة
Test bridge connection between systems
"""

import asyncio
import httpx
import sys
from pathlib import Path

# إضافة المسارات
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(Path(__file__).parent))


async def test_operating_system_api():
    """اختبار API Operating System مباشرة"""
    print("\n🔍 اختبار Operating System API (مباشر)...")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Health Check
            response = await client.get("http://localhost:8001/health")
            print(f"  ✅ Health: {response.status_code}")
            
            # Status
            response = await client.get("http://localhost:8001/status")
            print(f"  ✅ Status: {response.status_code}")
            
            # Services
            response = await client.get("http://localhost:8001/services")
            print(f"  ✅ Services: {response.status_code}")
            
    except Exception as e:
        print(f"  ❌ خطأ: {e}")
        return False
    
    return True


async def test_integration_api():
    """اختبار Integration API"""
    print("\n🔍 اختبار Integration API...")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Health Check
            response = await client.get("http://localhost:8003/health")
            print(f"  ✅ Health: {response.status_code}")
            
            # Integration Status
            response = await client.get("http://localhost:8003/api/integration/status")
            print(f"  ✅ Integration Status: {response.status_code}")
            
            # Routes
            response = await client.get("http://localhost:8003/api/integration/routes")
            print(f"  ✅ Routes: {response.status_code}")
            
    except Exception as e:
        print(f"  ❌ خطأ: {e}")
        return False
    
    return True


async def test_bridge_connection():
    """اختبار الربط بين الأنظمة"""
    print("\n🔍 اختبار الربط بين الأنظمة...")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # OS Health عبر Integration
            response = await client.get("http://localhost:8003/api/integration/os/health")
            print(f"  ✅ OS Health (via Gateway): {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"     Status: {data.get('status', 'unknown')}")
            
            # OS Status عبر Integration
            response = await client.get("http://localhost:8003/api/integration/os/status")
            print(f"  ✅ OS Status (via Gateway): {response.status_code}")
            
            # OS Services عبر Integration
            response = await client.get("http://localhost:8003/api/integration/os/services")
            print(f"  ✅ OS Services (via Gateway): {response.status_code}")
            
            # OS Resources عبر Integration
            response = await client.get("http://localhost:8003/api/integration/os/resources")
            print(f"  ✅ OS Resources (via Gateway): {response.status_code}")
            
            # OS Direct Bridge
            response = await client.get("http://localhost:8003/api/integration/os/direct/health")
            print(f"  ✅ OS Health (via Bridge): {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"     Source: {data.get('source', 'unknown')}")
            
    except Exception as e:
        print(f"  ❌ خطأ: {e}")
        return False
    
    return True


async def main():
    """اختبار شامل"""
    print("=" * 60)
    print("🧪 اختبار نظام الربط")
    print("=" * 60)
    
    # اختبار 1: Operating System API
    os_ok = await test_operating_system_api()
    
    # اختبار 2: Integration API
    integration_ok = await test_integration_api()
    
    # اختبار 3: Bridge Connection
    bridge_ok = await test_bridge_connection()
    
    # النتيجة
    print("\n" + "=" * 60)
    print("📊 النتائج:")
    print(f"  Operating System API: {'✅' if os_ok else '❌'}")
    print(f"  Integration API: {'✅' if integration_ok else '❌'}")
    print(f"  Bridge Connection: {'✅' if bridge_ok else '❌'}")
    print("=" * 60)
    
    if os_ok and integration_ok and bridge_ok:
        print("\n🎉 جميع الاختبارات نجحت!")
        return 0
    else:
        print("\n⚠️  بعض الاختبارات فشلت")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

