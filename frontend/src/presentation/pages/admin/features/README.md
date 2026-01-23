# 📦 Admin Features - دليل الميزات

**آخر تحديث:** 2024

---

## 🎯 نظرة عامة

جميع Features في صفحات Admin منظمة بنفس الهيكل الموحد:

```
feature-name/
├── hooks/                  # Hooks الخاصة
│   ├── useFeaturePage.ts  # Hook رئيسي
│   └── index.ts
├── types/                  # الأنواع
│   └── feature.types.ts
├── pages/                  # الصفحات
│   ├── FeaturePage.tsx
│   ├── FeaturePage.scss
│   └── ...
└── index.ts                # التصدير
```

---

## 📋 Features المتاحة

### 1. Dashboard ✅

**المسار:** `features/dashboard/`

**الصفحات:**

- `AdminDashboardPage` - لوحة التحكم الرئيسية

**Hooks:**

- `useAdminDashboard` - Hook رئيسي

**Services:**

- `admin-dashboard.service.ts` (Application Layer)

---

### 2. Users ✅

**المسار:** `features/users/`

**الصفحات:**

- `UsersManagementPage` - إدارة المستخدمين

**Hooks:**

- `useUsersManagement` - Hook رئيسي

**Services:**

- `users-management.service.ts` (Application Layer)

---

### 3. Whitelist ✅

**المسار:** `features/whitelist/`

**الصفحات:**

- `WhitelistManagementPage` - إدارة القائمة البيضاء

**Hooks:**

- `useWhitelistManagement` - Hook رئيسي
- يستخدم `useWhitelist` من Application Layer

---

### 4. Developer ✅

**المسار:** `features/developer/`

**الصفحات:**

- `DeveloperDashboardPage` - لوحة المطور

**Hooks:**

- `useDeveloperDashboard` - Hook رئيسي
- يستخدم `developerService` من Application Layer

---

### 5. Database Core ✅

**المسار:** `features/database-core/`

**الصفحات (10 صفحات):**

- `DatabaseCoreDashboardPage` - لوحة التحكم
- `PerformancePage` - مراقبة الأداء
- `ConnectionsPage` - إدارة الاتصالات
- `CachePage` - إدارة Cache
- `DatabaseExplorerPage` - استكشاف قاعدة البيانات
- `QueryBuilderPage` - بناء الاستعلامات
- `TransactionsPage` - مراقبة المعاملات
- `AuditLogsPage` - سجلات التدقيق
- `BackupsPage` - النسخ الاحتياطي
- `MigrationsPage` - إدارة Migrations

**Hooks:**

- `useDatabaseCorePage` - Hook أساسي
- `useDatabaseCoreDashboard` - Dashboard
- `usePerformancePage` - Performance
- `useConnectionsPage` - Connections
- `useCachePage` - Cache
- `useDatabaseExplorerPage` - Explorer
- `useQueryBuilderPage` - Query Builder
- `useTransactionsPage` - Transactions
- `useAuditLogsPage` - Audit Logs
- `useBackupsPage` - Backups
- `useMigrationsPage` - Migrations

**Services:**

- يستخدم hooks من `@/application/features/database-core`

---

### 6. Security ✅

**المسار:** `features/security/`

**الصفحات (5 صفحات):**

- `SecurityDashboardPage` - لوحة تحكم الأمان
- `SessionsManagementPage` - إدارة الجلسات
- `SecurityLogsPage` - سجلات الأمان
- `SecuritySettingsPage` - إعدادات الأمان
- `RouteProtectionPage` - حماية المسارات

**Hooks:**

- `useSecurityPage` - Hook أساسي
- `useSecurityDashboard` - Dashboard
- `useSessionsManagement` - Sessions
- `useSecurityLogs` - Logs

**Services:**

- يستخدم hooks من `@/application/features/security`

---

### 7. Analytics ✅

**المسار:** `features/analytics/`

**الصفحات (2 صفحات):**

- `ErrorDashboardPage` - لوحة تحكم الأخطاء
- `PerformanceDashboardPage` - لوحة تحكم الأداء

**Hooks:**

- `useAnalyticsPage` - Hook أساسي
- `useErrorDashboard` - Error Dashboard
- `usePerformanceDashboard` - Performance Dashboard

**Services:**

- يستخدم `monitoringService` و `performanceService` من Infrastructure

---

## 🚀 إضافة Feature جديد

### 1. إنشاء الهيكل

```bash
features/your-feature/
├── hooks/
│   ├── useYourFeaturePage.ts
│   └── index.ts
├── types/
│   └── your-feature.types.ts
├── pages/
│   ├── YourFeaturePage.tsx
│   ├── YourFeaturePage.scss
│   └── index.ts
└── index.ts
```

### 2. إنشاء Hook

```typescript
// hooks/useYourFeaturePage.ts
import { useAdminPage } from '../../../core/hooks'
import { yourFeatureService } from '@/application/features/your-feature'

export function useYourFeaturePage() {
  const { canAccess, loading: authLoading } = useAdminPage('your.permission')
  const { data, loading, error, refresh } = yourFeatureService.useData()

  return {
    canAccess,
    loading: authLoading || loading,
    error,
    data,
    refresh,
  }
}
```

### 3. إنشاء الصفحة

```typescript
// pages/YourFeaturePage.tsx
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useYourFeaturePage } from '../hooks'

const YourFeaturePage: React.FC = () => {
  const { canAccess, loading, error, data, refresh } = useYourFeaturePage()

  if (loading) return <AdminLoadingState />
  if (error) return <AdminErrorState onRetry={refresh} />
  if (!canAccess) return null

  return (
    <AdminPageLayout title="..." icon={...}>
      {/* Content */}
    </AdminPageLayout>
  )
}
```

### 4. التصدير

```typescript
// index.ts
export * from './hooks'
export * from './types'
export { default as YourFeaturePage } from './pages/YourFeaturePage'
```

### 5. إضافة Route

```typescript
// routing/core/routes/admin.routes.tsx
const YourFeaturePage = lazy(
  () => import('../../../pages/admin/features/your-feature/pages/YourFeaturePage')
)
```

---

## 📚 المبادئ

1. **Separation of Concerns** - فصل الاهتمامات
2. **DRY** - لا تكرار
3. **Type Safety** - 100% TypeScript
4. **Reusability** - إعادة الاستخدام
5. **Maintainability** - سهولة الصيانة

---

**آخر تحديث:** 2024
