/**
 * Error Configuration - إعدادات الأخطاء
 *
 * إعدادات مركزية لجميع صفحات الأخطاء
 */

import { ShieldX, AlertCircle, FileX, ServerCrash, WifiOff, Wrench } from 'lucide-react'
import type { ErrorPageConfig } from '../core/types'

/**
 * إعدادات صفحات الأخطاء
 */
export const ERROR_CONFIG: Record<string, ErrorPageConfig> = {
  forbidden: {
    type: 'forbidden',
    title: 'غير مصرح بالوصول',
    message: 'عذراً، ليس لديك  اللازمة للوصول إلى هذه الصفحة.',
    secondaryMessage: 'يرجى التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.',
    icon: ShieldX,
    iconColor: 'error',
    showRefreshButton: true,
    showBackButton: true,
    showHomeButton: true,
  },
  unauthorized: {
    type: 'unauthorized',
    title: 'غير مصرح بالوصول',
    message: 'عذراً، ليس لديك  اللازمة للوصول إلى هذه الصفحة.',
    secondaryMessage: 'يرجى تسجيل الدخول أو التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.',
    icon: AlertCircle,
    iconColor: 'warning',
    showLoginButton: true,
    showBackButton: true,
    showHomeButton: true,
  },
  'not-found': {
    type: 'not-found',
    title: 'الصفحة غير موجودة',
    message: 'عذراً، الصفحة التي تبحث عنها غير موجودة.',
    secondaryMessage: 'يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.',
    icon: FileX,
    iconColor: 'info',
    showBackButton: true,
    showHomeButton: true,
  },
  'server-error': {
    type: 'server-error',
    title: 'خطأ في الخادم',
    message: 'عذراً، حدث خطأ في الخادم. نحن نعمل على إصلاحه.',
    secondaryMessage: 'يرجى المحاولة مرة أخرى لاحقاً أو التواصل مع الدعم الفني.',
    icon: ServerCrash,
    iconColor: 'error',
    showRefreshButton: true,
    showBackButton: true,
    showHomeButton: true,
  },
  'network-error': {
    type: 'network-error',
    title: 'مشكلة في الاتصال',
    message: 'عذراً، لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.',
    secondaryMessage: 'بعد التحقق من الاتصال، يمكنك المحاولة مرة أخرى.',
    icon: WifiOff,
    iconColor: 'warning',
    showRefreshButton: true,
    showBackButton: true,
    showHomeButton: true,
  },
  maintenance: {
    type: 'maintenance',
    title: 'الصيانة قيد التنفيذ',
    message: 'نعتذر، النظام قيد الصيانة حاليًا.',
    secondaryMessage: 'سنعود قريباً. شكراً لصبرك.',
    icon: Wrench,
    iconColor: 'info',
    showHomeButton: true,
  },
}

/**
 * الحصول على إعدادات صفحة خطأ
 */
export function getErrorConfig(type: string): ErrorPageConfig | undefined {
  return ERROR_CONFIG[type]
}

/**
 * التحقق من وجود إعدادات لصفحة خطأ
 */
export function hasErrorConfig(type: string): boolean {
  return type in ERROR_CONFIG
}
