# Presentation Layer - طبقة العرض

## 📋 الوصف

طبقة العرض (Presentation Layer) هي الطبقة الخارجية في Clean Architecture المسؤولة عن التعامل مع HTTP Requests والاستجابات. تحتوي على Routes، Handlers، Middleware، DTOs، و Swagger Documentation التي تتعامل مع واجهة API الخارجية.

## 🏗️ الهيكل

```
presentation/
└── api/
    ├── routes/          # المسارات
    │   ├── auth.routes.ts
    │   ├── health.routes.ts
    │   ├── notification.routes.ts
    │   ├── storage.routes.ts
    │   ├── assessment.routes.ts
    │   ├── project.routes.ts
    │   └── office.routes.ts
    ├── handlers/        # المعالجات
    │   ├── auth.handler.ts
    │   ├── storage.handler.ts
    │   ├── assessment.handler.ts
    │   ├── project.handler.ts
    │   └── office.handler.ts
    ├── middleware/      # البرمجيات الوسطية
    │   ├── auth.middleware.ts
    │   ├── cors.middleware.ts
    │   ├── error.middleware.ts
    │   └── rate-limit.middleware.ts
    ├── dto/            # Data Transfer Objects
    │   ├── auth.dto.ts
    │   └── oauth.dto.ts
    └── swagger/        # التوثيق
        ├── swagger.config.ts
        └── swagger.routes.ts
```

## 📦 المكونات

### 1. Routes - المسارات

**الموقع:** `api/routes/`

**الوظيفة:**
- تعريف مسارات API
- ربط المسارات بالـ Handlers
- إدارة Middleware لكل Route
- Route Groups و Nesting

**الأقسام:**

#### `routes/auth.routes.ts`
- مسارات المصادقة
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- POST /auth/verify-email
- POST /auth/reset-password

#### `routes/health.routes.ts`
- مسارات Health Check
- GET /health
- GET /health/database
- GET /health/email

#### `routes/notification.routes.ts`
- مسارات الإشعارات
- GET /notifications
- POST /notifications/read
- GET /notifications/stats

#### `routes/storage.routes.ts`
- مسارات التخزين السحابي
- GET /storage/providers
- GET /storage/connections
- POST /storage/connections/:id/files/upload
- GET /storage/connections/:id/files
- DELETE /storage/connections/:id/files/:fileId

#### `routes/assessment.routes.ts`
- مسارات التقييمات
- GET /assessments
- GET /assessments/:id
- POST /assessments
- PUT /assessments/:id
- DELETE /assessments/:id
- POST /assessments/:id/submit
- GET /assessments/:id/results

#### `routes/project.routes.ts`
- مسارات المشاريع
- GET /projects
- GET /projects/:id
- POST /projects
- PUT /projects/:id
- DELETE /projects/:id
- GET /projects/:id/progress
- GET /projects/stats

#### `routes/office.routes.ts`
- مسارات توليد ملفات Office
- POST /office/generate
- GET /office/templates

#### `routes/index.ts`
- تصدير جميع المسارات
- تجميع Routes

### 2. Handlers - المعالجات

**الموقع:** `api/handlers/`

**الوظيفة:**
- معالجة HTTP Requests
- استدعاء Use Cases
- تحويل Responses
- Error Handling على مستوى Handler

**الأقسام:**

#### `handlers/auth.handler.ts`
- معالج المصادقة
- handleRegister
- handleLogin
- handleLogout
- handleRefreshToken
- handleVerifyEmail
- handlePasswordReset
- handleOAuthCallback

#### `handlers/storage.handler.ts`
- معالج التخزين السحابي
- getProviders
- getConnections
- uploadFile
- getFiles
- deleteFile

#### `handlers/assessment.handler.ts`
- معالج التقييمات
- getAssessments
- getAssessment
- createAssessment
- updateAssessment
- deleteAssessment
- submitAssessment
- getAssessmentResults

#### `handlers/project.handler.ts`
- معالج المشاريع
- getProjects
- getProject
- createProject
- updateProject
- deleteProject
- getProjectProgress
- getProjectStats

#### `handlers/office.handler.ts`
- معالج توليد ملفات Office
- generateOffice
- getTemplates

### 3. Middleware - البرمجيات الوسطية

**الموقع:** `api/middleware/`

**الوظيفة:**
- معالجة Requests قبل الوصول للـ Handlers
- Authentication & Authorization
- Error Handling
- CORS
- Rate Limiting
- Request Validation

**الأقسام:**

#### `middleware/auth.middleware.ts`
- مصادقة المستخدمين
- التحقق من Tokens
- إضافة User إلى Request
- حماية Routes

#### `middleware/cors.middleware.ts`
- إعداد CORS
- Allowed Origins
- Allowed Methods
- Allowed Headers

#### `middleware/error.middleware.ts`
- معالجة الأخطاء المركزية
- تحويل Exceptions إلى HTTP Responses
- Logging للأخطاء
- Error Formatting

#### `middleware/rate-limit.middleware.ts`
- تحديد معدل الطلبات
- حماية من Abuse
- Rate Limit Headers

#### `middleware/login-rate-limit.middleware.ts`
- تحديد معدل محاولات تسجيل الدخول
- حماية من Brute Force
- Account Locking

### 4. DTOs - Data Transfer Objects

**الموقع:** `api/dto/`

**الوظيفة:**
- تعريف هياكل البيانات للـ API
- Validation Schemas
- Type Safety
- API Contracts

**الأقسام:**

#### `dto/auth.dto.ts`
- DTOs للمصادقة
- RegisterRequest
- LoginRequest
- AuthResponse
- TokenResponse

#### `dto/oauth.dto.ts`
- DTOs لـ OAuth
- OAuthInitiateRequest
- OAuthCallbackRequest
- OAuthResponse

### 5. Swagger - التوثيق

**الموقع:** `api/swagger/`

**الوظيفة:**
- توثيق API
- Interactive API Documentation
- Schema Definitions
- Examples

**الأقسام:**

#### `swagger/swagger.config.ts`
- إعدادات Swagger
- API Info
- Security Definitions
- Tags

#### `swagger/swagger.routes.ts`
- مسار Swagger UI
- GET /api-docs
- JSON Schema Endpoint

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. HTTP-Specific Code
- Express Routes
- Request/Response Handling
- HTTP Status Codes
- HTTP Headers

### 2. Input Validation
- Validation على مستوى API
- Schema Validation (Zod)
- Error Messages للـ Validation

### 3. Error Handling
- تحويل Domain Exceptions إلى HTTP Responses
- Error Formatting
- Error Logging

### 4. Authentication & Authorization
- Token Validation
- Role-based Access Control
- Permission Checks

### 5. API Documentation
- Swagger/OpenAPI Documentation
- API Examples
- Schema Definitions

### 6. CORS & Security
- CORS Configuration
- Security Headers
- Rate Limiting

### 7. Request/Response Transformation
- تحويل Domain Models إلى DTOs
- تحويل DTOs إلى Domain Models
- Response Formatting

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Business Logic
- ❌ لا يجب وجود Business Logic
- ✅ يجب أن يكون في Application Layer

### 2. Database Access
- ❌ لا يجب الوصول مباشرة إلى قاعدة البيانات
- ✅ يجب استخدام Use Cases من Application Layer

### 3. Domain Models
- ❌ لا يجب استخدام Domain Entities مباشرة في Responses
- ✅ يجب استخدام DTOs

### 4. External API Calls
- ❌ لا يجب استدعاء APIs خارجية مباشرة
- ✅ يجب استخدام Services من Application Layer

### 5. Configuration Details
- ❌ لا يجب قراءة Environment Variables مباشرة
- ✅ يجب استخدام Config Managers

### 6. Complex Data Processing
- ❌ لا يجب معالجة بيانات معقدة
- ✅ يجب أن تكون في Application Layer

## 🔄 التدفق (Flow)

```
HTTP Request
    ↓
Routes
    ↓
Middleware (Auth, CORS, Rate Limit)
    ↓
Handlers
    ↓
Use Cases (Application Layer)
    ↓
Services & Repositories
    ↓
Response
```

## 📝 أمثلة الاستخدام

### Route Example
```typescript
// auth.routes.ts
router.post('/register', 
  validateRequest(registerSchema),
  async (req, res, next) => {
    try {
      await authHandler.handleRegister(req, res)
    } catch (error) {
      next(error)
    }
  }
)
```

### Handler Example
```typescript
// auth.handler.ts
export async function handleRegister(
  req: Request,
  res: Response
): Promise<void> {
  const dto = req.body as RegisterRequest
  
  const result = await registerUseCase.execute(
    dto.email,
    dto.password,
    dto.name
  )
  
  res.status(201).json({
    success: true,
    data: {
      user: mapUserToDTO(result.user),
      tokens: result.tokens
    }
  })
}
```

### Middleware Example
```typescript
// auth.middleware.ts
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = extractToken(req)
  
  if (!token) {
    throw new UnauthorizedException('Token missing')
  }
  
  const user = tokenService.verifyToken(token)
  req.user = user
  next()
}
```

### DTO Example
```typescript
// auth.dto.ts
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
})

export type RegisterRequest = z.infer<typeof registerSchema>

export interface AuthResponse {
  user: UserDTO
  tokens: {
    accessToken: string
    refreshToken: string
  }
}
```

## 🧪 الاختبار

- كل Route يجب أن يكون له Integration Tests
- كل Handler يجب أن يكون له Unit Tests
- اختبار Middleware بشكل منفصل
- اختبار Error Scenarios
- اختبار Authentication & Authorization

## 📚 المراجع

- RESTful API Design
- Express.js Best Practices
- API Security Best Practices
- OpenAPI/Swagger Documentation

