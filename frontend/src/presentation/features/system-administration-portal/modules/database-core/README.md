# Database Core Feature - ميزة لوحة تحكم قاعدة البيانات

**الحالة:** 🚧 قيد التطوير  
**الإصدار:** 1.0.0  
**آخر تحديث:** 2026-01-10

---

## 📋 نظرة عامة

ميزة لوحة تحكم متكاملة لـ `database-core` service. توفر واجهة إدارية احترافية تتيح للمسؤولين والمطورين مراقبة وإدارة قاعدة البيانات بشكل كامل.

---

## 🎯 الهدف

توفير لوحة تحكم شاملة تدعم:

- مراقبة الأداء (Performance Monitoring)
- إدارة الاتصالات (Connection Management)
- إدارة Cache
- مراقبة المعاملات (Transaction Monitoring)
- Audit Logs & Analytics
- إدارة النسخ الاحتياطي (Backup Management)
- إدارة Migrations
- تحكم شامل في قاعدة البيانات (Database Control)

---

## 📁 الهيكل

```
database-core/
├── hooks/                      # Custom Hooks
│   ├── useApi.ts              # Hook أساسي للـ API calls
│   ├── useDatabaseMetrics.ts  # Hook للمقاييس
│   ├── useConnectionStats.ts  # Hook لإحصائيات الاتصالات
│   ├── useCacheStats.ts       # Hook لإحصائيات Cache
│   ├── useTransactionMonitoring.ts  # Hook لمراقبة المعاملات
│   ├── useAuditLogs.ts        # Hook لـ Audit Logs
│   ├── useBackupManagement.ts # Hook لإدارة النسخ الاحتياطي
│   ├── useMigrations.ts       # Hook لإدارة Migrations
│   ├── useDatabaseControl.ts  # Hook للتحكم الشامل
│   ├── useRealTimeMonitoring.ts  # Hook للـ Real-time monitoring
│   ├── useAdvancedFilter.ts   # Hook للفلترة المتقدمة
│   └── index.ts
├── services/                  # Services
│   ├── database-core.service.ts  # Service الرئيسي
│   ├── database-control.service.ts  # Service للتحكم الشامل
│   ├── metrics.service.ts     # Service للمقاييس
│   ├── connections.service.ts # Service للاتصالات
│   ├── cache.service.ts       # Service للـ Cache
│   ├── transactions.service.ts # Service للمعاملات
│   ├── audit.service.ts       # Service للـ Audit
│   ├── backup.service.ts      # Service للنسخ الاحتياطي
│   ├── migrations.service.ts  # Service للـ Migrations
│   └── index.ts
├── store/                     # State Management
│   ├── database-core.store.ts # Zustand Store
│   └── index.ts
├── types/                     # TypeScript Types
│   ├── database-core.types.ts # أنواع عامة
│   ├── metrics.types.ts       # أنواع المقاييس
│   ├── connections.types.ts   # أنواع الاتصالات
│   ├── database-control.types.ts  # أنواع التحكم الشامل
│   └── index.ts
├── constants/                 # Constants
│   ├── endpoints.constants.ts # API Endpoints
│   └── index.ts
├── utils/                     # Utilities
│   ├── query-builder.util.ts  # بناء استعلامات SQL
│   ├── formatters.util.ts     # تنسيق البيانات
│   ├── validators.util.ts     # التحقق من البيانات
│   └── index.ts
├── index.ts                   # Barrel Export الرئيسي
└── README.md                  # هذا الملف
```

---

## 🚀 الميزات

### 1. مراقبة الأداء (Performance Monitoring)

- Performance Metrics في الوقت الفعلي
- Query Statistics
- Slow Queries Analysis
- Memory Usage
- Connection Pool Status

### 2. إدارة الاتصالات (Connection Management)

- قائمة الاتصالات النشطة
- Connection Pool Statistics
- Health Checks
- إدارة الاتصالات (إضافة/حذف/تعديل)

### 3. إدارة Cache

- Cache Statistics
- Cache Hit/Miss Rates
- Cache Keys Registry
- Clear/Clean Cache Actions

### 4. مراقبة المعاملات (Transaction Monitoring)

- Active Transactions
- Transaction Statistics
- Transaction History
- Failed Transactions

### 5. Audit Logs & Analytics

- Audit Logs Viewer
- Statistics & Trends
- Alerts & Reports
- Filtering & Search

### 6. إدارة النسخ الاحتياطي (Backup Management)

- Backup List
- Backup Scheduling
- Restore Operations
- Backup History

### 7. إدارة Migrations

- Migration History
- Migration Status
- Run/Rollback Migrations
- Migration Details

### 8. تحكم شامل في قاعدة البيانات (Database Control)

- Database Explorer
- Query Builder
- Table Management
- Data Management
- Index Management
- Security Management

---

## 💻 الاستخدام

### استخدام Hook

```typescript
import { useDatabaseMetrics } from '@/application/features/database-core/hooks'

const MyComponent = () => {
  const { data: metrics, loading, error, refresh } = useDatabaseMetrics()

  if (loading) return <div>جارٍ التحميل...</div>
  if (error) return <div>خطأ: {error.message}</div>

  return (
    <div>
      <h2>Performance Metrics</h2>
      <pre>{JSON.stringify(metrics, null, 2)}</pre>
      <button onClick={refresh}>تحديث</button>
    </div>
  )
}
```

### استخدام Service

```typescript
import { databaseCoreService } from '@/application/features/database-core/services'

const handleAction = async () => {
  // جلب Health Status
  const health = await databaseCoreService.getHealthStatus()

  // جلب Metrics
  const metrics = await databaseCoreService.getMetrics()

  // جلب Performance Stats
  const performance = await databaseCoreService.getPerformanceStats()
}
```

---

## 🔗 التكاملات

### مع الميزات الأخرى:

- **admin/**: يحتاج database-core للوصول إلى لوحة التحكم
- **security/**: يستخدم database-core لمراقبة الأمان

---

## 📝 ملاحظات

- جميع Types مستوردة من Domain Layer
- Store يستخدم Zustand مع Persist Middleware
- يدعم Real-time Updates
- Base Components قابلة لإعادة الاستخدام
- Code Reusability (DRY, SRP, Composition)

---

## 🧪 الاختبار

```typescript
import { describe, it, expect } from 'vitest'
import { useDatabaseMetrics } from './hooks/useDatabaseMetrics'
import { renderHook } from '@testing-library/react'

describe('useDatabaseMetrics', () => {
  it('should fetch metrics successfully', async () => {
    const { result } = renderHook(() => useDatabaseMetrics())
    // ...
  })
})
```

---

## 📚 المراجع

- [Database Core Development Plan](../../../../docs/مراجعة-التقارير/03-خطط-التطوير/database-core-dashboard-development-plan.md)
- [Database Core API Documentation](../../../../database-core/README.md)

---

**آخر تحديث:** 2026-01-10  
**الإصدار:** 1.0.0
