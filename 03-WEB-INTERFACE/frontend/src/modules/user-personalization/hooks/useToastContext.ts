/**
 * useToastContext Hook
 * Hook للوصول إلى Toast Context
 */

import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';
import type { ToastContextType } from '../context/ToastContextTypes';

/**
 * hook أساسي للوصول إلى ToastContext
 */
export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

/**
 * alias باسم useToast لسهولة الاستخدام
 * (متوافق مع الاستيراد في ExportImport.tsx)
 */
export const useToast = useToastContext;
