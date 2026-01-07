# Routing Core - نواة نظام التوجيه

> **آخر تحديث:** يناير 2026  
> **الإصدار:** 2.0.0

نواة نظام التوجيه - هيكل منظم ومقسم لإدارة المسارات وبياناتها الوصفية (Metadata).

---

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [البنية](#البنية)
3. [Metadata - البيانات الوصفية](#metadata---البيانات-الوصفية)
4. [Routes - المسارات](#routes---المسارات)
5. [الهيكل الجديد](#الهيكل-الجديد)
6. [أمثلة الاستخدام](#أمثلة-الاستخدام)
7. [أفضل الممارسات](#أفضل-الممارسات)

---

## 🎯 نظرة عامة

تم إعادة هيكلة نظام التوجيه ليكون أكثر تنظيماً وقابلية للتوسع:

- ✅ **فصل Metadata عن Routes** - كل metadata في ملف منفصل
- ✅ **تقسيم حسب الفئة** - مسارات منظمة حسب الدور (Student, Teacher, Admin, etc.)
- ✅ **سهولة الصيانة** - كل ملف مستقل ويمكن تعديله بسهولة
- ✅ **قابلية التوسع** - إضافة مسارات جديدة بسهولة

---

## 🏗️ البنية

```
core/
└── routes/
    ├── index.ts                    # يجمع allRoutes و routeMetadata
    ├── metadata/                   # بيانات وصفية للمسارات
    │   ├── public.metadata.ts      # مسارات عامة
    │   ├── auth.metadata.ts        # مسارات المصادقة
    │   ├── student.metadata.ts     # مسارات الطالب
    │   ├── teacher.metadata.ts     # مسارات المعلم
    │   ├── moderator.metadata.ts   # مسارات المشرف
    │   ├── admin.metadata.ts       # مسارات المسؤول
    │   ├── shared.metadata.ts      # مسارات مشتركة
    │   ├── error.metadata.ts       # صفحات الأخطاء
    │   └── index.ts                # تصدير مركزي
    ├── public.routes.tsx           # مسارات عامة
    ├── auth.routes.tsx             # مسارات المصادقة
    ├── student.routes.tsx          # مسارات الطالب
    ├── teacher.routes.tsx          # مسارات المعلم
    ├── moderator.routes.tsx        # مسارات المشرف
    ├── admin.routes.tsx            # مسارات المسؤول
    ├── shared.routes.tsx          # مسارات مشتركة
    └── error.routes.tsx           # صفحات الأخطاء
```

---

## 📝 Metadata - البيانات الوصفية

### نظرة عامة

كل ملف metadata يحتوي على بيانات وصفية للمسارات الخاصة بفئة معينة.

### الملفات

#### 1. `public.metadata.ts`

**المسارات:** Home, Terms, Privacy  
**الوصف:** بيانات وصفية للمسارات العامة التي لا تحتاج مصادقة

```typescript
export const publicMetadata: Record<string, RouteMetadata> = {
  [ROUTES.HOME]: {
    title: 'الرئيسية - Oman Education AI',
    description: 'نظام التعليم الذكي',
    requiresAuth: false,
    breadcrumb: 'الرئيسية',
    icon: Home,
    layout: 'main',
    showInNav: true,
    navOrder: 1,
  },
  // ...
}
```

#### 2. `auth.metadata.ts`

**المسارات:** Login, Register  
**الوصف:** بيانات وصفية لمسارات تسجيل الدخول والتسجيل

#### 3. `student.metadata.ts`

**المسارات:** Dashboard, Lessons, Assessments, Projects, Storage  
**الوصف:** بيانات وصفية للمسارات الخاصة بالطلاب

#### 4. `teacher.metadata.ts`

**المسارات:** Lessons Management, Code Generator, Office Generator  
**الوصف:** بيانات وصفية للمسارات الخاصة بالمعلمين

#### 5. `moderator.metadata.ts`

**المسارات:** Quick Actions, User Support  
**الوصف:** بيانات وصفية للمسارات الخاصة بالمشرفين

#### 6. `admin.metadata.ts`

**المسارات:** Admin Dashboard, Users Management, Security Dashboard, Developer Dashboard  
**الوصف:** بيانات وصفية للمسارات الخاصة بالمسؤولين والمطورين

#### 7. `shared.metadata.ts`

**المسارات:** Profile, Settings, Subscription, User Security  
**الوصف:** بيانات وصفية للمسارات المشتركة بين جميع المستخدمين

#### 8. `error.metadata.ts`

**المسارات:** Unauthorized, Forbidden  
**الوصف:** بيانات وصفية لصفحات الأخطاء

---

## 🛣️ Routes - المسارات

### نظرة عامة

كل ملف routes يحتوي على تعريفات المسارات الخاصة بفئة معينة، مع استخدام Lazy Loading للصفحات.

### الملفات

#### 1. `public.routes.tsx`

**المسارات:** Home, Terms, Privacy  
**الحماية:** PublicRoute (توجيه المستخدمين المسجلين)

```typescript
export const publicRoutes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    element: (
      <PublicRoute allowAuthenticated={false}>
        <MainLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <HomePage />
          </React.Suspense>
        </MainLayout>
      </PublicRoute>
    ),
    metadata: publicMetadata[ROUTES.HOME],
  },
  // ...
]
```

#### 2. `auth.routes.tsx`

**المسارات:** Login, Register, OAuth Callback  
**الحماية:** PublicRoute

#### 3. `student.routes.tsx`

**المسارات:** Dashboard, Lessons, Assessments, Projects, Storage  
**الحماية:** ProtectedRoute مع الصلاحيات المناسبة

#### 4. `teacher.routes.tsx`

**المسارات:** Lessons Management, Code Generator, Office Generator  
**الحماية:** ProtectedRoute مع صلاحيات `lessons.manage`

#### 5. `moderator.routes.tsx`

**المسارات:** Quick Actions, User Support  
**الحماية:** ProtectedRoute مع `requiredRole="moderator"`

#### 6. `admin.routes.tsx`

**المسارات:** Admin Dashboard, Users Management, Security Dashboard, Developer Dashboard  
**الحماية:** ProtectedRoute مع `requiredRole="admin"` أو `requiredRole="developer"`

#### 7. `shared.routes.tsx`

**المسارات:** Profile, Settings, Subscription, User Security  
**الحماية:** ProtectedRoute (مشترك بين جميع المستخدمين)

#### 8. `error.routes.tsx`

**المسارات:** Unauthorized, Forbidden  
**الحماية:** لا حماية (صفحات أخطاء)

---

## 🔄 الهيكل الجديد

### قبل إعادة الهيكلة

```
routes.config.tsx (1236 سطر)
├── Lazy imports (112 سطر)
├── routeMetadata (418 سطر)
├── publicRoutes (36 سطر)
├── authRoutes (44 سطر)
├── protectedRoutes (567 سطر)
└── errorRoutes (59 سطر)
```

**المشاكل:**

- ملف واحد كبير جداً (1236 سطر)
- صعوبة في الصيانة
- صعوبة في إيجاد المسارات
- Metadata مختلط مع Routes

### بعد إعادة الهيكلة

```
core/routes/
├── index.ts (54 سطر) - يجمع كل شيء
├── metadata/ (8 ملفات منفصلة)
│   ├── public.metadata.ts (~30 سطر)
│   ├── auth.metadata.ts (~20 سطر)
│   ├── student.metadata.ts (~150 سطر)
│   ├── teacher.metadata.ts (~80 سطر)
│   ├── moderator.metadata.ts (~30 سطر)
│   ├── admin.metadata.ts (~120 سطر)
│   ├── shared.metadata.ts (~60 سطر)
│   └── error.metadata.ts (~20 سطر)
└── *.routes.tsx (8 ملفات منفصلة)
    ├── public.routes.tsx (~55 سطر)
    ├── auth.routes.tsx (~60 سطر)
    ├── student.routes.tsx (~200 سطر)
    ├── teacher.routes.tsx (~100 سطر)
    ├── moderator.routes.tsx (~45 سطر)
    ├── admin.routes.tsx (~200 سطر)
    ├── shared.routes.tsx (~60 سطر)
    └── error.routes.tsx (~40 سطر)
```

**المزايا:**

- ✅ ملفات صغيرة ومنظمة
- ✅ سهولة في الصيانة
- ✅ فصل كامل بين Metadata و Routes
- ✅ سهولة في إيجاد المسارات
- ✅ قابلية عالية للتوسع

---

## 💻 أمثلة الاستخدام

### مثال 1: إضافة مسار جديد للطالب

**1. إضافة Metadata في `student.metadata.ts`:**

```typescript
export const studentMetadata: Record<string, RouteMetadata> = {
  // ... existing metadata
  [ROUTES.MY_NEW_PAGE]: {
    title: 'صفحتي الجديدة',
    description: 'وصف الصفحة',
    requiresAuth: true,
    requiredPermissions: ['lessons.view'],
    breadcrumb: 'صفحتي الجديدة',
    icon: BookOpen,
    layout: 'main',
    showInNav: true,
    navOrder: 5,
  },
}
```

**2. إضافة Route في `student.routes.tsx`:**

```typescript
const MyNewPage = lazy(() => import('../../../pages/learning/MyNewPage'))

export const studentRoutes: RouteConfig[] = [
  // ... existing routes
  {
    path: ROUTES.MY_NEW_PAGE,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <MainLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <MyNewPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.MY_NEW_PAGE],
  },
]
```

### مثال 2: إضافة مسار جديد للمعلم

**1. إضافة Metadata في `teacher.metadata.ts`:**

```typescript
export const teacherMetadata: Record<string, RouteMetadata> = {
  // ... existing metadata
  [ROUTES.CONTENT_EDITOR]: {
    title: 'محرر المحتوى',
    description: 'إنشاء وتعديل المحتوى التعليمي',
    requiresAuth: true,
    requiredPermissions: ['lessons.manage'],
    breadcrumb: 'محرر المحتوى',
    icon: Edit,
    layout: 'main',
    showInNav: false,
  },
}
```

**2. إضافة Route في `teacher.routes.tsx`:**

```typescript
const ContentEditorPage = lazy(() => import('../../../pages/content/ContentEditorPage'))

export const teacherRoutes: RouteConfig[] = [
  // ... existing routes
  {
    path: ROUTES.CONTENT_EDITOR,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.manage']}>
        <MainLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <ContentEditorPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.CONTENT_EDITOR],
  },
]
```

### مثال 3: تعديل Metadata لمسار موجود

**في `student.metadata.ts`:**

```typescript
export const studentMetadata: Record<string, RouteMetadata> = {
  [ROUTES.DASHBOARD]: {
    title: 'لوحة التحكم - محدث', // تم التحديث
    description: 'لوحة التحكم الرئيسية - وصف محدث',
    requiresAuth: true,
    breadcrumb: 'لوحة التحكم',
    icon: LayoutDashboard,
    layout: 'main',
    showInNav: true,
    navOrder: 2,
    analytics: {
      category: 'Navigation',
      action: 'View Dashboard',
    },
  },
  // ...
}
```

---

## ✅ أفضل الممارسات

### 1. تنظيم Metadata

```typescript
// ✅ جيد - منظم حسب الفئة
export const studentMetadata: Record<string, RouteMetadata> = {
  [ROUTES.DASHBOARD]: {
    /* ... */
  },
  [ROUTES.LESSONS]: {
    /* ... */
  },
}

// ❌ سيء - metadata مختلط
export const allMetadata = {
  [ROUTES.DASHBOARD]: {
    /* ... */
  },
  [ROUTES.ADMIN_DASHBOARD]: {
    /* ... */
  },
  [ROUTES.LESSONS]: {
    /* ... */
  },
}
```

### 2. استخدام Lazy Loading

```typescript
// ✅ جيد - Lazy Loading
const DashboardPage = lazy(() => import('../../../pages/user/DashboardPage'))

// ❌ سيء - Eager Loading
import DashboardPage from '../../../pages/user/DashboardPage'
```

### 3. فصل Metadata عن Routes

```typescript
// ✅ جيد - Metadata في ملف منفصل
import { studentMetadata } from './metadata/student.metadata'
metadata: studentMetadata[ROUTES.DASHBOARD]

// ❌ سيء - Metadata مدمج في Route
metadata: {
  title: 'لوحة التحكم',
  description: '...',
  // ...
}
```

### 4. استخدام الصلاحيات بشكل صحيح

```typescript
// ✅ جيد - صلاحيات محددة
<ProtectedRoute requiredPermissions={['lessons.view']}>
  <LessonsPage />
</ProtectedRoute>

// ❌ سيء - بدون صلاحيات
<ProtectedRoute>
  <LessonsPage />
</ProtectedRoute>
```

### 5. تنظيم الاستيرادات

```typescript
// ✅ جيد - استيرادات منظمة
import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import MainLayout from '../../../layouts/MainLayout'
import { ProtectedRoute } from '../../guards'
import { studentMetadata } from './metadata/student.metadata'

// ❌ سيء - استيرادات عشوائية
import { ROUTES } from '@/domain/constants/routes.constants'
import React, { lazy } from 'react'
import { ProtectedRoute } from '../../guards'
import { studentMetadata } from './metadata/student.metadata'
import MainLayout from '../../../layouts/MainLayout'
import { RouteConfig } from '../../types'
```

---

## 🔍 البحث عن المسارات

### البحث عن Metadata

```bash
# البحث في metadata
grep -r "DASHBOARD" core/routes/metadata/

# النتيجة: student.metadata.ts
```

### البحث عن Routes

```bash
# البحث في routes
grep -r "DASHBOARD" core/routes/*.tsx

# النتيجة: student.routes.tsx
```

---

## 📚 المراجع

- [Routing System README](../README.md) - الوثائق الكاملة لنظام التوجيه
- [Route Types](../../types.ts) - أنواع المسارات والواجهات
- [Route Guards](../guards/README.md) - حماية المسارات

---

**آخر تحديث:** يناير 2026  
**الإصدار:** 2.0.0
