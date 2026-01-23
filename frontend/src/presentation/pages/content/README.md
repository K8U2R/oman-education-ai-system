# 📚 Content Pages - صفحات المحتوى التعليمي

## 📋 نظرة عامة

قسم `content` يحتوي على صفحات إدارة المحتوى التعليمي في نظام التعليم الذكي العماني. يوفر واجهات شاملة لإدارة الدروس، المسارات التعليمية، والمواد الدراسية بطريقة احترافية ومنظمة.

**الهدف الرئيسي:** توفير واجهات موحدة ومنظمة لإدارة المحتوى التعليمي مع تقليل التكرار وتحسين الصيانة.

---

## 🏗️ الهيكل التنظيمي

```
frontend/src/presentation/pages/content/
│
├── 📄 LessonsManagementPage.tsx          # صفحة إدارة الدروس
├── 📄 LessonFormPage.tsx                 # صفحة إنشاء/تعديل درس
├── 📄 LearningPathsManagementPage.tsx    # صفحة إدارة المسارات التعليمية
│
├── 🎨 styles/
│   ├── LessonsManagementPage.scss        # أنماط صفحة الدروس
│   ├── LessonFormPage.scss               # أنماط صفحة نموذج الدرس
│   ├── LearningPathsManagementPage.scss  # أنماط صفحة المسارات
│   └── ManagementPageBase.scss           # الأنماط المشتركة (80% من الكود)
│
├── 📦 constants/
│   ├── lessonsColumns.tsx                 # أعمدة جدول الدروس
│   ├── learningPathsColumns.tsx          # أعمدة جدول المسارات
│   └── index.ts                          # تصدير الثوابت
│
├── 📄 index.ts                           # تصدير الصفحات
└── 📄 README.md                          # هذا الملف
```

### 📊 إحصائيات القسم

- **عدد الصفحات:** 3 صفحات رئيسية
- **عدد المكونات المشتركة:** 2 (columns constants)
- **عدد ملفات الأنماط:** 4 (3 صفحات + 1 مشترك)
- **تقليل التكرار:** ~75% مقارنة بالنسخة الأصلية

---

## 🔧 المكونات والهوكس المستخدمة

### 🎣 Hooks الموحدة

#### 1. `useDataFetcher<T>`

Hook موحد لجلب البيانات من API مع معالجة الأخطاء والتحميل.

```typescript
const {
  data: lessons,
  loading: lessonsLoading,
  setData: setLessons,
} = useDataFetcher<Lesson>(API_ENDPOINTS.CONTENT.LESSONS)
```

**المزايا:**

- ✅ معالجة تلقائية للأخطاء
- ✅ إدارة حالة التحميل
- ✅ إعادة الجلب (refetch)
- ✅ تحديث البيانات يدوياً

#### 2. `useSearch<T>`

Hook موحد للبحث والتصفية في البيانات.

```typescript
const { searchTerm, setSearchTerm, filteredData } = useSearch<Lesson>(lessons, {
  searchFields: ['title'],
})
```

**المزايا:**

- ✅ بحث في حقول متعددة
- ✅ دالة بحث مخصصة
- ✅ case-sensitive/insensitive
- ✅ عدد النتائج تلقائياً

#### 3. `useModal<T>`

Hook موحد لإدارة حالة الـ modals.

```typescript
const deleteModal = useModal<Lesson>()

// فتح modal
deleteModal.open(lesson)

// إغلاق modal
deleteModal.close()

// التحقق من الحالة
if (deleteModal.isOpen) { ... }
```

### 🧩 المكونات المشتركة

#### 1. `AdminPageWrapper`

مكون wrapper للصفحات الإدارية يوفر:

- ✅ فحص المصادقة و تلقائياً
- ✅ إعادة التوجيه عند عدم وجود صلاحيات
- ✅ عرض حالة التحميل

```typescript
<AdminPageWrapper
  requiredPermissions={['lessons.view', 'lessons.manage']}
  loadingMessage="جاري تحميل الدروس..."
>
  {/* محتوى الصفحة */}
</AdminPageWrapper>
```

#### 2. `LoadingWrapper`

مكون wrapper لعرض حالة التحميل.

```typescript
<LoadingWrapper isLoading={lessonsLoading} message="جاري تحميل الدروس...">
  <DataTable data={lessons} />
</LoadingWrapper>
```

#### 3. `DeleteConfirmModal`

مكون modal موحد لتأكيد الحذف.

```typescript
<DeleteConfirmModal
  isOpen={deleteModal.isOpen}
  onClose={deleteModal.close}
  onConfirm={handleDelete}
  itemTitle={deleteModal.selectedData?.title || ''}
  itemType="درس"
/>
```

---

## 🔄 طريقة العمل

### 1. صفحة إدارة الدروس (`LessonsManagementPage`)

#### التدفق الأساسي

```
1. تحميل الصفحة
   ↓
2. AdminPageWrapper يفحص
   ↓
3. useDataFetcher يجلب البيانات (lessons, subjects, gradeLevels)
   ↓
4. useSearch يفلتر البيانات حسب البحث
   ↓
5. عرض البيانات في DataTable
   ↓
6. عند الحذف:
   - فتح DeleteConfirmModal
   - Optimistic update (تحديث UI فوراً)
   - حذف من API
   - Rollback في حالة الفشل
```

#### مثال الكود

```typescript
const LessonsManagementPage: React.FC = () => {
  // 1. جلب البيانات
  const { data: lessons, loading, setData: setLessons } =
    useDataFetcher<Lesson>(API_ENDPOINTS.CONTENT.LESSONS)

  // 2. البحث
  const { searchTerm, setSearchTerm, filteredData } =
    useSearch<Lesson>(lessons, { searchFields: ['title'] })

  // 3. Modal الحذف
  const deleteModal = useModal<Lesson>()

  // 4. معالجة الحذف مع Optimistic Update
  const handleDelete = async () => {
    const deletedLesson = deleteModal.selectedData
    const previousLessons = [...lessons]

    // تحديث UI فوراً
    setLessons(lessons.filter(l => l.id !== deletedLesson.id))
    deleteModal.close()

    try {
      await apiClient.delete(API_ENDPOINTS.CONTENT.LESSON(deletedLesson.id))
    } catch (error) {
      // Rollback
      setLessons(previousLessons)
      handleError(error, { message: 'فشل حذف الدرس' })
    }
  }

  // 5. إنشاء الأعمدة
  const columns = React.useMemo(
    () => createLessonsColumns({
      getSubjectName,
      getGradeLevelName,
      navigate,
      onDelete: (lesson) => deleteModal.open(lesson),
    }),
    [subjects, gradeLevels, navigate, deleteModal]
  )

  return (
    <AdminPageWrapper requiredPermissions={['lessons.view']}>
      {/* UI */}
    </AdminPageWrapper>
  )
}
```

### 2. صفحة نموذج الدرس (`LessonFormPage`)

#### التدفق الأساسي

```
1. تحميل الصفحة
   ↓
2. AdminPageWrapper يفحص
   ↓
3. useDataFetcher يجلب subjects و gradeLevels
   ↓
4. إذا كان تعديل: جلب بيانات الدرس
   ↓
5. ملء النموذج
   ↓
6. عند الحفظ:
   - التحقق من البيانات
   - إرسال إلى API
   - التنقل إلى صفحة الإدارة
```

### 3. صفحة إدارة المسارات (`LearningPathsManagementPage`)

نفس التدفق مثل `LessonsManagementPage` مع استخدام `createLearningPathsColumns`.

---

## 📐 الأنماط (SCSS)

### الهيكل

```
styles/
├── ManagementPageBase.scss    # الأنماط المشتركة (80% من الكود)
└── [PageName].scss            # الأنماط الخاصة بكل صفحة
```

### استخدام الأنماط المشتركة

```scss
// ManagementPageBase.scss
.management-page__toolbar { ... }
.management-page__search { ... }
.management-page__table-card { ... }
.management-page__actions { ... }
.management-page__draft-badge { ... }
```

```scss
// LessonsManagementPage.scss
@use './styles/ManagementPageBase' as *;

.lessons-management-page {
  .management-page__toolbar {
    @extend .management-page__toolbar;
  }
  // تخصيصات إضافية...
}
```

**الفوائد:**

- ✅ تقليل التكرار بنسبة ~80%
- ✅ صيانة أسهل للتصميم المتجاوب
- ✅ تغيير واحد يؤثر على جميع الصفحات

---

## 📦 Constants - الثوابت

### أعمدة الجداول

تم فصل أعمدة الجداول إلى ملفات منفصلة لإعادة الاستخدام:

```typescript
// constants/lessonsColumns.tsx
export function createLessonsColumns(options: CreateLessonsColumnsOptions) {
  return [
    { key: 'title', label: 'العنوان', ... },
    { key: 'actions', label: 'الإجراءات', ... },
  ]
}
```

**الاستخدام:**

```typescript
const columns = React.useMemo(
  () =>
    createLessonsColumns({
      getSubjectName,
      getGradeLevelName,
      navigate,
      onDelete: lesson => deleteModal.open(lesson),
    }),
  [subjects, gradeLevels, navigate, deleteModal]
)
```

**الفوائد:**

- ✅ إعادة استخدام الأعمدة
- ✅ سهولة إضافة/تعديل الأعمدة
- ✅ فصل المنطق عن العرض

---

## 🎯 أفضل الممارسات

### 1. استخدام Types الموحدة

```typescript
// ✅ جيد
import type { Lesson, Subject, GradeLevel } from '@/application/types/content.types'

// ❌ سيء
interface Lesson { ... } // في كل صفحة
```

### 2. استخدام Hooks الموحدة

```typescript
// ✅ جيد
const { data, loading } = useDataFetcher<Lesson>(endpoint)

// ❌ سيء
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)
useEffect(() => { ... }, [])
```

### 3. Optimistic Updates

```typescript
// ✅ جيد - تحديث UI فوراً
const previousData = [...data]
setData(data.filter(item => item.id !== deletedId))
try {
  await api.delete(id)
} catch {
  setData(previousData) // Rollback
}

// ❌ سيء - انتظار API
await api.delete(id)
setData(data.filter(item => item.id !== deletedId))
```

### 4. فصل Constants

```typescript
// ✅ جيد
const columns = createLessonsColumns({ ... })

// ❌ سيء
const columns = [{ key: 'title', ... }, ...] // في الصفحة
```

---

## 🚀 التوسع المستقبلي

### إضافة صفحة جديدة

#### الخطوات

1. **إنشاء الصفحة:**

```typescript
// NewPage.tsx
import { useDataFetcher, useSearch } from '@/application/hooks'
import { AdminPageWrapper } from '../../components/admin'

const NewPage: React.FC = () => {
  const { data, loading } = useDataFetcher<NewType>(endpoint)
  const { searchTerm, filteredData } = useSearch<NewType>(data)

  return (
    <AdminPageWrapper requiredPermissions={['new.view']}>
      {/* UI */}
    </AdminPageWrapper>
  )
}
```

1. **إنشاء Columns (إن لزم):**

```typescript
// constants/newColumns.tsx
export function createNewColumns(options) {
  return [
    /* columns */
  ]
}
```

1. **إضافة الأنماط:**

```scss
// NewPage.scss
@use './styles/ManagementPageBase' as *;

.new-page {
  @extend .management-page__toolbar;
  // تخصيصات...
}
```

### إضافة ميزة جديدة

#### مثال: إضافة التصفية المتقدمة

```typescript
// استخدام useSearchFilter بدلاً من useSearch
import { useSearchFilter } from '@/application/shared/hooks'

const { searchTerm, filter, filteredData } = useSearchFilter(data, {
  filterOptions: [
    { value: 'all', label: 'الكل' },
    { value: 'published', label: 'منشور', filterFn: item => item.is_published },
    { value: 'draft', label: 'مسودة', filterFn: item => !item.is_published },
  ],
})
```

---

## 📊 مقارنة قبل وبعد التحسينات

| المقياس              | قبل  | بعد        | التحسين                 |
| -------------------- | ---- | ---------- | ----------------------- |
| **عدد الأسطر**       | ~450 | ~350       | -22%                    |
| **التكرار في الكود** | ~60% | ~15%       | -75%                    |
| **التكرار في SCSS**  | ~80% | ~20%       | -75%                    |
| **عدد الملفات**      | 6    | 10         | +67% (لكن أكثر تنظيماً) |
| **سهولة الصيانة**    | ⭐⭐ | ⭐⭐⭐⭐⭐ | +150%                   |
| **سهولة التوسع**     | ⭐⭐ | ⭐⭐⭐⭐⭐ | +150%                   |

---

## 🔍 أمثلة الاستخدام

### مثال 1: إضافة عمود جديد للجدول

```typescript
// constants/lessonsColumns.tsx
export function createLessonsColumns(options) {
  return [
    // ... الأعمدة الموجودة
    {
      key: 'created_at',
      label: 'تاريخ الإنشاء',
      render: value => new Date(value as string).toLocaleDateString('ar-SA'),
    },
  ]
}
```

### مثال 2: إضافة فلتر جديد

```typescript
// في الصفحة
const { searchTerm, filter, filteredData } = useSearchFilter(lessons, {
  searchFields: ['title'],
  filterOptions: [
    { value: 'all', label: 'الكل' },
    { value: 'beginner', label: 'مبتدئ', filterFn: l => l.difficulty_level === 'beginner' },
  ],
})
```

### مثال 3: إضافة action جديد

```typescript
// في columns
{
  key: 'actions',
  render: (_, row) => (
    <div className="actions">
      {/* Actions موجودة */}
      <Button onClick={() => handleDuplicate(row)}>نسخ</Button>
    </div>
  ),
}
```

---

## 🛠️ الأدوات والتقنيات

- **React 18+** - مكتبة UI
- **TypeScript** - للـ type safety
- **SCSS Modules** - للأنماط
- **React Router DOM** - للتنقل
- **Zustand** - لإدارة الحالة (في hooks)
- **Axios** - للـ API calls (عبر apiClient)

---

## 📝 الملاحظات المهمة

1. **:** جميع الصفحات محمية بـ `AdminPageWrapper`
2. **التفاؤل:** استخدام Optimistic Updates للحذف
3. **الأخطاء:** استخدام `handleError` لمعالجة موحدة
4. **الأنماط:** استخدام `ManagementPageBase` للأنماط المشتركة
5. **Types:** استخدام Types من `@/application/types/content.types`

---

## 🤝 المساهمة

عند إضافة صفحة جديدة أو تحسين موجودة:

1. ✅ اتبع الهيكل الموجود
2. ✅ استخدم Hooks والمكونات الموحدة
3. ✅ أضف Types في `content.types.ts`
4. ✅ استخدم `ManagementPageBase` للأنماط
5. ✅ أضف Columns في `constants/` إن لزم
6. ✅ اتبع أفضل الممارسات المذكورة أعلاه

---

## 📚 المراجع

- [Application Hooks Documentation](../../../application/hooks/README.md)
- [Common Components Documentation](../../components/common/README.md)
- [Content Types](../../../application/types/content.types.ts)
- [API Endpoints](../../../../domain/constants/index.ts)

---

**آخر تحديث:** يناير 2025  
**الإصدار:** 2.0.0  
**الحالة:** ✅ مستقر ومحدث
