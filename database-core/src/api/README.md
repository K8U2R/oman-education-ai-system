# API Layer - طبقة API (Database Core)

## 📋 الوصف

طبقة API في Database Core Service هي الطبقة المسؤولة عن التعامل مع HTTP Requests والاستجابات. تحتوي على Routes، Middleware، و Contracts التي تتعامل مع واجهة API الخارجية للخدمة.

## 🏗️ الهيكل

```
api/
├── routes/            # المسارات
│   └── database.routes.ts
├── middleware/       # البرمجيات الوسطية
│   └── error.middleware.ts
└── contracts/        # العقود
    ├── DatabaseRequest.ts
    └── DatabaseResponse.ts
```

## 📦 المكونات

### 1. Routes - المسارات

**الموقع:** `routes/`

**الوظيفة:**
- تعريف مسارات API
- ربط المسارات بالـ Handlers
- إدارة Middleware

**الأقسام:**

#### `routes/database.routes.ts`
- مسارات قاعدة البيانات
- POST /database/query
- POST /database/execute
- GET /database/health
- Route Handlers
- Request Validation

### 2. Middleware - البرمجيات الوسطية

**الموقع:** `middleware/`

**الوظيفة:**
- معالجة Requests قبل الوصول للـ Handlers
- Error Handling
- Request Validation
- Logging

**الأقسام:**

#### `middleware/error.middleware.ts`
- معالجة الأخطاء المركزية
- تحويل Exceptions إلى HTTP Responses
- Error Formatting
- Error Logging

### 3. Contracts - العقود

**الموقع:** `contracts/`

**الوظيفة:**
- تعريف هياكل البيانات للـ API
- Request/Response Types
- API Contracts
- Validation Schemas

**الأقسام:**

#### `contracts/DatabaseRequest.ts`
- أنواع الطلبات
- Query Request
- Execute Request
- Request Validation

#### `contracts/DatabaseResponse.ts`
- أنواع الاستجابات
- Query Response
- Execute Response
- Error Response

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. HTTP-Specific Code
- Express Routes
- Request/Response Handling
- HTTP Status Codes
- HTTP Headers

### 2. Input Validation
- Validation على مستوى API
- Schema Validation
- Error Messages

### 3. Error Handling
- تحويل Domain Exceptions إلى HTTP Responses
- Error Formatting
- Error Logging

### 4. API Contracts
- Request/Response Types
- API Documentation
- Schema Definitions

### 5. Request/Response Transformation
- تحويل Domain Models إلى DTOs
- تحويل DTOs إلى Domain Models
- Response Formatting

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Business Logic
- ❌ لا يجب وجود Business Logic
- ✅ يجب أن يكون في Application Layer

### 2. Database Access
- ❌ لا يجب الوصول مباشرة إلى قاعدة البيانات
- ✅ يجب استخدام Services من Application Layer

### 3. Domain Models
- ❌ لا يجب استخدام Domain Entities مباشرة في Responses
- ✅ يجب استخدام DTOs

### 4. Complex Data Processing
- ❌ لا يجب معالجة بيانات معقدة
- ✅ يجب أن تكون في Application Layer

## 🔄 التدفق (Flow)

```
HTTP Request
    ↓
Routes
    ↓
Middleware
    ↓
Application Layer (Services)
    ↓
Response
```

## 📝 أمثلة الاستخدام

### Route Example
```typescript
// database.routes.ts
router.post('/query',
  validateRequest(querySchema),
  async (req, res, next) => {
    try {
      const result = await databaseService.query(req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
)
```

## 🧪 الاختبار

- كل Route يجب أن يكون له Integration Tests
- اختبار Error Scenarios
- اختبار Request Validation

## 📚 المراجع

- RESTful API Design
- Express.js Best Practices
- API Security Best Practices

