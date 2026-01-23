/**
 * Shared Hooks - Hooks المشتركة
 *
 * هذا الملف يصدر جميع Hooks المشتركة بين الميزات المختلفة.
 *
 * ## 📋 التنظيم:
 *
 * Hooks مرتبة حسب الفئة:
 *
 * ### 1. Internationalization (i18n)
 * - `useI18n` - Hook للترجمة واللغة
 *
 * ### 2. Async Operations
 * - `useAsyncOperation` - Hook شامل للعمليات غير المتزامنة
 *   - دمج `useApiState` السابق (لم يعد موجوداً)
 *
 * ### 3. Page Management
 * - `usePageAuth` - Hook للمصادقة في الصفحات
 * - `usePageLoading` - Hook لحالة التحميل في الصفحات
 *
 * ### 4. UI State Management
 * - `useModal` - Hook لإدارة حالة Modal
 * - `useConfirmDialog` - Hook لحوارات التأكيد (يعتمد على useModal)
 * - `useSearchFilter` - Hook للبحث والتصفية
 *
 * ## 🔗 العلاقات:
 *
 * ```
 * usePageAuth
 *   ├── usePageLoading
 *   └── useAuth, useRole (from features/auth)
 *
 * useConfirmDialog
 *   └── useModal
 *
 * useAsyncOperation
 *   └── ErrorHandler (from utils)
 * ```
 *
 * ## 📝 ملاحظات:
 *
 * - جميع hooks متوافقة مع Clean Architecture
 * - لا تعتمد على presentation layer
 * - تستخدم TypeScript Generics للـ type safety
 *
 * ---
 *
 * **آخر تحديث:** يناير 2026
 */

// Internationalization
export * from './useI18n'

// Async Operations
export * from './useAsyncOperation'
// Note: useApiState تم دمجه في useAsyncOperation

// Page Management
export * from './usePageAuth'
export * from './usePageLoading'

// UI State Management
export * from './useModal'
export * from './useConfirmDialog'
export * from './useSearchFilter'
