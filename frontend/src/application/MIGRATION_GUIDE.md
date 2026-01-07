# 🔄 دليل الهجرة - Migration Guide

> **من:** الهيكلة القديمة  
> **إلى:** الهيكلة الجديدة (Feature-Based Architecture)  
> **التاريخ:** يناير 2026

---

## 📋 نظرة عامة

تم إعادة هيكلة `application/` بالكامل من نمط تقليدي إلى نمط **Feature-Based Architecture**. هذا يعني أن جميع الـ imports تحتاج إلى تحديث.

---

## 🎯 المبدأ الأساسي

**الخبر السار:** معظم الـ imports يمكن أن تبقى كما هي إذا استخدمت `@/application` مباشرة!

بسبب أننا أنشأنا `index.ts` مركزي يصدر كل شيء، يمكنك الاستمرار في استخدام:

```typescript
import { useAuth, useRole } from '@/application'
```

**لكن** إذا كنت تستخدم مسارات محددة، ستحتاج إلى التحديث.

---

## 📊 جدول التحويل الكامل

### 1. Hooks - الـ Hooks

#### ✅ الطريقة الجديدة (موصى بها)

```typescript
// استيراد من index.ts المركزي (يعمل مباشرة!)
import { useAuth, useRole, useOAuth } from '@/application'
import { useApp, useI18n } from '@/application'
import { useLessons } from '@/application'
import { useStorage } from '@/application'
```

#### 🔄 إذا كنت تستخدم مسارات محددة

| القديم                           | الجديد                                  |
| -------------------------------- | --------------------------------------- |
| `@/application/hooks`            | `@/application` (نفس الشيء)             |
| `@/application/hooks/useAuth`    | `@/application/features/auth/hooks`     |
| `@/application/hooks/useRole`    | `@/application/features/auth/hooks`     |
| `@/application/hooks/useOAuth`   | `@/application/features/auth/hooks`     |
| `@/application/hooks/useLessons` | `@/application/features/learning/hooks` |
| `@/application/hooks/useStorage` | `@/application/features/storage/hooks`  |
| `@/application/hooks/useI18n`    | `@/application/shared/hooks`            |
| `@/application/hooks/useApp`     | `@/application/shared/hooks`            |

---

### 2. Services - الخدمات

#### ✅ الطريقة الجديدة (موصى بها)

```typescript
// استيراد من index.ts المركزي
import { authService } from '@/application'
import { learningAssistantService } from '@/application'
import { storageIntegrationService } from '@/application'
import { notificationService } from '@/application'
import { adminService } from '@/application'
import { developerService } from '@/application'
```

#### 🔄 إذا كنت تستخدم مسارات محددة

| القديم                                 | الجديد                                          |
| -------------------------------------- | ----------------------------------------------- |
| `@/application/services/auth`          | `@/application/features/auth/services`          |
| `@/application/services/learning`      | `@/application/features/learning/services`      |
| `@/application/services/storage`       | `@/application/features/storage/services`       |
| `@/application/services/notifications` | `@/application/features/notifications/services` |
| `@/application/services/admin`         | `@/application/features/admin/services`         |
| `@/application/services/developer`     | `@/application/features/developer/services`     |
| `@/application/services/system`        | `@/application/core/services/system`            |
| `@/application/services/ui`            | `@/application/core/services/ui`                |

---

### 3. Interceptors - المعالجات

#### ✅ الطريقة الجديدة

```typescript
import {
  createAuthRequestInterceptor,
  createAuthResponseInterceptor,
  createOfflineResponseInterceptor,
} from '@/application'
```

#### 🔄 إذا كنت تستخدم مسارات محددة

| القديم                                        | الجديد                            |
| --------------------------------------------- | --------------------------------- |
| `@/application/interceptors`                  | `@/application/core/interceptors` |
| `@/application/interceptors/auth.interceptor` | `@/application/core/interceptors` |

---

### 4. Stores - إدارة الحالة

#### ✅ الطريقة الجديدة

```typescript
// استيراد مباشر من feature
import { authStore } from '@/application/features/auth/store'
import { lessonsStore } from '@/application/features/learning/store'
import { storageStore } from '@/application/features/storage/store'
import { notificationStore } from '@/application/features/notifications/store'
```

#### 🔄 إذا كنت تستخدم مسارات محددة

| القديم                                   | الجديد                                       |
| ---------------------------------------- | -------------------------------------------- |
| `@/application/stores/authStore`         | `@/application/features/auth/store`          |
| `@/application/stores/lessonsStore`      | `@/application/features/learning/store`      |
| `@/application/stores/storageStore`      | `@/application/features/storage/store`       |
| `@/application/stores/notificationStore` | `@/application/features/notifications/store` |
| `@/application/stores/userStore`         | `@/application/features/auth/store`          |

---

## 🔍 أمثلة عملية

### مثال 1: استيراد Hooks

```typescript
// ❌ قديم
import { useAuth, useRole } from '@/application/hooks/useAuth'
import { useAuth, useRole } from '@/application/hooks'

// ✅ جديد (الطريقة الموصى بها)
import { useAuth, useRole } from '@/application'

// ✅ جديد (إذا أردت مسار محدد)
import { useAuth, useRole } from '@/application/features/auth/hooks'
```

### مثال 2: استيراد Services

```typescript
// ❌ قديم
import { authService } from '@/application/services/auth'
import { learningAssistantService } from '@/application/services/learning'

// ✅ جديد (الطريقة الموصى بها)
import { authService, learningAssistantService } from '@/application'

// ✅ جديد (إذا أردت مسار محدد)
import { authService } from '@/application/features/auth/services'
import { learningAssistantService } from '@/application/features/learning/services'
```

### مثال 3: استيراد Interceptors

```typescript
// ❌ قديم
import { createAuthRequestInterceptor } from '@/application/interceptors'

// ✅ جديد (الطريقة الموصى بها)
import { createAuthRequestInterceptor } from '@/application'

// ✅ جديد (إذا أردت مسار محدد)
import { createAuthRequestInterceptor } from '@/application/core/interceptors'
```

### مثال 4: استيراد Stores

```typescript
// ❌ قديم
import { authStore } from '@/application/stores/authStore'

// ✅ جديد
import { authStore } from '@/application/features/auth/store/authStore'
```

---

## 🎯 استراتيجية الهجرة

### الطريقة 1: استخدام index.ts المركزي (الأسهل)

**الخبر السار:** إذا كنت تستخدم `@/application/hooks` أو `@/application/services`، يمكنك ببساطة تغييرها إلى `@/application` فقط!

```typescript
// قبل
import { useAuth, useRole } from '@/application/hooks'

// بعد (يعمل مباشرة!)
import { useAuth, useRole } from '@/application'
```

### الطريقة 2: تحديث المسارات المحددة

إذا كنت تستخدم مسارات محددة مثل `@/application/hooks/useAuth`، ستحتاج إلى تحديثها:

```typescript
// قبل
import { useAuth } from '@/application/hooks/useAuth'

// بعد
import { useAuth } from '@/application/features/auth/hooks'
```

---

## 📝 قائمة الملفات التي تحتاج تحديث

### ملفات Presentation Layer

1. **Routing:**
   - `presentation/routing/OAuthCallback.tsx`
   - `presentation/routing/hooks/useNavigation.ts`
   - `presentation/routing/guards/ProtectedRoute.tsx`
   - `presentation/routing/guards/PublicRoute.tsx`
   - `presentation/routing/RouteProvider.tsx`
   - `presentation/routing/hooks/useRouteGuard.ts`

2. **Components:**
   - `presentation/components/layout/LanguageToggle/LanguageToggle.tsx`
   - `presentation/components/layout/MobileMenu/MobileMenu.tsx`
   - `presentation/components/settings/LanguageSettings.tsx`
   - `presentation/layouts/MainLayout.tsx`

3. **Pages:**
   - جميع الصفحات التي تستورد hooks أو services

---

## ✅ خطوات الهجرة

### الخطوة 1: البحث والاستبدال

استبدل جميع:

- `@/application/hooks` → `@/application`
- `@/application/services` → `@/application` (إذا كان ممكن)
- `@/application/interceptors` → `@/application`
- `@/application/stores` → `@/application/features/*/store`

### الخطوة 2: تحديث المسارات المحددة

ابحث عن:

- `@/application/hooks/useAuth` → `@/application/features/auth/hooks`
- `@/application/services/auth` → `@/application/features/auth/services`
- إلخ...

### الخطوة 3: الاختبار

- شغل `npm run build` للتأكد من عدم وجود أخطاء
- شغل `npm run dev` واختبر التطبيق

---

## 🚨 ملاحظات مهمة

1. **لا تحذف الملفات القديمة بعد:** اتركها مؤقتاً حتى تتأكد من أن كل شيء يعمل
2. **اختبر كل feature:** تأكد من أن كل ميزة تعمل بعد التحديث
3. **احفظ نسخة احتياطية:** قبل البدء، تأكد من وجود commit في Git

---

## 📚 المراجع

- **الهيكلة الجديدة:** راجع `README.md`
- **Core:** راجع `core/README.md`
- **Features:** راجع `features/README.md`
- **Shared:** راجع `shared/README.md`

---

**آخر تحديث:** يناير 2026
