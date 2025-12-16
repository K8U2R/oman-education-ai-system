# ⚡ دليل البدء السريع - نظام التكامل

## 🚀 التشغيل السريع

### الطريقة 1: استخدام run.py (موصى به)

#### Windows:
```bash
cd 02-SYSTEM-INTEGRATION
python run.py
```

#### Linux/Mac:
```bash
cd 02-SYSTEM-INTEGRATION
python3 run.py
```

### الطريقة 2: استخدام start.bat / start.sh

#### Windows:
```bash
cd 02-SYSTEM-INTEGRATION
start.bat
```

#### Linux/Mac:
```bash
cd 02-SYSTEM-INTEGRATION
chmod +x start.sh
./start.sh
```

### الطريقة 3: من مجلد integration-orchestrator

```bash
cd 02-SYSTEM-INTEGRATION/integration-orchestrator
python -m uvicorn main:app --host 0.0.0.0 --port 8003 --reload
```

---

## ✅ التحقق من التشغيل

بعد التشغيل، افتح المتصفح على:

- **الصفحة الرئيسية:** http://localhost:8003
- **فحص الصحة:** http://localhost:8003/health
- **حالة التكامل:** http://localhost:8003/api/integration/status
- **API Documentation:** http://localhost:8003/docs

---

## 🔧 إصلاح المشاكل

### مشكلة: ImportError

إذا واجهت خطأ في الاستيراد:

```bash
# تأكد من أنك في المجلد الصحيح
cd 02-SYSTEM-INTEGRATION

# استخدم run.py بدلاً من main.py مباشرة
python run.py
```

### مشكلة: Port مستخدم

إذا كان المنفذ 8003 مستخدم:

```bash
# غيّر المنفذ في .env
PORT=8004 python run.py
```

---

## 📊 API Endpoints

### الصفحة الرئيسية
```
GET /
```

### فحص الصحة
```
GET /health
```

### حالة التكامل
```
GET /api/integration/status
```

### جميع المسارات
```
GET /api/integration/routes
```

### الإحصائيات
```
GET /api/integration/stats
```

---

**استمتع باستخدام نظام التكامل! 🚀**

