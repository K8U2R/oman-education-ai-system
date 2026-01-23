/**
 * Auth Service - خدمة المصادقة
 *
 * Application Service للمصادقة
 * يستخدم Domain Layer للكيانات والأنواع
 */

// استخدام apiClientRefactored (الموصى به) أو apiClient (للتوافق)
import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { storageAdapter } from '@/infrastructure/services/storage'

import { IAuthRepository } from '@/domain/interfaces/repositories/IAuthRepository'
import { User } from '@/domain/entities/User'
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  AuthTokens,
  UserData,
  OAuthProvider,
} from '@/domain/types/auth.types'
import { API_ENDPOINTS } from '@/domain/constants/api.constants'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useNotificationStore } from '@/stores/useNotificationStore'

// Re-export types for backward compatibility
export type { LoginRequest, RegisterRequest, LoginResponse, UserData }
export type UserResponse = UserData

class AuthService implements IAuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)

    // Store tokens
    storageAdapter.set('access_token', response.tokens.access_token)
    storageAdapter.set('refresh_token', response.tokens.refresh_token)

    return response
  }

  async register(data: RegisterRequest): Promise<User> {
    const userData = await apiClient.post<UserData>(API_ENDPOINTS.AUTH.REGISTER, data)
    return User.fromData(userData)
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens regardless of API call result
      storageAdapter.remove('access_token')
      storageAdapter.remove('refresh_token')
    }
  }

  async getCurrentUser(): Promise<User> {
    // Backend returns { success: true, data: { user: UserData }, message: '...' }
    // apiClient.get extracts 'data' from response, so we get { user: UserData }
    const response = await apiClient.get<{ user: UserData }>(API_ENDPOINTS.AUTH.ME)
    return User.fromData(response.user)
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<{ tokens: AuthTokens }>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    })

    // Safe parsing logic similar to api-client.ts to handle various backend response structures
    // Backend might return:
    // 1. { success: true, data: { tokens: {...} } } -> apiClient returns { tokens: {...} }
    // 2. { success: true, tokens: {...} } -> apiClient returns { tokens: {...} }
    // 3. { tokens: {...} } -> apiClient returns { tokens: {...} }
    const unknownResponse = response as unknown as {
      tokens?: AuthTokens
      data?: { tokens?: AuthTokens }
      access_token?: string
      refresh_token?: string
    }
    let tokens =
      unknownResponse.tokens ||
      unknownResponse.data?.tokens ||
      (unknownResponse as unknown as AuthTokens)

    // Extra safety: if tokens is still not found or missing access_token, check if response ITSELF is the tokens object
    if (!tokens?.access_token && unknownResponse?.access_token) {
      tokens = unknownResponse as unknown as AuthTokens
    }

    if (!tokens || !tokens.access_token) {
      console.error('[AuthService] Invalid refresh response:', response)
      throw new Error('Invalid token response structure')
    }

    storageAdapter.set('access_token', tokens.access_token)
    storageAdapter.set('refresh_token', tokens.refresh_token)

    return tokens
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    })
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
    useNotificationStore.getState().addNotification({
      type: 'success',
      title: 'تم الإرسال',
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
    })
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, new_password: newPassword })
    useNotificationStore.getState().addNotification({
      type: 'success',
      title: 'تم بنجاح',
      message: 'تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.'
    })
  }

  async updateUser(data: Partial<UserData>): Promise<User> {
    const userData = await apiClient.patch<UserData>(API_ENDPOINTS.AUTH.UPDATE_USER, data)
    useNotificationStore.getState().addNotification({
      type: 'success',
      message: 'تم تحديث البيانات بنجاح'
    })
    return User.fromData(userData)
  }

  /**
   * إرسال بريد التحقق من البريد الإلكتروني
   *
   * @param email - البريد الإلكتروني
   * @returns Promise<void>
   * @throws {Error} إذا فشل الإرسال
   *
   * @example
   * ```typescript
   * await authService.sendVerificationEmail('user@example.com')
   * ```
   */
  async sendVerificationEmail(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.SEND_VERIFICATION_EMAIL, { email })
    useNotificationStore.getState().addNotification({
      type: 'success',
      title: 'تم الإرسال',
      message: 'تم إرسال رابط التحقق إلى بريدك الإلكتروني بنجاح.'
    })
  }

  /**
   * التحقق من البريد الإلكتروني باستخدام رمز التحقق
   *
   * @param token - رمز التحقق
   * @returns Promise<User> - المستخدم المحدث بعد التحقق
   * @throws {Error} إذا فشل التحقق
   *
   * @example
   * ```typescript
   * const user = await authService.verifyEmail('verification_token_here')
   * ```
   */
  async verifyEmail(token: string): Promise<User> {
    const response = await apiClient.post<{ user: UserData }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      token,
    })
    return User.fromData(response.user)
  }

  isAuthenticated(): boolean {
    return !!storageAdapter.get('access_token')
  }

  getAccessToken(): string | null {
    return storageAdapter.get('access_token')
  }

  getRefreshToken(): string | null {
    return storageAdapter.get('refresh_token')
  }

  /**
   * Get OAuth URL for provider
   * @param provider - OAuth provider ('google')
   * @param redirectTo - URL to redirect after OAuth (default: current page)
   */
  getOAuthUrl(provider: OAuthProvider, redirectTo?: string): string {
    // Backend runs on port 3000, frontend on 5174
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:30000'
    // Remove /api/v1 suffix if present since routes are mounted at /api/v1 in express
    const baseUrl = backendUrl.replace(/\/api\/v1$/, '')
    const redirectUrl = redirectTo || `${window.location.origin}${ROUTES.OAUTH_CALLBACK}`

    // API_ENDPOINTS.AUTH.OAUTH returns /auth/{provider}, backend expects this at /api/v1/auth/{provider}
    const oauthPath = API_ENDPOINTS.AUTH.OAUTH(provider)
    return `${baseUrl}/api/v1${oauthPath}?redirect_to=${encodeURIComponent(redirectUrl)}`
  }

  /**
   * Handle OAuth callback
   * This should be called after OAuth redirect
   */
  async handleOAuthCallback(): Promise<{ success: boolean; error?: string; data?: LoginResponse }> {
    // Check for errors in URL query parameters first
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')

    if (error) {
      const decodedError = errorDescription
        ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
        : 'حدث خطأ أثناء تسجيل الدخول'

      console.error('OAuth error:', error, decodedError)
      console.error('Full URL:', window.location.href)

      return {
        success: false,
        error: decodedError,
      }
    }

    // Capture token from different possible query parameters
    // Standard OAuth2 might return code, but backend might redirect with tokens directly
    const access_token = urlParams.get('access_token') || urlParams.get('accessToken')
    const refresh_token = urlParams.get('refresh_token') || urlParams.get('refreshToken')

    if (access_token && refresh_token) {
      storageAdapter.set('access_token', access_token)
      storageAdapter.set('refresh_token', refresh_token)

      // Potentially fetch user data to complete the login response
      // But for now, we just indicate success
      return {
        success: true,
        data: {
          tokens: {
            access_token,
            refresh_token,
            token_type: 'Bearer',
            expires_in: 3600 // Default to 1 hour if unknown
          },
          user: {} as any // We might need to fetch user, but this suffices for redirect
        }
      }
    }

    // If no tokens, maybe we have a 'code' and need to exchange it?
    // Current backend implementation seems to redirect with *tokens* for simplicity based on previous analysis.
    // If not, we would call apiClient.post(callbackUrl, { code }).

    // Fallback if no tokens found but no error param
    return {
      success: false,
      error: 'لم يتم العثور على رموز الدخول'
    }
  }
}

export const authService = new AuthService()
