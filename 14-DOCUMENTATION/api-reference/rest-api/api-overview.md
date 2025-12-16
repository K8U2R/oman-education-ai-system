# 🔌 نظرة عامة على REST API

## مقدمة

REST API لنظام التعليم الذكي العُماني يوفر واجهة برمجية موحدة للوصول إلى جميع ميزات النظام.

---

## 🌐 Base URL

```
Production:  https://api.oman-education.ai/v1
Staging:     https://staging-api.oman-education.ai/v1
Development: http://localhost:8000/api/v1
```

---

## 🔐 المصادقة

### JWT Token

جميع الطلبات (عدا تسجيل الدخول والتسجيل) تتطلب token مصادقة:

```http
Authorization: Bearer <your-token>
```

### الحصول على Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**الاستجابة:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

## 📋 نقاط النهاية الرئيسية

### 🔐 المصادقة (Authentication)

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/auth/register` | تسجيل مستخدم جديد |
| POST | `/auth/login` | تسجيل الدخول |
| POST | `/auth/logout` | تسجيل الخروج |
| POST | `/auth/refresh` | تحديث Token |
| GET | `/auth/me` | معلومات المستخدم الحالي |

### 💬 المحادثة (Chat)

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/chat/send` | إرسال رسالة |
| GET | `/chat/history` | تاريخ المحادثة |
| DELETE | `/chat/clear` | مسح المحادثة |

### 🏗️ المشاريع (Projects)

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/projects` | قائمة المشاريع |
| POST | `/projects` | إنشاء مشروع |
| GET | `/projects/{id}` | تفاصيل المشروع |
| PUT | `/projects/{id}` | تحديث المشروع |
| DELETE | `/projects/{id}` | حذف المشروع |

### 💻 توليد الكود (Code Generation)

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/code/generate` | توليد كود |
| POST | `/code/optimize` | تحسين كود |
| POST | `/code/explain` | شرح كود |

---

## 📝 أمثلة الاستخدام

### مثال 1: إرسال رسالة محادثة

```bash
curl -X POST https://api.oman-education.ai/v1/chat/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "كيف أبني موقع ويب؟",
    "context": {}
  }'
```

**الاستجابة:**
```json
{
  "id": "msg_123",
  "role": "assistant",
  "content": "سأساعدك في بناء موقع ويب...",
  "timestamp": "2024-01-22T10:30:00Z"
}
```

### مثال 2: إنشاء مشروع

```bash
curl -X POST https://api.oman-education.ai/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "موقع المطعم",
    "type": "web_app",
    "description": "موقع لمطعم عربي"
  }'
```

### مثال 3: توليد كود

```bash
curl -X POST https://api.oman-education.ai/v1/code/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "description": "دالة لحساب الأرقام الأولية",
    "requirements": ["efficient", "documented"]
  }'
```

---

## ⚠️ معالجة الأخطاء

### رموز الحالة

| الكود | المعنى |
|-------|--------|
| 200 | نجح |
| 201 | تم الإنشاء |
| 400 | طلب خاطئ |
| 401 | غير مصرح |
| 404 | غير موجود |
| 500 | خطأ في الخادم |

### مثال على خطأ

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "البريد الإلكتروني غير صحيح",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

---

## 📊 Rate Limiting

- **المستخدم العادي:** 100 طلب/ساعة
- **المستخدم المميز:** 1000 طلب/ساعة
- **المطور:** 5000 طلب/ساعة

### Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## 📚 المزيد

- [نقاط النهاية الكاملة](rest-endpoints.md)
- [نماذج البيانات](data-models.md)
- [أمثلة متقدمة](advanced-examples.md)

---

**📅 آخر تحديث:** 2024-01-22

