/**
 * Auth Interceptor - معالج المصادقة
 *
 * Application Layer Interceptor لمعالجة:
 * - Token injection
 * - 401 errors (refresh token)
 * - Redirect to login
 *
 * هذا هو المكان الصحيح لـ business logic المتعلق بالمصادقة
 */

import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { RequestInterceptor, ResponseInterceptor } from '@/infrastructure/services/http'
import { storageAdapter } from '@/infrastructure/services/storage'
import { authService } from '@/features/user-authentication-management'

/**
 * Request Interceptor لإضافة Token
 */
export function createAuthRequestInterceptor(): RequestInterceptor {
  return {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      // Add auth token if available
      const token = storageAdapter.get('access_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    onRejected: error => {
      return Promise.reject(error)
    },
  }
}

/**
 * Response Interceptor لمعالجة 401 errors
 */
export function createAuthResponseInterceptor(): ResponseInterceptor {
  let isRefreshing = false
  const failedQueue: Array<{
    resolve: (value?: AxiosResponse) => void
    reject: (error?: Error) => void
    config: InternalAxiosRequestConfig
  }> = []

  const processQueue = async (token: string | null, error: Error | undefined): Promise<void> => {
    // Import httpClient dynamically to avoid circular dependency
    const { httpClient } = await import('@/infrastructure/services/http')

    const queue = [...failedQueue]
    failedQueue.length = 0

    queue.forEach(({ resolve, reject, config }) => {
      if (token) {
        // Retry request with new token
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        // Retry using httpClient
        httpClient
          .getAxiosInstance()
          .request(config)
          .then((response: AxiosResponse) => resolve(response))
          .catch((err: Error) => reject(err))
      } else {
        reject(error || new Error('Unknown error'))
      }
    })
  }

  const redirectToLogin = (): void => {
    if (typeof window !== 'undefined') {
      console.warn('[Auth Interceptor] Auto-redirect DISABLED for debugging (Auth Freeze Mode).')
      // window.location.href = '/login'
    }
  }

  return {
    onFulfilled: (response: AxiosResponse) => {
      return response
    },
    onRejected: async (error: unknown): Promise<AxiosResponse> => {
      const axiosError = error instanceof AxiosError ? error : new AxiosError(String(error))
      const originalRequest = axiosError.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Handle 401 Unauthorized
      if (axiosError.response?.status === 401 && originalRequest && !originalRequest._retry) {
        // If already refreshing, queue the request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (value?: AxiosResponse) => resolve(value as AxiosResponse),
              reject: (err?: Error) => reject(err),
              config: originalRequest,
            })
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = storageAdapter.get('refresh_token')

        if (!refreshToken) {
          await processQueue(null, new Error('No refresh token'))
          redirectToLogin()
          return Promise.reject(axiosError)
        }

        try {
          const tokens = await authService.refreshToken(refreshToken)
          await processQueue(tokens.access_token, undefined)

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`
          }

          // Import httpClient dynamically to avoid circular dependency
          const { httpClient } = await import('@/infrastructure/services/http')

          // Retry using httpClient
          return httpClient.getAxiosInstance().request(originalRequest)
        } catch (refreshError) {
          await processQueue(null, refreshError as Error)
          storageAdapter.remove('access_token')
          storageAdapter.remove('refresh_token')
          redirectToLogin()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    },
  }
}
