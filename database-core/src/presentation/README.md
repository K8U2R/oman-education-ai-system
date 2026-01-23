# Presentation Layer - طبقة العرض

## نظرة عامة

طبقة العرض تحتوي على API Routes و Handlers و Middleware التي تتعامل مع الطلبات والاستجابات.

## البنية

```
presentation/
├── api/               # API Layer
│   ├── routes/       # API Routes
│   ├── handlers/     # Request Handlers
│   ├── middleware/   # Middleware
│   ├── contracts/    # API Contracts
│   └── validators/   # Request Validators
└── README.md         # هذا الملف
```

## Routes

### database.routes.ts
مسارات API لقاعدة البيانات:
- `POST /api/database/execute` - تنفيذ عملية على قاعدة البيانات
- `GET /api/database/health` - فحص صحة الخدمة

## Handlers

### DatabaseHandler
معالج طلبات قاعدة البيانات. يستخدم DatabaseCoreService لتنفيذ العمليات.

### HealthHandler
معالج طلبات فحص صحة الخدمة.

## Middleware

### error.middleware.ts
معالجة الأخطاء مع دعم UTF-8 للغة العربية.

### validation.middleware.ts
التحقق من صحة البيانات باستخدام Zod.

### logging.middleware.ts
تسجيل جميع الطلبات الواردة.

## Contracts

### DatabaseRequest
عقد Zod للتحقق من طلبات قاعدة البيانات.

## المبادئ

1. **Handlers**: كل Handler مسؤول عن معالجة نوع معين من الطلبات
2. **Middleware**: Middleware للتحقق والتسجيل ومعالجة الأخطاء
3. **Validation**: استخدام Zod للتحقق من البيانات
4. **Error Handling**: معالجة موحدة للأخطاء
