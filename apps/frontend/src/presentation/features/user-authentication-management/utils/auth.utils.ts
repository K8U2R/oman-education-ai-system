/**
 * Auth Utils - دوال مساعدة للمصادقة
 *
 * @description دوال مساعدة خاصة بميزة المصادقة
 */

import type { UserData } from '../types'
import { AUTH_CONFIG } from '@/domain/constants'

/**
 * التحقق من صحة البريد الإلكتروني
 */
export function isValidEmail(email: string): boolean {
  return AUTH_CONFIG.VALIDATION.EMAIL_REGEX.test(email)
}

/**
 * alias لـ isValidEmail للتوافق مع الاختبارات
 */
export const validateEmail = isValidEmail

/**
 * التحقق من قوة كلمة المرور
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < AUTH_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(
      `كلمة المرور يجب أن تكون على الأقل ${AUTH_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} أحرف`
    )
  }

  if (password.length > AUTH_CONFIG.VALIDATION.PASSWORD_MAX_LENGTH) {
    errors.push(`كلمة المرور يجب أن تكون أقل من ${AUTH_CONFIG.VALIDATION.PASSWORD_MAX_LENGTH} حرف`)
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * التحقق من صحة الاسم
 */
export function validateName(name: string): {
  valid: boolean
  error?: string
} {
  if (name.length < AUTH_CONFIG.VALIDATION.NAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `الاسم يجب أن يكون على الأقل ${AUTH_CONFIG.VALIDATION.NAME_MIN_LENGTH} أحرف`,
    }
  }

  if (name.length > AUTH_CONFIG.VALIDATION.NAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `الاسم يجب أن يكون أقل من ${AUTH_CONFIG.VALIDATION.NAME_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * التحقق من انتهاء صلاحية Token
 */
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return true

    const payload = JSON.parse(atob(parts[1] || ''))
    if (!payload.exp) return true

    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= expirationTime
  } catch {
    return true // Consider invalid tokens as expired
  }
}

/**
 * نوع المستخدم للتحقق من
 */
interface UserWithPermissions {
  permissions?: string[]
  role?: string
}

/**
 * متطلبات الوصول للمسار
 */
interface RouteRequirements {
  requiredRole?: string
  requiredPermission?: string
}

/**
 * التحقق من  (للتوافق مع الاختبارات)
 */
export function hasPermission(
  user: UserWithPermissions | null | undefined,
  permission: string
): boolean {
  if (!user || !user.permissions) return false
  return user.permissions.includes(permission)
}

/**
 * التحقق من الدور (للتوافق مع الاختبارات)
 */
export function hasRole(user: UserWithPermissions | null | undefined, role: string): boolean {
  if (!user) return false
  return user.role === role
}

/**
 * التحقق من إمكانية الوصول للمسار (للتوافق مع الاختبارات)
 */
export function canAccessRoute(
  user: UserWithPermissions | null | undefined,
  requirements: RouteRequirements | null | undefined
): boolean {
  if (!requirements) return true
  if (requirements.requiredRole && !hasRole(user, requirements.requiredRole)) return false
  if (requirements.requiredPermission && !hasPermission(user, requirements.requiredPermission))
    return false
  return true
}

/**
 * الحصول على وقت انتهاء Token
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null

    const payload = JSON.parse(atob(parts[1] || ''))
    if (!payload.exp) return null

    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    return new Date(expirationTime)
  } catch {
    return null
  }
}

/**
 * التحقق من صحة Token
 */
export function isValidToken(token: string | null | undefined): boolean {
  if (!token) return false

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false

    // Try to parse payload
    JSON.parse(atob(parts[1] || ''))
    return true
  } catch {
    return false
  }
}

/**
 * تنسيق رسالة الخطأ
 */
export function formatAuthError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return AUTH_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * التحقق من أن المستخدم نشط
 */
export function isUserActive(user: UserData | null): boolean {
  return user?.is_active === true
}

/**
 * التحقق من أن المستخدم موثق
 */
export function isUserVerified(user: UserData | null): boolean {
  return user?.is_verified === true
}

/**
 * التحقق من أن المستخدم يمكنه الوصول
 */
export function canUserAccess(user: UserData | null): boolean {
  return isUserActive(user) && isUserVerified(user)
}

/**
 * حساب وقت انتهاء الجلسة
 */
export function calculateSessionExpiry(rememberMe: boolean = false): Date {
  const duration = rememberMe
    ? AUTH_CONFIG.REMEMBER_ME_DURATION
    : AUTH_CONFIG.DEFAULT_SESSION_DURATION

  return new Date(Date.now() + duration)
}

/**
 * تنسيق اسم المستخدم للعرض
 */
export function formatUserName(user: UserData | null): string {
  if (!user) return 'مستخدم غير معروف'

  if (user.full_name) {
    return user.full_name
  }

  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`
  }

  if (user.first_name) {
    return user.first_name
  }

  return user.email || 'مستخدم غير معروف'
}
