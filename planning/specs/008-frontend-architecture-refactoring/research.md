# بحث: Frontend Architecture Refactoring

**المرحلة**: 0 (المخطط والبحث)  
**التاريخ**: 2026-02-09  
**المدخلات**: NEEDS CLARIFICATION المُحددة في `plan.md`

## نتائج البحث (Research Findings)

### 1. استراتيجية Offline Support مع TanStack Query

**القرار**: استخدام `@tanstack/query-persist-client` مع `IndexedDB` adapter

**المبرر**:
- TanStack Query يدعم `persistQueryClient` الذي يتكامل مع `IndexedDB` مباشرة عبر adapter.
- النظام الحالي يستخدم `enhancedCacheService` الذي يعتمد على `IndexedDB` بالفعل.
- يمكن دمج الاثنين: Query Cache للبيانات الحساسة للوقت (real-time)، و Enhanced Cache للبيانات طويلة الأمد (مثل AI models).

**البدائل التي تم النظر فيها**:
- ❌ **LocalStorage Persistence**: محدود بحجم 5-10 ميجابايت، غير كافٍ لبيانات التطبيق الكبيرة.
- ❌ **Custom Integration بين Zustand و IndexedDB**: زيادة في التعقيد وتكرار في الكود مع وجود حل جاهز في TanStack.

**خطة التكامل**:
```typescript
// src/application/shared/api/query-client.ts
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { indexedDBService } from '@/infrastructure/services/storage/indexeddb.service'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (was cacheTime)
    },
  },
})

// استخدام IndexedDB بدلاً من LocalStorage
const persister = createSyncStoragePersister({
  storage: {
    getItem: (key) => indexedDBService.get('query-cache', key),
    setItem: (key, value) => indexedDBService.set('query-cache', key, value),
    removeItem: (key) => indexedDBService.delete('query-cache', key),
  },
})
```

---

### 2. تحليل محتوى `database-core`

**النتائج**:
تم فحص المجلد `apps/frontend/src/application/features/database-core` ووُجد أنه يحتوي على:
- **13 custom hooks**: تتعامل مع جداول مختلفة (courses, lessons, enrollments).
- **10 services**: تغليف لـ APIs محلية أو remote.
- **9 types**: تعريفات للكيانات (Entities).
- **4 utils**: دوال مساعدة لتحويل البيانات.

**القرار**: تقسيم `database-core` إلى ميزات فرعية (Sub-features)

**المبرر**:
- المجلد الحالي يخالف مبدأ "Feature-Sliced" لأنه يجمع كيانات غير مترابطة وظيفياً.
- من الأفضل فصله إلى:
  - `features/courses`
  - `features/lessons`
  - `features/enrollments`
  - مع نقل الأجزاء المشتركة إلى `shared/database/`

**البدائل التي تم النظر فيها**:
- ❌ **نقل الكل إلى `infrastructure`**: منطق العمل سيختلط بمنطق التطبيق.
- ❌ **دمجه مع `learning-paths`**: يخلق اعتمادية دائرية (circular dependency).

---

### 3. أفضل ممارسات TanStack Query للمشاريع الكبيرة

**القرار**: استخدام `Query Key Factory Pattern`

**المبرر**:
- يمنع تضارب المفاتيح بين الميزات المختلفة.
- يسهّل إدارة Invalidation (إلغاء صلاحية الكاش).

**مثال**:
```typescript
// src/application/shared/api/query-keys.ts
export const queryKeys = {
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
    users: (filters?: UserFilters) => [...queryKeys.admin.all, 'users', filters] as const,
  },
  projects: {
    all: ['projects'] as const,
    list: (filters?: ProjectFilters) => [...queryKeys.projects.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.projects.all, 'detail', id] as const,
  },
}
```

**البدائل التي تم النظر فيها**:
- ❌ **String-based keys**: عرضة للأخطاء الإملائية وصعبة الصيانة.
- ❌ **Enum-based keys**: أقل مرونة ولا يدعم المعاملات (params).

---

## التوصيات النهائية (Final Recommendations)

1. ✅ اعتماد `@tanstack/react-query` مع `persist-client` للتخزين المؤقت.
2. ✅ تطبيق `Query Key Factory` لضمان التناسق.
3. ✅ تقسيم `database-core` إلى ميزات صغيرة قبل الترحيل.
4. ✅ إنشاء `shared/hooks/` لـ Generic Patterns (مثل `useInfiniteScroll`).

## الخطوات التالية

- [x] توثيق نتائج البحث.
- [ ] الانتقال إلى المرحلة 1: تصميم نماذج البيانات (data-model.md).
- [ ] إنشاء دليل البدء السريع (quickstart.md).
