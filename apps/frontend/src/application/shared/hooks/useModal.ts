/**
 * useModal Hook - Hook لإدارة حالة Modal
 *
 * Hook موحد لإدارة فتح/إغلاق Modal وتخزين البيانات المحددة
 * يقلل التكرار في كود modal state management
 *
 * ## 🎯 الميزات
 *
 * - ✅ إدارة حالة فتح/إغلاق Modal
 * - ✅ تخزين البيانات المحددة (selectedData)
 * - ✅ دعم TypeScript Generics للـ type safety
 * - ✅ دوال مساعدة: `open`, `close`, `toggle`, `openWith`
 * - ✅ خيارات افتراضية: `defaultOpen`, `defaultData`
 *
 * ## 🔗 العلاقة مع hooks أخرى
 *
 * - **useConfirmDialog**: يعتمد على `useModal` داخلياً لإدارة حالة الحوار
 * - **استخدام مستقل**: يمكن استخدامه مباشرة للـ modals العامة
 *
 * ## 📋 حالات الاستخدام
 *
 * ### ✅ استخدم `useModal` عندما:
 * - تحتاج modal عام (EditForm, CreateForm, ViewDetails)
 * - تريد إدارة حالة فتح/إغلاق مع بيانات
 * - تحتاج type safety للبيانات المحددة
 *
 * ### ❌ لا تستخدم `useModal` عندما:
 * - تحتاج حوار تأكيد فقط (استخدم `useConfirmDialog` بدلاً من ذلك)
 * - تحتاج modal بسيط بدون بيانات (يمكن استخدام `useState` مباشرة)
 *
 * ## 💡 أمثلة الاستخدام
 *
 * ### مثال 1: Modal بسيط بدون بيانات
 * ```tsx
 * const { isOpen, open, close } = useModal()
 *
 * <Modal isOpen={isOpen} onClose={close}>
 *   <p>محتوى Modal</p>
 * </Modal>
 * ```
 *
 * ### مثال 2: Modal مع بيانات محددة (Edit Form)
 * ```tsx
 * const editModal = useModal<User>()
 *
 * const handleEdit = (user: User) => {
 *   editModal.openWith(user)
 * }
 *
 * <Modal isOpen={editModal.isOpen} onClose={editModal.close}>
 *   {editModal.selectedData && (
 *     <EditUserForm user={editModal.selectedData} />
 *   )}
 * </Modal>
 * ```
 *
 * ### مثال 3: Modal متعدد الاستخدامات
 * ```tsx
 * const { isOpen, selectedData, open, close, toggle } = useModal<Lesson>()
 *
 * // فتح مع بيانات
 * open(lesson)
 *
 * // فتح بدون بيانات
 * open()
 *
 * // تبديل الحالة
 * toggle()
 * ```
 *
 * ## ⚠️ ملاحظات مهمة
 *
 * - `selectedData` يتم مسحه تلقائياً عند `close()` أو `toggle()` (عند الإغلاق)
 * - `open(data)` يحدّث `selectedData` فقط إذا تم تمرير `data`
 * - `openWith(data)` يحدّث `selectedData` دائماً (مطلوب)
 * - استخدم `toggle()` بحذر - قد لا يكون مناسباً لجميع الحالات
 */

import { useState, useCallback } from 'react'

export interface UseModalOptions<T = unknown> {
  /**
   * الحالة الافتراضية للـ modal
   */
  defaultOpen?: boolean

  /**
   * البيانات الافتراضية المحددة
   */
  defaultData?: T | null
}

export interface UseModalReturn<T = unknown> {
  /**
   * هل الـ modal مفتوح؟
   */
  isOpen: boolean

  /**
   * البيانات المحددة
   */
  selectedData: T | null

  /**
   * فتح الـ modal
   */
  open: (data?: T) => void

  /**
   * إغلاق الـ modal
   */
  close: () => void

  /**
   * تبديل حالة الـ modal
   */
  toggle: () => void

  /**
   * فتح الـ modal مع بيانات
   */
  openWith: (data: T) => void
}

/**
 * Hook لإدارة حالة Modal
 *
 * @param options - خيارات الـ modal
 * @returns معلومات وحالة الـ modal
 *
 * @example
 * ```tsx
 * const { isOpen, selectedData, open, close } = useModal<User>()
 *
 * const handleEdit = (user: User) => {
 *   openWith(user)
 * }
 *
 * <Modal isOpen={isOpen} onClose={close}>
 *   {selectedData && <EditForm user={selectedData} />}
 * </Modal>
 * ```
 */
export function useModal<T = unknown>(options: UseModalOptions<T> = {}): UseModalReturn<T> {
  const { defaultOpen = false, defaultData = null } = options

  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [selectedData, setSelectedData] = useState<T | null>(defaultData)

  const open = useCallback((data?: T) => {
    if (data !== undefined) {
      setSelectedData(data)
    }
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setSelectedData(null)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
    if (isOpen) {
      setSelectedData(null)
    }
  }, [isOpen])

  const openWith = useCallback((data: T) => {
    setSelectedData(data)
    setIsOpen(true)
  }, [])

  return {
    isOpen,
    selectedData,
    open,
    close,
    toggle,
    openWith,
  }
}
