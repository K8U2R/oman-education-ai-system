# Projects Feature - إدارة المشاريع التعليمية

**الحالة:** ✅ مكتمل  
**الإصدار:** 2.0.0  
**آخر تحديث:** 2025-01-08

---

## 📋 نظرة عامة

ميزة إدارة المشاريع التعليمية في النظام. تتيح للمستخدمين إنشاء وإدارة المشاريع التعليمية، تتبع التقدم، وإدارة المهام والمراحل.

---

## 🎯 الهدف

تمكين المستخدمين من:

- إنشاء مشاريع تعليمية
- إدارة المشاريع المتعددة
- تتبع تقدم المشاريع
- إدارة المهام والمراحل
- توليد ملفات التقارير

---

## 📁 الهيكل

```
projects/
├── hooks/                    # Custom Hooks
│   ├── useProjects.ts       # Hook للمشاريع
│   └── index.ts
├── services/                 # Services
│   ├── project.service.ts   # Service الرئيسي
│   └── index.ts
├── store/                    # State Management
│   ├── projectsStore.ts     # Zustand Store
│   └── index.ts
├── types/                    # TypeScript Types
│   ├── project.types.ts     # أنواع المشاريع
│   └── index.ts
├── constants/                # Constants
│   ├── project.constants.ts # ثوابت المشاريع
│   └── index.ts
├── utils/                    # Utilities
│   ├── project.utils.ts     # دوال مساعدة
│   └── index.ts
├── index.ts                  # Barrel Export الرئيسي
└── README.md                 # هذا الملف
```

## 🚀 الميزات

### 1. إدارة المشاريع

- إنشاء مشاريع جديدة
- تحديث المشاريع
- حذف المشاريع
- عرض قائمة المشاريع
- البحث والتصفية

### 2. تتبع التقدم

- عرض تقدم كل مشروع
- إدارة المراحل
- إدارة المهام
- إحصائيات التقدم

### 3. إحصائيات المشاريع

- إحصائيات شاملة
- إحصائيات حسب النوع
- إحصائيات حسب الحالة

## 💻 الاستخدام

### استخدام Hook

```typescript
import { useProjects, useProject } from '@/application/features/projects/hooks'

// استخدام useProjects
const MyComponent = () => {
  const { projects, isLoading, error, loadProjects, createProject, updateProject, deleteProject } =
    useProjects({
      type: 'educational',
      status: 'in_progress',
    })

  const handleCreate = async () => {
    await createProject({
      title: 'مشروع جديد',
      type: 'educational',
      description: 'وصف المشروع',
    })
  }

  // ...
}

// استخدام useProject
const ProjectDetailComponent = ({ projectId }: { projectId: string }) => {
  const { project, progress, isLoading, loadProject, loadProgress } = useProject(projectId)

  useEffect(() => {
    loadProject()
    loadProgress()
  }, [loadProject, loadProgress])

  // ...
}
```

### استخدام Service

```typescript
import { projectService } from '@/application/features/projects/services'

// جلب المشاريع
const { projects, total } = await projectService.getProjects({
  type: 'educational',
  status: 'in_progress',
  page: 1,
  per_page: 20,
})

// جلب مشروع واحد
const project = await projectService.getProject('project-id')

// إنشاء مشروع
const newProject = await projectService.createProject({
  title: 'مشروع جديد',
  type: 'educational',
  description: 'وصف المشروع',
})

// تحديث مشروع
const updated = await projectService.updateProject('project-id', {
  title: 'عنوان محدث',
  status: 'completed',
})

// حذف مشروع
await projectService.deleteProject('project-id')

// جلب التقدم
const progress = await projectService.getProjectProgress('project-id')

// جلب الإحصائيات
const stats = await projectService.getProjectStats()
```

### استخدام Store

```typescript
import { useProjectsStore } from '@/application/features/projects/store'

const MyComponent = () => {
  const { projects, selectedProject, isLoading, fetchProjects, selectProject, createProject } =
    useProjectsStore()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // ...
}
```

### استخدام Utils

```typescript
import {
  validateProjectTitle,
  formatProjectType,
  formatProjectStatus,
  getProjectStatusColor,
  isProjectCompleted,
  calculateDaysRemaining,
  formatDaysRemaining,
  sortProjectsByProgress,
} from '@/application/features/projects/utils'

// التحقق من عنوان المشروع
const { valid, error } = validateProjectTitle('عنوان المشروع')

// تنسيق نوع المشروع
const typeFormatted = formatProjectType('educational') // "تعليمي"

// تنسيق حالة المشروع
const statusFormatted = formatProjectStatus('in_progress') // "قيد التنفيذ"

// الحصول على لون الحالة
const color = getProjectStatusColor('completed') // "#22c55e"

// التحقق من اكتمال المشروع
const isCompleted = isProjectCompleted(project)

// حساب الأيام المتبقية
const days = calculateDaysRemaining(project)

// تنسيق الأيام المتبقية
const daysFormatted = formatDaysRemaining(project) // "5 أيام متبقية"

// ترتيب المشاريع حسب التقدم
const sorted = sortProjectsByProgress(projects)
```

### استخدام Constants

```typescript
import {
  PROJECT_CONFIG,
  PROJECT_TYPES,
  PROJECT_STATUS,
} from '@/application/features/projects/constants'

// استخدام Configuration
const defaultPageSize = PROJECT_CONFIG.DEFAULT_PAGE_SIZE
const errorMessage = PROJECT_CONFIG.ERROR_MESSAGES.PROJECT_NOT_FOUND

// استخدام Project Types
const educationalType = PROJECT_TYPES.EDUCATIONAL

// استخدام Status
const inProgressStatus = PROJECT_STATUS.IN_PROGRESS
```

## 🔗 التكاملات

### مع الميزات الأخرى:

- **auth/**: يحتاج auth للوصول إلى المشاريع
- **learning/**: يمكن ربط المشاريع بالدروس
- **office/**: يمكن توليد ملفات Office للمشاريع
- **storage/**: يمكن حفظ ملفات المشاريع
- **notifications/**: إشعارات عن التقدم

---

## 📝 ملاحظات

- جميع Types منظمة في `types/`
- Store يستخدم Zustand مع devtools
- يدعم Pagination والبحث والتصفية
- يدعم تتبع التقدم والإحصائيات

---

## 🧪 الاختبار

```typescript
import { describe, it, expect } from 'vitest'
import { useProjects } from './hooks/useProjects'
import { renderHook } from '@testing-library/react'

describe('useProjects', () => {
  it('should load projects successfully', async () => {
    const { result } = renderHook(() => useProjects())
    // ...
  })
})
```

---

## 📚 المراجع

- [API Constants](../../../domain/constants/api.constants.ts)

---

**آخر تحديث:** 2025-01-08  
**الإصدار:** 2.0.0
