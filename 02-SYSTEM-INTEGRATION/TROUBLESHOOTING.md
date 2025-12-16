# 🔧 استكشاف الأخطاء - نظام التكامل

## ❌ المشاكل الشائعة والحلول

### 1. ImportError: attempted relative import with no known parent package

**السبب:** محاولة تشغيل `main.py` مباشرة كـ script

**الحل:**
```bash
# استخدم run.py بدلاً من main.py مباشرة
cd 02-SYSTEM-INTEGRATION
python run.py
```

أو:
```bash
# استخدم uvicorn كوحدة
cd 02-SYSTEM-INTEGRATION/integration-orchestrator
python -m uvicorn main:app --host 0.0.0.0 --port 8003
```

---

### 2. ModuleNotFoundError: No module named 'config'

**السبب:** المسارات غير صحيحة

**الحل:**
```bash
# تأكد من أنك في المجلد الصحيح
cd 02-SYSTEM-INTEGRATION

# استخدم run.py
python run.py
```

---

### 3. Port already in use

**السبب:** المنفذ 8003 مستخدم

**الحل:**
```bash
# غيّر المنفذ في .env
PORT=8004 python run.py
```

أو:
```bash
# أو قم بإيقاف العملية المستخدمة للمنفذ
# Windows:
netstat -ano | findstr :8003
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8003 | xargs kill
```

---

### 4. Cannot connect to 01-OPERATING-SYSTEM

**السبب:** نظام التشغيل غير مشغل

**الحل:**
```bash
# شغّل نظام التشغيل أولاً
cd 01-OPERATING-SYSTEM
python run.py
```

---

### 5. Cannot connect to 03-WEB-INTERFACE

**السبب:** واجهة الويب غير مشغلة

**الحل:**
```bash
# شغّل واجهة الويب أولاً
cd 03-WEB-INTERFACE/backend-api
python app.py
```

---

### 6. pydantic BaseSettings error

**السبب:** إصدار pydantic قديم

**الحل:**
```bash
# قم بتحديث pydantic
pip install pydantic-settings
```

أو:
```bash
# أو استخدم pydantic v1
pip install "pydantic<2.0"
```

---

## ✅ التحقق من الإعدادات

### 1. التحقق من التبعيات

```bash
cd 02-SYSTEM-INTEGRATION
pip install -r requirements.txt
```

### 2. التحقق من ملف .env

```bash
# تأكد من وجود .env
ls .env  # Linux/Mac
dir .env  # Windows

# أو أنشئه من .env.example
cp .env.example .env  # Linux/Mac
copy .env.example .env  # Windows
```

### 3. التحقق من المسارات

```bash
# تأكد من وجود الملفات
ls integration-orchestrator/main.py
ls integration-orchestrator/config.py
ls communication-bridge/message_broker.py
ls system-coordination/dependency_manager.py
```

---

## 🧪 اختبار النظام

### 1. اختبار Config

```bash
cd 02-SYSTEM-INTEGRATION/integration-orchestrator
python -c "from config import settings; print(settings.HOST, settings.PORT)"
```

### 2. اختبار System Connector

```bash
cd 02-SYSTEM-INTEGRATION/integration-orchestrator
python -c "from system_connector import SystemConnector; print('OK')"
```

### 3. اختبار API Gateway

```bash
cd 02-SYSTEM-INTEGRATION/integration-orchestrator
python -c "from api_gateway_manager import ApiGatewayManager; print('OK')"
```

---

## 📞 الحصول على المساعدة

إذا استمرت المشاكل:

1. تحقق من السجلات في `logs/`
2. راجع `README.md` و `START_HERE.md`
3. تحقق من أن جميع الأنظمة المطلوبة تعمل

---

**نتمنى لك تجربة سلسة! 🚀**

