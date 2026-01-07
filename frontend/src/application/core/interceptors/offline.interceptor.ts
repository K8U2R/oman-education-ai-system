/**
 * Offline Interceptor - معالج العمل دون اتصال
 *
 * Application Layer Interceptor لمعالجة:
 * - Network errors
 * - Offline request queuing
 *
 * هذا هو المكان الصحيح لـ business logic المتعلق بالعمل دون اتصال
 */

import { AxiosError } from 'axios'
import { ResponseInterceptor } from '@/infrastructure/http'
import { offlineService } from '../services/system'

/**
 * Response Interceptor لمعالجة Network Errors
 */
export function createOfflineResponseInterceptor(): ResponseInterceptor {
  return {
    onFulfilled: response => {
      return response
    },
    onRejected: async (error: unknown) => {
      const axiosError = error as AxiosError
      // Handle network errors (no response from server)
      if (!axiosError.response && axiosError.request) {
        // Queue request for offline service
        if (axiosError.config) {
          offlineService.queueRequest({
            url: axiosError.config.url || '',
            method: (axiosError.config.method || 'GET').toUpperCase(),
            data: axiosError.config.data,
            headers: axiosError.config.headers as Record<string, string>,
          })
        }
      }

      return Promise.reject(axiosError)
    },
  }
}
