/**
 * Query Keys Factory - مصنع مفاتيح الاستعلام المركزي
 *
 * @description
 * يوفر نمطاً موحداً لتعريف مفاتيح الاستعلام (Query Keys) لجميع الميزات.
 * يضمن التناسق ويسهل إدارة إلغاء الصلاحية (Invalidation).
 *
 * @pattern
 * [domain] → [scope] → [identifier] → [params]
 *
 * @example
 * queryKeys.admin.users.list({ role: 'student' })
 * // ['admin', 'users', 'list', { role: 'student' }]
 */

import type { QueryClient } from '@tanstack/react-query'
import type { SearchUsersRequest } from '@/application/features/admin/types'
import type { ProjectType, ProjectStatus } from '@/application/features/projects/types'

export const queryKeys = {
    /**
     * مفاتيح الإدارة (Admin Domain)
     */
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
            detail: (userId: string) => [...queryKeys.admin.users.all(), 'detail', userId] as const,
            activities: () => [...queryKeys.admin.users.all(), 'activities'] as const,
        },
    },

    /**
     * مفاتيح المشاريع (Projects Domain)
     */
    projects: {
        all: ['projects'] as const,
        list: (filters?: { type?: ProjectType; status?: ProjectStatus; subject?: string }) =>
            [...queryKeys.projects.all, 'list', filters] as const,
        detail: (projectId: string) => [...queryKeys.projects.all, 'detail', projectId] as const,
        progress: (projectId: string) => [...queryKeys.projects.all, 'progress', projectId] as const,
        stats: () => [...queryKeys.projects.all, 'stats'] as const,
    },

    /**
     * مفاتيح المطور (Developer Domain)
     */
    developer: {
        all: ['developer'] as const,
        stats: () => [...queryKeys.developer.all, 'stats'] as const,
        endpoints: () => [...queryKeys.developer.all, 'endpoints'] as const,
        services: () => [...queryKeys.developer.all, 'services'] as const,
        performance: () => [...queryKeys.developer.all, 'performance'] as const,
    },

    /**
     * مفاتيح المصادقة (Auth Domain)
     */
    auth: {
        all: ['auth'] as const,
        me: () => [...queryKeys.auth.all, 'me'] as const,
    },
} as const

/**
 * دالة مساعدة لإبطال جميع استعلامات domain معين
 *
 * @example
 * invalidateDomain(queryClient, 'admin')
 */
export const invalidateDomain = (
    queryClient: QueryClient,
    domain: keyof typeof queryKeys
): Promise<void> => {
    return queryClient.invalidateQueries({ queryKey: queryKeys[domain].all })
}
