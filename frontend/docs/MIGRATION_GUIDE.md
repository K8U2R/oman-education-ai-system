# 🔄 Migration Guide - دليل الانتقال

## 📋 نظرة عامة

هذا الدليل يشرح كيفية الانتقال من الكود القديم إلى البنية الجديدة المحسّنة.

---

## 🎯 التغييرات الرئيسية

### 1. API Client

#### ❌ القديم:
```typescript
import { apiClient } from '@/infrastructure/api/api-client'
```

#### ✅ الجديد:
```typescript
import { apiClientRefactored as apiClient } from '@/infrastructure/api'
// أو
import { apiClientRefactored } from '@/infrastructure/api'
```

**السبب:** 
- `api-client.ts` القديم يحتوي على business logic
- `api-client.refactored.ts` يستخدم HttpClient النقي + Interceptors
- Business logic موجود في Application Layer

---

### 2. Storage Adapter

#### ❌ القديم:
```typescript
import { storageAdapter } from '@/infrastructure/storage'

// Sync only
const value = storageAdapter.get('key')
storageAdapter.set('key', 'value')
```

#### ✅ الجديد (موصى به):
```typescript
import { storageService, createStorageService } from '@/infrastructure/storage'

// Sync adapter
const localStorage = createStorageService('localStorage')
const value = localStorage.get('key')
localStorage.set('key', 'value')

// Async adapter
const indexedDB = createStorageService('indexeddb')
const value = await indexedDB.getAsync('key')
await indexedDB.setAsync('key', 'value')
```

**السبب:**
- `storageAdapter` هو singleton مباشر
- `storageService` يوفر factory pattern
- يدعم Sync و Async adapters بشكل موحد

---

### 3. HTTP Client (للاستخدام المباشر)

#### ✅ الجديد:
```typescript
import { httpClient, createHttpClient } from '@/infrastructure/http'

// استخدام مباشر
const response = await httpClient.get('/users')

// أو إنشاء instance جديد للاختبار
const testClient = createHttpClient({ 
  baseURL: 'http://test-api',
  timeout: 5000 
})
```

**الاستخدام:**
- للاستخدام المباشر في Infrastructure Layer
- للاختبارات
- لإنشاء clients مخصصة

---

## 📝 خطوات Migration

### المرحلة 1: API Client Migration

#### الخطوة 1: تحديث Imports
```typescript
// قبل
import { apiClient } from '@/infrastructure/api/api-client'

// بعد
import { apiClientRefactored as apiClient } from '@/infrastructure/api'
```

#### الخطوة 2: اختبار
- ✅ اختبار جميع API calls
- ✅ اختبار refresh token flow
- ✅ اختبار error handling

#### الخطوة 3: حذف الكود القديم (بعد التأكد)
```typescript
// يمكن حذف api-client.ts القديم بعد التأكد من عدم وجود استخدامات
```

---

### المرحلة 2: Storage Migration (اختياري)

#### الخطوة 1: تحديث Imports
```typescript
// قبل
import { storageAdapter } from '@/infrastructure/storage'

// بعد
import { storageService, createStorageService } from '@/infrastructure/storage'
```

#### الخطوة 2: تحديث الاستخدام
```typescript
// قبل
const token = storageAdapter.get('access_token')

// بعد (sync)
const token = storageService.get('access_token')

// أو (async - للـ IndexedDB)
const token = await storageService.getAsync('access_token')
```

#### الخطوة 3: Migration تدريجي
- يمكن استخدام `storageAdapter` القديم والجديد معاً
- Migration تدريجي حسب الحاجة

---

## 🔍 التحقق من Migration

### 1. البحث عن الاستخدامات القديمة
```bash
# في terminal
grep -r "from '@/infrastructure/api/api-client'" frontend/src
grep -r "from.*api-client'" frontend/src
```

### 2. TypeScript Check
```bash
npm run type-check
```

### 3. Build Check
```bash
npm run build
```

---

## ⚠️ ملاحظات مهمة

### 1. التوافق مع الكود القديم
- الكود القديم ما زال يعمل
- Migration تدريجي ممكن
- لا حاجة لتغيير كل شيء دفعة واحدة

### 2. Breaking Changes
- ❌ لا توجد breaking changes
- ✅ API نفسه (get, post, put, delete)
- ✅ فقط التغيير في الـ import path

### 3. Performance
- ✅ نفس الأداء
- ✅ نفس الـ features
- ✅ تحسينات في البنية فقط

---

## 🧪 الاختبار بعد Migration

### 1. Unit Tests
```bash
npm run test
```

### 2. Integration Tests
- اختبار API calls
- اختبار Auth flow
- اختبار Error handling

### 3. Manual Testing
- تسجيل الدخول
- Refresh token
- Network errors
- Offline mode

---

## 📚 المراجع

- `INFRASTRUCTURE_REFACTORING_COMPLETE.md` - ملخص الإصلاحات
- `INFRASTRUCTURE_REFACTORING_PLAN.md` - الخطة الكاملة
- `INFRASTRUCTURE_REFACTORING_STATUS.md` - حالة التنفيذ

---

**آخر تحديث:** 2024

