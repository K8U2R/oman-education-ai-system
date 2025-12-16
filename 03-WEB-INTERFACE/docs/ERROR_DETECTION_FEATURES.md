# 🔍 نظام كشف وعرض الأخطاء - Error Detection & Display System

## 📋 نظرة عامة

تم إضافة نظام شامل لكشف وعرض الأخطاء في FlowForge IDE يتضمن:

1. **Error Boundary** - لحماية المكونات من الأخطاء
2. **Error Store** - إدارة حالة الأخطاء
3. **Error Display** - عرض الأخطاء للمستخدم
4. **Error Service** - خدمة مركزية للأخطاء
5. **Editor Error Detection** - كشف الأخطاء في المحرر
6. **API Error Handling** - معالجة أخطاء API

---

## 🎯 المميزات

### 1. Error Boundary

**الملف:** `src/core/error/ErrorBoundary.tsx`

- ✅ يلتقط الأخطاء في المكونات
- ✅ يعرض واجهة خطأ صديقة للمستخدم
- ✅ خيارات: Try Again, Reload, Go Home
- ✅ تسجيل الأخطاء تلقائياً

**الاستخدام:**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. Error Store (Zustand)

**الملف:** `src/core/error/ErrorStore.ts`

- ✅ إدارة حالة الأخطاء مركزياً
- ✅ دعم مستويات مختلفة: error, warning, info, success
- ✅ إضافة/إزالة/مسح الأخطاء
- ✅ تصفية الأخطاء حسب المستوى

**الاستخدام:**
```tsx
import { useErrorStore } from '@/core/error/ErrorStore';

const { addError, removeError, clearAll } = useErrorStore();
```

### 3. Error Display Component

**الملف:** `src/core/error/ErrorDisplay.tsx`

- ✅ عرض الأخطاء بشكل منظم
- ✅ أيقونات ملونة حسب المستوى
- ✅ تفاصيل قابلة للطي
- ✅ إمكانية الإغلاق

**المستويات:**
- 🔴 **Error** - أخطاء حرجة
- 🟡 **Warning** - تحذيرات
- 🔵 **Info** - معلومات
- 🟢 **Success** - نجاح

### 4. Error Panel

**الملف:** `src/core/error/ErrorPanel.tsx`

- ✅ لوحة عائمة لعرض الأخطاء
- ✅ مؤشر في الزاوية السفلية
- ✅ عدد الأخطاء والتحذيرات
- ✅ إمكانية الإغلاق والمسح

### 5. Error Service

**الملف:** `src/core/error/ErrorService.ts`

- ✅ خدمة مركزية للأخطاء
- ✅ معالجة الأخطاء العامة (Global Errors)
- ✅ معالجة Promise Rejections
- ✅ تسجيل تلقائي للأخطاء
- ✅ تكامل مع خدمات تتبع الأخطاء الخارجية

**الاستخدام:**
```tsx
import { errorService } from '@/core/error/ErrorService';

errorService.logError(error, errorInfo, {
  title: 'Custom Error',
  message: 'Error message',
  level: 'error',
});
```

### 6. Editor Error Detection

**الملف:** `src/modules/code-editor/EditorErrors.tsx`

- ✅ كشف الأخطاء في Monaco Editor
- ✅ عرض الأخطاء والتحذيرات
- ✅ النقر للانتقال إلى السطر
- ✅ تكامل مع Error Store

**المميزات:**
- Syntax Errors
- Type Errors
- Linting Warnings
- Custom Validation

### 7. API Error Handler

**الملف:** `src/services/api/errorHandler.ts`

- ✅ معالجة أخطاء Axios
- ✅ رسائل خطأ حسب Status Code
- ✅ تفاصيل الخطأ
- ✅ Helper function للـ async functions

**الاستخدام:**
```tsx
import { handleApiError, withErrorHandling } from '@/services/api/errorHandler';

// Manual handling
try {
  await apiCall();
} catch (error) {
  handleApiError(error);
}

// Automatic handling
const safeApiCall = withErrorHandling(apiCall);
```

### 8. Error Helper Hook

**الملف:** `src/hooks/useErrorHandler.ts`

- ✅ Hook لمعالجة الأخطاء في المكونات
- ✅ دوال مساعدة: handleError, showWarning, showInfo, showSuccess
- ✅ تكامل مع Error Service

**الاستخدام:**
```tsx
import { useErrorHandler } from '@/hooks/useErrorHandler';

const { handleError, showWarning, showSuccess } = useErrorHandler();

// In component
try {
  // code
} catch (error) {
  handleError(error, 'Operation Failed');
}
```

### 9. Error Helpers

**الملف:** `src/utils/errorHelpers.ts`

- ✅ دوال مساعدة لتحليل الأخطاء
- ✅ كشف نوع الخطأ (Network, Timeout)
- ✅ تنسيق الأخطاء للعرض

**الدوال:**
- `getErrorMessage(error)` - استخراج رسالة الخطأ
- `getErrorStack(error)` - استخراج Stack Trace
- `isNetworkError(error)` - كشف أخطاء الشبكة
- `isTimeoutError(error)` - كشف أخطاء Timeout
- `formatErrorForDisplay(error)` - تنسيق الخطأ للعرض

---

## 🚀 التكامل

### في App.tsx

```tsx
import ErrorBoundary from '@/core/error/ErrorBoundary';
import ErrorPanel from '@/core/error/ErrorPanel';
import '@/core/error/ErrorService'; // Initialize

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
      <ErrorPanel />
    </ErrorBoundary>
  );
}
```

### في المكونات

```tsx
import { useErrorHandler } from '@/hooks/useErrorHandler';
import ErrorBoundary from '@/core/error/ErrorBoundary';

function MyComponent() {
  const { handleError, showSuccess } = useErrorHandler();

  const handleAction = async () => {
    try {
      await doSomething();
      showSuccess('Success', 'Operation completed successfully');
    } catch (error) {
      handleError(error, 'Operation Failed');
    }
  };

  return (
    <ErrorBoundary>
      {/* Component content */}
    </ErrorBoundary>
  );
}
```

### في API Calls

```tsx
import { withErrorHandling } from '@/services/api/errorHandler';

const fetchData = withErrorHandling(async () => {
  const response = await api.get('/data');
  return response.data;
});
```

---

## 📊 Scripts المضافة

تم إضافة scripts جديدة في `package.json`:

```json
{
  "scripts": {
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,scss}\"",
    "type-check": "tsc --noEmit",
    "test:coverage": "vitest --coverage",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## 🎨 واجهة المستخدم

### Error Panel
- يظهر في الزاوية السفلية اليسرى
- مؤشر ملون حسب نوع الخطأ
- عدد الأخطاء والتحذيرات
- قابلة للطي والفتح

### Error Display
- بطاقات ملونة حسب المستوى
- أيقونات واضحة
- تفاصيل قابلة للطي
- زر إغلاق

### Editor Errors
- تظهر في أسفل المحرر
- قائمة بالأخطاء والتحذيرات
- النقر للانتقال إلى السطر
- ألوان مختلفة حسب الخطورة

---

## 🔧 التخصيص

### إضافة Validation Rules

```tsx
import { addCustomValidation } from '@/modules/code-editor/LintingService';

addCustomValidation(model, [
  {
    pattern: /console\.log/,
    message: 'Avoid console.log in production',
    severity: monaco.MarkerSeverity.Warning,
  },
]);
```

### تكامل مع Error Tracking Service

```tsx
// في ErrorService.ts
if (window.errorTracking) {
  window.errorTracking.captureException(error, options);
}
```

---

## 📝 ملاحظات

1. **Auto-dismiss**: رسائل Success تُغلق تلقائياً بعد 5 ثوان
2. **Error Logging**: جميع الأخطاء تُسجل في Console
3. **Error Boundaries**: يجب استخدامها حول المكونات الحرجة
4. **API Errors**: يتم معالجتها تلقائياً مع رسائل واضحة

---

## 🐛 Debugging

### عرض جميع الأخطاء

```tsx
import { useErrorStore } from '@/core/error/ErrorStore';

const { errors } = useErrorStore();
console.log('All errors:', errors);
```

### مسح جميع الأخطاء

```tsx
const { clearAll } = useErrorStore();
clearAll();
```

### تصفية حسب المستوى

```tsx
const { getErrorsByLevel } = useErrorStore();
const errors = getErrorsByLevel('error');
```

---

**تاريخ الإضافة:** 2025-12-13  
**الإصدار:** 1.0.0

