/**
 * API Client - عميل API
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { analyticsService, performanceService, offlineService } from '@/application'
import { tokenManager } from '../services/auth/token-manager.service'
import { useAuthStore } from '@/features/user-authentication-management'
import type { ApiRequestConfig } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:30000/api/v1'

interface QueuedRequest {
  resolve: (value: unknown) => void
  reject: (error: unknown) => void
}

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private failedQueue: QueuedRequest[] = []
  private refreshAttempts = 0
  private readonly MAX_REFRESH_ATTEMPTS = 3
  private lastRefreshTime = 0
  private readonly REFRESH_COOLDOWN = 1000 // 1 second cooldown between refreshes

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.setupRequestInterceptor()
    this.setupResponseInterceptor()
  }

  /**
   * إعداد Request Interceptor
   */
  private setupRequestInterceptor(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // If Authorization header is already set (e.g., from retry after refresh), use it
        const existingAuth = config.headers?.Authorization || config.headers?.authorization
        if (
          existingAuth &&
          typeof existingAuth === 'string' &&
          existingAuth.startsWith('Bearer ')
        ) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[API Client] Using existing Authorization header:', config.url)
          }
          return config
        }

        // Add auth token if available using TokenManager
        const tokenInfo = tokenManager.getTokens()
        const token = tokenInfo.accessToken

        if (token && config.headers) {
          // Always set Authorization header, even if it already exists
          // This ensures we use the latest token after refresh
          config.headers.Authorization = `Bearer ${token}`
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[API Client] ✅ Token added to request:', config.url, {
              source: tokenInfo.source,
              tokenLength: token.length,
              tokenPrefix: token.substring(0, 20) + '...',
              hasExistingAuth: !!config.headers.Authorization,
            })
          }
        } else if (import.meta.env.DEV && config.url && !config.url.includes('/auth/')) {
          const tokenInfo = tokenManager.getTokenInfo()
          const authState = useAuthStore.getState()

          console.error('[API Client] ❌ No token found for request:', config.url, {
            ...tokenInfo,
            authState: {
              isAuthenticated: authState.isAuthenticated,
              hasUser: !!authState.user,
              hasTokens: !!authState.tokens,
            },
          })
        }

        // Log final Authorization header for debugging
        if (import.meta.env.DEV && config.headers && config.url && !config.url.includes('/auth/')) {
          const authHeader = config.headers.Authorization
          if (authHeader) {
            // eslint-disable-next-line no-console
            console.log('[API Client] Final Authorization header:', {
              url: config.url,
              hasToken: !!authHeader,
              tokenLength: typeof authHeader === 'string' ? authHeader.length : 0,
            })
          }
        }

        // Add request ID for tracking (using custom property)
        const apiConfig = config as ApiRequestConfig
        apiConfig.__startTime = Date.now()

        // Track request
        analyticsService.trackEvent('api_request', 'API', 'Request', config.url || '')

        return config
      },
      error => {
        // Track request error
        analyticsService.trackError(error as Error, { type: 'request_error' })
        return Promise.reject(error)
      }
    )
  }

  /**
   * إعداد Response Interceptor
   */
  private setupResponseInterceptor(): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Measure response time
        const apiConfig = response.config as ApiRequestConfig
        const startTime = apiConfig.__startTime
        if (startTime) {
          const duration = Date.now() - startTime
          performanceService.recordMetric('api_response_time', duration, 'ms')
        }

        // Track successful response
        analyticsService.trackEvent(
          'api_response',
          'API',
          'Response',
          response.config.url,
          undefined,
          {
            status: response.status,
          }
        )

        return response
      },
      async (error: AxiosError) => {
        // Measure error response time
        const apiConfig = error.config as ApiRequestConfig | undefined
        const startTime = apiConfig?.__startTime
        if (startTime) {
          const duration = Date.now() - startTime
          performanceService.recordMetric('api_error_time', duration, 'ms')
        }

        // في development mode، نتخطى تتبع أخطاء 404 المتوقعة
        const is404 = error.response?.status === 404
        const isDevelopment = import.meta.env.DEV

        // Track error (skip 404 in development for expected missing endpoints)
        if (!(isDevelopment && is404)) {
          analyticsService.trackError(error as Error, {
            type: 'api_error',
            status: error.response?.status,
            url: error.config?.url,
          })
        }

        // Handle 401 Unauthorized
        // Skip refresh for auth endpoints to prevent infinite loops
        if (error.response?.status === 401) {
          const url = error.config?.url || ''
          // Don't try to refresh if the request is to an auth endpoint
          if (url.includes('/auth/') && !url.includes('/auth/refresh')) {
            return Promise.reject(error)
          }
          return this.handle401Error(error)
        }

        // Handle 403 Forbidden - قد يكون بسبب تحديث الدور في قاعدة البيانات
        // محاولة تحديث بيانات المستخدم تلقائياً
        if (error.response?.status === 403) {
          this.handle403Error(error)
        }

        // Handle network errors
        if (!error.response && error.request) {
          return this.handleNetworkError(error)
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * معالجة خطأ 401
   */
  private async handle401Error(error: AxiosError): Promise<AxiosResponse> {
    const originalRequest = error.config as ApiRequestConfig | undefined

    if (!originalRequest) {
      return Promise.reject(error)
    }

    // Check if we've exceeded max refresh attempts
    if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
      if (import.meta.env.DEV) {
        console.error('[API Client] Max refresh attempts reached, redirecting to login')
      }
      this.refreshAttempts = 0
      this.lastRefreshTime = 0
      this.processQueue(null, new Error('Max refresh attempts exceeded'))
      this.redirectToLogin()
      return Promise.reject(error)
    }

    // Check cooldown period to prevent rapid refresh attempts
    const now = Date.now()
    if (now - this.lastRefreshTime < this.REFRESH_COOLDOWN) {
      if (import.meta.env.DEV) {
        console.warn('[API Client] Refresh cooldown active, rejecting request to prevent loop')
      }
      return Promise.reject(error)
    }

    // If already refreshing, queue the request
    if (this.isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const queuedRequest: QueuedRequest = {
          resolve: (token: unknown) => {
            if (typeof token === 'string' && originalRequest.headers) {
              // Use a fresh request config to ensure interceptor runs with new token
              const retryConfig = {
                ...originalRequest,
                headers: {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${token}`,
                },
              }
              this.client.request(retryConfig).then(resolve).catch(reject)
            } else {
              reject(new Error('Invalid token'))
            }
          },
          reject,
        }
        this.failedQueue.push(queuedRequest)
      })
    }

    this.isRefreshing = true
    this.refreshAttempts++
    this.lastRefreshTime = Date.now()
    const refreshToken = tokenManager.getRefreshToken()

    if (!refreshToken) {
      this.refreshAttempts = 0
      this.processQueue(null, new Error('No refresh token'))
      this.redirectToLogin()
      return Promise.reject(error)
    }

    try {
      // استخدام API_BASE_URL مباشرة لأنه يحتوي بالفعل على /api/v1
      const refreshUrl = API_BASE_URL.endsWith('/api/v1')
        ? `${API_BASE_URL.replace(/\/api\/v1$/, '')}/api/v1/auth/refresh`
        : `${API_BASE_URL}/api/v1/auth/refresh`
      const response = await axios.post(refreshUrl, {
        refresh_token: refreshToken,
      })

      // Backend returns { success: true, data: { tokens: {...} } }
      // axios.post returns { data: { success: true, data: { tokens: {...} } } }
      const responseData = response.data

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[API Client] Refresh response structure:', {
          hasData: !!responseData,
          hasDataData: !!responseData?.data,
          hasDataTokens: !!responseData?.data?.tokens,
          hasTokens: !!responseData?.tokens,
          keys: Object.keys(responseData || {}),
        })
      }

      // Try multiple possible response structures
      let tokens = responseData?.data?.tokens || responseData?.tokens

      // If tokens is not found, try direct access
      if (!tokens && responseData?.data) {
        tokens = responseData.data
      }

      if (!tokens || !tokens.access_token) {
        if (import.meta.env.DEV) {
          console.error('[API Client] Invalid token response structure:', {
            responseData,
            tokens,
          })
        }
        throw new Error('Invalid token response structure')
      }

      const { access_token, refresh_token: newRefreshToken } = tokens

      // Save tokens using TokenManager (saves to both storageAdapter and authStore)
      tokenManager.saveTokens(
        {
          access_token,
          refresh_token: newRefreshToken || undefined,
        },
        { syncToStore: true }
      )

      // Reset refresh attempts on success
      this.refreshAttempts = 0
      this.processQueue(access_token, null)

      // Retry original request with new token
      if (originalRequest && originalRequest.headers) {
        // Force update Authorization header with new token
        // Clear any existing Authorization header first
        delete originalRequest.headers.Authorization
        delete originalRequest.headers.authorization

        // Set new token explicitly
        originalRequest.headers.Authorization = `Bearer ${access_token}`

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('[API Client] Retrying request with new token:', originalRequest.url, {
            tokenLength: access_token.length,
            tokenPrefix: access_token.substring(0, 20) + '...',
          })
        }

        // Use a fresh request config to ensure interceptor runs with new token
        // Create a completely new config object to avoid any caching issues
        const retryConfig: ApiRequestConfig = {
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${access_token}`,
          } as typeof originalRequest.headers,
          // Mark this as a retry to prevent infinite loops
          __isRetry: true,
        }

        // Verify token is in storage before retrying (TokenManager already saved it, but verify)
        const storedToken = tokenManager.getAccessToken()
        if (storedToken !== access_token) {
          if (import.meta.env.DEV) {
            console.warn('[API Client] Token mismatch! Re-saving...', {
              stored: storedToken ? storedToken.substring(0, 20) + '...' : 'missing',
              expected: access_token.substring(0, 20) + '...',
            })
          }
          // Re-save token to ensure it's stored
          tokenManager.saveTokens({ access_token }, { syncToStore: false })
        }

        return this.client.request(retryConfig)
      }

      return Promise.reject(new Error('Original request not found'))
    } catch (refreshError) {
      this.processQueue(null, refreshError as Error)
      // Only redirect to login if we've exceeded max attempts
      if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
        tokenManager.clearTokens()
        this.redirectToLogin()
        this.refreshAttempts = 0
      }
      return Promise.reject(refreshError)
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * معالجة خطأ 403 Forbidden
   * قد يكون بسبب تحديث الدور في قاعدة البيانات
   * محاولة تحديث بيانات المستخدم تلقائياً
   */

  private handle403Error(_error: AxiosError): void {
    // فقط إذا كان المستخدم مصادق عليه
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    if (!isAuthenticated) {
      return
    }

    // تحديث بيانات المستخدم بشكل غير متزامن (لا ننتظر النتيجة)
    // لأن 403 قد يكون صحيحاً (المستخدم فعلاً لا يملك )
    // لكن نحاول تحديث البيانات في الخلفية على أمل أن يكون الدور قد تم تحديثه
    import('@/features/user-authentication-management')
      .then(({ authService }) => {
        return authService.getCurrentUser().then(updatedUser => {
          // تحديث auth store بالبيانات المحدثة
          const accessToken = authService.getAccessToken() || ''
          const refreshToken = authService.getRefreshToken() || ''
          const tokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: 'Bearer' as const,
            expires_in: 3600,
          }

          useAuthStore.getState().login(updatedUser, tokens)
        })
      })
      .catch(refreshError => {
        // فشل تحديث بيانات المستخدم - لا نفعل شيء
        // المستخدم سيحتاج لتحديث البيانات يدوياً
        console.warn('Failed to refresh user data after 403:', refreshError)
      })
  }

  /**
   * معالجة خطأ الشبكة
   */
  private handleNetworkError(error: AxiosError): Promise<AxiosResponse> {
    // Queue request for offline service
    if (error.config) {
      offlineService.queueRequest({
        url: error.config.url || '',
        method: error.config.method || 'GET',
        data: error.config.data,
        headers: error.config.headers as Record<string, string>,
      })
    }

    return Promise.reject(error)
  }

  /**
   * معالجة قائمة الانتظار
   */
  private processQueue(token: string | null, error: Error | null): void {
    this.failedQueue.forEach(promise => {
      if (token) {
        promise.resolve(token)
      } else {
        promise.reject(error || new Error('Unknown error'))
      }
    })

    this.failedQueue = []
  }

  /**
   * إعادة التوجيه إلى صفحة تسجيل الدخول
   * ملاحظة: بدلاً من إعادة تحميل الصفحة، نمسح auth store
   * وسيتم إعادة التوجيه تلقائياً عبر ProtectedRoute
   */
  private redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      // 1. Clear everything using the robust reset action
      tokenManager.clearTokens()
      useAuthStore.getState().reset()

      // 2. Hard redirect to break any React render loops
      if (window.location.pathname !== '/') {
        window.location.replace('/')
      }
    }
  }

  async get<T = unknown>(url: string, config?: Partial<ApiRequestConfig>): Promise<T> {
    const response = await this.client.get<T>(url, config as ApiRequestConfig)
    return response.data
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config as ApiRequestConfig)
    return response.data
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config as ApiRequestConfig)
    return response.data
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config as ApiRequestConfig)
    return response.data
  }

  async delete<T = unknown>(url: string, config?: Partial<ApiRequestConfig>): Promise<T> {
    const response = await this.client.delete<T>(url, config as ApiRequestConfig)
    return response.data
  }
}

export const apiClient = new ApiClient()
