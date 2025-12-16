# 🚀 دليل البدء السريع - Quick Start Guide

## 📋 نظرة عامة

هذا الدليل يساعدك على تشغيل النظام بسرعة.

---

## 🎯 الطريقة السريعة (موصى به)

### تشغيل جميع الأنظمة دفعة واحدة:

#### Windows:
```cmd
16-SCRIPTS\02-DEPLOYMENT\start-all-systems.bat
```

#### Linux/Mac:
```bash
./16-SCRIPTS/02-DEPLOYMENT/start-all-systems.sh
```

#### Python (جميع الأنظمة):
```bash
python 16-SCRIPTS/02-DEPLOYMENT/start-all-systems.py
```

---

## 🔍 فحص حالة الأنظمة

### بعد التشغيل، تحقق من الحالة:

```bash
python 16-SCRIPTS/03-MAINTENANCE/check-systems-status.py
```

---

## 🌐 الروابط بعد التشغيل

بعد تشغيل جميع الأنظمة، ستكون متاحة على:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Integration**: http://localhost:8003
- **Operating System**: http://localhost:8001

---

## 🛠️ تشغيل الأنظمة بشكل منفصل

### 1. نظام التشغيل (01-OPERATING-SYSTEM)

```bash
cd 01-OPERATING-SYSTEM
python -m api_gateway.fastapi_server
```

**يعمل على**: http://localhost:8001

### 2. نظام التكامل (02-SYSTEM-INTEGRATION)

```bash
cd 02-SYSTEM-INTEGRATION
python run.py
```

**يعمل على**: http://localhost:8003

### 3. واجهة الويب - Backend (03-WEB-INTERFACE)

```bash
cd 03-WEB-INTERFACE/backend-api
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**يعمل على**: http://localhost:8000

### 4. واجهة الويب - Frontend (03-WEB-INTERFACE)

```bash
cd 03-WEB-INTERFACE/frontend-architecture
npm install
npm start
```

**يعمل على**: http://localhost:3000

---

## 🖥️ تشغيل واجهة سطح المكتب (GUI)

### الطريقة الحالية:

```bash
python main.py
```

**ملاحظة**: إذا لم يكن GUI موجوداً، سيتم تشغيل API Server تلقائياً.

---

## ⚠️ استكشاف الأخطاء

### المشكلة: "No connection could be made"

**السبب**: الأنظمة غير مشغلة

**الحل**:
```bash
# تشغيل جميع الأنظمة
python 16-SCRIPTS/02-DEPLOYMENT/start-all-systems.py
```

### المشكلة: "Port already in use"

**السبب**: منفذ مستخدم بالفعل

**الحل**:
```bash
# Windows: إيقاف العملية على المنفذ
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Linux/Mac: إيقاف العملية
lsof -ti:8001 | xargs kill -9
```

### المشكلة: "Module not found"

**السبب**: التبعيات غير مثبتة

**الحل**:
```bash
# تثبيت التبعيات
pip install -r requirements.txt
```

---

## 📚 المزيد من المعلومات

- 📖 [دليل السكريبتات](./16-SCRIPTS/README.md)
- 📖 [دليل التكامل](./01-OPERATING-SYSTEM/14-DOCUMENTATION/06-INTEGRATION/INTEGRATION_GUIDE.md)
- 📖 [دليل API](./01-OPERATING-SYSTEM/14-DOCUMENTATION/04-GUIDES/QUICK_START.md)

---

**📅 آخر تحديث**: 2025-12-12
