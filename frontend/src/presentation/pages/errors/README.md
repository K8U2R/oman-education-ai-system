# Error Pages - صفحات الأخطاء

## 📁 الهيكل التنظيمي

```
errors/
├── core/                              # المكونات الأساسية
│   ├── BaseErrorPage.tsx             # المكون الأساسي الموحد
│   ├── BaseErrorPage.scss
│   ├── ErrorPageFactory.tsx           # Factory لإنشاء صفحات الأخطاء
│   └── types.ts                       # Types و Interfaces
│
├── pages/                             # صفحات الأخطاء المحددة
│   ├── ForbiddenPage.tsx              # 403 (يستخدم BaseErrorPage)
│   ├── UnauthorizedPage.tsx           # 401 (يستخدم BaseErrorPage)
│   ├── NotFoundPage.tsx               # 404
│   ├── ServerErrorPage.tsx            # 500
│   ├── NetworkErrorPage.tsx            # Network errors
│   └── MaintenancePage.tsx            # Maintenance mode
│
├── components/                        # مكونات قابلة لإعادة الاستخدام
│   ├── ErrorDetailsPanel.tsx          # لوحة تفاصيل الخطأ
│   ├── ErrorDetailsPanel.scss
│   ├── ErrorIcon.tsx                  # أيقونات الأخطاء
│   ├── ErrorIcon.scss
│   ├── ErrorActions.tsx                # أزرار الإجراءات
│   ├── ErrorActions.scss
│   ├── ErrorMessage.tsx                # رسائل الخطأ
│   └── ErrorMessage.scss
│
├── hooks/                             # Custom Hooks
│   ├── useErrorDetails.ts             # Hook لتفاصيل الخطأ
│   ├── useErrorNavigation.ts          # Hook للتنقل
│   ├── useErrorRefresh.ts             # Hook لتحديث البيانات
│   └── useErrorPageSetup.ts           # Hook موحد لإعداد صفحات الأخطاء (يقلل التكرار)
│
├── utils/                             # Utilities
│   ├── error-mapper.ts                # تحويل الأخطاء
│   ├── error-formatter.ts             # تنسيق رسائل الخطأ
│   └── error-constants.ts             # ثوابت الأخطاء
│
├── config/                            # Configuration
│   └── error-config.ts                # إعدادات الأخطاء
│
├── index.ts                            # Export مركزي
└── README.md                           # هذا الملف
```

## 🎯 الهدف

تقليل التكرار بين صفحات الأخطاء المختلفة من خلال:

- **مكون أساسي موحد** (`BaseErrorPage`) يمكن إعادة استخدامه
- **مكونات قابلة للتخصيص** لكل نوع خطأ
- **Custom Hooks** لتبسيط المنطق
- **Utilities** لمعالجة الأخطاء
- **كود نظيف ومنظم** يسهل الصيانة

## 📦 المكونات

### 1. BaseErrorPage

المكون الأساسي لجميع صفحات الأخطاء. يدعم:

- أنواع مختلفة من الأخطاء (forbidden, unauthorized, not-found, server-error, network-error, maintenance)
- أيقونات وألوان قابلة للتخصيص
- أزرار إجراءات قابلة للتخصيص
- عرض معلومات التطوير (في وضع التطوير فقط)

**الاستخدام:**

```tsx
<BaseErrorPage
  type="forbidden"
  title="غير مصرح بالوصول"
  message="عذراً، ليس لديك ..."
  icon={ShieldX}
  iconColor="error"
  showRefreshButton={true}
/>
```

### 2. ErrorPageFactory

Factory لإنشاء صفحات الأخطاء ديناميكياً:

```tsx
import { ErrorPageFactory } from '@/presentation/pages/errors'

// إنشاء صفحة خطأ من نوع معين
const errorPage = ErrorPageFactory.create('not-found')

// إنشاء صفحة خطأ مخصصة
const customPage = ErrorPageFactory.createCustom({
  type: 'server-error',
  title: 'خطأ مخصص',
  message: 'رسالة مخصصة',
  icon: ServerCrash,
  iconColor: 'error',
})
```

### 3. صفحات الأخطاء

#### ForbiddenPage (403)

- يستخدم `BaseErrorPage`
- زر تحديث
- عرض معلومات تفصيلية في وضع التطوير

#### UnauthorizedPage (401)

- يستخدم `BaseErrorPage`
- زر تسجيل الدخول
- عرض معلومات تفصيلية في وضع التطوير

#### NotFoundPage (404)

- يستخدم `BaseErrorPage`
- زر العودة وزر الصفحة الرئيسية
- عرض معلومات تفصيلية في وضع التطوير

#### ServerErrorPage (500)

- يستخدم `BaseErrorPage`
- زر تحديث
- عرض معلومات تفصيلية في وضع التطوير

#### NetworkErrorPage

- يستخدم `BaseErrorPage`
- زر تحديث
- عرض معلومات تفصيلية في وضع التطوير

#### MaintenancePage

- يستخدم `BaseErrorPage`
- رسالة بسيطة
- زر الصفحة الرئيسية فقط

### 4. مكونات قابلة لإعادة الاستخدام

#### ErrorIcon

أيقونة خطأ مع ألوان قابلة للتخصيص:

```tsx
<ErrorIcon icon={ShieldX} color="error" size="lg" />
```

#### ErrorActions

أزرار إجراءات في صفحات الأخطاء:

```tsx
<ErrorActions
  showRefreshButton={true}
  showBackButton={true}
  showHomeButton={true}
  onRefresh={handleRefresh}
  attemptedPath="/dashboard"
/>
```

#### ErrorMessage

رسالة خطأ منسقة:

```tsx
<ErrorMessage
  message="حدث خطأ"
  secondaryMessage="يرجى المحاولة مرة أخرى"
  attemptedPath="/dashboard"
/>
```

### 5. Custom Hooks

#### useErrorDetails

Hook لاستخراج تفاصيل الخطأ من `location.state`:

```tsx
const { apiError, errorDetails, attemptedPath, currentPath } = useErrorDetails()
```

#### useErrorNavigation

Hook للتنقل في صفحات الأخطاء:

```tsx
const { goBack, goHome, goToLogin, navigate, retry } = useErrorNavigation()
```

#### useErrorRefresh

Hook لتحديث بيانات المستخدم:

```tsx
const { isRefreshing, refresh, error } = useErrorRefresh()
```

#### useErrorPageSetup

Hook موحد لإعداد صفحات الأخطاء - يقلل التكرار بشكل كبير:

```tsx
const {
  user,
  userRole,
  userPermissions,
  showDetails,
  setShowDetails,
  apiError,
  errorDetails,
  attemptedPath,
  currentPath,
  routeMetadata,
  isDevelopment,
  showErrorDetails,
  formattedSecondaryMessage,
} = useErrorPageSetup({
  currentErrorRoute: ROUTES.UNAUTHORIZED,
  useFormattedMessage: true,
})
```

**الفوائد:**

- يقلل التكرار في جميع صفحات الأخطاء
- يوفر جميع البيانات المطلوبة من مكان واحد
- يدعم تنسيق الرسائل تلقائياً
- يسهل إضافة صفحات أخطاء جديدة

### 6. Utilities

#### error-mapper

تحويل الأخطاء من أشكال مختلفة إلى شكل موحد:

```tsx
import { mapStatusCodeToErrorType, mapErrorToAPIError } from '@/presentation/pages/errors'

const errorType = mapStatusCodeToErrorType(404) // 'not-found'
const apiError = mapErrorToAPIError(error)
```

#### error-formatter

تنسيق رسائل الأخطاء:

```tsx
import { formatErrorMessage, formatSecondaryMessage } from '@/presentation/pages/errors'

const message = formatErrorMessage(apiError, 'حدث خطأ')
const secondary = formatSecondaryMessage(apiError, errorDetails, 'رسالة افتراضية')
```

#### error-constants

ثوابت الأخطاء:

```tsx
import { ERROR_CODES, ERROR_MESSAGES, ERROR_STATUS_CODES } from '@/presentation/pages/errors'

const code = ERROR_CODES.NOT_FOUND
const message = ERROR_MESSAGES[code]
const status = ERROR_STATUS_CODES['not-found']
```

## 🔄 الهجرة من الهيكل القديم

### قبل

```
pages/
├── ForbiddenPage.tsx      (339 سطر - كود مكرر)
├── ForbiddenPage.scss     (286 سطر)
├── UnauthorizedPage.tsx   (81 سطر - كود مكرر)
└── UnauthorizedPage.scss  (147 سطر)
```

### بعد

```
pages/errors/
├── BaseErrorPage.tsx      (مكون أساسي موحد)
├── pages/
│   ├── ForbiddenPage.tsx      (~50 سطر - يستخدم BaseErrorPage + useErrorPageSetup)
│   ├── UnauthorizedPage.tsx   (~50 سطر - يستخدم BaseErrorPage + useErrorPageSetup)
│   ├── NotFoundPage.tsx       (~50 سطر - يستخدم BaseErrorPage + useErrorPageSetup)
│   ├── ServerErrorPage.tsx    (~50 سطر - يستخدم BaseErrorPage + useErrorPageSetup)
│   ├── NetworkErrorPage.tsx    (~50 سطر - يستخدم BaseErrorPage + useErrorPageSetup)
│   └── MaintenancePage.tsx     (~20 سطر - يستخدم BaseErrorPage فقط)
├── components/
│   ├── ErrorDetailsPanel.tsx
│   ├── ErrorIcon.tsx
│   ├── ErrorActions.tsx
│   └── ErrorMessage.tsx
├── hooks/
│   ├── useErrorDetails.ts
│   ├── useErrorNavigation.ts
│   ├── useErrorRefresh.ts
│   └── useErrorPageSetup.ts   (Hook موحد يقلل التكرار)
└── utils/
    ├── error-mapper.ts
    ├── error-formatter.ts
    └── error-constants.ts
```

## ✅ الفوائد

1. **تقليل التكرار**: من ~850 سطر إلى ~600 سطر (منظم) (-30% في الكود الفعلي)
2. **سهولة الصيانة**: تغيير واحد في `BaseErrorPage` أو `useErrorPageSetup` يؤثر على جميع الصفحات
3. **اتساق التصميم**: جميع صفحات الأخطاء لها نفس المظهر والسلوك
4. **قابلية التوسع**: إضافة صفحة خطأ جديدة أصبح أسهل بكثير (فقط ~50 سطر)
5. **إعادة الاستخدام**: المكونات والـ Hooks قابلة لإعادة الاستخدام في أي مكان
6. **Hook موحد**: `useErrorPageSetup` يقلل التكرار في جميع الصفحات بنسبة ~70%

## 🚀 إضافة صفحة خطأ جديدة

### الطريقة 1: استخدام ErrorPageFactory

```tsx
import { ErrorPageFactory } from '@/presentation/pages/errors'

export const CustomErrorPage: React.FC = () => {
  return ErrorPageFactory.create('server-error', {
    title: 'خطأ مخصص',
    message: 'رسالة مخصصة',
  })
}
```

### الطريقة 2: استخدام BaseErrorPage مباشرة

```tsx
import { BaseErrorPage } from '@/presentation/pages/errors'
import { AlertCircle } from 'lucide-react'

export const CustomErrorPage: React.FC = () => {
  return (
    <BaseErrorPage
      type="server-error"
      title="خطأ مخصص"
      message="رسالة مخصصة"
      icon={AlertCircle}
      iconColor="error"
      showRefreshButton={true}
    />
  )
}
```

### الطريقة 3: إنشاء صفحة كاملة

```tsx
import { BaseErrorPage, useErrorDetails, useErrorNavigation } from '@/presentation/pages/errors'
import { FileX } from 'lucide-react'

export const CustomErrorPage: React.FC = () => {
  const { apiError, errorDetails, attemptedPath } = useErrorDetails()
  const { goHome, retry } = useErrorNavigation()

  return (
    <BaseErrorPage
      type="not-found"
      title="خطأ مخصص"
      message="رسالة مخصصة"
      icon={FileX}
      iconColor="info"
      showRefreshButton={true}
    />
  )
}
```

## 📚 الاستيراد

```tsx
// استيراد جميع المكونات
import {
  BaseErrorPage,
  ErrorPageFactory,
  ForbiddenPage,
  UnauthorizedPage,
  NotFoundPage,
  ServerErrorPage,
  NetworkErrorPage,
  MaintenancePage,
  ErrorIcon,
  ErrorActions,
  ErrorMessage,
  ErrorDetailsPanel,
  useErrorDetails,
  useErrorNavigation,
  useErrorRefresh,
  ERROR_CONFIG,
  ERROR_CODES,
  ERROR_MESSAGES,
  mapStatusCodeToErrorType,
  formatErrorMessage,
} from '@/presentation/pages/errors'
```

## 🔧 التخصيص

### إضافة نوع خطأ جديد

1. إضافة النوع في `core/types.ts`:

```typescript
export type ErrorType =
  | 'forbidden'
  | 'unauthorized'
  | 'not-found'
  | 'server-error'
  | 'network-error'
  | 'maintenance'
  | 'custom-error'
```

1. إضافة الإعدادات في `config/error-config.ts`:

```typescript
'custom-error': {
  type: 'custom-error',
  title: 'خطأ مخصص',
  message: 'رسالة مخصصة',
  icon: AlertCircle,
  iconColor: 'error',
  showRefreshButton: true,
}
```

1. إضافة route في `error.routes.tsx` (إذا لزم الأمر)

## 📊 الإحصائيات

- **عدد الملفات**: ~25 ملف (منظم)
- **التكرار**: <10%
- **الصيانة**: سهلة جداً
- **قابلية التوسع**: عالية جداً
