# 🚀 دليل تشغيل النظام الكامل

## 📋 نظرة عامة

هذا الدليل يوضح كيفية تشغيل جميع أنظمة المشروع معاً لتجربة موقع الويب الكامل.

---

## ⚡ الطريقة السريعة (موصى بها)

### Windows:
```bash
start-all-systems.bat
```

### Linux/Mac:
```bash
chmod +x start-all-systems.sh
./start-all-systems.sh
```

### Python مباشرة:
```bash
python start-all-systems.py
```

---

## 🔧 الطريقة اليدوية (خطوة بخطوة)

### المتطلبات

1. **Python 3.8+** مثبت
2. **Node.js 16+** مثبت
3. **التبعيات** مثبتة:
   ```bash
   pip install -r requirements.txt
   ```

---

### الخطوة 1: تشغيل نظام التشغيل

افتح **Terminal 1**:

```bash
cd 01-OPERATING-SYSTEM
python api_server.py
```

**النتيجة:** ✅ http://localhost:8003

---

### الخطوة 2: تشغيل نظام التكامل

افتح **Terminal 2**:

```bash
cd 02-SYSTEM-INTEGRATION/integration-orchestrator
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

**النتيجة:** ✅ http://localhost:8001

---

### الخطوة 3: تشغيل Backend API

افتح **Terminal 3**:

```bash
cd 03-WEB-INTERFACE/backend-api
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**النتيجة:** 
- ✅ API: http://localhost:8000
- ✅ Docs: http://localhost:8000/docs

---

### الخطوة 4: تشغيل Frontend

افتح **Terminal 4**:

```bash
cd 03-WEB-INTERFACE/frontend-architecture

# إذا لم يتم تثبيت التبعيات
npm install --legacy-peer-deps

# تشغيل Frontend
npm start
```

**النتيجة:** ✅ http://localhost:3000

---

## 🌐 الروابط بعد التشغيل

| الخدمة | الرابط | الوصف |
|--------|--------|-------|
| 🎨 **Frontend** | http://localhost:3000 | واجهة المستخدم الرئيسية |
| 🔌 **Backend API** | http://localhost:8000 | واجهة برمجة التطبيقات |
| 📚 **API Docs** | http://localhost:8000/docs | توثيق API التفاعلي |
| 🔗 **Integration** | http://localhost:8001 | نظام التكامل |
| ⚙️ **Operating System** | http://localhost:8003 | نظام التشغيل |

---

## ✅ التحقق من الحالة

بعد تشغيل جميع الأنظمة، استخدم:

```bash
python check-systems-status.py
```

سيظهر لك حالة كل نظام.

---

## 🎯 تجربة الموقع

### 1. افتح المتصفح
اذهب إلى: **http://localhost:3000**

### 2. استكشف الميزات
- ✅ الصفحة الرئيسية
- ✅ المحادثة الذكية
- ✅ بناء المشاريع
- ✅ توليد الكود
- ✅ استوديو التصميم

### 3. جرب API
- ✅ افتح: http://localhost:8000/docs
- ✅ جرب الطلبات المختلفة
- ✅ راجع التوثيق

---

## 🐛 حل المشاكل

### مشكلة: Port مستخدم

**Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:8000 | xargs kill -9
```

### مشكلة: Frontend لا يعمل

```bash
cd 03-WEB-INTERFACE/frontend-architecture
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm start
```

### مشكلة: Backend لا يعمل

```bash
cd 03-WEB-INTERFACE/backend-api
pip install -r requirements.txt
python -m uvicorn app:app --reload
```

### مشكلة: ModuleNotFoundError

```bash
# تثبيت جميع التبعيات
pip install -r requirements.txt

# التأكد من Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

---

## 🛑 إيقاف الأنظمة

### الطريقة السريعة:
اضغط `Ctrl+C` في كل terminal

### Windows:
```bash
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

### Linux/Mac:
```bash
pkill -f "python.*uvicorn"
pkill -f "node.*react"
```

---

## 📊 ترتيب التشغيل الموصى به

1. ✅ **نظام التشغيل** أولاً (الأساس)
2. ✅ **نظام التكامل** ثانياً (يربط الأنظمة)
3. ✅ **Backend API** ثالثاً (الخدمات)
4. ✅ **Frontend** أخيراً (الواجهة)

---

## 💡 نصائح

- ✅ اترك جميع Terminals مفتوحة
- ✅ راجع السجلات (Logs) في كل Terminal
- ✅ استخدم `check-systems-status.py` للتحقق
- ✅ افتح API Docs لاستكشاف الواجهات

---

## 🎉 جاهز!

بعد تشغيل جميع الأنظمة:

1. ✅ افتح http://localhost:3000
2. ✅ استمتع بالنظام!
3. ✅ جرب جميع الميزات

---

**📅 آخر تحديث:** 2024-01-22  
**🚀 استمتع بالنظام!**

