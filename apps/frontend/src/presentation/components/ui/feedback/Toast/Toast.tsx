/**
 * Toast Component - مكون الإشعار السريع
 *
 * مكون إشعار سريع قابلة لإعادة الاستخدام
 */

import React, { useEffect, useMemo } from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import styles from './Toast.module.scss'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  message: string
  type?: ToastType
  duration?: number
  onClose: (id: string) => void
  position?:
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  position: _position = 'top-right',
}) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [duration, id, onClose])

  const Icon = icons[type]

  const typeClass = useMemo(() => {
    return styles[`toast--${type}`] || styles['toast--info']
  }, [type])

  return (
    <div className={`${styles.toast} ${typeClass}`} role="alert">
      <div className={styles.icon}>
        <Icon className="w-5 h-5" />
      </div>
      <p className={styles.message}>{message}</p>
      <button className={styles.close} onClick={() => onClose(id)} aria-label={t('common.close')}>
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
