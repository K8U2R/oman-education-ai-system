# 📡 دليل API Endpoints - API Endpoints Guide

## 🎉 API Server يعمل بنجاح!

**URL**: http://192.168.9.103:8001/

---

## 📋 الصفحة الرئيسية

### GET `/`
الصفحة الرئيسية - معلومات عامة عن الـ API

**الاستجابة**:
```json
{
  "name": "Oman Education AI - Operating System API",
  "version": "1.0.0",
  "status": "running",
  "description": "نظام تشغيل متكامل ومتقدم...",
  "endpoints": {
    "docs": "/docs",
    "redoc": "/redoc",
    "health": "/api/v1/system/health",
    "websocket": {
      "system_status": "/ws/system-status",
      "monitoring": "/ws/monitoring",
      "events": "/ws/events"
    }
  },
  "timestamp": "2025-12-12T..."
}
```

---

## 🔍 معلومات API

### GET `/api/v1/info`
معلومات شاملة عن الـ API

**الاستجابة**:
```json
{
  "name": "Oman Education AI - Operating System API",
  "version": "1.0.0",
  "endpoints": {
    "system": {...},
    "monitoring": {...},
    "services": {...},
    "websocket": {...}
  }
}
```

### GET `/api/v1/version`
معلومات الإصدار

**الاستجابة**:
```json
{
  "version": "1.0.0",
  "api_version": "v1",
  "release_date": "2025-12-12",
  "status": "stable"
}
```

---

## 🏥 System Endpoints

### GET `/api/v1/system/status`
حالة النظام الكاملة

### GET `/api/v1/system/health`
فحص صحة النظام

### POST `/api/v1/system/shutdown`
إيقاف النظام

---

## 📊 Monitoring Endpoints

### GET `/api/v1/monitoring/health`
فحص صحة المراقبة

### GET `/api/v1/monitoring/performance`
مقاييس الأداء

### GET `/api/v1/monitoring/resources`
استخدام الموارد

---

## ⚙️ Services Endpoints

### GET `/api/v1/services/list`
قائمة جميع الخدمات

### POST `/api/v1/services/start/{service_name}`
بدء خدمة معينة

### POST `/api/v1/services/stop/{service_name}`
إيقاف خدمة معينة

---

## 🔌 WebSocket Endpoints

### `/ws/system-status`
تحديثات حالة النظام في الوقت الحقيقي

### `/ws/monitoring`
مقاييس المراقبة في الوقت الحقيقي

### `/ws/events`
أحداث النظام في الوقت الحقيقي

---

## 📚 الوثائق

- **Swagger UI**: http://192.168.9.103:8001/docs
- **ReDoc**: http://192.168.9.103:8001/redoc

---

## 🧪 أمثلة الاستخدام

### من المتصفح:
```
http://192.168.9.103:8001/
http://192.168.9.103:8001/api/v1/info
http://192.168.9.103:8001/api/v1/system/health
http://192.168.9.103:8001/docs
```

### من Terminal (curl):
```bash
# الصفحة الرئيسية
curl http://192.168.9.103:8001/

# معلومات API
curl http://192.168.9.103:8001/api/v1/info

# Health Check
curl http://192.168.9.103:8001/api/v1/system/health

# Status
curl http://192.168.9.103:8001/api/v1/system/status
```

### من Python:
```python
import requests

# الصفحة الرئيسية
response = requests.get("http://192.168.9.103:8001/")
print(response.json())

# Health Check
response = requests.get("http://192.168.9.103:8001/api/v1/system/health")
print(response.json())
```

---

## ✅ الحالة

- ✅ **API Server**: يعمل على http://192.168.9.103:8001
- ✅ **جميع الـ Endpoints**: جاهزة للاستخدام
- ✅ **الوثائق**: متاحة على /docs
- ✅ **WebSocket**: جاهز للاتصال

---

**📅 آخر تحديث**: 2025-12-12

