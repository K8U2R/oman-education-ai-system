/**
 * Toast Context
 * Context لإدارة الإشعارات المنبثقة
 */

import { createContext } from 'react';
import type { ToastContextType } from './ToastContextTypes';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
export type { ToastContextType };

