/**
 * HTTP Client Factory - مصنع عميل HTTP
 *
 * Factory pattern لإنشاء HTTP clients
 */

import { HttpClient, HttpClientConfig } from './http-client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

/**
 * إنشاء HTTP Client افتراضي
 */
export function createHttpClient(config?: Partial<HttpClientConfig>): HttpClient {
  return new HttpClient({
    baseURL: config?.baseURL || API_BASE_URL,
    timeout: config?.timeout || 30000,
    headers: config?.headers,
  })
}

/**
 * HTTP Client الافتراضي (singleton للاستخدام المباشر)
 *
 * ملاحظة: في الاختبارات، استخدم createHttpClient() بدلاً من هذا
 */
export const httpClient = createHttpClient()
