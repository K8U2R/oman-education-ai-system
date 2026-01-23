# 📚 صفحات Admin - دليل شامل

**آخر تحديث:** 2024  
**الحالة:** ✅ مكتمل - الهيكل الجديد

---

## 🏗️ الهيكل الجديد

تم إعادة هيكلة صفحات Admin بالكامل لتحقيق:

- ✅ **Clean Architecture** - فصل واضح للطبقات
- ✅ **Feature-Based Organization** - تنظيم حسب الميزات
- ✅ **DRY Principle** - تقليل التكرار إلى أقل من 5%
- ✅ **Type Safety** - 100% TypeScript coverage
- ✅ **Scalability** - سهولة إضافة صفحات جديدة

---

## 📁 الهيكل التنظيمي

```
admin/
├── core/                    # البنية التحتية الأساسية
│   ├── constants/          # الثوابت (Permissions, Routes, Intervals)
│   ├── types/              # الأنواع المشتركة
│   ├── utils/              # الأدوات المساعدة
│   ├── hooks/              # Hooks الأساسية
│   └── components/         # المكونات الأساسية
│
├── shared/                  # المكونات المشتركة
│   ├── components/         # مكونات مشتركة (Loading, Error)
│   └── styles/             # الأنماط المشتركة
│
└── features/                # الميزات (Feature-Based)
    ├── dashboard/          # لوحة التحكم
    ├── users/              # إدارة المستخدمين
    ├── whitelist/          # القائمة البيضاء
    ├── developer/          # لوحة المطور
    ├── database-core/      # قاعدة البيانات (10 صفحات)
    ├── security/           # الأمان (5 صفحات)
    └── analytics/          # التحليلات (2 صفحات)
```

---

## 🎯 Core Infrastructure

### Constants

- `permissions.constants.ts` - جميع صلاحيات Admin
- `intervals.constants.ts` - فترات التحديث التلقائي
- `routes.constants.ts` - مسارات Admin

### Types

- `admin-page.types.ts` - أنواع صفحات Admin
- `admin-stats.types.ts` - أنواع الإحصائيات

### Utils

- `permissions.util.ts` - أدوات
- `formatting.util.ts` - أدوات التنسيق
- `validation.util.ts` - أدوات التحقق

### Hooks

- `useAdminPage.ts` - Hook أساسي لصفحات Admin
- `useAdminPermissions.ts` - Hook للصلاحيات
- `useAdminDataFetch.ts` - Hook موحد لجلب البيانات

### Components

- `AdminPageLayout/` - Layout موحد لصفحات Admin
- `AdminStatsCard/` - بطاقة إحصائيات
- `AdminDataTable/` - جدول بيانات موحد

---

## 🎨 Shared Layer

### Components

- `AdminLoadingState/` - حالة التحميل الموحدة
- `AdminErrorState/` - حالة الخطأ الموحدة

### Styles

- `_admin-variables.scss` - متغيرات Admin
- `_admin-mixins.scss` - Mixins مشتركة
- `admin-base.scss` - الأنماط الأساسية

---

## 📦 Features

كل Feature يحتوي على:

```
feature-name/
├── hooks/                  # Hooks الخاصة بالميزة
│   ├── useFeaturePage.ts  # Hook رئيسي
│   └── index.ts
├── types/                  # الأنواع الخاصة
│   └── feature.types.ts
├── pages/                  # الصفحات
│   ├── FeaturePage.tsx
│   ├── FeaturePage.scss
│   └── ...
└── index.ts                # التصدير الموحد
```

---

## 🚀 إضافة صفحة جديدة

### الخطوات

1. **إنشاء Hook** في `features/your-feature/hooks/`

   ```typescript
   export function useYourFeaturePage() {
     const { canAccess, loading } = useAdminPage('your.permission')
     // ... logic
     return { canAccess, loading, data }
   }
   ```

2. **إنشاء الصفحة** في `features/your-feature/pages/`

   ```typescript
   const YourFeaturePage: React.FC = () => {
     const { canAccess, loading, data } = useYourFeaturePage()

     if (loading) return <AdminLoadingState />
     if (!canAccess) return null

     return (
       <AdminPageLayout title="..." icon={...}>
         {/* Content */}
       </AdminPageLayout>
     )
   }
   ```

3. **إضافة التصدير** في `features/your-feature/index.ts`

   ```typescript
   export { default as YourFeaturePage } from './pages/YourFeaturePage'
   ```

4. **إضافة Route** في `routing/core/routes/admin.routes.tsx`

   ```typescript
   const YourFeaturePage = lazy(
     () => import('../../../pages/admin/features/your-feature/pages/YourFeaturePage')
   )
   ```

---

## 📋 الصفحات المتاحة

### Dashboard

- `AdminDashboardPage` - لوحة التحكم الرئيسية

### Users

- `UsersManagementPage` - إدارة المستخدمين

### Whitelist

- `WhitelistManagementPage` - إدارة القائمة البيضاء

### Developer

- `DeveloperDashboardPage` - لوحة المطور

### Database Core (10 صفحات)

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

### Security (5 صفحات)

- `SecurityDashboardPage` - لوحة تحكم الأمان
- `SessionsManagementPage` - إدارة الجلسات
- `SecurityLogsPage` - سجلات الأمان
- `SecuritySettingsPage` - إعدادات الأمان
- `RouteProtectionPage` - حماية المسارات

### Analytics (2 صفحات)

- `ErrorDashboardPage` - لوحة تحكم الأخطاء
- `PerformanceDashboardPage` - لوحة تحكم الأداء

---

## 🔐

جميع محددة في `core/constants/permissions.constants.ts`

### أمثلة

- `database-core.view` - عرض Database Core
- `database-core.metrics.view` - عرض Metrics
- `database-core.connections.manage` - إدارة الاتصالات
- `system.view` - عرض النظام
- `whitelist.manage` - إدارة Whitelist

---

## 🎨 الأنماط

### استخدام المتغيرات

```scss
@use '../../../../../../styles/variables' as *;
@use '../../../../../../styles/mixins' as *;
@use '../../../shared/styles' as *;

.my-component {
  padding: $spacing-6;
  color: $primary-600;
  background: $background-primary;
}
```

### استخدام Mixins

```scss
@include admin-card;
@include respond-to(md) {
  // Mobile styles
}
```

---

## 📖 أمثلة الاستخدام

### صفحة بسيطة

```typescript
import { AdminPageLayout } from '../../core/components'
import { AdminLoadingState } from '../../shared/components'
import { useYourFeaturePage } from '../hooks'

const YourPage: React.FC = () => {
  const { canAccess, loading } = useYourFeaturePage()

  if (loading) return <AdminLoadingState />
  if (!canAccess) return null

  return (
    <AdminPageLayout title="..." icon={...}>
      {/* Content */}
    </AdminPageLayout>
  )
}
```

### صفحة مع بيانات

```typescript
const YourPage: React.FC = () => {
  const { canAccess, loading, error, data, refresh } = useYourFeaturePage()

  if (loading) return <AdminLoadingState />
  if (error) return <AdminErrorState onRetry={refresh} />
  if (!canAccess) return null

  return (
    <AdminPageLayout
      title="..."
      actions={<Button onClick={refresh}>تحديث</Button>}
    >
      {/* Content with data */}
    </AdminPageLayout>
  )
}
```

---

## 🔗 روابط مفيدة

- [Core Infrastructure](../admin/core/README.md)
- [Shared Components](../admin/shared/README.md)
- [Features Guide](./features/README.md)

---

## 📝 ملاحظات

- جميع الصفحات تستخدم `AdminPageLayout` للاتساق
- جميع الصفحات تستخدم `useAdminPage` أو hooks مخصصة للصلاحيات
- جميع الأنماط تستخدم المتغيرات المشتركة
- لا توجد استيرادات مباشرة من Infrastructure Layer

---

**آخر تحديث:** 2024
