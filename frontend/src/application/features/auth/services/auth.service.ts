/**
 * Auth Service - خدمة المصادقة
 *
 * Application Service للمصادقة
 * يستخدم Domain Layer للكيانات والأنواع
 */

// استخدام apiClientRefactored (الموصى به) أو apiClient (للتوافق)
import { apiClientRefactored as apiClient } from '@/infrastructure/api'
import { storageAdapter } from '@/infrastructure/storage'
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
    const userData = await apiClient.get<UserData>(API_ENDPOINTS.AUTH.ME)
    return User.fromData(userData)
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<{ tokens: AuthTokens }>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    })

    storageAdapter.set('access_token', response.tokens.access_token)
    storageAdapter.set('refresh_token', response.tokens.refresh_token)

    return response.tokens
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    })
  }

  async updateUser(data: Partial<UserData>): Promise<User> {
    const userData = await apiClient.patch<UserData>(API_ENDPOINTS.AUTH.UPDATE_USER, data)
    return User.fromData(userData)
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
   * @param provider - OAuth provider ('google' or 'github')
   * @param redirectTo - URL to redirect after OAuth (default: current page)
   */
  getOAuthUrl(provider: OAuthProvider, redirectTo?: string): string {
    // Use apiClient base URL which already includes /api/v1
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
    // Ensure baseUrl ends with /api/v1
    const apiBaseUrl = baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl}/api/v1`
    const currentUrl = redirectTo || `${window.location.origin}${ROUTES.OAUTH_CALLBACK}`
    // API_ENDPOINTS.AUTH.OAUTH returns /auth/oauth/{provider}, so we need to add /api/v1
    return `${apiBaseUrl}${API_ENDPOINTS.AUTH.OAUTH(provider)}?redirect_to=${encodeURIComponent(currentUrl)}`
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

      // Provide more helpful error message for common issues
      let helpfulError = decodedError || `خطأ OAuth: ${error}`
      if (decodedError.includes('Unable to exchange external code')) {
        helpfulError = `فشل استبدال كود OAuth. تحقق من:
1. Client Secret في Supabase Dashboard
2. Redirect URI في Google Cloud Console
3. راجع ملف OAUTH_TROUBLESHOOTING.md`
      }

      return {
        success: false,
        error: helpfulError,
      }
    }

    // Check for tokens in query parameters (from backend redirect)
    const accessTokenFromQuery = urlParams.get('access_token')
    const refreshTokenFromQuery = urlParams.get('refresh_token')

    if (accessTokenFromQuery && refreshTokenFromQuery) {
      storageAdapter.set('access_token', accessTokenFromQuery)
      storageAdapter.set('refresh_token', refreshTokenFromQuery)

      // Clean URL by removing query parameters
      window.history.replaceState({}, '', window.location.pathname)

      // Get user info
      try {
        const user = await this.getCurrentUser()
        return {
          success: true,
          data: {
            user: user.toData(),
            tokens: {
              access_token: accessTokenFromQuery,
              refresh_token: refreshTokenFromQuery,
              token_type: (urlParams.get('token_type') || 'Bearer') as 'Bearer',
              expires_in: parseInt(urlParams.get('expires_in') || '3600', 10),
            },
          },
        }
      } catch (error) {
        console.error('Failed to get user after OAuth:', error)
        return {
          success: false,
          error: 'فشل الحصول على معلومات المستخدم',
        }
      }
    }

    // Check for errors in URL hash
    const hash = window.location.hash
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1))
      const hashError = hashParams.get('error')
      const hashErrorDescription = hashParams.get('error_description')

      if (hashError) {
        const decodedError = hashErrorDescription
          ? decodeURIComponent(hashErrorDescription.replace(/\+/g, ' '))
          : 'حدث خطأ أثناء تسجيل الدخول'

        console.error('OAuth hash error:', hashError, decodedError)
        console.error('Full URL hash:', hash)

        // Provide more helpful error message for common issues
        let helpfulError = decodedError || `خطأ OAuth: ${hashError}`
        if (decodedError.includes('Unable to exchange external code')) {
          helpfulError = `فشل استبدال كود OAuth. تحقق من:
1. Client Secret في Supabase Dashboard
2. Redirect URI في Google Cloud Console
3. راجع ملف OAUTH_TROUBLESHOOTING.md`
        }

        return {
          success: false,
          error: helpfulError,
        }
      }

      // Check for tokens in hash (fallback for other OAuth providers)
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      if (accessToken && refreshToken) {
        storageAdapter.set('access_token', accessToken)
        storageAdapter.set('refresh_token', refreshToken)

        // Get user info
        try {
          const user = await this.getCurrentUser()
          return {
            success: true,
            data: {
              user: user.toData(),
              tokens: {
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: 'Bearer',
                expires_in: 3600,
              },
            },
          }
        } catch (error) {
          console.error('Failed to get user after OAuth:', error)
          return {
            success: false,
            error: 'فشل الحصول على معلومات المستخدم',
          }
        }
      }
    }

    // No tokens and no errors - might be still processing
    return {
      success: false,
      error: 'لم يتم العثور على معلومات المصادقة',
    }
  }
}

export const authService = new AuthService()
