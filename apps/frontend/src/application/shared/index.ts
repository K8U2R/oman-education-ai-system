/**
 * Shared Module - الوحدة المشتركة
 *
 * نقطة الدخول الموحدة لجميع المكونات المشتركة بين الميزات في طبقة Application.
 *
 * ## 📦 المحتويات:
 *
 * ### 🎣 Hooks
 * - `useI18n` - الترجمة واللغة
 * - `useAsyncOperation` - العمليات غير المتزامنة
 * - `usePageAuth` - المصادقة في الصفحات
 * - `usePageLoading` - حالة التحميل
 * - `useModal` - إدارة Modal
 * - `useConfirmDialog` - حوارات التأكيد
 * - `useSearchFilter` - البحث والتصفية
 *
 * ### 🏪 Store Factories
 * - `createAsyncStore` - Factory لـ async stores
 * - `createPaginatedStore` - Factory لـ paginated stores
 *
 * ### 🛠️ Utilities
 * - `ErrorHandler` - معالجة الأخطاء الموحدة
 *
 * ### 📝 Types
 * - (سيتم إضافتها عند الحاجة)
 *
 * ## 🔄 الاستخدام:
 *
 * ```typescript
 * // استيراد من نقطة الدخول الموحدة (موصى به)
 * import {
 *   useAsyncOperation,
 *   usePageAuth,
 *   useI18n,
 *   createAsyncStore,
 *   ErrorHandler,
 * } from '@/application/shared'
 *
 * // أو من المسارات المحددة
 * import { useAsyncOperation } from '@/application/shared/hooks'
 * import { createAsyncStore } from '@/application/shared/store'
 * import { ErrorHandler } from '@/application/shared/utils'
 * ```
 *
 * ## 🏗️ Clean Architecture:
 *
 * جميع المكونات في هذا المجلد تتبع مبادئ Clean Architecture:
 * - ✅ لا تعتمد على Presentation Layer
 * - ✅ Type Safety مع TypeScript
 * - ✅ Separation of Concerns
 * - ✅ Composition over Inheritance
 *
 * ## 📚 التوثيق:
 *
 * - [README.md](./README.md) - دليل شامل للقسم
 * - [ARCHITECTURE.md](./ARCHITECTURE.md) - التوثيق المعماري
 * - [CHANGELOG.md](./CHANGELOG.md) - سجل التغييرات
 *
 * ---
 *
 * **آخر تحديث:** يناير 2026
 * **الإصدار:** 2.0.0
 */

// Hooks - Hooks المشتركة
export * from './hooks'

// Stores - Store Factories
export * from './store'

// Utils - Utilities المشتركة
export * from './utils'

// Types - أنواع TypeScript المشتركة (سيتم إضافتها عند الحاجة)
// export * from './types'
