/**
 * Auth Types - أنواع المصادقة
 *
 * @description أنواع TypeScript الخاصة بميزة المصادقة
 * هذه الأنواع مخصصة لطبقة Application ويمكن أن تختلف عن Domain Types
 */

// Re-export Domain Types
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  AuthTokens,
  UserData,
  OAuthProvider,
  UserRole,
  Permission,
} from '@/domain/types/auth.types'

export type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  AuthTokens,
  UserData,
  OAuthProvider,
  UserRole,
  Permission,
}

// Application-specific Types

/**
 * حالة المصادقة
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'

/**
 * خيارات تسجيل الدخول
 */
export interface LoginOptions {
  rememberMe?: boolean
  redirectTo?: string
}

/**
 * خيارات التسجيل
 */
export interface RegisterOptions {
  autoLogin?: boolean
  redirectTo?: string
}

/**
 * نتيجة تسجيل الدخول
 */
export interface LoginResult {
  success: boolean
  user?: UserData
  error?: string
  tokens?: AuthTokens
}

/**
 * نتيجة التسجيل
 */
export interface RegisterResult {
  success: boolean
  user?: UserData
  error?: string
}

/**
 * حالة تحديث المستخدم
 */
export interface UpdateUserState {
  loading: boolean
  error: string | null
}

/**
 * حالة تحديث كلمة المرور
 */
export interface UpdatePasswordState {
  loading: boolean
  error: string | null
}

/**
 * معلومات جلسة المستخدم
 */
export interface UserSession {
  userId: string
  email: string
  role: UserRole
  permissions: Permission[]
  expiresAt: Date
}

/**
 * إعدادات المصادقة
 */
export interface AuthSettings {
  requireEmailVerification: boolean
  allowOAuth: boolean
  sessionTimeout: number // بالدقائق
  rememberMeDuration: number // بالأيام
}

/**
 * خطأ المصادقة
 */
export interface AuthError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}

/**
 * نتيجة التحقق من البريد الإلكتروني
 */
export interface VerificationResult {
  success: boolean
  message: string
  error?: string
}
