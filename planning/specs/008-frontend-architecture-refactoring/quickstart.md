# دليل البدء السريع: Frontend Architecture Refactoring

**المرحلة**: 1 (التصميم والعقود)  
**الجمهور**: المطورون على Frontend  
**التاريخ**: 2026-02-09

## نظرة عامة (Overview)

تم إعادة هيكلة البنية المعمارية للواجهة الأمامية لتوحيد إدارة حالة الخادم باستخدام **TanStack Query v5**. هذا الدليل يوضح كيفية استخدام الأنماط الجديدة.

---

## التثبيت والإعداد (Setup)

### 1. تثبيت التبعيات

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 2. إعداد Query Client في التطبيق

```tsx
// src/main.tsx أو src/App.tsx (الجذر)

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 دقائق
      gcTime: 1000 * 60 * 60 * 24, // 24 ساعة (cache time)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* مكونات التطبيق هنا */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

## جلب البيانات (Data Fetching)

### قبل (Old Pattern - ❌ لا تستخدمه)

```tsx
// ❌ نمط قديم: useState + useEffect
const [data, setData] = useState(null)
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const result = await projectService.getProjects()
      setData(result.projects)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, [])
```

### بعد (New Pattern - ✅ استخدم هذا)

```tsx
// ✅ نمط جديد: useQuery
import { useQuery } from '@tanstack/react-query'
import { projectService } from '../services/project.service'
import { queryKeys } from '@/application/shared/api/query-keys'

const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.projects.list(),
  queryFn: () => projectService.getProjects(),
})
```

---

## تعديل البيانات (Data Mutation)

### إنشاء مشروع جديد

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

const CreateProjectForm = () => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateProjectRequest) => projectService.createProject(data),
    onSuccess: () => {
      // إعادة جلب قائمة المشاريع تلقائياً
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() })
    },
  })

  const handleSubmit = async (formData) => {
    await createMutation.mutateAsync(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? 'جارٍ الإنشاء...' : 'إنشاء مشروع'}
      </button>
      {createMutation.isError && <p>خطأ: {createMutation.error.message}</p>}
    </form>
  )
}
```

---

## الحالات المتقدمة (Advanced Patterns)

### 1. جلب بيانات مشروط (Dependent Queries)

```tsx
// جلب تفاصيل المشروع فقط إذا كان هناك projectId
const { data: project } = useQuery({
  queryKey: queryKeys.projects.detail(projectId),
  queryFn: () => projectService.getProject(projectId),
  enabled: !!projectId, // يُفعّل فقط إذا كان projectId موجوداً
})
```

### 2. Optimistic Updates (تحديثات متفائلة)

```tsx
const updateMutation = useMutation({
  mutationFn: ({ projectId, data }) => projectService.updateProject(projectId, data),
  onMutate: async (variables) => {
    // إلغاء أي إعادة جلب تلقائية
    await queryClient.cancelQueries({ queryKey: queryKeys.projects.detail(variables.projectId) })

    // حفظ القيمة السابقة (للرجوع في حالة الفشل)
    const previousProject = queryClient.getQueryData(
      queryKeys.projects.detail(variables.projectId)
    )

    // تحديث الكاش مباشرة (قبل استجابة السيرفر)
    queryClient.setQueryData(
      queryKeys.projects.detail(variables.projectId),
      (old) => ({ ...old, ...variables.data })
    )

    return { previousProject }
  },
  onError: (err, variables, context) => {
    // الرجوع إلى البيانات السابقة في حالة الفشل
    if (context?.previousProject) {
      queryClient.setQueryData(
        queryKeys.projects.detail(variables.projectId),
        context.previousProject
      )
    }
  },
  onSettled: (data, error, variables) => {
    // إعادة جلب البيانات من السيرفر
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(variables.projectId) })
  },
})
```

### 3. Infinite Scroll (التمرير اللانهائي)

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: queryKeys.projects.list(),
  queryFn: ({ pageParam = 1 }) =>
    projectService.getProjects({ page: pageParam, per_page: 20 }),
  getNextPageParam: (lastPage) =>
    lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  initialPageParam: 1,
})

// عرض البيانات
data?.pages.map((page) =>
  page.projects.map((project) => <ProjectCard key={project.id} project={project} />)
)
```

---

## إدارة الكاش (Cache Management)

### إبطال صلاحية الكاش

```tsx
// إبطال جميع استعلامات الإدارة
queryClient.invalidateQueries({ queryKey: queryKeys.admin.all })

// إبطال استعلامات معينة فقط
queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats.users() })
```

### حذف البيانات من الكاش

```tsx
queryClient.removeQueries({ queryKey: queryKeys.projects.detail(projectId) })
```

---

## التوافق مع Zustand (Zustand Integration)

Zustand يُستخدم **فقط** لحالة الواجهة المحلية (UI State):

```tsx
// ✅ جيد: UI state
const useAdminUIStore = create((set) => ({
  isSidebarOpen: true,
  activeTab: 'users',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}))

// ❌ سيء: Server state (استخدم TanStack Query بدلاً من ذلك)
const useDataStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const users = await api.getUsers()
    set({ users })
  },
}))
```

---

## الأدوات والتشخيص (Devtools)

### React Query Devtools

أضف `<ReactQueryDevtools />` إلى التطبيق لفتح لوحة التحكم:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
```

استخدمها لـ:
- 🔍 مراقبة حالة الاستعلامات (fresh, stale, inactive)
- 📊 فحص بيانات الكاش
- 🔄 إعادة جلب البيانات يدوياً
- ⏱️ قياس أوقات الجلب

---

## الأسئلة الشائعة (FAQ)

### متى أستخدم `useQuery` ومتى أستخدم `useMutation`؟

- **`useQuery`**: لجلب البيانات (GET requests)
- **`useMutation`**: لتعديل البيانات (POST, PUT, DELETE)

### كيف أتعامل مع errors بشكل عام؟

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.error('خطأ في جلب البيانات:', error)
        // يمكن إضافة toast notification هنا
      },
    },
  },
})
```

### كيف أوقف إعادة الجلب التلقائي؟

```tsx
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  refetchOnWindowFocus: false, // عدم إعادة الجلب عند العودة للنافذة
  refetchOnReconnect: false, // عدم إعادة الجلب عند الاتصال بالإنترنت
})
```

---

## الموارد الإضافية (Resources)

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Query Keys Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [تقرير تحليل المشروع](../../analysis_report.md)

---

**آخر تحديث**: 2026-02-09  
**الحالة**: جاهز للتنفيذ ✅
