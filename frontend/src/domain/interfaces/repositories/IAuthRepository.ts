/**
 * IAuthRepository - واجهة مستودع المصادقة
 *
 * Domain Interface لمستودع المصادقة
 */

import { User } from '../../entities/User'
import { LoginRequest, RegisterRequest, AuthTokens, LoginResponse } from '../../types/auth.types'

export interface IAuthRepository {
  /**
   * تسجيل الدخول
   */
  login(credentials: LoginRequest): Promise<LoginResponse>

  /**
   * التسجيل
   */
  register(data: RegisterRequest): Promise<User>

  /**
   * تسجيل الخروج
   */
  logout(): Promise<void>

  /**
   * الحصول على المستخدم الحالي
   */
  getCurrentUser(): Promise<User>

  /**
   * تحديث Token
   */
  refreshToken(refreshToken: string): Promise<AuthTokens>

  /**
   * التحقق من المصادقة
   */
  isAuthenticated(): boolean

  /**
   * الحصول على Access Token
   */
  getAccessToken(): string | null

  /**
   * الحصول على Refresh Token
   */
  getRefreshToken(): string | null

  /**
   * الحصول على OAuth URL
   */
  getOAuthUrl(provider: 'google' | 'github', redirectTo?: string): string

  /**
   * معالجة OAuth Callback
   */
  handleOAuthCallback(): Promise<{ success: boolean; error?: string; data?: LoginResponse }>
}
