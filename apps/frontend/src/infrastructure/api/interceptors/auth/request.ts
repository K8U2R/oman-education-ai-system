import type { InternalAxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import type { RequestInterceptor } from '@/infrastructure/services/http'
import { storageAdapter } from '@/infrastructure/services/storage'
import { authState } from './state'

/**
 * Sovereign Request Interceptor
 */
export function createSovereignAuthRequestInterceptor(): RequestInterceptor {
    return {
        onFulfilled: (config: InternalAxiosRequestConfig) => {
            // 1. Circuit Breaker Check
            if (authState.isTerminated) {
                return Promise.reject(new Error('EMERGENCY_STOP: System in Safe Mode'))
            }

            // 2. Request Tracing (X-Request-ID)
            if (!config.headers['X-Request-ID']) {
                config.headers['X-Request-ID'] = uuidv4()
            }

            // 3. Token Injection
            const token = storageAdapter.get('access_token')
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`
            }

            return config
        },
        onRejected: error => Promise.reject(error),
    }
}
