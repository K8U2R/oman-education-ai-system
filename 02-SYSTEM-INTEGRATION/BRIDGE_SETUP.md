# 🔗 إعداد نظام الربط

## 🎯 الهدف

ربط `01-OPERATING-SYSTEM` مع `02-SYSTEM-INTEGRATION` بشكل كامل.

---

## 📋 الخطوات

### 1. تشغيل API Server لـ Operating System

```bash
cd 01-OPERATING-SYSTEM
python run_api.py
```

سيعمل على: **http://localhost:8001**

---

### 2. تشغيل Integration System

```bash
cd 02-SYSTEM-INTEGRATION
python run.py
```

سيعمل على: **http://localhost:8003**

---

### 3. التحقق من الربط

#### فحص صحة Integration:
```bash
curl http://localhost:8003/health
```

#### فحص حالة التكامل:
```bash
curl http://localhost:8003/api/integration/status
```

#### الوصول لـ Operating System عبر Integration:
```bash
curl http://localhost:8003/api/integration/os/health
curl http://localhost:8003/api/integration/os/status
curl http://localhost:8003/api/integration/os/services
curl http://localhost:8003/api/integration/os/resources
curl http://localhost:8003/api/integration/os/metrics
```

---

## 🔗 المسارات المتاحة

### Operating System API (مباشر):
- `GET /` - الصفحة الرئيسية
- `GET /health` - فحص الصحة
- `GET /status` - حالة النظام
- `GET /services` - قائمة الخدمات
- `GET /resources` - معلومات الموارد
- `GET /metrics` - المقاييس
- `POST /control/start` - بدء النظام
- `POST /control/stop` - إيقاف النظام

### Integration API (عبر Gateway):
- `GET /api/integration/os/health` → Operating System `/health`
- `GET /api/integration/os/status` → Operating System `/status`
- `GET /api/integration/os/services` → Operating System `/services`
- `GET /api/integration/os/resources` → Operating System `/resources`
- `GET /api/integration/os/metrics` → Operating System `/metrics`

---

## ✅ الحالة

- ✅ **API Server** - جاهز في `01-OPERATING-SYSTEM/api_server.py`
- ✅ **System Connector** - جاهز في `02-SYSTEM-INTEGRATION`
- ✅ **API Gateway** - جاهز ومسجل المسارات
- ✅ **Proxy Routes** - جاهزة للاستخدام

**النظام جاهز للربط!** 🚀

