# Domain Layer - طبقة المجال (Frontend)

## 📋 الوصف

طبقة المجال في Frontend تحتوي على الكيانات (Entities)، القيم (Value Objects)، الواجهات (Interfaces)، والأنواع (Types) التي تمثل المفاهيم الأساسية في التطبيق. هذه الطبقة مستقلة عن أي تقنيات خارجية وتحتوي على منطق المجال الأساسي.

## 🏗️ الهيكل

```
domain/
├── entities/          # الكيانات
│   ├── User.ts
│   ├── Lesson.ts
│   └── StorageConnection.ts
├── value-objects/     # كائنات القيمة
│   ├── Email.ts
│   └── Password.ts
├── interfaces/        # الواجهات
│   ├── repositories/
│   └── services/
├── types/            # الأنواع
│   ├── auth.types.ts
│   ├── lesson.types.ts
│   └── notification.types.ts
├── constants/        # الثوابت
│   ├── api.constants.ts
│   └── routes.constants.ts
└── services/         # خدمات المجال
    └── role.service.ts
```

## 📦 المكونات

### 1. Entities - الكيانات

**الموقع:** `entities/`

**الوظيفة:**

- تمثيل الكيانات الأساسية
- منطق التحقق من البيانات
- Business Rules

**الأقسام:**

#### `entities/User.ts`

- كيان المستخدم
- User Info
- User Roles
- User Preferences

#### `entities/Lesson.ts`

- كيان الدرس
- Lesson Content
- Lesson Progress
- Lesson Metadata

#### `entities/StorageConnection.ts`

- كيان اتصال Storage
- Connection Info
- Connection Status
- Storage Type

### 2. Value Objects - كائنات القيمة

**الموقع:** `value-objects/`

**الوظيفة:**

- تمثيل القيم
- Immutable Objects
- Validation Logic

**الأقسام:**

#### `value-objects/Email.ts`

- كائن قيمة للبريد الإلكتروني
- Email Validation
- Email Normalization

#### `value-objects/Password.ts`

- كائن قيمة لكلمة المرور
- Password Validation
- Password Strength

### 3. Interfaces - الواجهات

**الموقع:** `interfaces/`

**الوظيفة:**

- تعريف العقود
- Repository Interfaces
- Service Interfaces

**الأقسام:**

#### `interfaces/repositories/`

- **IAuthRepository.ts**: واجهة مستودع المصادقة
- **ILessonRepository.ts**: واجهة مستودع الدروس
- **INotificationRepository.ts**: واجهة مستودع الإشعارات
- **IStorageRepository.ts**: واجهة مستودع Storage

#### `interfaces/services/`

- Service Interfaces
- Contract Definitions

### 4. Types - الأنواع

**الموقع:** `types/`

**الوظيفة:**

- Type Definitions
- Type Aliases
- Union Types

**الأقسام:**

#### `types/auth.types.ts`

- أنواع المصادقة
- AuthState
- LoginResult
- UserRole

#### `types/lesson.types.ts`

- أنواع الدروس
- LessonStatus
- LessonType
- ProgressData

#### `types/notification.types.ts`

- أنواع الإشعارات
- NotificationType
- NotificationStatus
- NotificationPriority

#### `types/storage.types.ts`

- أنواع Storage
- StorageType
- FileType
- StorageStatus

### 5. Constants - الثوابت

**الموقع:** `constants/`

**الوظيفة:**

- ثوابت التطبيق
- API Endpoints
- Route Paths
- Configuration Constants

**الأقسام:**

#### `constants/api.constants.ts`

- API Endpoints
- API Base URLs
- API Timeouts

#### `constants/routes.constants.ts`

- Route Paths
- Route Names
- Route Parameters

### 6. Services - خدمات المجال

**الموقع:** `services/`

**الوظيفة:**

- Domain Services
- Pure Business Logic
- Domain Calculations

**الأقسام:**

#### `services/role.service.ts`

- خدمة الأدوار
- Role Checks
- Permission Validation
- Role Hierarchy

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. Pure Domain Logic

- منطق المجال الأساسي
- Business Rules
- Domain Calculations

### 2. Domain Entities

- الكيانات الأساسية
- Entity Logic
- Validation Rules

### 3. Value Objects

- Immutable Value Objects
- Value Validation
- Value Comparison

### 4. Domain Interfaces

- Repository Interfaces
- Service Interfaces
- Contract Definitions

### 5. Domain Types

- Type Definitions
- Type Aliases
- Union Types

### 6. Domain Constants

- Application Constants
- Configuration Constants
- Magic Numbers/Strings

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. React-Specific Code

- ❌ لا يجب وجود React Components
- ❌ لا يجب وجود React Hooks
- ✅ يجب أن تكون Framework-agnostic

### 2. UI Logic

- ❌ لا يجب وجود UI Logic
- ❌ لا يجب وجود Styling
- ✅ يجب أن تكون Presentation-agnostic

### 3. API Calls

- ❌ لا يجب استدعاء APIs
- ❌ لا يجب استخدام HTTP Clients
- ✅ يجب أن تكون Network-agnostic

### 4. Browser APIs

- ❌ لا يجب استخدام Browser APIs
- ❌ لا يجب استخدام DOM APIs
- ✅ يجب أن تكون Platform-agnostic

### 5. External Libraries

- ❌ لا يجب استخدام External Libraries (مثل axios)
- ✅ يمكن استخدام TypeScript فقط

### 6. State Management

- ❌ لا يجب وجود State Management Logic
- ✅ يجب أن تكون State-agnostic

## 🔄 التدفق (Flow)

```
Domain Layer (Pure Domain Logic)
    ↑
Application Layer (Uses Domain)
    ↑
Presentation Layer (Uses Domain through Application)
```

## 📝 أمثلة الاستخدام

### Entity Example

```typescript
// User.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly name: string,
    public readonly role: UserRole
  ) {}

  hasPermission(permission: Permission): boolean {
    return roleService.hasPermission(this.role, permission)
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
      throw new InvalidEmailException()
    }
    return new Email(email.toLowerCase())
  }

  getValue(): string {
    return this.value
  }
}
```

### Interface Example

```typescript
// IAuthRepository.ts
export interface IAuthRepository {
  login(email: Email, password: Password): Promise<AuthResult>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
}
```

## 🧪 الاختبار

- كل Entity يجب أن يكون له Unit Tests
- كل Value Object يجب أن يكون له Unit Tests
- اختبار جميع Validation Rules
- اختبار جميع Business Rules
- لا حاجة لـ Mocks (Pure Logic)

## 📚 المراجع

- Domain-Driven Design
- Clean Architecture
- Frontend Domain Modeling
