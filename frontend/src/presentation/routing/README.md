# Routing System - نظام التوجيه

> **آخر تحديث:** يناير 2026  
> **الإصدار:** 2.0.0

نظام توجيه متقدم ومتكامل لإدارة المسارات في التطبيق مع دعم كامل للمصادقة، ، التحليلات، والتحميل المسبق.

---

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [البنية](#البنية)
3. [المكونات الرئيسية](#المكونات-الرئيسية)
4. [Guards - حماية المسارات](#guards---حماية-المسارات)
5. [Hooks - خطافات مخصصة](#hooks---خطافات-مخصصة)
6. [Components - المكونات](#components---المكونات)
7. [Analytics - التحليلات](#analytics---التحليلات)
8. [Middleware - البرمجيات الوسطية](#middleware---البرمجيات-الوسطية)
9. [Preloading - التحميل المسبق](#preloading---التحميل-المسبق)
10. [Transitions - الانتقالات](#transitions---الانتقالات)
11. [Error Handling - معالجة الأخطاء](#error-handling---معالجة-الأخطاء)
12. [History - السجل](#history---السجل)
13. [Utils - الأدوات المساعدة](#utils---الأدوات-المساعدة)
14. [أمثلة الاستخدام](#أمثلة-الاستخدام)

---

## 🎯 نظرة عامة

نظام التوجيه يوفر:

- ✅ **حماية متقدمة للمسارات** - دعم كامل للمصادقة و (RBAC)
- ✅ **Lazy Loading** - تحميل الصفحات عند الحاجة لتحسين الأداء
- ✅ **Route Metadata** - بيانات وصفية شاملة لكل مسار
- ✅ **Breadcrumbs** - مسار تنقل هرمي تلقائي
- ✅ **Analytics** - تتبع استخدام المسارات
- ✅ **Route History** - سجل التنقل
- ✅ **Preloading** - تحميل مسبق للمسارات المهمة
- ✅ **Transitions** - انتقالات سلسة بين الصفحات
- ✅ **Error Boundaries** - معالجة أخطاء التوجيه

---

## 🏗️ البنية

```
routing/
├── core/                    # نواة نظام التوجيه (جديد)
│   └── routes/              # المسارات والبيانات الوصفية
│       ├── index.ts         # يجمع allRoutes و routeMetadata
│       ├── metadata/        # بيانات وصفية للمسارات
│       │   ├── public.metadata.ts
│       │   ├── auth.metadata.ts
│       │   ├── student.metadata.ts
│       │   ├── teacher.metadata.ts
│       │   ├── moderator.metadata.ts
│       │   ├── admin.metadata.ts
│       │   ├── shared.metadata.ts
│       │   ├── error.metadata.ts
│       │   └── index.ts
│       ├── public.routes.tsx
│       ├── auth.routes.tsx
│       ├── student.routes.tsx
│       ├── teacher.routes.tsx
│       ├── moderator.routes.tsx
│       ├── admin.routes.tsx
│       ├── shared.routes.tsx
│       └── error.routes.tsx
├── guards/              # حماية المسارات
│   ├── ProtectedRoute.tsx    # حماية المسارات المحمية
│   ├── PublicRoute.tsx       # حماية المسارات العامة
│   └── index.ts
├── hooks/               # Hooks مخصصة
│   ├── useNavigation.ts     # Hook للتنقل
│   ├── useRouteGuard.ts     # Hook للتحقق من
│   ├── useRouteMetadata.ts  # Hook لبيانات المسار
│   ├── useBreadcrumbs.ts    # Hook للـ Breadcrumbs
│   └── index.ts
├── components/          # المكونات
│   ├── Breadcrumbs.tsx      # مكون Breadcrumbs
│   └── index.ts
├── analytics/          # التحليلات
│   └── RouteAnalytics.ts    # تتبع استخدام المسارات
├── middleware/         # البرمجيات الوسطية
│   └── RouteMiddleware.ts   # معالجة الطلبات قبل التوجيه
├── preloading/        # التحميل المسبق
│   └── RoutePreloader.ts    # تحميل مسبق للمسارات
├── transitions/       # الانتقالات
│   ├── RouteTransition.tsx  # انتقالات بين الصفحات
│   └── RouteTransition.scss
├── errors/            # معالجة الأخطاء
│   ├── RouteErrorBoundary.tsx  # معالجة أخطاء التوجيه
│   └── RouteErrorBoundary.scss
├── history/          # السجل
│   └── RouteHistory.ts       # سجل التنقل
├── utils/            # الأدوات المساعدة
│   ├── navigation.ts         # دوال التنقل
│   ├── breadcrumbs.ts        # دوال Breadcrumbs
│   ├── route-utils.ts        # دوال مساعدة عامة
│   └── index.ts
├── types.ts          # الأنواع والواجهات
├── (routes.config.tsx تم حذفه - استخدام index.ts مباشرة)
├── RouteProvider.tsx  # Provider للمسارات
├── OAuthCallback.tsx  # معالجة OAuth Callback
└── index.ts          # تصدير مركزي
```

> **ملاحظة:** تم إعادة هيكلة نظام التوجيه في الإصدار 2.0.0. راجع [Routing Core README](./core/README.md) للتفاصيل الكاملة.

---

## 📦 المكونات الرئيسية

### 1. Routes Configuration - إعدادات المسارات

**الموقع:** `index.ts` (Export مباشر من `core/routes`)

**الوظيفة:**

- Re-export لـ `allRoutes` و `routeMetadata` من `core/routes`
- الحفاظ على التوافق مع الكود القديم

**الهيكل الجديد:**
تم إعادة هيكلة المسارات في `core/routes/`:

- **Metadata**: منفصلة في `core/routes/metadata/` (8 ملفات)
- **Routes**: منفصلة في `core/routes/` (8 ملفات)
- **Index**: يجمع كل شيء في `core/routes/index.ts`
- **Export**: يتم التصدير من `routing/index.ts` مباشرة

**الأنواع:**

- **Public Routes**: مسارات عامة (Home, Terms, Privacy)
- **Auth Routes**: مسارات المصادقة (Login, Register, OAuth Callback)
- **Student Routes**: مسارات الطالب (Dashboard, Lessons, Assessments, Projects, Storage)
- **Teacher Routes**: مسارات المعلم (Lessons Management, Code Generator, Office Generator)
- **Moderator Routes**: مسارات المشرف (Quick Actions, User Support)
- **Admin Routes**: مسارات المسؤول (Admin Dashboard, Users Management, Security)
- **Shared Routes**: مسارات مشتركة (Profile, Settings, Subscription, User Security)
- **Error Routes**: صفحات الأخطاء (Unauthorized, Forbidden)

**مثال (من `core/routes/student.routes.tsx`):**

```typescript
export const studentRoutes: RouteConfig[] = [
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <DashboardPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.DASHBOARD],
  },
]
```

> **راجع:** [Routing Core README](./core/README.md) للتفاصيل الكاملة عن الهيكل الجديد.

### 2. Route Provider - موفر المسارات

**الموقع:** `RouteProvider.tsx`

**الوظيفة:**

- إدارة حالة المسارات
- تحديث عنوان الصفحة (document.title)
- تحديث Meta Description
- تتبع استخدام المسارات
- إدارة سجل التنقل

**الاستخدام:**

```typescript
<RouteProvider>
  <Router>
    <Routes>
      {/* Routes */}
    </Routes>
  </Router>
</RouteProvider>
```

---

## 🛡️ Guards - حماية المسارات

### ProtectedRoute - حماية المسارات المحمية

**الموقع:** `guards/ProtectedRoute.tsx`

**الوظيفة:**

- التحقق من المصادقة
- التحقق من الأدوار (Roles)
- التحقق من (Permissions)
- توجيه المستخدمين غير المصرح لهم

**الخصائص:**

- `requiredRole`: دور واحد مطلوب
- `requiredRoles`: قائمة أدوار (يكفي وجود أحدها)
- `requiredPermission`: صلاحية واحدة مطلوبة
- `requiredPermissions`: قائمة صلاحيات (جميعها مطلوبة)
- `redirectTo`: مسار التوجيه عند الفشل (افتراضي: `/login`)

**مثال:**

```typescript
<ProtectedRoute
  requiredPermissions={['lessons.view']}
  requiredRole="teacher"
>
  <LessonsPage />
</ProtectedRoute>
```

### PublicRoute - حماية المسارات العامة

**الموقع:** `guards/PublicRoute.tsx`

**الوظيفة:**

- التحقق من حالة المصادقة
- توجيه المستخدمين المسجلين (اختياري)
- منع الوصول للمستخدمين المسجلين (اختياري)

**الخصائص:**

- `allowAuthenticated`: السماح للمستخدمين المسجلين (افتراضي: `false`)
- `redirectTo`: مسار التوجيه للمستخدمين المسجلين (افتراضي: `/dashboard`)

**مثال:**

```typescript
// توجيه المستخدمين المسجلين إلى Dashboard
<PublicRoute allowAuthenticated={false}>
  <HomePage />
</PublicRoute>

// السماح للمستخدمين المسجلين بالوصول
<PublicRoute allowAuthenticated={true}>
  <TermsPage />
</PublicRoute>
```

---

## 🎣 Hooks - خطافات مخصصة

### useNavigation - Hook للتنقل

**الموقع:** `hooks/useNavigation.ts`

**الوظيفة:**

- تنقل مع تتبع تلقائي
- دوال مساعدة للتنقل الشائع

**الاستخدام:**

```typescript
const { navigate, goBack, goHome, goToDashboard, goToLogin, canGoTo } = useNavigation()

// التنقل إلى مسار معين
navigate('/lessons/123')

// العودة للخلف
goBack()

// الذهاب للصفحة الرئيسية
goHome()

// الذهاب للوحة التحكم
goToDashboard()

// الذهاب لصفحة تسجيل الدخول
goToLogin('/dashboard') // مع حفظ المسار للعودة

// التحقق من إمكانية الوصول لمسار
if (canGoTo('/admin')) {
  navigate('/admin')
}
```

### useRouteMetadata - Hook لبيانات المسار

**الموقع:** `hooks/useRouteMetadata.ts`

**الوظيفة:**

- الحصول على بيانات المسار الحالي
- الوصول إلى Metadata (title, description, icon, etc.)

**الاستخدام:**

```typescript
const metadata = useRouteMetadata()

console.log(metadata?.title) // "لوحة التحكم"
console.log(metadata?.description) // "إدارة حسابك"
console.log(metadata?.icon) // Icon Component
```

### useBreadcrumbs - Hook للـ Breadcrumbs

**الموقع:** `hooks/useBreadcrumbs.ts`

**الوظيفة:**

- توليد Breadcrumbs تلقائياً من المسار الحالي
- بناء مسار تنقل هرمي

**الاستخدام:**

```typescript
const breadcrumbs = useBreadcrumbs()

// Returns: [
//   { label: 'الرئيسية', path: '/' },
//   { label: 'الدروس', path: '/lessons' },
//   { label: 'تفاصيل الدرس', path: '/lessons/123' }
// ]
```

### useRouteGuard - Hook للتحقق من

**الموقع:** `hooks/useRouteGuard.ts`

**الوظيفة:**

- التحقق من قبل التنقل
- منع التنقل غير المصرح به

**الاستخدام:**

```typescript
const { canAccess, checkAccess } = useRouteGuard()

// التحقق من إمكانية الوصول
if (canAccess('/admin', { requiredRole: 'admin' })) {
  navigate('/admin')
}

// التحقق مع معالجة الخطأ
const result = checkAccess('/admin', { requiredRole: 'admin' })
if (!result.allowed) {
  showError(result.reason)
}
```

---

## 🧩 Components - المكونات

### Breadcrumbs - مسار التنقل

**الموقع:** `components/Breadcrumbs.tsx`

**الوظيفة:**

- عرض مسار التنقل الهرمي
- روابط للصفحات السابقة
- أيقونات لكل مستوى

**الاستخدام:**

```typescript
import { Breadcrumbs } from '@/presentation/routing'

<Breadcrumbs />
```

**الميزات:**

- إخفاء تلقائي على الصفحة الرئيسية
- إخفاء عند وجود breadcrumb واحد فقط
- دعم RTL كامل
- أيقونات تلقائية

---

## 📊 Analytics - التحليلات

### RouteAnalytics - تحليلات المسارات

**الموقع:** `analytics/RouteAnalytics.ts`

**الوظيفة:**

- تتبع استخدام المسارات
- قياس مدة البقاء في كل صفحة
- تتبع Referrer
- إحصائيات الاستخدام

**الاستخدام:**

```typescript
import { routeAnalytics } from '@/presentation/routing'

// تتبع عرض صفحة
routeAnalytics.trackRouteView('/dashboard', metadata, userId)

// الحصول على الإحصائيات
const stats = routeAnalytics.getStats()

// الحصول على الأحداث
const events = routeAnalytics.getEvents()
```

**البيانات المتتبعة:**

- المسار (path)
- العنوان (title)
- الفئة (category)
- الإجراء (action)
- الوقت (timestamp)
- المدة (duration)
- المرجع (referrer)
- معرف المستخدم (userId)

---

## 🔧 Middleware - البرمجيات الوسطية

### RouteMiddleware - برمجية وسطية للمسارات

**الموقع:** `middleware/RouteMiddleware.ts`

**الوظيفة:**

- معالجة الطلبات قبل التوجيه
- التحقق من
- تسجيل الأحداث
- معالجة الأخطاء

**الاستخدام:**

```typescript
import { routeMiddleware } from '@/presentation/routing'

// إضافة middleware
routeMiddleware.add((path, metadata) => {
  // معالجة قبل التوجيه
  console.log('Navigating to:', path)
})
```

---

## ⚡ Preloading - التحميل المسبق

### RoutePreloader - تحميل مسبق للمسارات

**الموقع:** `preloading/RoutePreloader.ts`

**الوظيفة:**

- تحميل مسبق للمسارات المهمة
- تحسين تجربة المستخدم
- تقليل وقت الانتظار

**الاستخدام:**

```typescript
import { routePreloader } from '@/presentation/routing'

// تحميل مسبق لمسار
routePreloader.preload('/dashboard')

// تحميل مسبق لعدة مسارات
routePreloader.preloadBatch(['/lessons', '/projects', '/assessments'])
```

---

## 🎬 Transitions - الانتقالات

### RouteTransition - انتقالات بين الصفحات

**الموقع:** `transitions/RouteTransition.tsx`

**الوظيفة:**

- انتقالات سلسة بين الصفحات
- تأثيرات بصرية
- تحسين تجربة المستخدم

**الاستخدام:**

```typescript
import { RouteTransition } from '@/presentation/routing'

<RouteTransition>
  <Routes>
    {/* Routes */}
  </Routes>
</RouteTransition>
```

---

## ⚠️ Error Handling - معالجة الأخطاء

### RouteErrorBoundary - معالجة أخطاء التوجيه

**الموقع:** `errors/RouteErrorBoundary.tsx`

**الوظيفة:**

- التقاط أخطاء التوجيه
- عرض صفحة خطأ مناسبة
- تسجيل الأخطاء

**الاستخدام:**

```typescript
import { RouteErrorBoundary } from '@/presentation/routing'

<RouteErrorBoundary>
  <Routes>
    {/* Routes */}
  </Routes>
</RouteErrorBoundary>
```

---

## 📜 History - السجل

### RouteHistory - سجل التنقل

**الموقع:** `history/RouteHistory.ts`

**الوظيفة:**

- حفظ سجل التنقل
- الوصول للصفحات السابقة
- إحصائيات التنقل

**الاستخدام:**

```typescript
import { routeHistory } from '@/presentation/routing'

// إضافة إدخال
routeHistory.addEntry('/dashboard', 'لوحة التحكم')

// الحصول على السجل
const history = routeHistory.getHistory()

// الحصول على آخر مسار
const lastPath = routeHistory.getLastPath()
```

---

## 🛠️ Utils - الأدوات المساعدة

### navigation.ts - دوال التنقل

**الوظيفة:**

- دوال مساعدة للتنقل
- تتبع تلقائي
- معالجة الأخطاء

**الدوال:**

- `navigateWithTracking()`: تنقل مع تتبع
- `navigateBack()`: العودة للخلف
- `navigateToHome()`: الذهاب للصفحة الرئيسية
- `navigateToDashboard()`: الذهاب للوحة التحكم
- `navigateToLogin()`: الذهاب لصفحة تسجيل الدخول
- `canNavigate()`: التحقق من إمكانية الوصول

### breadcrumbs.ts - دوال Breadcrumbs

**الوظيفة:**

- توليد Breadcrumbs من المسار
- تحويل المسار إلى عناصر Breadcrumbs

### route-utils.ts - دوال مساعدة عامة

**الوظيفة:**

- دوال مساعدة عامة للمسارات
- تحويل المسارات
- التحقق من المسارات

---

## 💻 أمثلة الاستخدام

### مثال 1: إضافة مسار محمي جديد (الهيكل الجديد)

**1. إضافة Metadata في `core/routes/metadata/student.metadata.ts`:**

```typescript
export const studentMetadata: Record<string, RouteMetadata> = {
  // ... existing metadata
  [ROUTES.MY_NEW_PAGE]: {
    title: 'صفحتي الجديدة',
    description: 'وصف الصفحة',
    requiresAuth: true,
    requiredPermissions: ['my-feature.view'],
    breadcrumb: 'صفحتي الجديدة',
    icon: BookOpen,
    layout: 'main',
    showInNav: true,
    navOrder: 5,
  },
}
```

**2. إضافة Route في `core/routes/student.routes.tsx`:**

```typescript
const MyNewPage = lazy(() => import('../../../pages/learning/MyNewPage'))

export const studentRoutes: RouteConfig[] = [
  // ... existing routes
  {
    path: ROUTES.MY_NEW_PAGE,
    element: (
      <ProtectedRoute requiredPermissions={['my-feature.view']}>
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

> **ملاحظة:** في الهيكل الجديد، يتم فصل Metadata عن Routes. راجع [Routing Core README](./core/README.md) للمزيد من الأمثلة.

### مثال 2: استخدام Hook للتنقل

```typescript
import { useNavigation } from '@/presentation/routing'

const MyComponent = () => {
  const { navigate, goBack, canGoTo } = useNavigation()

  const handleClick = () => {
    if (canGoTo('/admin')) {
      navigate('/admin')
    } else {
      alert('ليس لديك صلاحية للوصول')
    }
  }

  return (
    <div>
      <button onClick={handleClick}>الذهاب للإدارة</button>
      <button onClick={goBack}>العودة</button>
    </div>
  )
}
```

### مثال 3: استخدام Breadcrumbs

```typescript
import { Breadcrumbs } from '@/presentation/routing'

const MyPage = () => {
  return (
    <div>
      <Breadcrumbs />
      <h1>محتوى الصفحة</h1>
    </div>
  )
}
```

### مثال 4: تتبع استخدام المسارات

```typescript
import { routeAnalytics } from '@/presentation/routing'

// في RouteProvider أو useEffect
useEffect(() => {
  routeAnalytics.trackRouteView(location.pathname, metadata, user?.id)
}, [location.pathname])
```

### مثال 5: حماية مسار عام

```typescript
// في core/routes/public.routes.tsx
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
    metadata: routeMetadata[ROUTES.HOME],
  },
]
```

---

## 📝 Route Metadata - بيانات المسار

كل مسار يمكن أن يحتوي على بيانات وصفية:

```typescript
interface RouteMetadata {
  title?: string // عنوان الصفحة
  description?: string // وصف الصفحة
  requiresAuth?: boolean // يتطلب مصادقة؟
  requiredRole?: UserRole // دور مطلوب
  requiredRoles?: UserRole[] // قائمة أدوار
  requiredPermissions?: Permission[] // قائمة صلاحيات
  breadcrumb?: string // تسمية Breadcrumb
  icon?: React.ComponentType // أيقونة
  layout?: 'main' | 'auth' | 'minimal' // نوع التخطيط
  showInNav?: boolean // عرض في التنقل؟
  navOrder?: number // ترتيب في التنقل
  preload?: boolean // تحميل مسبق؟
  analytics?: {
    // بيانات التحليلات
    category?: string
    action?: string
  }
}
```

---

## 🔐 نظام

### الأدوار (Roles)

- `student` - طالب
- `parent` - ولي أمر
- `teacher` - معلم
- `moderator` - مشرف
- `admin` - مسؤول
- `developer` - مطور

### (Permissions)

- `lessons.view`, `lessons.create`, `lessons.update`, `lessons.delete`
- `projects.view`, `projects.create`, `projects.update`, `projects.delete`
- `storage.view`, `storage.upload`, `storage.delete`
- `users.view`, `users.create`, `users.update`, `users.delete`
- وغيرها...

---

## ✅ أفضل الممارسات

### 1. استخدام الهيكل الجديد (الإصدار 2.0.0+)

```typescript
// ✅ جيد - فصل Metadata عن Routes
// في core/routes/metadata/student.metadata.ts
export const studentMetadata: Record<string, RouteMetadata> = {
  [ROUTES.DASHBOARD]: { /* ... */ },
}

// في core/routes/student.routes.tsx
import { studentMetadata } from './metadata/student.metadata'
metadata: studentMetadata[ROUTES.DASHBOARD]

// ❌ سيء - Metadata مدمج في Route
metadata: {
  title: 'لوحة التحكم',
  // ...
}
```

### 2. استخدام Lazy Loading

```typescript
// ✅ جيد
const DashboardPage = lazy(() => import('../../../pages/user/DashboardPage'))

// ❌ سيء
import DashboardPage from '../../../pages/user/DashboardPage'
```

### 3. حماية جميع المسارات المحمية

```typescript
// ✅ جيد
<ProtectedRoute requiredPermissions={['lessons.view']}>
  <LessonsPage />
</ProtectedRoute>

// ❌ سيء
<LessonsPage /> // بدون حماية
```

### 4. تنظيم Metadata حسب الفئة

```typescript
// ✅ جيد - metadata منفصلة حسب الفئة
// student.metadata.ts
export const studentMetadata = {
  /* ... */
}

// teacher.metadata.ts
export const teacherMetadata = {
  /* ... */
}

// ❌ سيء - metadata مختلطة
export const allMetadata = {
  [ROUTES.DASHBOARD]: {
    /* ... */
  },
  [ROUTES.ADMIN_DASHBOARD]: {
    /* ... */
  },
}
```

### 5. استخدام Hooks للتنقل

```typescript
// ✅ جيد
const { navigate } = useNavigation()
navigate('/dashboard')

// ❌ سيء
window.location.href = '/dashboard'
```

> **راجع:** [Routing Core README](./core/README.md) للمزيد من أفضل الممارسات.

---

## 🧪 الاختبار

### اختبار Guards

```typescript
import { render } from '@testing-library/react'
import { ProtectedRoute } from './guards'

test('redirects unauthenticated users', () => {
  // Test implementation
})
```

### اختبار Hooks

```typescript
import { renderHook } from '@testing-library/react'
import { useNavigation } from './hooks/useNavigation'

test('navigates correctly', () => {
  // Test implementation
})
```

---

## 📚 المراجع

- [Routing Core README](./core/README.md) - الوثائق الكاملة للهيكل الجديد
- [React Router Documentation](https://reactrouter.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [RBAC Best Practices](https://en.wikipedia.org/wiki/Role-based_access_control)

---

## 🔄 التحديثات الرئيسية (الإصدار 2.0.0)

### إعادة هيكلة نظام التوجيه

تم إعادة هيكلة نظام التوجيه بالكامل في الإصدار 2.0.0:

- ✅ **فصل Metadata عن Routes** - كل metadata في ملف منفصل
- ✅ **تقسيم حسب الفئة** - مسارات منظمة حسب الدور
- ✅ **سهولة الصيانة** - ملفات صغيرة ومنظمة
- ✅ **قابلية التوسع** - إضافة مسارات جديدة بسهولة

**الهيكل الجديد:**

- `core/routes/metadata/` - 8 ملفات metadata منفصلة
- `core/routes/` - 8 ملفات routes منفصلة
- `routes.config.tsx` - تم حذفه (تم تحديث جميع الاستخدامات لاستخدام `index.ts` مباشرة)

**راجع:** [Routing Core README](./core/README.md) للتفاصيل الكاملة.

---

**آخر تحديث:** يناير 2026  
**الإصدار:** 2.0.0
