
/**
 * Sovereign Auth Interceptor - معالج المصادقة السيادي
 * 
 * ✅ Encapsulated State (No Global Variables)
 * ✅ Circuit Breaker Pattern
 * ✅ Queue Management
 */

import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { RequestInterceptor, ResponseInterceptor } from '@/infrastructure/services/http'
import { storageAdapter } from '@/infrastructure/services/storage'
import { authService } from '@/features/user-authentication-management'

interface QueuedRequest {
    resolve: (value?: any) => void
    reject: (error?: any) => void
    config: InternalAxiosRequestConfig
}

export class SovereignAuthInterceptor {
    private static instance: SovereignAuthInterceptor

    // Encapsulated State
    private isRefreshing = false
    private isTerminated = false
    private refreshAttempts = 0
    private failedQueue: QueuedRequest[] = []
    private readonly MAX_REFRESH_ATTEMPTS = 3

    private constructor() { }

    public static getInstance(): SovereignAuthInterceptor {
        if (!SovereignAuthInterceptor.instance) {
            SovereignAuthInterceptor.instance = new SovereignAuthInterceptor()
        }
        return SovereignAuthInterceptor.instance
    }

    /**
     * Request Interceptor: Injects Token
     */
    public getRequestInterceptor(): RequestInterceptor {
        return {
            onFulfilled: (config: InternalAxiosRequestConfig) => {
                if (this.isTerminated) {
                    return Promise.reject(new Error('EMERGENCY_STOP: System in Safe Mode'))
                }

                const token = storageAdapter.get('access_token')
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            onRejected: (error) => Promise.reject(error),
        }
    }

    /**
     * Response Interceptor: Handles 401 & Refresh
     */
    public getResponseInterceptor(): ResponseInterceptor {
        return {
            onFulfilled: (response: AxiosResponse) => response,
            onRejected: async (error: any) => {
                const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

                if (this.isTerminated) {
                    return Promise.reject(new Error('EMERGENCY_STOP: System in Safe Mode'))
                }

                // Handle Rate Limiting (429 or Custom Code)
                if (error.response?.status === 429 || error.response?.data?.error?.code === 'AUTH_RATE_LIMIT_EXCEEDED') {
                    this.isTerminated = true
                    this.failedQueue = []
                    const retryAfter = error.response?.data?.error?.retryAfter || 900
                    console.error(`🚨 RATE LIMIT EXCEEDED: Blocked for ${retryAfter}s`)

                    // Dispatch specific event for UI to show countdown
                    window.dispatchEvent(new CustomEvent('ADS:SYSTEM_HALT', {
                        detail: {
                            reason: 'Too Many Auth Attempts',
                            code: 'AUTH_RATE_LIMIT',
                            meta: { retryAfter }
                        }
                    }))
                    return Promise.reject(error)
                }

                // Handle 401 Unauthorized
                if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        // Add to queue if refreshing
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject, config: originalRequest })
                        })
                    }

                    originalRequest._retry = true
                    this.isRefreshing = true
                    this.refreshAttempts++

                    if (this.refreshAttempts > this.MAX_REFRESH_ATTEMPTS) {
                        this.handleEmergencyStop()
                        return Promise.reject(error)
                    }

                    try {
                        // Get refresh token
                        const refreshToken = storageAdapter.get('refresh_token')
                        if (!refreshToken) {
                            throw new Error("No refresh token available")
                        }

                        // Attempt Refresh
                        const newToken = await authService.refreshToken(refreshToken)

                        if (newToken) {
                            // Determine token value based on return type (string or object)
                            const tokenValue = typeof newToken === 'string' ? newToken : (newToken as any).accessToken;

                            // Update storage
                            storageAdapter.set('access_token', tokenValue)
                            // Assuming refreshToken returns new helper object or just access token? 
                            // Using existing pattern. If it returns object with refresh_token, update that too.
                            if (typeof newToken !== 'string' && (newToken as any).refreshToken) {
                                storageAdapter.set('refresh_token', (newToken as any).refreshToken)
                            }

                            // Process queue
                            this.processQueue(tokenValue)

                            // Retry original
                            originalRequest.headers.Authorization = `Bearer ${tokenValue}`
                            const { httpClient } = await import('@/infrastructure/services/http')
                            return httpClient.getAxiosInstance().request(originalRequest)
                        } else {
                            throw new Error("Refresh failed")
                        }

                    } catch (refreshError) {
                        this.processQueue(null, refreshError as Error)
                        this.redirectToLogin()
                        return Promise.reject(refreshError)
                    } finally {
                        this.isRefreshing = false
                    }
                }

                return Promise.reject(error)
            },
        }
    }

    private async processQueue(token: string | null, error?: Error): Promise<void> {
        const { httpClient } = await import('@/infrastructure/services/http')

        this.failedQueue.forEach(({ resolve, reject, config }) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
                    // Critical: Mark as retried to prevent infinite loops if this specific retry fails
                    ; (config as any)._retry = true

                httpClient.getAxiosInstance().request(config)
                    .then(resolve)
                    .catch(reject)
            } else {
                reject(error || new Error('Auth Error'))
            }
        })

        this.failedQueue = []
    }

    private handleEmergencyStop(): void {
        this.isTerminated = true
        this.failedQueue = []
        console.error('🚨 SYSTEM HALT: Max Auth Retries Exceeded')
        // Dispatch system halt event if needed
        window.dispatchEvent(new CustomEvent('ADS:SYSTEM_HALT', {
            detail: { reason: 'Authentication Loop Detected', code: 'AUTH_RACE_CONDITION' }
        }))
    }

    private redirectToLogin(): void {
        authService.logout()
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.replace('/login')
        }
    }
}

export const sovereignAuthInterceptor = SovereignAuthInterceptor.getInstance()
