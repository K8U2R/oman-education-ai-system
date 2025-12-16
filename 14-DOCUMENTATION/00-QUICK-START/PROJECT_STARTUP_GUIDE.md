# 🚀 دليل تشغيل المشروع
# Project Startup Guide

## 📋 المتطلبات

### Backend (Python)
- Python 3.8+
- Virtual Environment (`.venv`)
- Dependencies من `requirements.txt`

### Frontend (Node.js)
- Node.js 18+
- npm أو yarn
- Dependencies من `package.json`

---

## 🔧 الإعداد الأولي

### 1. إعداد Backend

```bash
# إنشاء Virtual Environment (إذا لم يكن موجوداً)
python -m venv .venv

# تفعيل Virtual Environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# تثبيت Dependencies
pip install -r requirements.txt

# إنشاء ملفات .env (إذا لم تكن موجودة)
python create_env_files.py
```

### 2. إعداد Frontend

```bash
cd 03-WEB-INTERFACE/frontend

# تثبيت Dependencies
npm install

# أو باستخدام yarn
yarn install
```

---

## 🚀 تشغيل المشروع

### الطريقة 1: تشغيل منفصل (موصى به للتطوير)

#### Terminal 1: Backend Server
```bash
cd 01-OPERATING-SYSTEM/api_gateway
python -m uvicorn fastapi_server:app --reload --host 0.0.0.0 --port 8000
```

**الوصول:**
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

#### Terminal 2: Frontend Server
```bash
cd 03-WEB-INTERFACE/frontend
npm run dev
```

**الوصول:**
- Frontend: http://localhost:3000 (أو المنفذ المحدد في vite.config)

---

### الطريقة 2: تشغيل تلقائي (Script)

#### Windows (PowerShell)
```powershell
# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 01-OPERATING-SYSTEM/api_gateway; python -m uvicorn fastapi_server:app --reload --host 0.0.0.0 --port 8000"

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 03-WEB-INTERFACE/frontend; npm run dev"
```

#### Linux/Mac (Bash)
```bash
# Backend
gnome-terminal -- bash -c "cd 01-OPERATING-SYSTEM/api_gateway && python -m uvicorn fastapi_server:app --reload --host 0.0.0.0 --port 8000; exec bash"

# Frontend
gnome-terminal -- bash -c "cd 03-WEB-INTERFACE/frontend && npm run dev; exec bash"
```

---

## ✅ التحقق من التشغيل

### Backend
```bash
# اختبار API
curl http://localhost:8000/api/v1/info

# أو في المتصفح
# http://localhost:8000/api/v1/info
```

### Frontend
```bash
# فتح المتصفح على
# http://localhost:3000
```

---

## 🔍 استكشاف الأخطاء

### Backend لا يعمل
1. تحقق من تفعيل Virtual Environment
2. تحقق من تثبيت Dependencies: `pip list`
3. تحقق من المنفذ 8000: `netstat -ano | findstr :8000`
4. تحقق من ملفات .env

### Frontend لا يعمل
1. تحقق من تثبيت Dependencies: `npm list`
2. تحقق من المنفذ 3000: `netstat -ano | findstr :3000`
3. تحقق من ملف `.env` في frontend
4. امسح cache: `npm run clean` أو `rm -rf node_modules/.vite`

---

## 📝 ملاحظات

- Backend يعمل على المنفذ **8000**
- Frontend يعمل على المنفذ **3000** (أو المنفذ المحدد في vite.config)
- في وضع التطوير، كلاهما يعمل مع Hot Reload
- تأكد من أن قاعدة البيانات تعمل (إذا كانت مطلوبة)

---

## 🛑 إيقاف الخدمات

### Backend
- اضغط `Ctrl+C` في Terminal Backend

### Frontend
- اضغط `Ctrl+C` في Terminal Frontend

---

**تاريخ الإنشاء:** $(date)  
**آخر تحديث:** $(date)

