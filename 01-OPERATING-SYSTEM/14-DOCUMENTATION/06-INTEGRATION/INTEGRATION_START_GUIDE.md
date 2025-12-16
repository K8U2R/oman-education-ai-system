# 🚀 دليل بدء التكامل - Integration Start Guide

## 🎯 الهدف

ربط **01-OPERATING-SYSTEM** مع **02-SYSTEM-INTEGRATION** و **03-WEB-INTERFACE** بشكل كامل.

---

## 📋 الخطوات السريعة

### 1. تشغيل 01-OPERATING-SYSTEM

```bash
cd 01-OPERATING-SYSTEM
python -m api_gateway.fastapi_server
```

**يعمل على:** http://localhost:8001

### 2. تشغيل 02-SYSTEM-INTEGRATION (في نافذة أخرى)

```bash
cd 02-SYSTEM-INTEGRATION
python run.py
```

**يعمل على:** http://localhost:8003

### 3. تشغيل التكامل الكامل (اختياري)

```bash
cd 01-OPERATING-SYSTEM
python integration/integration_example_full.py
```

---

## 🔗 التكامل التلقائي

### مع 02-SYSTEM-INTEGRATION

```python
from integration import SystemIntegrationConnector

connector = SystemIntegrationConnector("http://localhost:8003")
await connector.connect()
await connector.register_system()

# إرسال حدث
await connector.send_event("system.initialized", {
    "components": 8
})
```

### مع 03-WEB-INTERFACE

```python
from integration import WebInterfaceConnector

connector = WebInterfaceConnector("http://localhost:3000")
cors_config = connector.get_cors_config()

# CORS سيتم تكوينه تلقائياً
```

---

## 📡 WebSocket Endpoints

### من Frontend (JavaScript)

```javascript
// System Status
const ws = new WebSocket('ws://localhost:8001/ws/system-status');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Status:', data);
};

// Monitoring
const ws2 = new WebSocket('ws://localhost:8001/ws/monitoring');
ws2.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Metrics:', data);
};

// Events
const ws3 = new WebSocket('ws://localhost:8001/ws/events');
ws3.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Event:', data);
};
```

---

## ✅ التحقق من التكامل

### 1. فحص اتصال 02-SYSTEM-INTEGRATION

```bash
curl http://localhost:8003/health
curl http://localhost:8003/api/integration/status
```

### 2. فحص 01-OPERATING-SYSTEM

```bash
curl http://localhost:8001/health
curl http://localhost:8001/api/v1/system/status
```

### 3. فحص التكامل

```bash
# من خلال 02-SYSTEM-INTEGRATION
curl http://localhost:8003/api/integration/os/health
curl http://localhost:8003/api/integration/os/status
```

---

## 🎯 النتيجة المتوقعة

بعد التكامل:
- ✅ **01-OPERATING-SYSTEM** مسجل في **02-SYSTEM-INTEGRATION**
- ✅ **الأحداث** تُرسل تلقائياً
- ✅ **03-WEB-INTERFACE** يمكنه الوصول للـ API
- ✅ **WebSocket** يعمل للبيانات المباشرة

---

## 📚 الوثائق

- `INTEGRATION_COMPLETE.md` - دليل التكامل الكامل
- `integration_example_full.py` - مثال التكامل الكامل
- `integration_manager.py` - مدير التكامل

---

**جاهز للبدء!** 🚀

