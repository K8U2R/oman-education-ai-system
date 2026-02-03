/**
 * ToastContainer Types - أنواع حاوية الإشعارات
 *
 * جميع Types و Interfaces لمكون ToastContainer
 */

import type { ToastType } from './Toast'

export type { ToastType }

export interface ToastItem {
  id: string
  message: string
  type?: ToastType
  duration?: number
}
