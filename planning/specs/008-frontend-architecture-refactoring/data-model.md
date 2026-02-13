# نموذج البيانات: Frontend Architecture Refactoring

**المرحلة**: 1 (التصميم والعقود)  
**التاريخ**: 2026-02-09  
**المتطلبات الأساسية**: `research.md` مكتمل

## Query Key Factory Structure

### مبدأ التصميم

جميع مفاتيح الاستعلام (Query Keys) ستتبع نمطاً هرمياً موحداً:
```
[domain] → [scope] → [identifier] → [params]
```

### التنفيذ

```typescript
// src/application/shared/api/query-keys.ts

/**
 * مصنع مفاتيح الاستعلام المركزي
 * يضمن التناسق ويسهل Invalidation
 */
export const queryKeys = {
  admin: {
    all: ['admin'] as const,
    stats: {
      all: () => [...queryKeys.admin.all, 'stats'] as const,
      system: () => [...queryKeys.admin.stats.all(), 'system'] as const,
      users: () => [...queryKeys.admin.stats.all(), 'users'] as const,
      content: () => [...queryKeys.admin.stats.all(), 'content'] as const,
      usage: () => [...queryKeys.admin.stats.all(), 'usage'] as const,
    },
    users: {
      all: () => [...queryKeys.admin.all, 'users'] as const,
      list: (filters?: SearchUsersRequest) =>
        [...queryKeys.admin.users.all(), 'list', filters] as const,
      detail: (userId: string) =>
        [...queryKeys.admin.users.all(), 'detail', userId] as const,
      activities: () => [...queryKeys.admin.users.all(), 'activities'] as const,
    },
  },

  projects: {
    all: ['projects'] as const,
    list: (filters?: { type?: ProjectType; status?: ProjectStatus; subject?: string }) =>
      [...queryKeys.projects.all, 'list', filters] as const,
    detail: (projectId: string) =>
      [...queryKeys.projects.all, 'detail', projectId] as const,
    progress: (projectId: string) =>
      [...queryKeys.projects.all, 'progress', projectId] as const,
    stats: () => [...queryKeys.projects.all, 'stats'] as const,
  },

  developer: {
    all: ['developer'] as const,
    stats: () => [...queryKeys.developer.all, 'stats'] as const,
    endpoints: () => [...queryKeys.developer.all, 'endpoints'] as const,
    services: () => [...queryKeys.developer.all, 'services'] as const,
    performance: () => [...queryKeys.developer.all, 'performance'] as const,
  },
} as const

/**
 * دالة مساعدة لإبطال جميع استعلامات domain معين
 */
export const invalidateDomain = (
  queryClient: QueryClient,
  domain: keyof typeof queryKeys
) => {
  return queryClient.invalidateQueries({ queryKey: queryKeys[domain].all })
}
```

---

## Zustand Store Shape (Client-Only State)

### ما سيبقى في Zustand

فقط حالة الواجهة المحلية (UI State) التي **لا علاقة لها بالسيرفر**:

```typescript
// src/application/features/admin/store/ui-store.ts (مثال)

interface AdminUIStore {
  // UI State Only
  isSidebarOpen: boolean
  activeTab: 'users' | 'stats' | 'settings'
  selectedUserIds: string[] // للتحديد المتعدد في الجدول

  // Actions
  toggleSidebar: () => void
  setActiveTab: (tab: AdminUIStore['activeTab']) => void
  selectUser: (userId: string) => void
  clearSelection: () => void
}

export const useAdminUIStore = create<AdminUIStore>((set) => ({
  isSidebarOpen: true,
  activeTab: 'users',
  selectedUserIds: [],
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectUser: (userId) =>
    set((state) => ({
      selectedUserIds: state.selectedUserIds.includes(userId)
        ? state.selectedUserIds.filter((id) => id !== userId)
        : [...state.selectedUserIds, userId],
    })),
  clearSelection: () => set({ selectedUserIds: [] }),
}))
```

### ما سيُزال من Zustand

أي شيء يُجلب من السيرفر:
- ❌ `systemStats`, `userStats`, `contentStats` (سينتقل إلى `useQuery`)
- ❌ `users`, `projects`, `lessons` (سينتقل إلى `useQuery`)
- ❌ `isLoading`, `error` للبيانات (تُدار تلقائياً بواسطة TanStack)

---

## Service Hooks Pattern

### القالب الموحد لـ Custom Hooks

```typescript
// src/application/features/admin/hooks/useAdminStats.ts

import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import { queryKeys } from '@/application/shared/api/query-keys'

export const useSystemStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.stats.system(),
    queryFn: () => adminService.getSystemStats(),
    staleTime: 1000 * 60, // 1 minute
  })
}

export const useUserStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.stats.users(),
    queryFn: () => adminService.getUserStats(),
    staleTime: 1000 * 60,
  })
}

// للبحث مع Filters
export const useAdminUsers = (filters?: SearchUsersRequest) => {
  return useQuery({
    queryKey: queryKeys.admin.users.list(filters),
    queryFn: () => adminService.searchUsers(filters || {}),
    enabled: true, // يمكن تعطيله بشرط
  })
}
```

### Mutations Pattern

```typescript
// src/application/features/admin/hooks/useUpdateUser.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import { queryKeys } from '@/application/shared/api/query-keys'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      adminService.updateUser(userId, data),
    onSuccess: (updatedUser) => {
      // إبطال قائمة المستخدمين لإعادة جلبها
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all() })
      // تحديث تفاصيل المستخدم المحدد مباشرة (Optimistic Update)
      queryClient.setQueryData(
        queryKeys.admin.users.detail(updatedUser.id),
        updatedUser
      )
    },
  })
}
```

---

## Migration Map (خريطة الترحيل)

| الميزة | الحالة الحالية | الحالة المستهدفة | الأولوية |
|--------|----------------|------------------|----------|
| `useAdminStore` | Zustand (Fetch + UI) | TanStack Query (Fetch) + Zustand (UI only) | P1 |
| `useProjects` | Local State (useState) | TanStack Query | P1 |
| `useDeveloper` | Zustand (Fetch + UI) | TanStack Query (Fetch) + Zustand (UI only) | P2 |
| `database-core` hooks | Local State | Split to features + TanStack | P3 |

---

## الخطوات التالية

- [x] تعريف Query Keys Factory.
- [x] تصميم Zustand Stores الجديدة (UI-only).
- [x] توثيق أنماط Hooks و Mutations.
- [ ] إنشاء دليل البدء السريع (`quickstart.md`).
