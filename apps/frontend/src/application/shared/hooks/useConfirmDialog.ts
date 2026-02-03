/**
 * useConfirmDialog Hook - Hook لحوار التأكيد
 *
 * Hook موحد لإدارة حوارات التأكيد
 * يوفر واجهة سهلة لاستخدام ConfirmDialog مع دعم كامل للأنواع والأحوال
 *
 * ## 🎯 الميزات
 *
 * - ✅ إدارة حالة حوار التأكيد
 * - ✅ دعم أنواع مختلفة: `danger`, `warning`, `info`, `success`
 * - ✅ نصوص قابلة للتخصيص: `confirmText`, `cancelText`
 * - ✅ دعم async operations في `onConfirm`
 * - ✅ خيارات افتراضية قابلة للتخصيص
 *
 * ## 🔗 العلاقة مع hooks أخرى
 *
 * - **useModal**: يعتمد على `useModal` داخلياً لإدارة حالة الحوار
 * - **Composition Pattern**: مثال على استخدام Composition over Inheritance
 *
 * ## 📋 حالات الاستخدام
 *
 * ### ✅ استخدم `useConfirmDialog` عندما:
 * - تحتاج حوار تأكيد (تأكيد الحذف، تأكيد الإجراءات الخطرة)
 * - تريد واجهة موحدة لجميع حوارات التأكيد
 * - تحتاج أنواع مختلفة من الحوارات (danger, warning, info, success)
 *
 * ### ❌ لا تستخدم `useConfirmDialog` عندما:
 * - تحتاج modal عام (استخدم `useModal` بدلاً من ذلك)
 * - تحتاج form داخل modal (استخدم `useModal` مع Form component)
 *
 * ## 💡 أمثلة الاستخدام
 *
 * ### مثال 1: حوار تأكيد حذف بسيط
 * ```tsx
 * const confirm = useConfirmDialog()
 *
 * const handleDelete = () => {
 *   confirm.open({
 *     title: 'تأكيد الحذف',
 *     message: 'هل أنت متأكد من حذف هذا العنصر؟',
 *     variant: 'danger',
 *     onConfirm: async () => {
 *       await deleteItem()
 *       confirm.close()
 *     },
 *   })
 * }
 *
 * <ConfirmDialog
 *   isOpen={confirm.isOpen}
 *   onClose={confirm.close}
 *   onConfirm={confirm.options?.onConfirm || (() => {})}
 *   title={confirm.options?.title || ''}
 *   message={confirm.options?.message || ''}
 *   variant={confirm.options?.variant || 'warning'}
 * />
 * ```
 *
 * ### مثال 2: حوار تأكيد مع خيارات افتراضية
 * ```tsx
 * const confirm = useConfirmDialog({
 *   defaultVariant: 'danger',
 *   defaultConfirmText: 'حذف',
 *   defaultCancelText: 'إلغاء',
 * })
 *
 * confirm.open({
 *   title: 'حذف المستخدم',
 *   message: 'لا يمكن التراجع عن هذا الإجراء',
 *   onConfirm: async () => {
 *     await deleteUser()
 *     confirm.close()
 *   },
 * })
 * ```
 *
 * ### مثال 3: حوار تأكيد متعدد الاستخدامات
 * ```tsx
 * const confirm = useConfirmDialog()
 *
 * // حذف
 * const handleDelete = () => {
 *   confirm.open({
 *     title: 'حذف',
 *     message: 'هل أنت متأكد؟',
 *     variant: 'danger',
 *     onConfirm: deleteItem,
 *   })
 * }
 *
 * // حفظ
 * const handleSave = () => {
 *   confirm.open({
 *     title: 'حفظ التغييرات',
 *     message: 'هل تريد حفظ التغييرات؟',
 *     variant: 'info',
 *     onConfirm: saveChanges,
 *   })
 * }
 * ```
 *
 * ## ⚠️ ملاحظات مهمة
 *
 * - `onConfirm` يمكن أن يكون async function
 * - `close()` يجب استدعاؤه يدوياً بعد نجاح العملية
 * - `options` يحتوي على جميع خيارات الحوار الحالي
 * - استخدم `variant` المناسب للسياق (danger للحذف، warning للتحذيرات)
 *
 * ## 🔄 Integration مع ConfirmDialog Component
 *
 * هذا Hook مصمم للعمل مع `ConfirmDialog` component من `@/presentation/components/common`:
 *
 * ```tsx
 * import { ConfirmDialog } from '@/presentation/components/common'
 *
 * const confirm = useConfirmDialog()
 *
 * <ConfirmDialog
 *   isOpen={confirm.isOpen}
 *   onClose={confirm.close}
 *   {...confirm.options}
 * />
 * ```
 */

import { useModal } from './useModal'

export interface UseConfirmDialogOptions {
  /**
   * نوع الحوار الافتراضي
   */
  defaultVariant?: 'danger' | 'warning' | 'info' | 'success'

  /**
   * نص زر التأكيد الافتراضي
   */
  defaultConfirmText?: string

  /**
   * نص زر الإلغاء الافتراضي
   */
  defaultCancelText?: string
}

export interface ConfirmDialogState {
  /**
   * هل الحوار مفتوح؟
   */
  isOpen: boolean

  /**
   * فتح الحوار
   */
  open: (options: ConfirmDialogOptions) => void

  /**
   * إغلاق الحوار
   */
  close: () => void

  /**
   * خيارات الحوار الحالية
   */
  options: ConfirmDialogOptions | null
}

export interface ConfirmDialogOptions {
  /**
   * عنوان الحوار
   */
  title: string

  /**
   * رسالة الحوار
   */
  message: string

  /**
   * نوع الحوار
   */
  variant?: 'danger' | 'warning' | 'info' | 'success'

  /**
   * نص زر التأكيد
   */
  confirmText?: string

  /**
   * نص زر الإلغاء
   */
  cancelText?: string

  /**
   * دالة التأكيد
   */
  onConfirm: () => void | Promise<void>
}

/**
 * Hook لحوار التأكيد
 *
 * @param options - خيارات افتراضية
 * @returns حالة الحوار ووظائفه
 *
 * @example
 * ```tsx
 * const confirm = useConfirmDialog()
 *
 * const handleDelete = () => {
 *   confirm.open({
 *     title: 'تأكيد الحذف',
 *     message: 'هل أنت متأكد من حذف هذا العنصر؟',
 *     variant: 'danger',
 *     onConfirm: async () => {
 *       await deleteItem()
 *       confirm.close()
 *     },
 *   })
 * }
 * ```
 */
export function useConfirmDialog(options: UseConfirmDialogOptions = {}): ConfirmDialogState {
  const {
    defaultVariant = 'warning',
    defaultConfirmText = 'تأكيد',
    defaultCancelText = 'إلغاء',
  } = options

  const modal = useModal<ConfirmDialogOptions>()

  const open = (dialogOptions: ConfirmDialogOptions) => {
    modal.openWith({
      ...dialogOptions,
      variant: dialogOptions.variant || defaultVariant,
      confirmText: dialogOptions.confirmText || defaultConfirmText,
      cancelText: dialogOptions.cancelText || defaultCancelText,
    })
  }

  return {
    isOpen: modal.isOpen,
    open,
    close: modal.close,
    options: modal.selectedData,
  }
}
