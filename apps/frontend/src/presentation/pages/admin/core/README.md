# 🔧 Admin Core Infrastructure

**آخر تحديث:** 2024

---

## 📁 الهيكل

```
core/
├── constants/          # الثوابت
├── types/              # الأنواع
├── utils/              # الأدوات
├── hooks/              # Hooks
└── components/         # المكونات
```

---

## 📦 Constants

### `permissions.constants.ts`

جميع صلاحيات Admin في مكان واحد.

```typescript
export const ADMIN_PERMISSIONS = {
  DATABASE_CORE: {
    VIEW: 'database-core.view',
    METRICS_VIEW: 'database-core.metrics.view',
    // ...
  },
  // ...
}
```

### `intervals.constants.ts`

فترات التحديث التلقائي.

```typescript
export const ADMIN_REFRESH_INTERVALS = {
  DASHBOARD: 30000,
  DATABASE_CORE: 5000,
  // ...
}
```

### `routes.constants.ts`

مسارات Admin.

```typescript
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  DATABASE_CORE: {
    DASHBOARD: '/admin/database-core',
    // ...
  },
  // ...
}
```

---

## 🎯 Types

### `admin-page.types.ts`

أنواع صفحات Admin المشتركة.

```typescript
export interface AdminPageOptions {
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
  // ...
}

export interface AdminPageState<T> {
  canAccess: boolean
  loading: boolean
  error: string | null
  data: T | null
}
```

---

## 🛠️ Utils

### `permissions.util.ts`

أدوات .

```typescript
export function hasPermission(user: User, permission: Permission): boolean
export function hasAnyPermission(user: User, permissions: Permission[]): boolean
export function hasAllPermissions(user: User, permissions: Permission[]): boolean
```

### `formatting.util.ts`

أدوات التنسيق.

```typescript
export function formatAdminDate(date: Date | string, format?: 'short' | 'long'): string
export function formatAdminNumber(value: number): string
export function formatAdminPercentage(value: number): string
export function formatAdminBytes(bytes: number): string
export function formatAdminDuration(ms: number): string
```

### `validation.util.ts`

أدوات التحقق.

```typescript
export function validateAdminInput(input: unknown): boolean
export function sanitizeAdminInput(input: string): string
```

---

## 🎣 Hooks

### `useAdminPage`

Hook أساسي لصفحات Admin.

```typescript
const { canAccess, loading, error } = useAdminPage('your.permission')
```

### `useAdminPermissions`

Hook للصلاحيات.

```typescript
const { hasPermission, hasAnyPermission } = useAdminPermissions()
```

### `useAdminDataFetch`

Hook موحد لجلب البيانات.

```typescript
const { data, loading, error, refresh } = useAdminDataFetch({
  endpoint: '/api/data',
  interval: 5000,
})
```

---

## 🧩 Components

### `AdminPageLayout`

Layout موحد لصفحات Admin.

```typescript
<AdminPageLayout
  title="..."
  description="..."
  icon={<Icon />}
  actions={<Button>...</Button>}
>
  {/* Content */}
</AdminPageLayout>
```

### `AdminStatsCard`

بطاقة إحصائيات.

```typescript
<AdminStatsCard
  title="..."
  value="..."
  icon={<Icon />}
  variant="success"
/>
```

### `AdminDataTable`

جدول بيانات موحد.

```typescript
<AdminDataTable
  data={data}
  columns={columns}
  loading={loading}
/>
```

---

## 📖 أمثلة الاستخدام

### استخدام Hook أساسي

```typescript
import { useAdminPage } from '../core/hooks'

const MyPage: React.FC = () => {
  const { canAccess, loading } = useAdminPage('my.permission')
  // ...
}
```

### استخدام Constants

```typescript
import { ADMIN_ROUTES, ADMIN_REFRESH_INTERVALS } from '../core/constants'

navigate(ADMIN_ROUTES.DATABASE_CORE.DASHBOARD)
const interval = ADMIN_REFRESH_INTERVALS.DATABASE_CORE
```

### استخدام Utils

```typescript
import { formatAdminNumber, formatAdminDate } from '../core/utils'

const formatted = formatAdminNumber(1234)
const date = formatAdminDate(new Date())
```

---

**آخر تحديث:** 2024
