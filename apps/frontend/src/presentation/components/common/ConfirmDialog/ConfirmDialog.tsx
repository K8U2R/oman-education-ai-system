/**
 * ConfirmDialog Component - مكون حوار التأكيد
 *
 * مكون موحد لحوارات التأكيد لاستبدال window.confirm
 * يوفر واجهة مستخدم أفضل وتخصيص أكثر
 */

import React from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { Modal } from '../../ui/layout/Modal'
import { Button } from '../../ui/inputs/Button'

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info' | 'success'

export interface ConfirmDialogProps {
  /**
   * هل الحوار مفتوح؟
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
   * عنوان الحوار
   */
  title: string

  /**
   * رسالة الحوار
   */
  message: string

  /**
   * نوع الحوار (يحدد الأيقونة واللون)
   */
  variant?: ConfirmDialogVariant

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

  /**
   * هل زر التأكيد معطل؟
   */
  isConfirmDisabled?: boolean

  /**
   * حجم الحوار
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ConfirmDialog Component
 *
 * مكون حوار التأكيد الموحد
 *
 * @example
 * ```tsx
 * const { isOpen, open, close } = useModal()
 *
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={close}
 *   onConfirm={handleDelete}
 *   title="تأكيد الحذف"
 *   message="هل أنت متأكد من حذف هذا العنصر؟"
 *   variant="danger"
 *   confirmText="حذف"
 *   cancelText="إلغاء"
 * />
 * ```
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'warning',
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  isLoading = false,
  isConfirmDisabled = false,
  size = 'md',
}) => {
  const handleConfirm = async () => {
    await onConfirm()
  }

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <XCircle size={24} className="confirm-dialog__icon confirm-dialog__icon--danger" />
      case 'warning':
        return (
          <AlertTriangle size={24} className="confirm-dialog__icon confirm-dialog__icon--warning" />
        )
      case 'info':
        return <Info size={24} className="confirm-dialog__icon confirm-dialog__icon--info" />
      case 'success':
        return (
          <CheckCircle2 size={24} className="confirm-dialog__icon confirm-dialog__icon--success" />
        )
      default:
        return <Info size={24} className="confirm-dialog__icon confirm-dialog__icon--info" />
    }
  }

  const getConfirmButtonVariant = (): 'primary' | 'danger' | 'warning' => {
    switch (variant) {
      case 'danger':
        return 'danger'
      case 'warning':
        return 'warning'
      default:
        return 'primary'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} title={title}>
      <div className="confirm-dialog">
        <div className="confirm-dialog__content">
          <div className="confirm-dialog__icon-wrapper">{getIcon()}</div>
          <p className="confirm-dialog__message">{message}</p>
        </div>
        <div className="confirm-dialog__actions">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
            disabled={isLoading || isConfirmDisabled}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
