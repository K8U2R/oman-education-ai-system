import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { ResponseInterceptor } from '@/infrastructure/services/http'
import { storageAdapter } from '@/infrastructure/services/storage'
import { authService } from '@/features/user-authentication-management'
import { authState, MAX_REFRESH_ATTEMPTS } from './state'
import { dispatchSystemHalt, forceLogout } from './utils'

/**
 * Sovereign Response Interceptor
 */
export function createSovereignAuthResponseInterceptor(): ResponseInterceptor {
    let isRefreshing = false
    const failedQueue: Array<{
        resolve: (value?: AxiosResponse) => void
        reject: (error?: Error) => void
        config: InternalAxiosRequestConfig
    }> = []

    const processQueue = async (token: string | null, error: Error | undefined): Promise<void> => {
        // Dynamic import to avoid circular dependency
        const { httpClient } = await import('@/infrastructure/services/http')

        const queue = [...failedQueue]
        failedQueue.length = 0

        queue.forEach(({ resolve, reject, config }) => {
            if (authState.isTerminated) {
                reject(new Error('EMERGENCY_STOP: System in Safe Mode'))
                return
            }

            if (token) {
                if (config.headers) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                httpClient
                    .getAxiosInstance()
                    .request(config)
                    .then(resolve)
                    .catch(reject)
            } else {
                reject(error || new Error('Auth failed'))
            }
        })
    }

    return {
        onFulfilled: (response: AxiosResponse) => response,
        onRejected: async (error: unknown): Promise<AxiosResponse> => {
            // 1. Circuit Breaker Check
            if (authState.isTerminated) {
                return Promise.reject(new Error('EMERGENCY_STOP: System in Safe Mode'))
            }

            const axiosError = error instanceof AxiosError ? error : new AxiosError(String(error))
            const originalRequest = axiosError.config as InternalAxiosRequestConfig & { _retry?: boolean }

            // 2. Critical: Handle 429 Too Many Requests
            if (axiosError.response?.status === 429) {
                authState.isTerminated = true
                dispatchSystemHalt('System Overload (429) - Halting all traffic')
                return Promise.reject(new Error('EMERGENCY_STOP: Too Many Requests'))
            }

            // 3. Handle 401 Unauthorized
            if (axiosError.response?.status === 401 && originalRequest && !originalRequest._retry) {
                // Check Max Retries (Critical Safety)
                if (authState.refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
                    authState.isTerminated = true
                    authState.refreshAttempts = 0

                    dispatchSystemHalt('Infinite Auth Loop Detected (Sovereign Guard)')
                    await processQueue(null, new Error('EMERGENCY_STOP: Max refresh attempts exceeded'))
                    forceLogout()

                    return Promise.reject(new Error('EMERGENCY_STOP'))
                }

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
                authState.refreshAttempts++

                const refreshToken = storageAdapter.get('refresh_token')

                if (!refreshToken) {
                    await processQueue(null, new Error('No refresh token'))
                    forceLogout()
                    return Promise.reject(axiosError)
                }

                try {
                    const tokens = await authService.refreshToken(refreshToken)
                    authState.refreshAttempts = 0 // Reset on success
                    await processQueue(tokens.access_token, undefined)

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`
                    }

                    const { httpClient } = await import('@/infrastructure/services/http')
                    return httpClient.getAxiosInstance().request(originalRequest)
                } catch (refreshError) {
                    await processQueue(null, refreshError as Error)
                    forceLogout()
                    return Promise.reject(refreshError)
                } finally {
                    isRefreshing = false
                }
            }

            return Promise.reject(error)
        },
    }
}
