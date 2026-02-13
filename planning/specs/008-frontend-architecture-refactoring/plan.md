# خطة التنفيذ: Frontend Architecture Refactoring

**الفرع**: `008-frontend-architecture-refactoring` | **التاريخ**: 2026-02-09 | **المواصفات**: [spec.md](./spec.md)
**المدخلات**: مواصفات الميزة من `/specs/008-frontend-architecture-refactoring/spec.md`

## الملخص (Summary)

إعادة هيكلة معمارية الواجهة الأمامية لتوحيد إدارة الحالة باستخدام TanStack Query، ومواءمة هيكلة المجلدات بين طبقات التطبيق والعرض، وتنظيف الديون التقنية في `database-core`.

## السياق التقني (Technical Context)

**اللغة/الإصدار**: TypeScript 5.x, React 18
**التبعيات الأساسية**: `@tanstack/react-query` v5, `zustand`, `axios`
**التخزين**: `IndexedDB` (via `enhancedCacheService`), `LocalStorage`
**الاختبار**: `vitest`, `react-testing-library`
**المنصة المستهدفة**: Web (Vite)
**نوع المشروع**: Frontend Monolith (part of a Fullstack System)
**أهداف الأداء**: تقليل حجم الكود، تحسين الكاشينج (Stale-while-revalidate).
**القيود**: يجب الحفاظ على عمل التطبيق دون توقف أثناء الترحيل (Incremental Migration).

## فحص الدستور (Constitution Check)

*بوابة: يجب اجتيازها قبل بحث المرحلة 0.*

- [x] **سيادة الوحدات (Modularity)**: الخطة تعزز فصل الاهتمامات وتجعل كل ميزة مستقلة بذاتها.
- [x] **الحفاظ على النوع (Type Safety)**: استخدام `TanStack Query` مع TypeScript يحسن سلامة الأنواع للبيانات القادمة من الخادم.
- [x] **قابلية الصيانة**: تقليل الكود المكرر هو هدف رئيسي.

## هيكل المشروع (Project Structure)

### التوثيق (هذه الميزة)

```text
planning/specs/008-frontend-architecture-refactoring/
├── plan.md              # هذا الملف
├── research.md          # مخرجات المرحلة 0
├── data-model.md        # مخرجات المرحلة 1 (Query Keys & Store Shape)
└── tasks.md             # مخرجات المرحلة 2 (قائمة المهام التنفيذية)
```

### المصدر البرمجي (التغييرات المقترحة)

```text
apps/frontend/src/
├── application/
│   ├── shared/
│   │   ├── api/
│   │   │   └── query-client.ts  # [NEW] تكوين TanStack Query المركزي
│   │   └── hooks/
│   │       └── useResource.ts   # [NEW] Generic Hook (اختياري)
│   └── features/
│       ├── admin/               # [REFACTOR] إزالة Store Fetching
│       └── projects/            # [REFACTOR] استخدام useQuery
└── presentation/
    └── features/
        ├── admin/               # [RENAME] كان system-administration-portal
        ├── projects/            # [RENAME] كان project-management-dashboard
        └── ...
```

**قرار الهيكل**: سنعتمد هيكل "Feature-Sliced" معدل، حيث تتطابق أسماء المجلدات في الطبقات المختلفة لسهولة التنقل. سنبدأ بإنشاء `presentation/features/admin` (كنسخة أو إعادة تسمية) للتأكد من عدم كسر المسارات.

## المراحل (Phases)

### المرحلة 0: المخطط والبحث

1. **استخراج المجهول**:
   - كيف سيتم التعامل مع "Offline Support" الحالي مع TanStack Query؟ (يحتاج بحث: `persistQueryClient`)
   - ما هو الهيكل الداخلي الدقيق لـ `database-core`؟ (يحتاج تحليل: `file listing analysis`)

2. **مهام البحث**:
   - [ ] بحث: استراتيجية `persistQueryClient` مع `enhancedCacheService`.
   - [ ] تحليل: محتوى `database-core` وتبعيته.

### المرحلة 1: التصميم والعقود

1. **تصميم إدارة الحالة**:
   - تحديد المخزن (Store) الذي سيبقى في Zustand (Client Only).
   - تعريف مصنع مفاتيح الاستعلام (Query Key Factory Pattern).

2. **تحديث سياق الوكيل**:
   - توثيق الأنماط الجديدة لـ `useQuery` لضمان التزام الذكاء الاصطناعي بها مستقبلاً.

### المرحلة 2: التنفيذ (الخط)

سيتم تقسيم العمل إلى مسارات (Tracks) متوازية لضمان عدم تأثر العمل اليومي:

1. **Track A: Infrastructure Setup**: إعداد `QueryClient` وتكامله مع `App.tsx`.
2. **Track B: Admin Migration**: تحويل `useAdmin`.
3. **Track C: Projects Migration**: تحويل `useProjects`.
4. **Track D: Renaming**: توحيد المسميات (يتطلب تحديث `imports` ضخم).

---

## تتبع التعقيد

| الانتهاك | لماذا هو مطلوب | البديل الأبسط المرفوض |
|-----------|------------|-------------------------------------|
| استخدام مكتبة إضافية `TanStack Query` | إدارة الكاش، إعادة المحاولة، التزامن معقدة جداً يدوياً | الاستمرار في `useEffect` + `useState` (يسبب تكراراً وأخطاء سباق) |
