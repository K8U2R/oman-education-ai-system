/**
 * Shared Store - Stores المشتركة
 *
 * Factory functions لإنشاء Zustand stores قابلة لإعادة الاستخدام.
 *
 * ## 📋 المحتويات:
 *
 * - **createAsyncStore**: Factory لإنشاء async stores
 * - **createPaginatedStore**: Factory لإنشاء paginated stores
 *
 * ## 🔄 الاستخدام:
 *
 * ```typescript
 * import { createAsyncStore } from '@/application/shared/store'
 *
 * const useUserStore = createAsyncStore({
 *   fetchFn: async () => await fetchUser(),
 *   defaultErrorMessage: 'فشل جلب المستخدم',
 * })
 * ```
 *
 * ---
 *
 * **آخر تحديث:** يناير 2026
 */

export * from './createAsyncStore'
export * from './createPaginatedStore'
export * from './uiStore'
