/**
 * ToastProvider - موفر الإشعارات السريعة
 *
 * Context Provider لإدارة الإشعارات السريعة
 */

import React, { createContext, useContext } from 'react'
import { ToastContainer, useToast } from '../components/common/Toast'

interface ToastContextType {
  showToast: (
    message: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    duration?: number
  ) => string
  removeToast: (id: string) => void
  success: (message: string, duration?: number) => string
  error: (message: string, duration?: number) => string
  warning: (message: string, duration?: number) => string
  info: (message: string, duration?: number) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
}) => {
  const { toasts, showToast, removeToast, success, error, warning, info } = useToast()

  return (
    <ToastContext.Provider value={{ showToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} position={position} />
    </ToastContext.Provider>
  )
}
