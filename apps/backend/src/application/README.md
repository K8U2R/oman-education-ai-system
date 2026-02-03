# Application Layer - طبقة التطبيق

## 📋 الوصف

طبقة التطبيق (Application Layer) هي الطبقة الوسطى في Clean Architecture التي تحتوي على منطق الأعمال (Business Logic) الخاص بالتطبيق. هذه الطبقة تعمل كوسيط بين طبقة العرض (Presentation) وطبقة المجال (Domain)، وتحتوي على Use Cases و Services التي تنفذ سيناريوهات الاستخدام المحددة.

## 🏗️ الهيكل

```
application/
├── services/          # خدمات التطبيق (منظمة حسب المجال)
│   ├── base/         # الخدمات الأساسية المشتركة
│   ├── auth/         # خدمات المصادقة
│   │   ├── AuthService.ts
│   │   ├── TokenService.ts
│   │   ├── GoogleOAuthService.ts
│   │   └── ...
│   ├── email/        # خدمات البريد الإلكتروني
│   │   └── EmailService.ts
│   ├── storage/      # خدمات التخزين السحابي
│   │   └── StorageService.ts
│   ├── assessment/   # خدمات التقييمات
│   │   └── AssessmentService.ts
│   ├── project/      # خدمات المشاريع
│   │   └── ProjectService.ts
│   └── office/       # خدمات توليد ملفات Office
│       └── OfficeGenerationService.ts
├── use-cases/        # حالات الاستخدام (منظمة حسب المجال)
│   ├── auth/         # حالات استخدام المصادقة
│   │   ├── LoginUseCase.ts
│   │   ├── RegisterUseCase.ts
│   │   ├── VerifyEmailUseCase.ts
│   │   └── ...
│   └── user/         # حالات استخدام المستخدم
│       └── UpdateUserUseCase.ts
└── index.ts          # نقطة التصدير الرئيسية
```

## 📦 المكونات

### 1. Services - الخدمات

**الموقع:** `services/`

**الوظيفة:**
- تنفيذ منطق الأعمال المعقد
- تنسيق العمليات بين Use Cases
- إدارة الحالة المؤقتة (Caching, Rate Limiting)
- التعامل مع الخدمات الخارجية

**الأقسام:**

#### `services/base/`
- **BaseService.ts**: كلاس أساسي مشترك لجميع الخدمات
- يحتوي على منطق مشترك مثل Logging و Error Handling

#### `services/auth/`
- **AuthService.ts**: خدمة المصادقة الرئيسية
  - إدارة عمليات تسجيل الدخول والخروج
  - إدارة الجلسات والتفويض
- **TokenService.ts**: توليد وتحقق من Tokens
  - JWT, Refresh Tokens
  - إدارة صلاحية Tokens
- **GoogleOAuthService.ts**: إدارة OAuth مع Google
  - معالجة Callbacks
  - ربط حسابات Google
- **OAuthStateService.ts**: إدارة OAuth State
  - التحقق من State Tokens
  - حماية ضد CSRF
- **LoginRateLimiter.ts**: تحديد معدل محاولات تسجيل الدخول
  - حماية ضد Brute Force Attacks

#### `services/email/`
- **EmailService.ts**: خدمة إرسال البريد الإلكتروني
  - دعم عدة مزودين (SendGrid, SES)
  - إدارة القوالب والرسائل

#### `services/storage/`
- **StorageService.ts**: خدمة التخزين السحابي
  - إدارة مزودي التخزين (Google Drive, Dropbox, OneDrive)
  - إدارة الاتصالات والملفات
  - عمليات Upload/Download/Delete

#### `services/assessment/`
- **AssessmentService.ts**: خدمة التقييمات
  - إدارة التقييمات (CRUD)
  - إدارة الأسئلة والإجابات
  - تصحيح التقييمات وحساب النتائج

#### `services/project/`
- **ProjectService.ts**: خدمة المشاريع
  - إدارة المشاريع التعليمية (CRUD)
  - تتبع التقدم والمراحل
  - إحصائيات المشاريع

#### `services/office/`
- **OfficeGenerationService.ts**: خدمة توليد ملفات Office
  - توليد Excel, Word, PowerPoint, PDF
  - استخدام AI لتوليد المحتوى
  - إدارة القوالب

### 2. Use Cases - حالات الاستخدام

**الموقع:** `use-cases/`

**الوظيفة:**
- تنفيذ سيناريوهات الاستخدام المحددة
- كل Use Case يمثل عملية واحدة محددة
- التنسيق بين Services و Repositories
- التحقق من القواعد التجارية

**الأقسام:**

#### `use-cases/auth/` - حالات استخدام المصادقة
- **LoginUseCase.ts**: تسجيل الدخول
- **RegisterUseCase.ts**: تسجيل حساب جديد
- **RefreshTokenUseCase.ts**: تجديد Token
- **UpdatePasswordUseCase.ts**: تحديث كلمة المرور
- **SendVerificationEmailUseCase.ts**: إرسال بريد التحقق
- **VerifyEmailUseCase.ts**: التحقق من البريد الإلكتروني
- **RequestPasswordResetUseCase.ts**: طلب إعادة تعيين كلمة المرور
- **ResetPasswordUseCase.ts**: إعادة تعيين كلمة المرور
- **InitiateGoogleOAuthUseCase.ts**: بدء عملية OAuth مع Google
- **HandleGoogleOAuthCallbackUseCase.ts**: معالجة Callback من Google

#### `use-cases/user/` - حالات استخدام المستخدم
- **UpdateUserUseCase.ts**: تحديث معلومات المستخدم

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. Business Logic
- منطق الأعمال الخاص بالتطبيق
- قواعد التحقق من البيانات
- تنسيق العمليات المعقدة

### 2. Use Cases
- حالات استخدام محددة وواضحة
- كل Use Case له مسؤولية واحدة
- سهولة الاختبار والصيانة

### 3. Services
- خدمات قابلة لإعادة الاستخدام
- منطق مشترك بين Use Cases
- إدارة الحالة المؤقتة

### 4. Error Handling
- معالجة الأخطاء بشكل مناسب
- تحويل Domain Exceptions إلى Application Exceptions
- رسائل خطأ واضحة

### 5. Validation
- التحقق من صحة البيانات المدخلة
- استخدام Value Objects من Domain Layer
- رسائل تحقق واضحة

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Database Access
- ❌ لا يجب الوصول مباشرة إلى قاعدة البيانات
- ✅ يجب استخدام Repositories من Infrastructure Layer

### 2. HTTP/Express Specific Code
- ❌ لا يجب وجود Request/Response objects
- ❌ لا يجب وجود Express middleware
- ✅ يجب أن تكون مستقلة عن Framework

### 3. UI Components
- ❌ لا يجب وجود مكونات واجهة المستخدم
- ❌ لا يجب وجود HTML/CSS

### 4. External API Calls
- ❌ لا يجب استدعاء APIs خارجية مباشرة
- ✅ يجب استخدام Adapters من Infrastructure Layer

### 5. Configuration Details
- ❌ لا يجب قراءة Environment Variables مباشرة
- ✅ يجب استخدام Config Managers من Infrastructure Layer

### 6. Logging Implementation
- ❌ لا يجب تنفيذ Logging مباشرة
- ✅ يجب استخدام Logger من Shared Layer

## 🔄 التدفق (Flow)

```
Presentation Layer
    ↓
Application Layer (Use Cases)
    ↓
Domain Layer (Entities, Value Objects)
    ↓
Infrastructure Layer (Repositories, Adapters)
```

## 📝 أمثلة الاستخدام

### Use Case Example
```typescript
// LoginUseCase.ts
export class LoginUseCase {
  constructor(
    private authService: AuthService,
    private rateLimiter: LoginRateLimiter
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    // 1. Rate limiting check
    await this.rateLimiter.checkLimit(email)
    
    // 2. Validate inputs
    const emailVO = Email.create(email)
    const passwordVO = Password.create(password)
    
    // 3. Execute business logic
    return await this.authService.login(emailVO, passwordVO)
  }
}
```

### Service Example
```typescript
// AuthService.ts
export class AuthService extends BaseService {
  constructor(
    private authRepository: IAuthRepository,
    private tokenService: TokenService
  ) {
    super()
  }

  async login(email: Email, password: Password): Promise<LoginResult> {
    // Business logic here
  }
}
```

## 🧪 الاختبار

- كل Use Case يجب أن يكون له Unit Tests
- كل Service يجب أن يكون له Unit Tests
- استخدام Mocks للـ Dependencies
- اختبار جميع السيناريوهات (Success, Failure, Edge Cases)

## 📚 المراجع

- Clean Architecture by Robert C. Martin
- Domain-Driven Design by Eric Evans
- Application Layer Best Practices

