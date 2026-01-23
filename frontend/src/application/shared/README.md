# Shared - المشترك بين الميزات

> **الوصف:** يحتوي على كل ما يُستخدم عبر أكثر من feature واحدة في طبقة Application.

---

## 📁 الهيكلة

```
shared/
├── hooks/              # Hooks المشتركة
│   ├── useI18n.ts      # Hook للترجمة واللغة
│   ├── useAsyncOperation.ts  # Hook للعمليات غير المتزامنة
│   ├── usePageAuth.ts  # Hook للمصادقة في الصفحات
│   ├── usePageLoading.ts     # Hook لحالة التحميل
│   ├── useModal.ts     # Hook لإدارة حالة Modal
│   ├── useConfirmDialog.ts   # Hook لحوارات التأكيد
│   ├── useSearchFilter.ts    # Hook للبحث والتصفية
│   └── index.ts        # تصدير جميع hooks
├── store/              # Store Factories
│   ├── createAsyncStore.ts   # Factory لإنشاء async stores
│   ├── createPaginatedStore.ts # Factory لإنشاء paginated stores
│   └── index.ts        # تصدير جميع factories
├── utils/              # Utilities المشتركة
│   ├── errorHandler.ts # معالجة الأخطاء الموحدة
│   └── index.ts        # تصدير جميع utilities
├── types/              # أنواع TypeScript مشتركة (اختياري)
│   └── (سيتم إضافتها عند الحاجة)
├── index.ts            # نقطة الدخول الموحدة
└── README.md           # هذا الملف
```

---

## 🎯 المحتويات

### 🎣 hooks/

Hooks المشتركة بين الميزات:

#### 1. **useI18n.ts**

Hook للترجمة واللغة مع دعم RTL/LTR.

```typescript
const { language, direction, changeLanguage, formatDate } = useI18n()
```

#### 2. **useAsyncOperation.ts**

Hook شامل للعمليات غير المتزامنة مع دعم:

- ✅ العمليات العادية (execute)
- ✅ جلب البيانات التلقائي (autoFetch)
- ✅ Polling (interval)
- ✅ Cancellation (AbortController)

```typescript
// مع params
const { data, isLoading, error, execute } = useAsyncOperation(
  async (userId: string) => await fetchUser(userId)
)

// بدون params (مع autoFetch)
const { data, isLoading, error, fetch } = useAsyncOperation(async () => await fetchData(), {
  autoFetch: true,
  interval: 5000,
})
```

#### 3. **usePageAuth.ts**

Hook للمصادقة في الصفحات مع فحص الأدوار و.

```typescript
const { user, isLoading, canAccess, getShouldRedirect, loadingState } = usePageAuth({
  requireAuth: true,
  requiredRole: 'admin',
  requiredPermissions: ['users.manage'],
})
```

#### 4. **usePageLoading.ts**

Hook لحالة التحميل في الصفحات (متوافق مع Clean Architecture).

```typescript
const { isLoading, shouldShowLoading, loadingMessage } = usePageLoading({
  isLoading: loading,
  message: 'جاري التحميل...',
})
```

#### 5. **useModal.ts**

Hook لإدارة حالة Modal مع دعم البيانات المحددة.

```typescript
const editModal = useModal<User>()

editModal.openWith(user)

<Modal isOpen={editModal.isOpen} onClose={editModal.close}>
  {editModal.selectedData && <EditForm user={editModal.selectedData} />}
</Modal>
```

#### 6. **useConfirmDialog.ts**

Hook لحوارات التأكيد (يعتمد على useModal).

```typescript
const confirm = useConfirmDialog()

confirm.open({
  title: 'تأكيد الحذف',
  message: 'هل أنت متأكد؟',
  variant: 'danger',
  onConfirm: async () => {
    await deleteItem()
    confirm.close()
  },
})
```

#### 7. **useSearchFilter.ts**

Hook للبحث والتصفية في الجداول والقوائم.

```typescript
const { searchTerm, setSearchTerm, filter, setFilter, filteredData } = useSearchFilter(users, {
  searchFields: ['email', 'firstName'],
  filterOptions: [
    { value: 'all', label: 'الكل' },
    { value: 'active', label: 'نشط', filterFn: user => user.isActive },
  ],
})
```

---

### 🏪 store/

Store Factories لإنشاء stores قابلة لإعادة الاستخدام:

#### 1. **createAsyncStore.ts**

Factory لإنشاء Zustand stores للعمليات غير المتزامنة.

```typescript
const useUserStore = createAsyncStore({
  fetchFn: async () => await fetchUser(),
  defaultErrorMessage: 'فشل جلب المستخدم',
})
```

#### 2. **createPaginatedStore.ts**

Factory لإنشاء Zustand stores للبيانات المقسمة على صفحات.

```typescript
const useLessonsStore = createPaginatedStore({
  fetchFn: async params => await fetchLessons(params),
  defaultErrorMessage: 'فشل جلب الدروس',
})
```

---

### 🛠️ utils/

Utilities المشتركة:

#### 1. **errorHandler.ts**

معالجة الأخطاء الموحدة.

```typescript
import { ErrorHandler } from '@/application/shared/utils'

try {
  await someOperation()
} catch (err) {
  const error = ErrorHandler.handle(err, 'فشلت العملية')
  console.error(error.message)
}
```

---

## 📋 القواعد

### ✅ ما يجب أن يكون هنا

- **Hooks** تُستخدم في أكثر من feature واحدة
- **Store Factories** قابلة لإعادة الاستخدام
- **Utilities** مشتركة بين features متعددة
- **Types** مشتركة بين features متعددة (عند الحاجة)

### ❌ ما لا يجب أن يكون هنا

- **Hooks** خاصة بميزة واحدة (ضع في `features/feature-name/hooks/`)
- **Stores** خاصة بميزة واحدة (ضع في `features/feature-name/store/`)
- **Services** خاصة بميزة واحدة (ضع في `features/feature-name/services/`)
- **Types** خاصة بميزة واحدة (ضع في `features/feature-name/types/`)

---

## 🔄 الاستخدام

### من نقطة الدخول الموحدة (موصى به)

```typescript
// استيراد من shared/index.ts
import {
  useAsyncOperation,
  usePageAuth,
  useI18n,
  useModal,
  useConfirmDialog,
  createAsyncStore,
  ErrorHandler,
} from '@/application/shared'
```

### من المسارات المحددة

```typescript
// Hooks
import { useAsyncOperation } from '@/application/shared/hooks'

// Stores
import { createAsyncStore } from '@/application/shared/store'

// Utils
import { ErrorHandler } from '@/application/shared/utils'
```

---

## 🏗️ Clean Architecture Compliance

جميع hooks و utilities في هذا المجلد تتبع مبادئ Clean Architecture:

- ✅ **لا تعتمد على Presentation Layer**: لا تستورد React components
- ✅ **Type Safety**: استخدام TypeScript بشكل صارم
- ✅ **Separation of Concerns**: كل hook له مسؤولية واحدة
- ✅ **Composition over Inheritance**: استخدام Composition Pattern

### مثال على Clean Architecture

```typescript
// ✅ صحيح: usePageLoading لا يعيد React component
const { shouldShowLoading, loadingMessage } = usePageLoading({ isLoading })

// ❌ خطأ: لا تعيد LoadingComponent من application layer
// return { LoadingComponent: <LoadingState /> }
```

---

## 📊 العلاقات بين Hooks

```
usePageAuth
  ├── useAuth (from features/auth)
  ├── useRole (from features/auth)
  └── usePageLoading

useConfirmDialog
  └── useModal

useAsyncOperation
  └── ErrorHandler (from utils)
```

---

## 💡 Best Practices

### 1. استخدام TypeScript Generics

```typescript
// ✅ صحيح: type-safe
const modal = useModal<User>()

// ❌ خطأ: فقدان type safety
const modal = useModal()
```

### 2. استخدام Composition

```typescript
// ✅ صحيح: استخدام useConfirmDialog بدلاً من useModal للـ confirm dialogs
const confirm = useConfirmDialog()

// ❌ خطأ: استخدام useModal مباشرة للـ confirm dialogs
const confirm = useModal()
```

### 3. معالجة الأخطاء

```typescript
// ✅ صحيح: استخدام ErrorHandler
const error = ErrorHandler.handle(err, 'فشلت العملية')

// ❌ خطأ: معالجة يدوية
const error = err instanceof Error ? err : new Error('خطأ غير معروف')
```

---

## 🔍 أمثلة متقدمة

### مثال 1: استخدام useAsyncOperation مع polling

```typescript
const { data, isLoading, error, fetch, cancel } = useAsyncOperation(
  async () => await fetchNotifications(),
  {
    autoFetch: true,
    interval: 30000, // Refresh every 30 seconds
  }
)

// إلغاء polling عند unmount
useEffect(() => {
  return () => cancel()
}, [cancel])
```

### مثال 2: استخدام usePageAuth مع permissions

```typescript
const { user, canAccess, getShouldRedirect, loadingState } = usePageAuth({
  requireAuth: true,
  requiredPermissions: ['users.view', 'users.manage'],
})

if (getShouldRedirect()) {
  navigate(ROUTES.FORBIDDEN, { replace: true })
  return null
}

if (loadingState.shouldShowLoading) {
  return <LoadingState fullScreen message={loadingState.loadingMessage} />
}
```

### مثال 3: استخدام useModal مع form

```typescript
const editModal = useModal<User>()
const [formData, setFormData] = useState<User | null>(null)

const handleEdit = (user: User) => {
  editModal.openWith(user)
  setFormData(user)
}

const handleSave = async () => {
  await updateUser(formData!)
  editModal.close()
  setFormData(null)
}
```

---

## 📝 ملاحظات

- **ضع هنا فقط ما يُستخدم في أكثر من feature واحدة**
- **إذا كان شيء يُستخدم في feature واحدة فقط، ضعه في `features/feature-name/`**
- **حافظ على البساطة - لا تضع كل شيء هنا**
- **اتبع Clean Architecture principles**
- **استخدم TypeScript Generics للـ type safety**

---

## 🔗 روابط ذات صلة

### داخل المشروع

- [Application Layer README](../README.md)
- [Features README](../features/README.md)
- [Clean Architecture Guide](../../../docs/SYSTEM_ARCHITECTURE.md)

### داخل القسم

- [ARCHITECTURE.md](./ARCHITECTURE.md) - التوثيق المعماري الشامل
- [CHANGELOG.md](./CHANGELOG.md) - سجل التغييرات

---

## 📚 الملفات التوثيقية

### README.md (هذا الملف)

دليل شامل للقسم مع أمثلة استخدام.

### ARCHITECTURE.md

توثيق معماري شامل يشرح:

- المبادئ المعمارية
- هيكل المجلدات
- Patterns المستخدمة
- Design Decisions
- Best Practices

### CHANGELOG.md

سجل جميع التغييرات المهمة في القسم، مرتبة حسب التاريخ.

---

**آخر تحديث:** 11 يناير 2026  
**الإصدار:** 2.0.0
