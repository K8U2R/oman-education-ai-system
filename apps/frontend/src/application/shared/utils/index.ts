/**
 * Shared Utils - أدوات مشتركة
 *
 * تصدير جميع الأدوات المشتركة بين الميزات.
 *
 * ## 📋 المحتويات:
 *
 * - **ErrorHandler**: معالجة الأخطاء الموحدة
 *
 * ## 🔄 الاستخدام:
 *
 * ```typescript
 * import { ErrorHandler } from '@/application/shared/utils'
 *
 * try {
 *   await someOperation()
 * } catch (err) {
 *   const error = ErrorHandler.handle(err, 'فشلت العملية')
 *   console.error(error.message)
 * }
 * ```
 *
 * ---
 *
 * **آخر تحديث:** يناير 2026
 */

export * from './errorHandler'
