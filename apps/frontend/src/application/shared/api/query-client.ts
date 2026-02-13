/**
 * Query Client Configuration - تكوين عميل الاستعلام
 *
 * @description
 * يوفر تكوين QueryClient المركزي مع خيارات افتراضية محسّنة للأداء
 * ودعم التخزين المؤقت عبر IndexedDB.
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Query Client المركزي
 *
 * الخيارات الافتراضية:
 * - staleTime: 5 دقائق (البيانات تعتبر "طازجة" لمدة 5 دقائق)
 * - gcTime: 24 ساعة (البيانات غير المستخدمة تُحذف من الكاش بعد 24 ساعة)
 * - retry: محاولة واحدة فقط عند الفشل
 * - refetchOnWindowFocus: false (عدم إعادة الجلب عند العودة للنافذة)
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60 * 24, // 24 hours (was cacheTime in v4)
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 0, // No retry for mutations
        },
    },
})

/**
 * ملاحظات التطوير المستقبلي:
 *
 * TODO: دمج persistQueryClient مع IndexedDB
 * عند الحاجة لدعم Offline أكثر شمولاً، يمكن استخدام:
 *
 * import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
 * import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
 * import { indexedDBService } from '@/infrastructure/services/storage/indexeddb.service'
 *
 * const persister = createSyncStoragePersister({
 *   storage: {
 *     getItem: (key) => indexedDBService.get('query-cache', key),
 *     setItem: (key, value) => indexedDBService.set('query-cache', key, value),
 *     removeItem: (key) => indexedDBService.delete('query-cache', key),
 *   },
 * })
 */
