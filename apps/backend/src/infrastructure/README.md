# Infrastructure Layer - طبقة البنية التحتية

## 📋 الوصف

طبقة البنية التحتية (Infrastructure Layer) هي الطبقة المسؤولة عن التفاصيل التقنية والتكامل مع الأنظمة الخارجية. تحتوي على Adapters، Repositories، Configuration، Caching، Monitoring، وغيرها من المكونات التقنية التي تدعم عمل الطبقات الأخرى.

## 🏗️ الهيكل

```
infrastructure/
├── adapters/          # المحولات (منظمة حسب المجال)
│   ├── base/         # المحولات الأساسية المشتركة
│   ├── db/           # محولات قاعدة البيانات
│   │   ├── DatabaseCoreAdapter.ts
│   │   └── GoogleOAuthAdapter.ts
│   ├── ai/           # محولات الذكاء الاصطناعي (جاهز للمستقبل)
│   ├── cache/        # محولات التخزين المؤقت
│   └── email/        # محولات البريد الإلكتروني
├── repositories/     # المستودعات
│   ├── base/
│   ├── AuthRepository.ts
│   ├── GoogleOAuthRepository.ts
│   └── ...
├── cache/            # التخزين المؤقت
│   ├── CacheManager.ts
│   └── index.ts
├── config/           # الإعدادات
│   ├── ConfigManager.ts
│   ├── EnvironmentValidator.ts
│   └── GoogleOAuthConfig.ts
├── di/               # Dependency Injection
│   ├── Container.ts
│   ├── ServiceRegistry.ts
│   └── index.ts
├── monitoring/       # المراقبة
│   ├── HealthChecker.ts
│   └── checks/
├── rate-limit/       # تحديد المعدل
│   ├── RateLimitStore.ts
│   └── ...
├── templates/        # القوالب
│   └── email/
└── index.ts          # نقطة التصدير الرئيسية
```

## 📦 المكونات

### 1. Adapters - المحولات

**الموقع:** `adapters/`

**الوظيفة:**
- التكامل مع الأنظمة الخارجية
- تحويل بين Domain Models و External APIs
- إخفاء تفاصيل التكامل الخارجي

**الأقسام:**

#### `adapters/base/`
- **BaseAdapter.ts**: كلاس أساسي مشترك لجميع Adapters
- منطق مشترك مثل Error Handling و Logging

#### `adapters/db/`
- **DatabaseCoreAdapter.ts**: محول قاعدة البيانات
  - التكامل مع Database Core Service
  - تحويل Domain Models إلى Database Queries
- **GoogleOAuthAdapter.ts**: محول Google OAuth
  - التكامل مع Google OAuth API
  - إدارة OAuth Flow

#### `adapters/ai/`
- جاهز لإضافة محولات AI في المستقبل
- مثل: OpenAIAdapter, GrokAdapter, etc.

#### `adapters/cache/`
- **ICacheAdapter.ts**: واجهة Cache
- **MemoryCacheAdapter.ts**: Cache في الذاكرة
- **RedisCacheAdapter.ts**: Cache باستخدام Redis

#### `adapters/email/`
- **IEmailProvider.ts**: واجهة مزود البريد
- **SendGridAdapter.ts**: محول SendGrid
- **SESAdapter.ts**: محول AWS SES
- **ConsoleAdapter.ts**: محول للاختبار (Console)

### 2. Repositories - المستودعات

**الموقع:** `repositories/`

**الوظيفة:**
- تنفيذ واجهات Domain Repositories
- الوصول إلى قاعدة البيانات
- تحويل بين Domain Models و Database Models

**الأقسام:**

#### `repositories/base/`
- **BaseRepository.ts**: كلاس أساسي مشترك
- منطق مشترك للـ CRUD Operations

#### `repositories/AuthRepository.ts`
- مستودع المصادقة
- تنفيذ IAuthRepository
- عمليات User CRUD

#### `repositories/GoogleOAuthRepository.ts`
- مستودع Google OAuth
- تنفيذ IGoogleOAuthRepository
- إدارة حسابات Google

#### `repositories/OAuthStateRepository.ts`
- مستودع OAuth State
- إدارة State Tokens
- دعم Memory و Redis

#### `repositories/OAuthStateRepositoryFactory.ts`
- مصنع OAuth State Repository
- اختيار Storage Type (Memory/Redis)

#### `repositories/FallbackOAuthStateRepository.ts`
- مستودع احتياطي
- Fallback عند فشل Redis

### 3. Cache - التخزين المؤقت

**الموقع:** `cache/`

**الوظيفة:**
- إدارة التخزين المؤقت
- تحسين الأداء
- تقليل الحمل على قاعدة البيانات

**الأقسام:**

#### `cache/CacheManager.ts`
- مدير Cache المركزي
- اختيار Cache Adapter
- إدارة Cache Policies

### 4. Config - الإعدادات

**الموقع:** `config/`

**الوظيفة:**
- إدارة الإعدادات
- قراءة Environment Variables
- التحقق من صحة الإعدادات

**الأقسام:**

#### `config/ConfigManager.ts`
- مدير الإعدادات المركزي
- تحميل الإعدادات
- التحقق من الإعدادات

#### `config/EnvironmentValidator.ts`
- التحقق من Environment Variables
- رسائل خطأ واضحة
- Required vs Optional Variables

#### `config/GoogleOAuthConfig.ts`
- إعدادات Google OAuth
- Client ID, Client Secret, etc.

### 5. Dependency Injection - حقن التبعيات

**الموقع:** `di/`

**الوظيفة:**
- إدارة Dependency Injection Container
- تسجيل الخدمات
- حل التبعيات

**الأقسام:**

#### `di/Container.ts`
- Container الرئيسي
- إدارة Service Registration
- Service Resolution

#### `di/ServiceRegistry.ts`
- تسجيل جميع الخدمات
- Singleton vs Transient
- Factory Functions

### 6. Monitoring - المراقبة

**الموقع:** `monitoring/`

**الوظيفة:**
- مراقبة صحة النظام
- Health Checks
- Metrics Collection

**الأقسام:**

#### `monitoring/HealthChecker.ts`
- فاحص الصحة الرئيسي
- تجميع Health Checks
- Health Status Report

#### `monitoring/checks/`
- **DatabaseHealthCheck.ts**: فحص قاعدة البيانات
- **EmailHealthCheck.ts**: فحص خدمة البريد

### 7. Rate Limiting - تحديد المعدل

**الموقع:** `rate-limit/`

**الوظيفة:**
- تحديد معدل الطلبات
- حماية من Abuse
- دعم Memory و Redis

**الأقسام:**

#### `rate-limit/RateLimitStore.ts`
- مخزن Rate Limit
- واجهة مشتركة

#### `rate-limit/RedisRateLimitStore.ts`
- تنفيذ باستخدام Redis
- مناسب للإنتاج

#### `rate-limit/RateLimitStoreFactory.ts`
- مصنع Rate Limit Store
- اختيار Storage Type

### 8. Templates - القوالب

**الموقع:** `templates/`

**الوظيفة:**
- قوالب البريد الإلكتروني
- Template Engine
- إدارة القوالب

**الأقسام:**

#### `templates/email/template-engine.ts`
- محرك القوالب
- تحويل Templates إلى HTML
- Variable Substitution

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. External Integrations
- التكامل مع APIs خارجية
- التكامل مع قواعد البيانات
- التكامل مع Services خارجية

### 2. Technical Details
- تفاصيل التنفيذ التقني
- Framework-specific Code
- Library-specific Code

### 3. Configuration Management
- قراءة Environment Variables
- إدارة الإعدادات
- التحقق من الإعدادات

### 4. Infrastructure Services
- Caching
- Logging
- Monitoring
- Rate Limiting

### 5. Adapters Implementation
- تنفيذ Domain Interfaces
- تحويل بين Formats
- Error Handling للـ External Calls

### 6. Repository Implementation
- تنفيذ Domain Repository Interfaces
- Database Queries
- Data Mapping

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Business Logic
- ❌ لا يجب وجود Business Logic
- ✅ يجب أن يكون في Application أو Domain Layer

### 2. Domain Models
- ❌ لا يجب تعريف Domain Entities هنا
- ✅ يجب استخدام Domain Models من Domain Layer

### 3. Use Cases
- ❌ لا يجب وجود Use Cases
- ✅ يجب أن تكون في Application Layer

### 4. Presentation Logic
- ❌ لا يجب وجود HTTP Handlers
- ❌ لا يجب وجود Request/Response Processing
- ✅ يجب أن تكون في Presentation Layer

### 5. Domain Rules
- ❌ لا يجب وجود Domain Rules
- ✅ يجب أن تكون في Domain Layer

## 🔄 التدفق (Flow)

```
Application Layer
    ↓ (Uses Interfaces)
Infrastructure Layer (Implements Interfaces)
    ↓ (Calls External Services)
External Systems (Database, APIs, etc.)
```

## 📝 أمثلة الاستخدام

### Adapter Example
```typescript
// DatabaseCoreAdapter.ts
export class DatabaseCoreAdapter implements IDatabaseAdapter {
  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.databaseCoreService.query({
      table: 'users',
      where: { email }
    })
    return result ? this.mapToDomain(result) : null
  }
}
```

### Repository Example
```typescript
// AuthRepository.ts
export class AuthRepository implements IAuthRepository {
  constructor(
    private databaseAdapter: DatabaseCoreAdapter,
    private tokenService: TokenService
  ) {}

  async findByEmail(email: Email): Promise<User | null> {
    const userData = await this.databaseAdapter.findUserByEmail(email.getValue())
    return userData ? User.fromData(userData) : null
  }
}
```

### Cache Example
```typescript
// CacheManager.ts
export class CacheManager {
  async get<T>(key: string): Promise<T | null> {
    return await this.adapter.get<T>(key)
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.adapter.set(key, value, ttl)
  }
}
```

## 🧪 الاختبار

- كل Adapter يجب أن يكون له Integration Tests
- كل Repository يجب أن يكون له Integration Tests
- استخدام Test Doubles للـ External Services
- اختبار Error Handling
- اختبار Timeout Scenarios

## 📚 المراجع

- Clean Architecture by Robert C. Martin
- Adapter Pattern
- Repository Pattern
- Infrastructure Layer Best Practices

