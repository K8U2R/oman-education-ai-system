/**
 * DeleteConfirmModal Component - مكون modal تأكيد الحذف
 *
 * مكون موحد لحوارات تأكيد الحذف
 * يقلل التكرار في كود delete modals
 */

import React from 'react'
import { ConfirmDialog } from '../ConfirmDialog'

export interface DeleteConfirmModalProps {
  /**
   * هل الـ modal مفتوح؟
   */
  isOpen: boolean

  /**
   * دالة الإغلاق
   */
  onClose: () => void

  /**
   * دالة التأكيد
   */
  onConfirm: () => void | Promise<void>

  /**
   * عنوان العنصر المراد حذفه
   */
  itemTitle: string

  /**
   * نوع العنصر (اختياري)
   */
  itemType?: string

  /**
   * هل العنصر دائم ولا يمكن حذفه؟
   */
  isPermanent?: boolean

  /**
   * رسالة مخصصة
   */
  customMessage?: string

  /**
   * نص زر التأكيد
   */
  confirmText?: string

  /**
   * نص زر الإلغاء
   */
  cancelText?: string

  /**
   * هل زر التأكيد في حالة تحميل؟
   */
  isLoading?: boolean
}

/**
 * DeleteConfirmModal Component
 *
 * مكون modal موحد لتأكيد الحذف
 *
 * @example
 * ```tsx
 * <DeleteConfirmModal
 *   isOpen={isDeleteModalOpen}
 *   onClose={() => setIsDeleteModalOpen(false)}
 *   onConfirm={handleDelete}
 *   itemTitle="الدرس الأول"
 *   itemType="درس"
 * />
 * ```
 */
export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  itemType = 'عنصر',
  isPermanent = false,
  customMessage,
  confirmText = 'حذف',
  cancelText = 'إلغاء',
  isLoading = false,
}) => {
  const message =
    customMessage ||
    `هل أنت متأكد من حذف ${itemType} "${itemTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="تأكيد الحذف"
      message={message}
      variant="danger"
      confirmText={confirmText}
      cancelText={cancelText}
      isLoading={isLoading}
      isConfirmDisabled={isPermanent}
    />
  )
}
