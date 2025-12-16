# 🛠️ دليل إعداد التطوير

## نظرة عامة

هذا الدليل سيساعدك على إعداد بيئة التطوير المحلية لنظام التعليم الذكي العُماني.

---

## 📋 المتطلبات الأساسية

### البرمجيات المطلوبة

- **Python 3.8+** - [تحميل Python](https://www.python.org/downloads/)
- **Node.js 16+** - [تحميل Node.js](https://nodejs.org/)
- **Git** - [تحميل Git](https://git-scm.com/downloads)
- **PostgreSQL 12+** - [تحميل PostgreSQL](https://www.postgresql.org/download/)
- **MongoDB 4.4+** - [تحميل MongoDB](https://www.mongodb.com/try/download/community)
- **Redis 6.0+** - [تحميل Redis](https://redis.io/download)

### الأدوات الموصى بها

- **VS Code** - محرر النصوص
- **Postman** - لاختبار API
- **Docker** - للتطوير المحلي (اختياري)

---

## 🚀 خطوات الإعداد

### 1. استنساخ المشروع

```bash
# استنسخ المستودع
git clone https://github.com/oman-education/ai-system.git
cd ai-system
```

### 2. إعداد Python Environment

```bash
# إنشاء بيئة افتراضية
python -m venv venv

# تفعيل البيئة
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# تثبيت التبعيات
pip install -r requirements.txt
```

### 3. إعداد قاعدة البيانات

#### PostgreSQL

```bash
# إنشاء قاعدة بيانات
createdb oman_education

# أو باستخدام psql
psql -U postgres
CREATE DATABASE oman_education;
```

#### MongoDB

```bash
# تشغيل MongoDB
mongod

# في terminal آخر
mongo
use oman_education
```

#### Redis

```bash
# تشغيل Redis
redis-server
```

### 4. إعداد ملفات التكوين

```bash
# نسخ ملف التكوين
cp .env.example .env

# تعديل .env
# DATABASE_URL=postgresql://user:password@localhost:5432/oman_education
# MONGODB_URL=mongodb://localhost:27017
# REDIS_URL=redis://localhost:6379
```

### 5. إعداد الواجهة الأمامية

```bash
# الانتقال لمجلد الواجهة
cd 03-WEB-INTERFACE/frontend-architecture

# تثبيت التبعيات
npm install

# تشغيل الواجهة
npm start
```

### 6. تشغيل النظام

```bash
# من الجذر
python main.py

# أو تشغيل نظام التشغيل مباشرة
cd 01-OPERATING-SYSTEM
python operating_system.py

# أو تشغيل API
cd 02-SYSTEM-INTEGRATION
python run.py
```

---

## 🧪 الاختبار

### تشغيل الاختبارات

```bash
# جميع الاختبارات
pytest

# اختبارات محددة
pytest tests/test_system_core.py

# مع التغطية
pytest --cov=.
```

---

## 📝 معايير الكود

### التنسيق

```bash
# تنسيق الكود
black .

# فحص الأخطاء
flake8 .

# فحص الأنواع
mypy .
```

---

## 🔧 استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في الاتصال بقاعدة البيانات

```bash
# تحقق من تشغيل PostgreSQL
pg_isready

# تحقق من الاتصال
psql -U postgres -d oman_education
```

#### 2. خطأ في تثبيت التبعيات

```bash
# تحديث pip
pip install --upgrade pip

# إعادة التثبيت
pip install -r requirements.txt --force-reinstall
```

#### 3. مشاكل في المنافذ

```bash
# تحقق من المنافذ المستخدمة
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000
```

---

## 📚 المزيد

- [معايير الكود](../coding-standards/code-style.md)
- [دليل المساهمة](../contribution-guide/contributing.md)
- [دليل الاختبار](../testing-guide/testing-overview.md)

---

**📅 آخر تحديث:** 2024-01-22

