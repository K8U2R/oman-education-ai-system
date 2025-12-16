/**
 * Toast Context Types
 * أنواع Toast Context
 */

import type { ToastType } from '../components/Toast';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

