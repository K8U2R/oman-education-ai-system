# Domain Layer - طبقة المجال

## 📋 الوصف

طبقة المجال (Domain Layer) هي القلب النابض للنظام وتحتوي على منطق الأعمال الأساسي (Core Business Logic). هذه الطبقة مستقلة تماماً عن أي تقنيات خارجية وتحتوي على الكيانات (Entities)، القيم (Value Objects)، الواجهات (Interfaces)، والاستثناءات (Exceptions) التي تمثل المفاهيم الأساسية في مجال التطبيق.

## 🏗️ الهيكل

```
domain/
├── entities/          # الكيانات
│   ├── User.ts
│   └── OAuthState.ts
├── value-objects/     # كائنات القيمة
│   ├── Email.ts
│   ├── Password.ts
│   ├── OAuthToken.ts
│   └── ...
├── interfaces/        # الواجهات
│   ├── repositories/
│   │   ├── IAuthRepository.ts
│   │   └── IGoogleOAuthRepository.ts
│   └── email/
│       └── IEmailProvider.ts
├── types/            # الأنواع
│   └── auth.types.ts
├── exceptions/       # الاستثناءات
│   ├── AuthExceptions.ts
│   ├── ValidationExceptions.ts
│   └── ...
└── index.ts          # نقطة التصدير الرئيسية
```

## 📦 المكونات

### 1. Entities - الكيانات

**الموقع:** `entities/`

**الوظيفة:**
- تمثيل الكيانات الأساسية في النظام
- تحتوي على الهوية (Identity) والحالة (State)
- منطق الأعمال الأساسي المرتبط بالكيان
- قواعد التحقق من البيانات

**الأقسام:**

#### `entities/User.ts`
- كيان المستخدم الرئيسي
- يحتوي على: id, email, name, role, etc.
- منطق التحقق من بيانات المستخدم
- عمليات تحديث الحالة

#### `entities/OAuthState.ts`
- كيان حالة OAuth
- إدارة State Tokens
- التحقق من الصلاحية

### 2. Value Objects - كائنات القيمة

**الموقع:** `value-objects/`

**الوظيفة:**
- تمثيل القيم التي لا تحتوي على هوية
- Immutable (غير قابلة للتعديل)
- منطق التحقق من القيم
- مقارنة القيم

**الأقسام:**

#### `value-objects/Email.ts`
- كائن قيمة للبريد الإلكتروني
- التحقق من صحة التنسيق
- Normalization (تحويل إلى lowercase)

#### `value-objects/Password.ts`
- كائن قيمة لكلمة المرور
- التحقق من قوة كلمة المرور
- Hashing (يتم في Infrastructure)

#### `value-objects/OAuthToken.ts`
- كائن قيمة لـ OAuth Token
- التحقق من صحة Token
- إدارة صلاحية Token

#### `value-objects/OAuthCode.ts`
- كائن قيمة لـ OAuth Code
- التحقق من صحة Code

#### `value-objects/VerificationToken.ts`
- كائن قيمة لـ Token التحقق
- إدارة صلاحية Token

#### `value-objects/GoogleUserInfo.ts`
- كائن قيمة لمعلومات مستخدم Google
- تحويل من Google Response

### 3. Interfaces - الواجهات

**الموقع:** `interfaces/`

**الوظيفة:**
- تعريف العقود (Contracts) بين الطبقات
- فصل الاهتمامات (Separation of Concerns)
- تسهيل Dependency Injection
- تسهيل الاختبار

**الأقسام:**

#### `interfaces/repositories/`
- **IAuthRepository.ts**: واجهة مستودع المصادقة
- **IGoogleOAuthRepository.ts**: واجهة مستودع Google OAuth

#### `interfaces/email/`
- **IEmailProvider.ts**: واجهة مزود البريد الإلكتروني

### 4. Types - الأنواع

**الموقع:** `types/`

**الوظيفة:**
- تعريف أنواع TypeScript المشتركة
- Union Types, Intersection Types
- Type Aliases

**الأقسام:**

#### `types/auth.types.ts`
- أنواع متعلقة بالمصادقة
- LoginResult, RegisterResult, etc.

### 5. Exceptions - الاستثناءات

**الموقع:** `exceptions/`

**الوظيفة:**
- تعريف استثناءات المجال
- رسائل خطأ واضحة
- تصنيف الأخطاء

**الأقسام:**

#### `exceptions/AuthExceptions.ts`
- استثناءات المصادقة
- InvalidCredentialsException
- UserNotFoundException
- AccountLockedException

#### `exceptions/ValidationExceptions.ts`
- استثناءات التحقق
- InvalidEmailException
- WeakPasswordException

#### `exceptions/OAuthExceptions.ts`
- استثناءات OAuth
- InvalidStateException
- OAuthProviderException

#### `exceptions/EmailExceptions.ts`
- استثناءات البريد الإلكتروني
- EmailSendFailedException
- InvalidEmailTemplateException

#### `exceptions/DatabaseExceptions.ts`
- استثناءات قاعدة البيانات
- DatabaseConnectionException
- QueryExecutionException

#### `exceptions/ConfigurationExceptions.ts`
- استثناءات الإعدادات
- MissingConfigurationException
- InvalidConfigurationException

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. Pure Business Logic
- منطق الأعمال الأساسي فقط
- لا يعتمد على أي تقنيات خارجية
- قابل للاختبار بسهولة

### 2. Domain Entities
- الكيانات الأساسية في النظام
- منطق التحقق من البيانات
- قواعد الأعمال الأساسية

### 3. Value Objects
- كائنات قيمة Immutable
- منطق التحقق من القيم
- مقارنة القيم

### 4. Domain Interfaces
- واجهات تعرف العقود
- لا تحتوي على تنفيذ
- تسهيل Dependency Injection

### 5. Domain Exceptions
- استثناءات المجال
- رسائل خطأ واضحة
- تصنيف الأخطاء

### 6. Domain Types
- أنواع TypeScript المشتركة
- Type Definitions

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Infrastructure Dependencies
- ❌ لا يجب الاعتماد على Database
- ❌ لا يجب الاعتماد على HTTP/Express
- ❌ لا يجب الاعتماد على External APIs
- ✅ يجب أن تكون مستقلة تماماً

### 2. Framework Code
- ❌ لا يجب وجود Express, FastAPI, etc.
- ❌ لا يجب وجود React, Vue, etc.
- ✅ يجب أن تكون Framework-agnostic

### 3. External Libraries
- ❌ لا يجب استخدام مكتبات خارجية (مثل axios, lodash)
- ✅ يمكن استخدام TypeScript فقط

### 4. I/O Operations
- ❌ لا يجب قراءة/كتابة الملفات
- ❌ لا يجب استدعاء APIs
- ❌ لا يجب الوصول إلى Database

### 5. Configuration
- ❌ لا يجب قراءة Environment Variables
- ❌ لا يجب قراءة Configuration Files

### 6. Logging Implementation
- ❌ لا يجب تنفيذ Logging
- ✅ يمكن استخدام Console.log للاختبار فقط

## 🔄 التدفق (Flow)

```
Domain Layer (Pure Business Logic)
    ↑
Application Layer (Uses Domain)
    ↑
Infrastructure Layer (Implements Domain Interfaces)
```

## 📝 أمثلة الاستخدام

### Entity Example
```typescript
// User.ts
export class User {
  private constructor(
    public readonly id: string,
    private _email: Email,
    private _name: string,
    private _role: UserRole
  ) {}

  static create(email: Email, name: string, role: UserRole): User {
    // Validation logic
    return new User(generateId(), email, name, role)
  }

  updateEmail(newEmail: Email): void {
    // Business rule: can't change email if verified
    if (this.isEmailVerified) {
      throw new EmailAlreadyVerifiedException()
    }
    this._email = newEmail
  }
}
```

### Value Object Example
```typescript
// Email.ts
export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Email {
    if (!isValidEmail(email)) {
      throw new InvalidEmailException(email)
    }
    return new Email(email.toLowerCase().trim())
  }

  getValue(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}
```

### Interface Example
```typescript
// IAuthRepository.ts
export interface IAuthRepository {
  findByEmail(email: Email): Promise<User | null>
  save(user: User): Promise<void>
  update(user: User): Promise<void>
}
```

## 🧪 الاختبار

- كل Entity يجب أن يكون له Unit Tests
- كل Value Object يجب أن يكون له Unit Tests
- اختبار جميع قواعد التحقق
- اختبار جميع Business Rules
- لا حاجة لـ Mocks (Pure Logic)

## 📚 المراجع

- Domain-Driven Design by Eric Evans
- Clean Architecture by Robert C. Martin
- Domain Modeling Best Practices

