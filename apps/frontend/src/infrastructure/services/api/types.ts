/**
 * API Types - أنواع API
 *
 * تعريفات الأنواع للـ API Client و Responses
 */

import { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

/**
 * API Request Config مع metadata مخصص
 * Extends InternalAxiosRequestConfig للتوافق مع axios interceptors
 */
export interface ApiRequestConfig extends InternalAxiosRequestConfig {
  __startTime?: number
  __retryCount?: number
  __isRetry?: boolean
  skipAuth?: boolean
  skipErrorHandling?: boolean
}

/**
 * API Response مع metadata
 */
export interface ApiResponse<T = unknown> extends AxiosResponse<T> {
  config: InternalAxiosRequestConfig
}

/**
 * API Error مع معلومات إضافية
 */
export interface ApiError extends AxiosError {
  config?: ApiRequestConfig
  response?: AxiosResponse<ApiErrorResponse>
}

/**
 * API Error Response Structure
 */
export interface ApiErrorResponse {
  message?: string
  detail?: string
  code?: string
  errors?: Record<string, string[]>
  timestamp?: string
}

/**
 * Request Interceptor
 */
export interface RequestInterceptor {
  onFulfilled: (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>
  onRejected: (error: ApiError) => Promise<never>
}

/**
 * Response Interceptor
 */
export interface ResponseInterceptor {
  onFulfilled: <T = unknown>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>
  onRejected: (error: ApiError) => Promise<never> | Promise<ApiResponse>
}

/**
 * Generic API Response
 */
export interface ApiSuccessResponse<T = unknown> {
  data: T
  message?: string
  status: 'success'
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T = unknown> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

/**
 * API Client Methods
 */
export interface ApiClientMethods {
  get<T = unknown>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>>
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>
  ): Promise<ApiResponse<T>>
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>
  ): Promise<ApiResponse<T>>
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Partial<ApiRequestConfig>
  ): Promise<ApiResponse<T>>
  delete<T = unknown>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>>
}
