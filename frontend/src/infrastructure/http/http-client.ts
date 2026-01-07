/**
 * HTTP Client - عميل HTTP النقي
 *
 * Pure HTTP client بدون أي business logic
 * فقط HTTP operations: GET, POST, PUT, PATCH, DELETE
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

export interface HttpClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

export interface RequestInterceptor {
  onFulfilled?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  onRejected?: (error: unknown) => Promise<never>
}

export interface ResponseInterceptor {
  onFulfilled?: <T = unknown>(
    response: AxiosResponse<T>
  ) => AxiosResponse<T> | Promise<AxiosResponse<T>>
  onRejected?: (error: unknown) => Promise<never> | Promise<AxiosResponse>
}

/**
 * Pure HTTP Client - بدون business logic
 *
 * هذا الـ client مسؤول فقط عن:
 * - إرسال HTTP requests
 * - استقبال HTTP responses
 * - معالجة أخطاء HTTP (network errors, status codes)
 *
 * لا يحتوي على:
 * - Token management
 * - Refresh token logic
 * - Redirect logic
 * - Offline queue
 * - Analytics tracking
 */
export class HttpClient {
  private client: AxiosInstance

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    })
  }

  /**
   * إضافة Request Interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): number {
    return this.client.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected)
  }

  /**
   * إزالة Request Interceptor
   */
  removeRequestInterceptor(id: number): void {
    this.client.interceptors.request.eject(id)
  }

  /**
   * إضافة Response Interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): number {
    return this.client.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected)
  }

  /**
   * إزالة Response Interceptor
   */
  removeResponseInterceptor(id: number): void {
    this.client.interceptors.response.eject(id)
  }

  /**
   * GET Request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  /**
   * POST Request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  /**
   * PUT Request
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  /**
   * PATCH Request
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  /**
   * DELETE Request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  /**
   * الحصول على Axios Instance (للاستخدام المتقدم)
   */
  getAxiosInstance(): AxiosInstance {
    return this.client
  }
}
