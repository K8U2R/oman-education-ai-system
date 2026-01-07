/**
 * API Client - عميل API
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { storageAdapter } from '../storage'
import { analyticsService, performanceService, offlineService } from '@/application'
import type { ApiRequestConfig } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

interface QueuedRequest {
  resolve: (value: unknown) => void
  reject: (error: unknown) => void
}

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private failedQueue: QueuedRequest[] = []

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
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
        // Add auth token if available
        const token = storageAdapter.get('access_token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
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
        if (error.response?.status === 401) {
          return this.handle401Error(error)
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

    // If already refreshing, queue the request
    if (this.isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const queuedRequest: QueuedRequest = {
          resolve: (token: unknown) => {
            if (typeof token === 'string' && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
              this.client.request(originalRequest).then(resolve).catch(reject)
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
    const refreshToken = storageAdapter.get('refresh_token')

    if (!refreshToken) {
      this.processQueue(null, new Error('No refresh token'))
      this.redirectToLogin()
      return Promise.reject(error)
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
        refresh_token: refreshToken,
      })

      const { access_token, refresh_token: newRefreshToken } = response.data.tokens
      storageAdapter.set('access_token', access_token)
      if (newRefreshToken) {
        storageAdapter.set('refresh_token', newRefreshToken)
      }

      this.processQueue(access_token, null)

      // Retry original request
      if (originalRequest && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return this.client.request(originalRequest)
      }

      return Promise.reject(new Error('Original request not found'))
    } catch (refreshError) {
      this.processQueue(null, refreshError as Error)
      storageAdapter.remove('access_token')
      storageAdapter.remove('refresh_token')
      this.redirectToLogin()
      return Promise.reject(refreshError)
    } finally {
      this.isRefreshing = false
    }
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
   */
  private redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
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
