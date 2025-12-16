# 🚀 دليل تشغيل الخادم - Server Start Guide

## ⚠️ ملاحظة مهمة

**`main.py`** يقوم فقط بتهيئة النظام ولا يبدأ FastAPI server.

لبدء الخادم API، يجب تشغيل FastAPI server بشكل منفصل.

---

## 📋 الخطوات

### 1️⃣ تشغيل FastAPI Server (الخادم API)

افتح terminal جديد وقم بتشغيل:

```bash
# الانتقال إلى مجلد المشروع
cd A:\oman-education-ai-system

# تفعيل البيئة الافتراضية (إن وجدت)
.venv\Scripts\Activate.ps1  # Windows PowerShell
# أو
.venv\Scripts\activate.bat  # Windows CMD

# تشغيل FastAPI Server
cd 01-OPERATING-SYSTEM
python -m api_gateway.fastapi_server
```

### 2️⃣ التحقق من عمل الخادم

بعد تشغيل الخادم، يجب أن ترى:

```
🚀 API Server starting on http://0.0.0.0:8001
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001
```

### 3️⃣ اختبار الخادم

افتح المتصفح واذهب إلى:
- **Swagger UI:** http://localhost:8001/docs
- **Health Check:** http://localhost:8001/health
- **API Base:** http://localhost:8001/api/v1

---

## 🔧 حل المشاكل

### المشكلة: `ERR_CONNECTION_REFUSED`

**السبب:** FastAPI server غير مشغل

**الحل:**
1. تأكد من تشغيل `python -m api_gateway.fastapi_server`
2. تأكد من أن المنفذ 8001 غير مستخدم
3. تحقق من وجود أخطاء في terminal

### المشكلة: `ModuleNotFoundError`

**السبب:** المكتبات غير مثبتة

**الحل:**
```bash
cd 01-OPERATING-SYSTEM
pip install -r requirements.txt
```

### المشكلة: `GEMINI_API_KEY not found`

**السبب:** مفتاح API غير موجود

**الحل:**
1. تأكد من وجود ملف `.env` في جذر المشروع
2. أو قم بتشغيل `python create_env_files.py`
3. تأكد من وجود `GEMINI_API_KEY` في `.env`

---

## 📝 ملاحظات

- **`main.py`** = تهيئة النظام فقط (لا يبدأ API server)
- **`api_gateway.fastapi_server`** = يبدأ FastAPI server على المنفذ 8001
- يجب تشغيل FastAPI server في terminal منفصل عن Frontend

---

## ✅ بعد تشغيل الخادم

بعد تشغيل FastAPI server بنجاح:
- ✅ Frontend سيتصل بالخادم على `http://localhost:8001/api/v1`
- ✅ رسائل AI ستعمل
- ✅ جميع الـ API endpoints ستكون متاحة

---

**ملاحظة:** يمكنك تشغيل `main.py` و `fastapi_server` في نفس الوقت في terminal منفصلين.

