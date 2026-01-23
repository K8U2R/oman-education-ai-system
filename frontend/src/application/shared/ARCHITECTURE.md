# Architecture - التوثيق المعماري

> **الوصف:** توثيق معماري شامل لهيكل `application/shared` ومبادئ التصميم.

---

## 🏗️ نظرة عامة

`application/shared` هو مجلد يحتوي على جميع المكونات المشتركة بين الميزات المختلفة في طبقة Application. يتبع مبادئ **Clean Architecture** و **Domain-Driven Design (DDD)**.

---

## 📐 المبادئ المعمارية

### 1. Clean Architecture Compliance

جميع المكونات في `shared` تتبع مبادئ Clean Architecture:

```
┌─────────────────────────────────────┐
│     Presentation Layer              │
│  (Components, Pages, Routes)        │
└──────────────┬──────────────────────┘
               │ Uses
               ▼
┌─────────────────────────────────────┐
│     Application Layer               │
│  ┌──────────────────────────────┐  │
│  │   shared/                     │  │
│  │   ├── hooks/                  │  │
│  │   ├── store/                  │  │
│  │   ├── utils/                  │  │
│  │   └── types/                   │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │   features/                   │  │
│  └──────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ Uses
               ▼
┌─────────────────────────────────────┐
│     Domain Layer                    │
│  (Entities, Value Objects, Types)   │
└─────────────────────────────────────┘
```

**القواعد:**

- ✅ `shared` لا يعتمد على `presentation`
- ✅ `shared` يمكنه الاعتماد على `domain`
- ✅ `shared` يمكنه الاعتماد على `features` (بحذر)
- ❌ `shared` لا يحتوي على React components
- ❌ `shared` لا يحتوي على routing logic

### 2. Dependency Rule

```
shared/
  ├── hooks/          → domain, features (limited)
  ├── store/          → domain
  ├── utils/          → domain (optional)
  └── types/          → domain
```

**مثال على الاعتماديات الصحيحة:**

```typescript
// ✅ صحيح: shared يعتمد على domain
import type { UserRole, Permission } from '@/domain/types/auth.types'

// ✅ صحيح: shared يعتمد على features (محدود)
import { useAuth, useRole } from '@/application/features/auth'

// ❌ خطأ: shared يعتمد على presentation
import { LoadingState } from '@/presentation/pages/components'
```

### 3. Single Responsibility Principle

كل hook أو utility له مسؤولية واحدة واضحة:

- `useI18n` → الترجمة واللغة فقط
- `usePageAuth` → المصادقة في الصفحات فقط
- `useModal` → إدارة حالة Modal فقط
- `ErrorHandler` → معالجة الأخطاء فقط

---

## 📁 هيكل المجلدات

### hooks/

Hooks المشتركة بين الميزات.

**التنظيم:**

```
hooks/
├── useI18n.ts              # Internationalization
├── useAsyncOperation.ts    # Async Operations
├── usePageAuth.ts          # Page Management
├── usePageLoading.ts       # Page Management
├── useModal.ts             # UI State
├── useConfirmDialog.ts     # UI State
├── useSearchFilter.ts      # UI State
└── index.ts                # Exports
```

**القواعد:**

- كل hook في ملف منفصل
- استخدام TypeScript Generics للـ type safety
- لا تعتمد على presentation layer
- توثيق شامل مع أمثلة

### store/

Store Factories لإنشاء Zustand stores قابلة لإعادة الاستخدام.

**التنظيم:**

```
store/
├── createAsyncStore.ts      # Factory للـ async stores
├── createPaginatedStore.ts  # Factory للـ paginated stores
└── index.ts                 # Exports
```

**القواعد:**

- استخدام Factory Pattern
- دعم TypeScript Generics
- معالجة أخطاء موحدة

### utils/

Utilities المشتركة.

**التنظيم:**

```
utils/
├── errorHandler.ts          # معالجة الأخطاء
└── index.ts                 # Exports
```

**القواعد:**

- دوال pure functions عندما يكون ذلك ممكناً
- لا تعتمد على React
- يمكن استخدامها في أي مكان

### types/

أنواع TypeScript المشتركة (اختياري).

**التنظيم:**

```
types/
└── index.ts                 # Exports (حالياً فارغ)
```

**القواعد:**

- فقط الأنواع المستخدمة في أكثر من feature
- لا تكرر أنواع من domain layer

---

## 🔄 Patterns المستخدمة

### 1. Composition Pattern

استخدام Composition over Inheritance:

```typescript
// useConfirmDialog يستخدم useModal داخلياً
export function useConfirmDialog() {
  const modal = useModal<ConfirmDialogOptions>()
  // ...
}
```

### 2. Factory Pattern

استخدام Factory functions لإنشاء stores:

```typescript
const useUserStore = createAsyncStore({
  fetchFn: async () => await fetchUser(),
})
```

### 3. Hook Composition

تجميع hooks معاً:

```typescript
// usePageAuth يجمع useAuth, useRole, usePageLoading
export function usePageAuth() {
  const { user } = useAuth()
  const { hasRole } = useRole()
  const loadingState = usePageLoading()
  // ...
}
```

---

## 🎯 Design Decisions

### لماذا لا نستخدم `useApp`؟

`useApp` كان يجمع `useAuth`, `useI18n`, `useRole` في hook واحد، لكنه:

- ❌ ينتهك Clean Architecture (shared يعتمد على features)
- ❌ يخلق coupling غير ضروري
- ❌ يجعل الاختبار أصعب

**الحل:** استخدام hooks مباشرة في components.

### لماذا دمجنا `useApiState` في `useAsyncOperation`؟

- ✅ تقليل التكرار
- ✅ واجهة موحدة
- ✅ دعم أفضل للـ type safety

### لماذا `usePageAuth` لا يقوم بإعادة التوجيه؟

- ✅ فصل الاهتمامات (Separation of Concerns)
- ✅ مرونة أكبر في presentation layer
- ✅ متوافق مع Clean Architecture

---

## 📊 العلاقات بين المكونات

```
usePageAuth
  ├── useAuth (from features/auth)
  ├── useRole (from features/auth)
  └── usePageLoading

useConfirmDialog
  └── useModal

useAsyncOperation
  └── ErrorHandler (from utils)

createAsyncStore
  └── ErrorHandler (from utils)

createPaginatedStore
  └── ErrorHandler (from utils)
```

---

## ✅ Best Practices

### 1. Type Safety

```typescript
// ✅ صحيح: استخدام Generics
const modal = useModal<User>()

// ❌ خطأ: فقدان type safety
const modal = useModal()
```

### 2. Clean Architecture

```typescript
// ✅ صحيح: لا يعيد React component
const { shouldShowLoading } = usePageLoading()

// ❌ خطأ: يعيد React component من application layer
return { LoadingComponent: <LoadingState /> }
```

### 3. Error Handling

```typescript
// ✅ صحيح: استخدام ErrorHandler
const error = ErrorHandler.handle(err, 'فشلت العملية')

// ❌ خطأ: معالجة يدوية
const error = err instanceof Error ? err : new Error('خطأ')
```

---

## 🔍 Testing Strategy

### Unit Tests

كل hook يجب أن يكون قابل للاختبار بشكل منفصل:

```typescript
describe('useModal', () => {
  it('should open modal with data', () => {
    const { result } = renderHook(() => useModal<User>())
    act(() => {
      result.current.openWith(mockUser)
    })
    expect(result.current.isOpen).toBe(true)
    expect(result.current.selectedData).toEqual(mockUser)
  })
})
```

### Integration Tests

اختبار التفاعل بين hooks:

```typescript
describe('usePageAuth with usePageLoading', () => {
  it('should show loading when auth is loading', () => {
    // ...
  })
})
```

---

## 📚 المراجع

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [React Hooks Best Practices](https://react.dev/reference/react/hooks)

---

**آخر تحديث:** 11 يناير 2026  
**الإصدار:** 2.0.0
