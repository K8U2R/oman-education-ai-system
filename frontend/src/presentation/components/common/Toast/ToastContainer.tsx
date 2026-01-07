/**
 * ToastContainer Component - حاوية الإشعارات
 *
 * مكون حاوية لعرض الإشعارات
 */

import React from 'react'
import { Toast } from './Toast'
import type { ToastItem } from './ToastContainer.types'
import './ToastContainer.scss'

interface ToastContainerProps {
  toasts: ToastItem[]
  onClose: (id: string) => void
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right',
}) => {
  if (toasts.length === 0) return null

  return (
    <div className={`toast-container toast-container--${position}`}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={onClose}
          position={position}
        />
      ))}
    </div>
  )
}
