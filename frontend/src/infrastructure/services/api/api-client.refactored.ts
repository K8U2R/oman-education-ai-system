/**
 * API Client - عميل API (Refactored)
 *
 * هذا الإصدار يستخدم HttpClient النقي + Application Layer Interceptors
 * بدون أي business logic في Infrastructure Layer
 */

import { httpClient } from '../http'
import {
  createAuthRequestInterceptor,
  createAuthResponseInterceptor,
  createOfflineResponseInterceptor,
  analyticsService,
  performanceService,
} from '@/application'
import type { ApiRequestConfig, ApiError } from './types'
import type {
  RequestInterceptor as HttpClientRequestInterceptor,
  ResponseInterceptor as HttpClientResponseInterceptor,
} from '../http/http-client'

/**
 * API Client - يستخدم HttpClient النقي + Interceptors
 *
 * Business Logic موجود في Application Layer Interceptors:
 * - Auth logic في auth.interceptor.ts
 * - Analytics في analytics interceptor (يمكن إضافته لاحقاً)
 */
class ApiClient {
  private client = httpClient
  private requestInterceptorId: number | null = null
  private responseInterceptorId: number | null = null

  constructor() {
    this.setupInterceptors()
  }

  /**
   * إعداد Interceptors من Application Layer
   */
  private setupInterceptors(): void {
    // Auth Request Interceptor (من Application Layer)
    const authRequestInterceptor = createAuthRequestInterceptor()
    this.requestInterceptorId = this.client.addRequestInterceptor(authRequestInterceptor)

    // Analytics Request Interceptor
    const analyticsRequestInterceptor: HttpClientRequestInterceptor = {
      onFulfilled: config => {
        // Track request
        analyticsService.trackEvent('api_request', 'API', 'Request', config.url)
        // Add start time for performance tracking
        const apiConfig = config as ApiRequestConfig
        apiConfig.__startTime = Date.now()
        return config
      },
      onRejected: error => {
        analyticsService.trackError(error as Error, { type: 'request_error' })
        return Promise.reject(error)
      },
    }
    this.client.addRequestInterceptor(analyticsRequestInterceptor)

    // Auth Response Interceptor (من Application Layer)
    const authResponseInterceptor = createAuthResponseInterceptor()
    this.client.addResponseInterceptor(authResponseInterceptor)

    // Offline Response Interceptor (من Application Layer)
    const offlineResponseInterceptor = createOfflineResponseInterceptor()
    this.client.addResponseInterceptor(offlineResponseInterceptor)

    // Analytics & Performance Response Interceptor
    const analyticsResponseInterceptor: HttpClientResponseInterceptor = {
      onFulfilled: response => {
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
      onRejected: async error => {
        const apiError = error as ApiError
        // Measure error response time
        const apiConfig = apiError.config as ApiRequestConfig | undefined
        const startTime = apiConfig?.__startTime
        if (startTime) {
          const duration = Date.now() - startTime
          performanceService.recordMetric('api_error_time', duration, 'ms')
        }

        // في development mode، نتخطى تتبع أخطاء 404 المتوقعة
        const is404 = apiError.response?.status === 404
        const isDevelopment = import.meta.env.DEV

        // Track error (skip 404 in development for expected missing endpoints)
        if (!(isDevelopment && is404)) {
          analyticsService.trackError(apiError as Error, {
            type: 'api_error',
            status: apiError.response?.status,
            url: apiError.config?.url,
          })
        }

        return Promise.reject(error)
      },
    }
    this.client.addResponseInterceptor(analyticsResponseInterceptor)
  }

  /**
   * GET Request with caching support
   */
  async get<T = unknown>(
    url: string,
    config?: Partial<ApiRequestConfig> & { useCache?: boolean; cacheTTL?: number }
  ): Promise<T> {
    const { useCache = false, cacheTTL, ...apiConfig } = config || {}

    // Check cache first if enabled
    if (useCache) {
      try {
        const { enhancedCacheService } =
          await import('@/application/core/services/system/enhanced-cache.service')
        const cached = await enhancedCacheService.get<T>(url, { useIndexedDB: true })
        if (cached !== null) {
          return cached
        }
      } catch (error) {
        console.warn('[API Client] Cache read failed:', error)
      }
    }

    // Make API request
    const response = await this.client.get<{ data?: T } & T>(url, apiConfig)
    const data = (response.data as { data?: T }).data || (response.data as T)

    // Cache response if enabled
    if (useCache && data) {
      try {
        const { enhancedCacheService } =
          await import('@/application/core/services/system/enhanced-cache.service')
        await enhancedCacheService.set(url, data, {
          ttl: cacheTTL || 5 * 60 * 1000, // Default 5 minutes
          useIndexedDB: true,
        })
      } catch (error) {
        console.warn('[API Client] Cache write failed:', error)
      }
    }

    return data
  }

  /**
   * POST Request
   */
  async post<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.client.post<T>(url, data, config)
  }

  /**
   * PUT Request
   */
  async put<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.client.put<T>(url, data, config)
  }

  /**
   * PATCH Request
   */
  async patch<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.client.patch<T>(url, data, config)
  }

  /**
   * DELETE Request
   */
  async delete<T = unknown>(url: string, config?: ApiRequestConfig): Promise<T> {
    return this.client.delete<T>(url, config)
  }

  /**
   * تنظيف Interceptors (للاستخدام في الاختبارات)
   */
  cleanup(): void {
    if (this.requestInterceptorId !== null) {
      this.client.removeRequestInterceptor(this.requestInterceptorId)
    }
    if (this.responseInterceptorId !== null) {
      this.client.removeResponseInterceptor(this.responseInterceptorId)
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export factory for testing
export function createApiClient(): ApiClient {
  return new ApiClient()
}
