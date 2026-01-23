# 🛡️ أفضل الممارسات - Sidebar Implementation Guide

**تاريخ الإنشاء:** 2024  
**الغرض:** تطبيق أفضل أنظمة الحماية والتنظيم الهيكلي من المشروع على Sidebar

---

## 📋 جدول المحتويات

1. [أنظمة الحماية](#أنظمة-الحماية)
2. [التنظيم الهيكلي](#التنظيم-الهيكلي)
3. [Hooks Patterns](#hooks-patterns)
4. [Component Patterns](#component-patterns)
5. [Constants & Types](#constants--types)
6. [Error Handling](#error-handling)
7. [Loading States](#loading-states)

---

## 🛡️ أنظمة الحماية

### 1. ProtectedRoute Pattern

**الموقع:** `frontend/src/presentation/routing/guards/ProtectedRoute.tsx`

**المميزات:**

- ✅ التحقق من المصادقة (Authentication)
- ✅ التحقق من الأدوار (Role-based)
- ✅ التحقق من (Permission-based)
- ✅ Loading states أثناء التحقق
- ✅ Redirect مع state للـ error details
- ✅ Fallback إلى localStorage إذا كان store غير جاهز

**التطبيق على Sidebar:**

```typescript
// يجب استخدام نفس المنطق في Sidebar للتحقق من
const canAccessItem = useCallback(
  (item: SidebarItem): boolean => {
    // 1. التحقق من المصادقة
    if (item.requiresAuth && (!isAuthenticated || !user)) {
      return false
    }

    // 2. التحقق من الدور
    if (item.requiredRole && !hasRole(item.requiredRole)) {
      return false
    }

    // 3. التحقق من
    if (item.requiredPermissions && !hasAllPermissions(item.requiredPermissions)) {
      return false
    }

    return true
  },
  [isAuthenticated, user, hasRole, hasAllPermissions]
)
```

---

### 2. ProtectedComponent Pattern

**الموقع:** `frontend/src/presentation/components/auth/ProtectedComponent.tsx`

**المميزات:**

- ✅ إخفاء/إظهار المحتوى بناءً على
- ✅ Fallback component اختياري
- ✅ دعم Role و Permission checks

**التطبيق على Sidebar:**

```typescript
// يمكن استخدام ProtectedComponent داخل SidebarGroup
<ProtectedComponent
  requiredRole="admin"
  fallback={null}
>
  <SidebarGroup {...adminGroup} />
</ProtectedComponent>
```

---

### 3. usePageAuth Hook

**الموقع:** `frontend/src/application/shared/hooks/usePageAuth.ts`

**المميزات:**

- ✅ Hook موحد للمصادقة
- ✅ Loading state management
- ✅ getShouldRedirect() للتحقق من الحاجة لإعادة التوجيه
- ✅ Fallback إلى authService.isAuthenticated()

**التطبيق على Sidebar:**

```typescript
// يمكن استخدام usePageAuth في Sidebar للتحقق من
const { canAccess, isLoading } = usePageAuth({
  requireAuth: true,
  requiredRole: 'admin',
})
```

---

### 4. AdminPageWrapper Pattern

**الموقع:** `frontend/src/presentation/components/admin/AdminPageWrapper/AdminPageWrapper.tsx`

**المميزات:**

- ✅ Wrapper موحد للصفحات
- ✅ Authentication & Authorization checks
- ✅ Loading states
- ✅ Redirect handling

**التطبيق على Sidebar:**

```typescript
// يمكن إنشاء SidebarGroupWrapper مشابه
const SidebarGroupWrapper: React.FC<SidebarGroupWrapperProps> = ({
  requiredRole,
  requiredPermissions,
  children,
}) => {
  const { canAccess } = usePageAuth({
    requireAuth: true,
    requiredRole,
    requiredPermissions,
  })

  if (!canAccess) return null

  return <>{children}</>
}
```

---

## 🏗️ التنظيم الهيكلي

### 1. Clean Architecture Layers

**الهيكل:**

```
presentation/
├── components/
│   └── layout/
│       └── Sidebar/
│           ├── Sidebar.tsx              # Presentation Layer
│           ├── components/              # Sub-components
│           ├── hooks/                   # Presentation Hooks
│           ├── constants/               # Presentation Constants
│           └── types/                   # Presentation Types
│
application/
└── features/
    └── sidebar/                         # Application Layer
        ├── hooks/
        ├── services/
        └── types/

domain/
└── types/
    └── sidebar.types.ts                # Domain Types
```

---

### 2. Feature-Based Organization

**النمط من Admin Pages:**

```
admin/
├── core/                    # البنية التحتية الأساسية
│   ├── constants/          # الثوابت
│   ├── types/              # الأنواع المشتركة
│   ├── utils/              # الأدوات المساعدة
│   ├── hooks/              # Hooks الأساسية
│   └── components/         # المكونات الأساسية
│
├── shared/                  # المكونات المشتركة
│   ├── components/         # مكونات مشتركة
│   └── styles/             # الأنماط المشتركة
│
└── features/                # الميزات (Feature-Based)
    └── [feature-name]/
        ├── hooks/
        ├── types/
        └── pages/
```

**التطبيق على Sidebar:**

```
Sidebar/
├── core/                    # البنية التحتية الأساسية
│   ├── constants/          # sidebar.config.ts
│   ├── types/              # sidebar.types.ts
│   ├── hooks/              # useSidebar.ts
│   └── utils/              # sidebar.utils.ts
│
├── components/              # المكونات
│   ├── SidebarGroup.tsx
│   ├── SidebarItem.tsx
│   └── SidebarSearch.tsx
│
└── Sidebar.tsx              # المكون الرئيسي
```

---

### 3. Constants Organization

**النمط من Admin:**

```typescript
// permissions.constants.ts
export const ADMIN_PERMISSIONS = {
  USERS: {
    VIEW: 'users.view' as Permission,
    CREATE: 'users.create' as Permission,
    // ...
  },
  // ...
} as const
```

**التطبيق على Sidebar:**

```typescript
// sidebar.config.ts
export const SIDEBAR_GROUPS = {
  LEARNING: {
    id: 'learning',
    label: 'التعلم والمحتوى',
    icon: BookOpen,
    defaultOpen: true,
  },
  SETTINGS: {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    defaultOpen: false,
  },
  // ...
} as const
```

---

### 4. Types Organization

**النمط من Admin:**

```typescript
// admin-page.types.ts
export interface AdminPageOptions {
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
  // ...
}

export interface AdminPageReturn<T> {
  canAccess: boolean
  loading: boolean
  error: Error | null
  user: User | null
  data: T | null
  refresh: () => Promise<void>
}
```

**التطبيق على Sidebar:**

```typescript
// sidebar.types.ts
export interface SidebarGroup {
  id: string
  label: string
  icon?: React.ComponentType
  items: SidebarItem[]
  defaultOpen?: boolean
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
  collapsible?: boolean
}

export interface SidebarItem {
  path: string
  label: string
  icon: React.ComponentType
  requiresAuth?: boolean
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
  badge?: string | number
  external?: boolean
}
```

---

## 🎣 Hooks Patterns

### 1. useAdminPage Pattern

**الموقع:** `frontend/src/presentation/pages/admin/core/hooks/useAdminPage.ts`

**المميزات:**

- ✅ يستخدم `usePageAuth` للتحقق من
- ✅ يستخدم `usePageLoading` لإدارة حالة التحميل
- ✅ يعيد state فقط (لا components)
- ✅ Clean Architecture compliant

**التطبيق على Sidebar:**

```typescript
// hooks/useSidebar.ts
export function useSidebar(options: UseSidebarOptions = {}): UseSidebarReturn {
  const { user, canAccess, isLoading } = usePageAuth({
    requireAuth: true,
  })

  const { filteredGroups, filteredItems } = useMemo(() => {
    // Filter groups and items based on permissions
    return filterSidebarData(sidebarConfig, user)
  }, [user])

  return {
    user,
    canAccess,
    isLoading,
    groups: filteredGroups,
    items: filteredItems,
  }
}
```

---

### 2. useAsyncOperation Pattern

**الموقع:** `frontend/src/application/shared/hooks/useAsyncOperation.ts`

**المميزات:**

- ✅ دعم autoFetch
- ✅ دعم interval (polling)
- ✅ دعم cancellation (AbortController)
- ✅ Error handling موحد

**التطبيق على Sidebar:**

```typescript
// يمكن استخدام useAsyncOperation لجلب بيانات Sidebar من API
const {
  data: sidebarConfig,
  loading,
  error,
} = useAsyncOperation(
  async () => {
    const response = await apiClient.get('/api/sidebar/config')
    return response.data
  },
  {
    autoFetch: true,
    interval: 30000, // Refresh every 30 seconds
  }
)
```

---

### 3. useModal Pattern

**الموقع:** `frontend/src/application/shared/hooks/useModal.ts`

**المميزات:**

- ✅ إدارة حالة Modal موحدة
- ✅ Type-safe
- ✅ دعم selectedData

**التطبيق على Sidebar:**

```typescript
// يمكن استخدام useModal لإدارة Sidebar settings modal
const settingsModal = useModal<SidebarSettings>()

// في Sidebar component
<Button onClick={() => settingsModal.open(defaultSettings)}>
  إعدادات القائمة
</Button>
```

---

## 🧩 Component Patterns

### 1. AdminPageLayout Pattern

**الموقع:** `frontend/src/presentation/pages/admin/core/components/AdminPageLayout/AdminPageLayout.tsx`

**المميزات:**

- ✅ Layout موحد للصفحات
- ✅ Props موحدة (title, icon, actions)
- ✅ Responsive design

**التطبيق على Sidebar:**

```typescript
// يمكن إنشاء SidebarGroupLayout مشابه
export interface SidebarGroupLayoutProps {
  title: string
  icon?: React.ComponentType
  collapsible?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
}

export const SidebarGroupLayout: React.FC<SidebarGroupLayoutProps> = ({
  title,
  icon: Icon,
  collapsible = true,
  defaultOpen = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="sidebar-group-layout">
      <div className="sidebar-group-layout__header" onClick={() => collapsible && setIsOpen(!isOpen)}>
        {Icon && <Icon />}
        <span>{title}</span>
        {collapsible && <ChevronDown className={isOpen ? 'rotate-180' : ''} />}
      </div>
      {isOpen && <div className="sidebar-group-layout__content">{children}</div>}
    </div>
  )
}
```

---

### 2. LoadingState Pattern

**الموقع:** `frontend/src/presentation/pages/components/LoadingState.tsx`

**المميزات:**

- ✅ Loading state موحد
- ✅ دعم fullScreen
- ✅ دعم custom message

**التطبيق على Sidebar:**

```typescript
// في Sidebar component
if (isLoading) {
  return <LoadingState message="جاري تحميل القائمة..." />
}
```

---

## 📦 Constants & Types

### 1. Constants Organization

**النمط:**

```typescript
// constants/sidebar.config.ts
import { ROUTES } from '@/domain/constants/routes.constants'
import type { SidebarGroup, SidebarItem } from '../types'

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    id: 'learning',
    label: 'التعلم والمحتوى',
    icon: BookOpen,
    defaultOpen: true,
    items: [
      {
        path: ROUTES.HOME,
        label: 'الرئيسية',
        icon: Home,
      },
      // ...
    ],
  },
  // ...
]
```

---

### 2. Types Organization

**النمط:**

```typescript
// types/sidebar.types.ts
import type { UserRole, Permission } from '@/domain/types/auth.types'

export interface SidebarGroup {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  items: SidebarItem[]
  defaultOpen?: boolean
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
  collapsible?: boolean
}

export interface SidebarItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
  badge?: string | number
  external?: boolean
}
```

---

## ⚠️ Error Handling

### 1. ErrorHandler Pattern

**الموقع:** `frontend/src/application/shared/utils/errorHandler.ts`

**المميزات:**

- ✅ معالجة أخطاء موحدة
- ✅ Logging تلقائي
- ✅ User-friendly messages

**التطبيق على Sidebar:**

```typescript
// في Sidebar component
try {
  const config = await fetchSidebarConfig()
  setConfig(config)
} catch (error) {
  ErrorHandler.handle(error, 'فشل تحميل إعدادات القائمة')
}
```

---

## 🔄 Loading States

### 1. usePageLoading Pattern

**الموقع:** `frontend/src/application/shared/hooks/usePageLoading.ts`

**المميزات:**

- ✅ إدارة حالة التحميل موحدة
- ✅ دعم delay قبل إظهار loading
- ✅ دعم minimum display time

**التطبيق على Sidebar:**

```typescript
// في Sidebar component
const { shouldShowLoading, loadingMessage } = usePageLoading({
  isLoading: isLoading || !canAccess,
  message: 'جاري تحميل القائمة...',
  delay: 200, // Don't show loading for fast operations
  minimumDisplayTime: 300, // Minimum display time for smooth UX
})

if (shouldShowLoading) {
  return <LoadingState message={loadingMessage} />
}
```

---

## 📝 Checklist للتنفيذ

### ✅ الحماية

- [ ] استخدام `usePageAuth` للتحقق من
- [ ] استخدام `useRole` للتحقق من الأدوار
- [ ] استخدام `ProtectedComponent` للمجموعات المحمية
- [ ] Fallback إلى `authService.isAuthenticated()` إذا كان store غير جاهز

### ✅ التنظيم

- [ ] إنشاء `core/` للبنية التحتية
- [ ] إنشاء `components/` للمكونات الفرعية
- [ ] إنشاء `constants/` للثوابت
- [ ] إنشاء `types/` للأنواع
- [ ] إنشاء `hooks/` للـ hooks المخصصة

### ✅ Hooks

- [ ] إنشاء `useSidebar` hook موحد
- [ ] استخدام `usePageAuth` للتحقق من
- [ ] استخدام `usePageLoading` لإدارة حالة التحميل
- [ ] استخدام `useMemo` و `useCallback` للأداء

### ✅ Components

- [ ] إنشاء `SidebarGroup` component
- [ ] إنشاء `SidebarItem` component
- [ ] استخدام LoadingState أثناء التحميل
- [ ] استخدام ErrorState عند حدوث خطأ

### ✅ Constants & Types

- [ ] إنشاء `sidebar.config.ts` للثوابت
- [ ] إنشاء `sidebar.types.ts` للأنواع
- [ ] استخدام TypeScript strict mode
- [ ] Export types من index.ts

### ✅ Error Handling

- [ ] استخدام `ErrorHandler` لمعالجة الأخطاء
- [ ] Logging في development mode
- [ ] User-friendly error messages

### ✅ Loading States

- [ ] استخدام `usePageLoading` لإدارة حالة التحميل
- [ ] Delay قبل إظهار loading
- [ ] Minimum display time للـ smooth UX

---

**الخطوة التالية:** تطبيق هذه الممارسات في Sidebar الجديد
