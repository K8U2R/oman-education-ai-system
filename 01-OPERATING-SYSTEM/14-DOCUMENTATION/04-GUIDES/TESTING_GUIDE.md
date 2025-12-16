# 🧪 دليل الاختبار - Testing Guide

## 📋 نظرة عامة

هذا الدليل يوضح كيفية اختبار جميع مكونات **01-OPERATING-SYSTEM** للتأكد من جاهزيتها للإنتاج.

---

## 🚀 الاختبارات السريعة

### 1. فحص الجاهزية الشامل

```bash
cd 01-OPERATING-SYSTEM
python scripts/check_readiness.py
```

هذا السكريبت يفحص:
- ✅ جميع الـ imports المطلوبة
- ✅ وجود جميع الملفات
- ✅ إمكانية تهيئة المكونات
- ✅ إعدادات التكوين

### 2. اختبار API Endpoints يدوياً

```bash
# تشغيل السيرفر
python -m api_gateway.fastapi_server

# في نافذة أخرى، اختبار الـ endpoints:
python tests/test_api_endpoints.py
```

### 3. اختبار التكامل

```bash
python tests/test_integration.py
```

---

## 📡 اختبار API Endpoints

### باستخدام curl

```bash
# Health check
curl http://localhost:8001/health

# System status
curl http://localhost:8001/api/v1/system/status

# System health
curl http://localhost:8001/api/v1/system/health

# Monitoring performance
curl http://localhost:8001/api/v1/monitoring/performance

# Services list
curl http://localhost:8001/api/v1/services/list

# Processes list
curl http://localhost:8001/api/v1/processes/list
```

### باستخدام Python

```python
import httpx
import asyncio

async def test_api():
    async with httpx.AsyncClient(base_url="http://localhost:8001") as client:
        # Test endpoints
        response = await client.get("/api/v1/system/status")
        print(response.json())
        
        response = await client.get("/api/v1/monitoring/health")
        print(response.json())

asyncio.run(test_api())
```

### باستخدام Postman/Insomnia

1. استيراد OpenAPI schema من: `http://localhost:8001/openapi.json`
2. أو استخدام Swagger UI: `http://localhost:8001/docs`

---

## 🔗 اختبار التكامل مع الأنظمة الأخرى

### 1. اختبار التكامل مع 02-SYSTEM-INTEGRATION

```python
from integration import IntegrationBridge

bridge = IntegrationBridge("http://localhost:8003")
connected = await bridge.connect()

if connected:
    await bridge.register_system({
        "description": "Operating System Module"
    })
    print("✅ Connected and registered!")
else:
    print("⚠️ 02-SYSTEM-INTEGRATION not running")
```

### 2. اختبار Event System

```python
from event_system import EventBus, EventPublisher, EventSubscriber

# Create event bus
event_bus = EventBus()
publisher = EventPublisher(event_bus)
subscriber = EventSubscriber(event_bus)

# Subscribe to events
received = []
async def handler(event):
    received.append(event)
    print(f"Received: {event.event_name}")

subscriber.subscribe("system.test", handler)

# Publish event
await publisher.publish_system_event("test", {"data": "test"})
```

---

## 🧪 الاختبارات الآلية (pytest)

### تشغيل جميع الاختبارات

```bash
# تثبيت pytest إذا لم يكن مثبتاً
pip install pytest pytest-asyncio

# تشغيل الاختبارات
pytest tests/ -v

# تشغيل اختبارات محددة
pytest tests/test_api_endpoints.py -v
pytest tests/test_integration.py -v
```

### اختبارات متقدمة

```bash
# مع coverage
pytest tests/ --cov=. --cov-report=html

# مع output مفصل
pytest tests/ -v -s
```

---

## 📊 قائمة التحقق النهائية

### قبل الإطلاق

- [ ] ✅ جميع الـ imports تعمل
- [ ] ✅ جميع الملفات موجودة
- [ ] ✅ API Server يبدأ بنجاح
- [ ] ✅ جميع الـ endpoints تستجيب
- [ ] ✅ Event System يعمل
- [ ] ✅ Integration Bridge يعمل
- [ ] ✅ Service Registry يعمل
- [ ] ✅ Logging يعمل بشكل صحيح
- [ ] ✅ Error handling يعمل
- [ ] ✅ Documentation محدثة

### اختبارات الأداء

```bash
# اختبار الضغط (يحتاج apache-bench أو wrk)
ab -n 1000 -c 10 http://localhost:8001/api/v1/system/status
```

### اختبارات الأمان

- [ ] ✅ CORS configured correctly
- [ ] ✅ Auth middleware ready (if needed)
- [ ] ✅ Input validation working
- [ ] ✅ Error messages don't leak sensitive info

---

## 🐛 حل المشاكل الشائعة

### المشكلة: Import errors

```bash
# الحل: تأكد من المسار
cd 01-OPERATING-SYSTEM
export PYTHONPATH=$PWD:$PYTHONPATH
```

### المشكلة: Port already in use

```bash
# الحل: استخدم port آخر
python -m api_gateway.fastapi_server --port 8002
```

### المشكلة: Connection refused

```bash
# الحل: تأكد من تشغيل السيرفر أولاً
# ثم اختبر الاتصال
curl http://localhost:8001/health
```

---

## 📈 مراقبة الأداء

### أثناء الاختبار

```python
import time
import httpx

async def test_performance():
    client = httpx.AsyncClient()
    
    start = time.time()
    for _ in range(100):
        await client.get("http://localhost:8001/api/v1/system/status")
    end = time.time()
    
    print(f"100 requests in {end - start:.2f}s")
    print(f"Average: {(end - start) / 100 * 1000:.2f}ms per request")
```

---

## ✅ النتيجة المتوقعة

بعد إكمال جميع الاختبارات:
- ✅ جميع الـ endpoints تعمل
- ✅ التكامل مع الأنظمة الأخرى جاهز
- ✅ Event System يعمل بشكل صحيح
- ✅ النظام جاهز للإنتاج

---

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع logs في `logs/`
2. تحقق من `TROUBLESHOOTING.md`
3. راجع `INTEGRATION_GUIDE.md`

---

**تاريخ الإنشاء**: 2025-12-12  
**آخر تحديث**: 2025-12-12

