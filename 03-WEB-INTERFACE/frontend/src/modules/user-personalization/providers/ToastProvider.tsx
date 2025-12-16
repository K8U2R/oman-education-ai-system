/**
 * Toast Provider
 * Provider لإدارة الإشعارات المنبثقة
 */

import React from 'react';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

