# 🗺️ الخريطة السيادية - PROJECT_MAP.md
**Oman Education AI System - Architectural Sovereignty Map**

> **دستور المشروع المعماري**: هذا الملف يحدد المكان القانوني لكل نوع من الملفات في النظام.  
> **⚠️ أي ملف خارج هذه الخريطة = مخالفة معمارية = يُضاف للقائمة السوداء**

---

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [الطبقات الأساسية (Clean Architecture)](#الطبقات-الأساسية)
3. [حدود الباقات (SaaS Tiers)](#حدود-الباقات-saas-tiers)
4. [القوانين المطبَّقة](#القوانين-المطبقة)
5. [مصفوفة التموضع](#مصفوفة-التموضع)

---

## 🎯 نظرة عامة

### هيكل المشروع الأساسي
```
/root/oman-education-ai-system/
├── backend/src/              ← النظام الخلفي (Backend)
│   ├── domain/               ← الطبقة الأساسية (Core Business Logic)
│   ├── application/          ← حالات الاستخدام (Use Cases)  
│   ├── infrastructure/       ← المحولات الخارجية (Adapters)
│   ├── presentation/         ← واجهات API (Controllers/Routes)
│   ├── modules/              ← الوحدات المستقلة (Feature Modules)
│   ├── core/                 ← النواة المشتركة (AI Kernel, Errors)
│   └── shared/               ← المرافق المشتركة (Utils, Helpers)
├── frontend/src/             ← الواجهة الأمامية (Frontend)
├── .ai_governance/           ← نظام الحوكمة المعمارية
│   ├── MAP/                  ← الخريطة السيادية (هذا الملف)
│   └── LAWS/                 ← القوانين المعمارية
└── tests/                    ← الاختبارات (خارج src/)
```

**إحصائيات المسح**:
- **إجمالي ملفات TypeScript**: 450 ملف
- **الطبقات الرئيسية**: 5 (domain, application, infrastructure, presentation, modules)
- **نطاق الفحص**: `backend/src/`

---

## 🏛️ الطبقات الأساسية (Clean Architecture)

### 1️⃣ Domain Layer (`backend/src/domain/`)
**المسؤولية**: قلب المنطق التجاري، مستقل تماماً عن أي تقنية خارجية

#### الموقع القانوني لكل نوع:

| النوع | المسار القانوني | القانون المطبق | مثال |
|-------|-----------------|----------------|------|
| **Entities** | `domain/entities/` | LAW_01, LAW_05 | `User.ts`, `Notification.ts` |
| **Value Objects** | `domain/value-objects/` | LAW_05 | `Email.ts`, `Password.ts` |
| **Interfaces** | `domain/interfaces/{context}/` | LAW_01 | `interfaces/ai/IAIProvider.ts` |
| **Domain Types** | `domain/types/` + **bounded contexts** | LAW_05, LAW_14 | `types/features/education/` |
| **Exceptions** | `domain/exceptions/` | LAW_05 | `AuthExceptions.ts` |
| **Mappers** | `domain/mappers/` | LAW_05 | `NotificationMapper.ts` |
| **Domain Services** | `domain/services/` | LAW_05 | `role.service.ts` |

#### ✅ قواعد Domain Layer

```typescript
✅ المسموح:
- Pure TypeScript/JavaScript فقط
- No external dependencies (لا مكتبات خارجية)
- Interfaces تُعرِّف contracts (لا تُنفِّذ)
- Business logic نقي 100%

❌ الممنوع:
- ❌ Express, Fastify (presentation concerns)
- ❌ Sequelize, Prisma (infrastructure)
- ❌ أي adapter أو controller
- ❌ ملفات الاختبار (.test.ts) داخل domain/ (يجب أن تكون في tests/)
- ❌ directory اسمه "adapters" داخل interfaces/ (LAW_01 violation - تم إصلاحه ✅)
```

#### 📁 Domain Types - Bounded Contexts (تم إعادة تنظيمه ✅)

```
domain/types/
├── shared/                           ← Cross-cutting concerns فقط (11 ملف)
│   ├── api.types.ts
│   ├── cache.types.ts
│   ├── common.types.ts
│   ├── database.types.ts
│   ├── error.types.ts
│   ├── event.types.ts
│   ├── file.types.ts
│   ├── job.types.ts
│   ├── type-guards.ts
│   ├── validation.types.ts
│   └── utility.types.ts
│
├── features/                         ← 🆕 Bounded Contexts (LAW_05, LAW_14)
│   ├── education/                    ← تعليم (FREE tier base)
│   │   ├── assessment.types.ts
│   │   ├── content-management.types.ts
│   │   ├── learning.types.ts
│   │   └── index.ts
│   ├── productivity/                 ← إنتاجية (PRO tier)
│   │   ├── code-generation.types.ts
│   │   ├── office.types.ts
│   │   └── index.ts
│   ├── project/                      ← مشاريع (PRO tier)
│   │   ├── project.types.ts
│   │   └── index.ts
│   ├── data/                         ← بيانات (Cross-tier utility)
│   │   ├── export-import.types.ts
│   │   ├── report.types.ts
│   │   ├── storage.types.ts
│   │   └── index.ts
│   ├── analytics/                    ← تحليلات (PREMIUM tier)
│   │   ├── analytics.types.ts
│   │   └── index.ts
│   └── index.ts                      ← Main barrel export
│
├── auth/                             ← Authentication context
├── user/                             ← User management context
└── communication/                    ← Communication context (email, websockets)
```

**Status**: ✅ تم التطبيق بنسبة 100% (Phase 3 من DOMAIN_STRUCTURE_REFACTORING)

---

### 2️⃣ Application Layer (`backend/src/application/`)
**المسؤولية**: تنسيق Use Cases وتطبيق قواعد العمل

#### الموقع القانوني:

| النوع | المسار القانوني | القانون المطبق | مثال |
|-------|-----------------|----------------|------|
| **Use Cases** | `application/use-cases/{context}/` | LAW_05 | `use-cases/auth/LoginUseCase.ts` |
| **Application Services** | `application/services/{context}/` | LAW_05 | `services/ai/LessonGeneratorService.ts` |
| **DTOs** | `application/dtos/{context}/` | LAW_05 | `dtos/education/lesson.dto.ts` |
| **Prompts** | `application/prompts/` | LAW_05 | `prompts/lesson.prompts.ts` |
| **Routes** | `application/routes/` | LAW_05 | `routes/oauth.routes.ts` |

#### ⚠️ ملاحظة التحذير:
```diff
⚠️ POTENTIAL VIOLATION:
- application/routes/ ← يجب نقلها إلى presentation/api/routes/
                       (Routes = Presentation concern, not Application)
```

---

### 3️⃣ Infrastructure Layer (`backend/src/infrastructure/`)
**المسؤولية**: تنفيذ الـ Interfaces المُعرَّفة في Domain

#### الموقع القانوني:

| النوع | المسار القانوني | القانون المطبق | مثال |
|-------|-----------------|----------------|------|
| **Database Adapters** | `infrastructure/adapters/db/` | LAW_01 | `DatabaseCoreAdapter.ts` |
| **AI Adapters** | `infrastructure/adapters/ai/` | LAW_01 | `OpenAIAdapter.ts` |
| **Cache Adapters** | `infrastructure/adapters/cache/` | LAW_01 | `RedisAdapter.ts` |
| **Email Adapters** | `infrastructure/adapters/email/` | LAW_01 | `NodemailerAdapter.ts` |
| **Office Adapters** | `infrastructure/adapters/office/` | LAW_01 | `ExcelAdapter.ts` |
| **Configuration** | `infrastructure/config/` | LAW_05 | `config/core/ConfigManager.ts` |
| **Auth** | `infrastructure/auth/` | LAW_05 | `auth/passport.config.ts` |

#### ✅ قواعد Infrastructure

```typescript
✅ المسموح:
- تنفيذ domain/interfaces
- مكتبات خارجية (express, sequelize, redis, openai)
- Adapters pattern
- Configuration management

❌ الممنوع:
- ❌ Domain logic (يجب أن يكون في domain/)
- ❌ Business rules (يجب أن يكون في domain/ أو application/)
- ❌ Direct coupling بين adapters
```

#### 📁 Config Structure (تم إعادة تنظيمه ✅)

```
infrastructure/config/
├── core/
│   └── ConfigManager.ts
├── environment/
│   ├── env.config.ts
│   ├── env.validator.ts
│   └── env.schema.ts
├── oauth/
│   └── google/
│       └── google-oauth.config.ts
├── system/
│   └── structure/
│       ├── endpoints.config.ts
│       └── services.config.ts
└── index.ts (barrel export)

+ Backward compatibility proxies (deprecated, لكن موجودة للدعم)
  ├── env.config.ts (proxy)
  ├── env.validator.ts (proxy)
  ├── GoogleOAuthConfig.ts (proxy)
  └── system-structure.config.ts (proxy)
```

**Status**: ✅ تم التطبيق (Phase 1 من CONFIG_REFACTORING)

---

### 4️⃣ Presentation Layer (`backend/src/presentation/`)
**المسؤولية**: معالجة HTTP requests وعرض الردود

#### الموقع القانوني:

| النوع | المسار القانوني | القانون المطبق | مثال |
|-------|-----------------|----------------|------|
| **API Routes** | `presentation/api/routes/` | LAW_05 | `routes/health.routes.ts` |
| **Controllers** | `presentation/api/controllers/` | LAW_05 | (يجب نقلها من modules/) |
| **Handlers** | `presentation/api/handlers/` | LAW_05 | `handlers/base/BaseHandler.ts` |
| **Middleware** | `presentation/api/middleware/` | LAW_05 | `middleware/auth/authenticate.ts` |
| **Validators** | `presentation/api/validators/` | LAW_05 | (Zod schemas) |

---

### 5️⃣ Modules Layer (`backend/src/modules/`)
**المسؤولية**: وحدات مستقلة feature-based

#### الموقع القانوني:

```
modules/
├── auth/                     ← وحدة المصادقة
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   └── routes/
├── education/                ← وحدة التعليم
│   ├── controllers/
│   ├── services/
│   ├── interfaces/
│   └── dto/
└── {feature}/                ← نمط موحد
    ├── controllers/          ← Presentation-like
    ├── services/             ← Application-like
    ├── dto/                  ← Application DTOs
    └── interfaces/           ← Local interfaces
```

#### ⚠️ تحذير معماري:
```diff
⚠️ DISCUSSION NEEDED:
- modules/ تحتوي على controllers, services, dto
- هذا يخالف Clean Architecture layering
- الاقتراح: دمج modules/ في الطبقات الأساسية أو جعلها vertical slices
```

---

### 6️⃣ Core Layer (`backend/src/core/`)
**المسؤولية**: نواة مشتركة (AI Kernel, Error Handling)

| النوع | المسار القانوني | مثال |
|-------|-----------------|------|
| **AI Kernel** | `core/ai-kernel/` | `dispatcher/`, `intents/`, `skills/` |
| **Errors** | `core/errors/` | `AppError.ts`, `ErrorFactory.ts` |

---

### 7️⃣ Shared Layer (`backend/src/shared/`)
**المسؤولية**: مرافق مشتركة عبر كل الطبقات

| النوع | المسار القانوني | مثال |
|-------|-----------------|------|
| **Utils** | `shared/utils/` | `logger.ts`, `date-utils.ts` |
| **Core** | `shared/core/` | `BaseController.ts` |
| **Constants** | `shared/constants/` | `app.constants.ts` |

---

## 💎 حدود الباقات (SaaS Tiers)

### LAW_14: Package Sovereignty

كل ميزة يجب أن تُحدد لأي tier تنتمي، وأين يجب وضع منطقها:

| Tier | Features | Domain Types Location | Service Location |
|------|----------|----------------------|------------------|
| **FREE** 🆓 | Assessment، Basic Learning | `domain/types/features/education/` | `modules/education/services/` |
| **PRO** ⭐ | Code Generation, Office, Projects | `domain/types/features/productivity/`, `features/project/` | `application/services/ai/`, `infrastructure/adapters/office/` |
| **PREMIUM** 💎 | Analytics, Advanced AI | `domain/types/features/analytics/` | `application/services/ai/` (premium tier) |

### 🛡️ Tier Enforcement Points

```typescript
// المسار القانوني لفحص الباقة
presentation/api/middleware/subscription/
├── tier-guard.middleware.ts          ← فحص tier قبل السماح بالوصول
├── feature-gate.middleware.ts        ← تفعيل/تعطيل features حسب tier
└── usage-limit.middleware.ts         ← حدود الاستخدام حسب tier
```

**Status**: ⚠️ **TO BE IMPLEMENTED** (في الطريق)

---

## ⚖️ القوانين المطبَّقة

### LAW_01: Dependency Inversion
```
✅ Domain يُعرِّف interfaces
✅ Infrastructure يُنفِّذ interfaces
❌ Domain لا يعرف شيئاً عن infrastructure
```

**Violations Fixed**:
- ✅ `domain/interfaces/adapters/` → Deleted (Phase 1 - DOMAIN_STRUCTURE_REFACTORING)

### LAW_05: Single Responsibility
```
✅ كل directory له مسؤولية واحدة
✅ Bounded contexts لكل feature domain
❌ لا "dumping grounds" (مثل shared/ قديماً)
```

**Violations Fixed**:
- ✅ `domain/types/shared/` → Decomposed into `features/` (Phase 3)
- ✅ Test files → Moved to `tests/unit/` (Phase 2)

### LAW_14: Package Sovereignty
```
✅ كل tier له features محددة
✅ Clear boundaries بين FREE/PRO/PREMIUM
⚠️ Enforcement middleware مطلوب (قيد التطوير)
```

**Current Status**: Structure ready, enforcement pending

---

## 📊 مصفوفة التموضع

### Decision Tree: أين أضع الكود؟

```
هل الكود يحتوي على business logic نقي؟
├─ نعم → domain/
│  ├─ Entity? → domain/entities/
│  ├─ Value Object? → domain/value-objects/
│  ├─ Type? → domain/types/
│  │  ├─ Feature-specific? → domain/types/features/{context}/
│  │  └─ Cross-cutting? → domain/types/shared/
│  └─ Interface? → domain/interfaces/{context}/
│
├─ لا، Use Case أو orchestration؟
│  └─ نعم → application/
│     ├─ Use Case? → application/use-cases/{context}/
│     ├─ Service? → application/services/{context}/
│     └─ DTO? → application/dtos/{context}/
│
├─ لا، تفاعل مع external system؟
│  └─ نعم → infrastructure/
│     ├─ Database? → infrastructure/adapters/db/
│     ├─ API? → infrastructure/adapters/{api-name}/
│     └─ Config? → infrastructure/config/
│
└─ لا، HTTP request/response؟
   └─ نعم → presentation/
      ├─ Route? → presentation/api/routes/
      ├─ Middleware? → presentation/api/middleware/
      └─ Handler? → presentation/api/handlers/
```

---

## 🚨 بروتوكول "المطابقة أو الرفض"

### قبل إنشاء أي ملف جديد:

1. **✅ راجع الخريطة**: هل المسار موجود في PROJECT_MAP.md؟
2. **⚖️ تحقق من القانون**: أي LAW ينطبق؟
3. **🎯 حدد الـ Tier**: FREE, PRO, أم PREMIUM؟
4. **📍 ضع في المكان الصحيح**: حسب decision tree

### إذا طُلب منك وضع ملف في مكان مخالف:

```
⚠️ تحذير حوكمة (Governance Warning)

الملف: {filename}
المسار المطلوب: {requested_path}
المسار الصحيح: {correct_path}
القانون المخالف: {law_violated}

❌ هذا سيضع الملف في القائمة السوداء (BLACKLIST.md)
✅ الاقتراح: {suggested_solution}
```

---

## 📝 ملاحظات الصيانة

### حالة الهيكل الحالي
- ✅ **Domain Layer**: نظيف 100% (بعد DOMAIN_STRUCTURE_REFACTORING)
- ✅ **Infrastructure Config**: منظم (بعد CONFIG_REFACTORING)
- ⚠️ **Modules**: يحتاج مراجعة (possible vertical slice refactor)
- ⚠️ **Application routes**: يجب نقلها إلى presentation/
- ❌ **Tier Enforcement**: غير مُطبَّق بعد (TODO)

### التحديثات الأخيرة
- **2026-02-01**: Domain refactoring complete (3 phases)
- **2026-01-27**: Config reorganization
- **2026-02-01**: تأسيس نظام الحوكمة المعمارية

---

## 🎯 الخطوات التالية

1. **Immediate**: استكمال BLACKLIST.md بالمخالفات الحالية
2. **Short-term**: تطبيق tier enforcement middleware
3. **Mid-term**: إعادة تنظيم modules/ layer
4. **Long-term**: Automated compliance checker (CI/CD integration)

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-01  
**Guardian**: Antigravity AI  
**Status**: 🟢 Active Governance
