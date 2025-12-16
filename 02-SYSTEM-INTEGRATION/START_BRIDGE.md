# 🚀 بدء نظام الربط

## 📋 المتطلبات

1. ✅ `psutil` مثبت
2. ✅ `01-OPERATING-SYSTEM` جاهز
3. ✅ `02-SYSTEM-INTEGRATION` جاهز

---

## 🚀 خطوات التشغيل

### الخطوة 1: تشغيل Operating System API

افتح Terminal 1:

```bash
cd 01-OPERATING-SYSTEM
python run_api.py
```

**يجب أن ترى:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001
```

---

### الخطوة 2: تشغيل Integration System

افتح Terminal 2:

```bash
cd 02-SYSTEM-INTEGRATION
python run.py
```

**يجب أن ترى:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8003
```

---

### الخطوة 3: اختبار الربط

افتح Terminal 3:

```bash
cd 02-SYSTEM-INTEGRATION
python test_bridge.py
```

---

## ✅ التحقق اليدوي

### 1. فحص Operating System API:

```bash
curl http://localhost:8001/health
```

### 2. فحص Integration API:

```bash
curl http://localhost:8003/health
```

### 3. فحص الربط:

```bash
curl http://localhost:8003/api/integration/os/health
```

---

## 🔗 المسارات المتاحة

### Operating System (مباشر):
- http://localhost:8001/health
- http://localhost:8001/status
- http://localhost:8001/services
- http://localhost:8001/resources
- http://localhost:8001/metrics

### Integration (عبر Gateway):
- http://localhost:8003/api/integration/os/health
- http://localhost:8003/api/integration/os/status
- http://localhost:8003/api/integration/os/services
- http://localhost:8003/api/integration/os/resources
- http://localhost:8003/api/integration/os/metrics

### Integration (مباشر عبر Bridge):
- http://localhost:8003/api/integration/os/direct/health
- http://localhost:8003/api/integration/os/direct/status
- http://localhost:8003/api/integration/os/direct/services
- http://localhost:8003/api/integration/os/direct/resources
- http://localhost:8003/api/integration/os/direct/metrics

---

## 🎯 النتيجة المتوقعة

عند نجاح الربط، يجب أن ترى:

```
✅ Operating System API: ✅
✅ Integration API: ✅
✅ Bridge Connection: ✅

🎉 جميع الاختبارات نجحت!
```

---

**جاهز للاستخدام!** 🚀

