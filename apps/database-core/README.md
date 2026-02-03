# 🗄️ Database Core Service

**الإصدار:** 2.0.0  
**الحالة:** ✅ مكتمل (Core Features + Advanced Features)

---

## 📋 نظرة عامة

Database Core Service هو نظام قاعدة بيانات احترافي مبني على Clean Architecture و Domain-Driven Design (DDD). يوفر طبقة حوكمة متقدمة مع:

- ✅ **Clean Architecture**: فصل واضح بين الطبقات
- ✅ **TypeScript Strict Mode**: Full Type Coverage
- ✅ **Domain-Driven Design**: Entities و Value Objects
- ✅ **Multiple Database Support**: Supabase, PostgreSQL, وأكثر
- ✅ **Connection Management**: إدارة اتصالات متعددة
- ✅ **Health Monitoring**: مراقبة صحة الاتصالات
- ✅ **Routing Strategies**: استراتيجيات توجيه متقدمة
- ✅ **Policy Engine**: نظام صلاحيات متقدم مع Integration
- ✅ **Transaction Support**: دعم المعاملات
- ✅ **Error Handling**: Custom Exceptions منظمة
- ✅ **Audit Logging**: تسجيل شامل للعمليات
- ✅ **Validation**: Zod للتحقق من البيانات
- ✅ **Caching**: نظام تخزين مؤقت متقدم
- ✅ **Performance Monitoring**: مراقبة الأداء
- ✅ **Rate Limiting**: تحديد معدل الطلبات
- ✅ **Security Headers**: رؤوس أمان متقدمة

---

## 🏗️ البنية المعمارية

```
database-core/
├── src/
│   ├── domain/           # Domain Layer (Core Business Logic)
│   ├── application/      # Application Layer (Use Cases)
│   ├── infrastructure/    # Infrastructure Layer (Adapters)
│   ├── presentation/      # Presentation Layer (API)
│   └── shared/           # Shared Code
├── tests/                # Tests
└── docs/                 # Documentation
```

### Domain Layer
- **Entities**: DatabaseOperation, QueryResult, AuditLog
- **Value Objects**: OperationType, QueryCondition, QueryOptions, Actor
- **Interfaces**: 
  - IDatabaseAdapter
  - IPolicyEngine
  - IAuditLogger
  - IDatabaseConnectionManager
  - IDatabaseRouter
  - IAuthenticationClient
  - ITransactionManager
- **Exceptions**: DatabaseException, PermissionDeniedException, QueryException, ValidationException
- **Types & Constants**: Types و Constants منظمة

### Application Layer
- **Use Cases**: FindRecordsUseCase, InsertRecordUseCase, UpdateRecordUseCase, DeleteRecordUseCase, CountRecordsUseCase
- **Services**: 
  - DatabaseCoreService
  - PolicyService (مع Integration)
  - QueryOptimizerService
  - PerformanceMonitorService
- **DTOs**: DatabaseRequest, DatabaseResponse

### Infrastructure Layer
- **Adapters**: 
  - SupabaseAdapter (External)
  - PostgreSQLAdapter (Internal)
  - DatabaseAdapterFactory
  - DatabaseConnectionManager
  - DatabaseRouter
- **Policy Engine**: PolicyEngine (يطبق IPolicyEngine)
- **Audit Logger**: AuditLogger (يطبق IAuditLogger)
- **Clients**: AuthenticationClient
- **Transactions**: TransactionManager
- **Cache**: CacheManager, MemoryCache

### Presentation Layer
- **Routes**: database.routes.ts
- **Handlers**: DatabaseHandler, HealthHandler
- **Middleware**: error.middleware.ts, validation.middleware.ts, logging.middleware.ts

---

## 🚀 البدء السريع

### التثبيت

```bash
npm install
```

### الإعداد

1. انسخ `.env.example` إلى `.env`
2. املأ المتغيرات البيئية:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   PORT=3001
   LOG_LEVEL=info
   ```

### التشغيل

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## 📖 الاستخدام

### مثال أساسي

```typescript
import { DatabaseCoreService } from './application/services/DatabaseCoreService'
import { SupabaseAdapter } from './infrastructure/adapters/SupabaseAdapter'
import { PolicyEngine } from './infrastructure/policies/PolicyEngine'
import { AuditLogger } from './infrastructure/audit/AuditLogger'
import { OperationType } from './domain/value-objects/OperationType'

// Initialize services
const adapter = new SupabaseAdapter()
const policyEngine = new PolicyEngine()
const auditLogger = new AuditLogger()
const databaseService = new DatabaseCoreService(
  adapter,
  policyEngine,
  auditLogger
)

// Find records
const result = await databaseService.find('users', { role: 'student' })
console.log(result.data)

// Insert record
const insertResult = await databaseService.insert('users', {
  email: 'user@example.com',
  name: 'Ahmed',
})
console.log(insertResult.data)

// Update record
const updateResult = await databaseService.update(
  'users',
  { id: '123' },
  { name: 'Ahmed Updated' }
)
console.log(updateResult.data)

// Delete record
const deleteResult = await databaseService.delete('users', { id: '123' })
console.log(deleteResult.data)
```

### استخدام Use Cases مباشرة

```typescript
import { FindRecordsUseCase } from './application/use-cases/database'
import { Actor } from './domain/value-objects/Actor'

const findUseCase = new FindRecordsUseCase(adapter, policyEngine, auditLogger)
const actor = new Actor('user-123', 'user', 'student')

const result = await findUseCase.execute({
  entity: 'users',
  conditions: { role: 'student' },
  actor,
})
```

---

## 🔌 API Endpoints

### POST /api/database/execute

تنفيذ عملية على قاعدة البيانات.

**Request:**
```json
{
  "operation": "FIND",
  "entity": "users",
  "conditions": { "role": "student" },
  "actor": "user-123",
  "options": {
    "limit": 10,
    "offset": 0,
    "orderBy": { "column": "created_at", "direction": "desc" }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "metadata": {
    "executionTime": 45
  }
}
```

### GET /api/database/health

فحص صحة الخدمة.

**Response:**
```json
{
  "status": "ok",
  "service": "database-core",
  "timestamp": "2026-01-09T12:00:00.000Z",
  "database": "connected"
}
```

---

## 🧪 الاختبار

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 📚 التوثيق

- [Domain Layer README](./src/domain/README.md)
- [Application Layer README](./src/application/README.md)
- [Presentation Layer README](./src/presentation/README.md)
- [Infrastructure Layer README](./src/infrastructure/README.md)
- [Database Integration Guide](./docs/DATABASE_INTEGRATION.md)
- [Policy Engine Guide](./docs/POLICY_ENGINE.md)
- [Transactions Guide](./docs/TRANSACTIONS.md)
- [Advanced Features](./docs/ADVANCED_FEATURES.md)
- [Security Guide](./docs/SECURITY.md)
- [Improvement Roadmap](./docs/IMPROVEMENT_ROADMAP.md)
- [خطة التطوير](../docs/مراجعة-التقارير/03-خطط-التطوير/database-core-development-plan.md)
- [حالة إعادة البناء](./REFACTORING_STATUS.md)

---

## 🔧 التطوير

### البنية

النظام مبني على Clean Architecture مع:

1. **Domain Layer**: مستقل تماماً، لا يعتمد على أي طبقة أخرى
2. **Application Layer**: يعتمد على Domain Layer فقط
3. **Infrastructure Layer**: يطبق Interfaces من Domain Layer
4. **Presentation Layer**: يعتمد على Application Layer

### المعايير

- ✅ TypeScript Strict Mode
- ✅ No `any` types (في معظم الأماكن)
- ✅ Explicit return types
- ✅ Custom Exceptions
- ✅ Zod Validation
- ✅ Clean Code Principles

---

## 📊 الحالة

- ✅ Domain Layer: مكتمل
- ✅ Application Layer: مكتمل (مع PolicyService و Services متقدمة)
- ✅ Infrastructure Layer: مكتمل (مع Multiple Adapters و Connection Management)
- ✅ Presentation Layer: مكتمل
- ✅ Tests: مكتمل (Unit + Integration)
- ✅ Cache System: مكتمل
- ✅ Policy Engine: مكتمل (مع Authentication Integration)
- ✅ Transaction Support: مكتمل
- ✅ Multiple Database Support: مكتمل
- ✅ Health Monitoring: مكتمل
- ✅ Performance Monitoring: مكتمل
- ✅ Rate Limiting: مكتمل
- ✅ Security Headers: مكتمل

---

## 🤝 المساهمة

1. اتبع Clean Architecture
2. استخدم TypeScript Strict Mode
3. أضف Tests للكود الجديد
4. اكتب Documentation

---

## 📝 الترخيص

MIT

---

**آخر تحديث:** 2026-01-09  
**الإصدار:** 1.0.0
