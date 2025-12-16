# 📖 دليل الإعداد الكامل - نظام التعليم الذكي العُماني

## 🎯 نظرة عامة

هذا الدليل يوضح كيفية إعداد وتشغيل النظام بالكامل من الصفر.

---

## 📋 المتطلبات الأساسية

### البرمجيات المطلوبة

- **Python 3.10+** - للخادم الخلفي
- **Node.js 18+** - للواجهة الأمامية
- **PostgreSQL** - قاعدة البيانات (اختياري)
- **MongoDB** - قاعدة بيانات NoSQL (اختياري)
- **Redis** - التخزين المؤقت (اختياري)
- **Git** - إدارة الإصدارات

### الحسابات المطلوبة (اختياري)

- **Google Cloud Console** - لـ Gemini API و OAuth
- **GitHub** - لـ OAuth (اختياري)
- **Sentry** - لمراقبة الأخطاء (اختياري)

---

## 🚀 خطوات الإعداد

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd oman-education-ai-system
```

### 2. إعداد Python Environment

```bash
# إنشاء بيئة افتراضية
python -m venv .venv

# تفعيل البيئة
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# تثبيت التبعيات
pip install -r requirements.txt
```

### 3. إعداد متغيرات البيئة

#### الطريقة السريعة (موصى به):

```bash
python create_env_files.py
```

هذا السكريبت سينشئ:
- `.env` في المجلد الرئيسي (Backend)
- `.env` في `03-WEB-INTERFACE/frontend` (Frontend)

#### الطريقة اليدوية:

```bash
# Backend
cp .env.example .env
# عدّل القيم في .env

# Frontend
cd 03-WEB-INTERFACE/frontend
cp .env.example .env
# عدّل القيم في .env
```

### 4. إعداد قاعدة البيانات (اختياري)

```bash
# PostgreSQL
createdb oman_ai_db

# أو استخدم Docker
docker-compose up -d postgres
```

### 5. إعداد Frontend

```bash
cd 03-WEB-INTERFACE/frontend

# تثبيت التبعيات
npm install

# التحقق من الإعداد
npm run type-check
```

### 6. تشغيل النظام

#### Terminal 1: Backend

```bash
cd 01-OPERATING-SYSTEM
python -m api_gateway.fastapi_server
```

Backend سيعمل على: `http://localhost:8001`

#### Terminal 2: Frontend

```bash
cd 03-WEB-INTERFACE/frontend
npm run dev
```

Frontend سيعمل على: `http://localhost:3000`

---

## ⚙️ الإعدادات المتقدمة

### إعداد Google OAuth

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. أنشئ مشروع جديد
3. فعّل Google+ API
4. أنشئ OAuth 2.0 credentials
5. أضف Redirect URI: `http://localhost:3000/auth/oauth/google/callback`
6. انسخ Client ID و Client Secret إلى `.env`

### إعداد GitHub OAuth (اختياري)

1. اذهب إلى [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. أنشئ OAuth App جديد
3. أضف Authorization callback URL: `http://localhost:3000/auth/oauth/github/callback`
4. انسخ Client ID و Client Secret إلى `.env`

### إعداد Sentry (اختياري)

1. اذهب إلى [sentry.io](https://sentry.io)
2. أنشئ مشروع جديد
3. اختر React كإطار العمل
4. انسخ DSN
5. أضفه في `03-WEB-INTERFACE/frontend/.env`:
   ```env
   VITE_SENTRY_DSN=your-sentry-dsn-here
   ```

---

## 🧪 الاختبار

### اختبار Backend

```bash
cd 01-OPERATING-SYSTEM
python -m pytest tests/
```

### اختبار Frontend

```bash
cd 03-WEB-INTERFACE/frontend
npm run test
npm run test:e2e
```

---

## 📦 البناء للإنتاج

### Backend

```bash
# لا حاجة لبناء خاص - استخدم Python مباشرة
# أو استخدم Docker
docker build -t oman-ai-backend .
```

### Frontend

```bash
cd 03-WEB-INTERFACE/frontend
npm run build
```

الملفات المبنية ستكون في `dist/`

---

## 🐳 Docker (اختياري)

```bash
# بناء جميع الصور
docker-compose build

# تشغيل النظام
docker-compose up -d

# عرض السجلات
docker-compose logs -f
```

---

## 🔒 الأمان

### في الإنتاج:

1. **غير جميع المفاتيح الافتراضية**:
   - `SECRET_KEY`
   - `JWT_SECRET_KEY`
   - جميع API Keys

2. **استخدم HTTPS**:
   - فعّل SSL/TLS
   - استخدم مفاتيح قوية

3. **راجع CORS**:
   - حدّث `CORS_ORIGINS` في `.env`
   - أزل `localhost` في الإنتاج

4. **فعّل DEBUG=False**:
   - في `.env`: `DEBUG=False`

---

## 📊 المراقبة

### Performance Monitoring

النظام يجمع مقاييس الأداء تلقائياً:
- Web Vitals
- API Response Times
- Component Render Times

### Error Reporting

مع Sentry مفعّل:
- جميع الأخطاء تُسجل تلقائياً
- Session Replay متاح
- Browser Tracing مفعّل

---

## 🆘 حل المشاكل

### Backend لا يعمل

1. تحقق من Python version: `python --version`
2. تحقق من التبعيات: `pip list`
3. تحقق من `.env`: `cat .env`
4. راجع السجلات: `logs/app.log`

### Frontend لا يعمل

1. تحقق من Node version: `node --version`
2. احذف `node_modules` وأعد التثبيت
3. تحقق من `.env`: `cat .env`
4. راجع console للأخطاء

### مشاكل الاتصال

1. تأكد من تشغيل Backend على المنفذ 8001
2. تحقق من `VITE_API_BASE_URL` في frontend `.env`
3. راجع CORS settings في backend

---

## 📚 الموارد الإضافية

- [Frontend README](./03-WEB-INTERFACE/frontend/README.md)
- [Frontend Quick Start](./03-WEB-INTERFACE/frontend/QUICK_START.md)
- [Usage Examples](./03-WEB-INTERFACE/frontend/USAGE_EXAMPLES.md)
- [Improvements](./03-WEB-INTERFACE/frontend/IMPROVEMENTS.md)

---

## ✅ Checklist الإعداد

- [ ] Python 3.10+ مثبت
- [ ] Node.js 18+ مثبت
- [ ] تم استنساخ المشروع
- [ ] تم إنشاء `.env` files
- [ ] تم تثبيت Python dependencies
- [ ] تم تثبيت Node dependencies
- [ ] تم إعداد قاعدة البيانات (اختياري)
- [ ] تم إعداد Google OAuth (اختياري)
- [ ] تم إعداد Sentry (اختياري)
- [ ] Backend يعمل على :8001
- [ ] Frontend يعمل على :3000
- [ ] تم اختبار الاتصال بين Frontend و Backend

---

**آخر تحديث:** 2024-01-15

