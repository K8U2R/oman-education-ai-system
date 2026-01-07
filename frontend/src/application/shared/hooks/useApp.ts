/**
 * useApp Hook - Hook مركزي للتطبيق
 *
 * Custom Hook يجمع الـ hooks الأساسية للتطبيق:
 * - useAuth: المصادقة والمستخدم
 * - useI18n: اللغة والترجمة
 * - useRole: الأدوار والصلاحيات
 *
 * هذا الـ Hook يوفر نقطة دخول واحدة لمعظم المكونات
 * ويقلل من التكرار في استيراد واستخدام الـ hooks المتعددة.
 */

import { useAuth } from '../../features/auth/hooks/useAuth'
import { useI18n } from './useI18n'
import { useRole } from '../../features/auth/hooks/useRole'

/**
 * Hook مركزي يجمع جميع الـ hooks الأساسية
 *
 * @returns كائن يحتوي على جميع الوظائف من useAuth, useI18n, useRole
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, language, isAdmin, login, changeLanguage } = useApp()
 * ```
 */
export const useApp = () => {
  const auth = useAuth()
  const i18n = useI18n()
  const role = useRole() // يعتمد داخلياً على auth.user

  return {
    // من useAuth
    ...auth,
    // من useI18n
    ...i18n,
    // من useRole
    ...role,
  }
}
