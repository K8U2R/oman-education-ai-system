
/**
 * Sovereign Error Service - خدمة الأخطاء السيادية
 *
 * المصدر الوحيد للحقيقة لمعالجة الأخطاء (Single Source of Truth).
 * يدمج وظائف:
 * - ErrorHandlingService (Mapping & Notifications)
 * - ErrorBoundaryService (Reporting & React Integration)
 */

import {
    isAppError,
} from '@/domain/exceptions'
import { loggingService } from '@/infrastructure/services'
import { useNotificationStore } from '@/stores/useNotificationStore'

export interface ErrorInfo {
    message: string
    code?: string
    statusCode?: number
    details?: unknown
    timestamp: string
    stack?: string
    componentStack?: string
    url?: string
}

export class SovereignErrorService {
    private static instance: SovereignErrorService

    private constructor() { }

    public static getInstance(): SovereignErrorService {
        if (!SovereignErrorService.instance) {
            SovereignErrorService.instance = new SovereignErrorService()
        }
        return SovereignErrorService.instance
    }

    /**
     * Main entry point: Handle any error
     */
    public handleError(error: unknown, context?: { componentStack?: string, silent?: boolean }): ErrorInfo {
        const errorInfo = this.normalizeError(error, context)

        // 1. Log Error
        this.logError(error, errorInfo)

        // 2. Report Error (Sentry, Analytics)
        this.reportError(error, errorInfo)

        // 3. Notify User (unless silent)
        if (!context?.silent) {
            this.notifyUser(errorInfo)
        }

        return errorInfo
    }

    /**
     * Normalize Error to Standard Format
     */
    private normalizeError(error: unknown, context?: { componentStack?: string }): ErrorInfo {
        const timestamp = new Date().toISOString()
        const url = typeof window !== 'undefined' ? window.location.href : undefined

        // AppError (Custom Error)
        if (isAppError(error)) {
            return {
                message: error.message,
                code: error.code,
                statusCode: error.statusCode,
                details: error.context,
                timestamp: error.timestamp,
                stack: error.stack,
                componentStack: context?.componentStack,
                url
            }
        }

        // Axios Error Logic
        if (this.isAxiosError(error)) {
            const apiError = error as any // Cast safely as we verified shape
            // Logic mapped from old service
            const status = apiError.response?.status
            const message = apiError.response?.data?.message || apiError.message

            return {
                message,
                statusCode: status,
                code: `HTTP_${status || 'UNKNOWN'}`,
                details: apiError.response?.data,
                timestamp,
                stack: apiError.stack,
                componentStack: context?.componentStack,
                url
            }
        }

        // Error Object
        const err = error as any
        if (err instanceof Error) {
            return {
                message: err.message,
                code: err.name,
                timestamp,
                stack: err.stack,
                componentStack: context?.componentStack,
                url
            }
        }

        // Unknown
        return {
            message: typeof error === 'string' ? error : 'خطأ غير متوقع',
            code: 'UNKNOWN_ERROR',
            timestamp,
            componentStack: context?.componentStack,
            url
        }
    }

    /**
     * Log error using LoggingService
     */
    private logError(originalError: unknown, info: ErrorInfo): void {
        if (import.meta.env.DEV) {
            console.groupCollapsed(`[SovereignError] ${info.message}`)
            console.error(originalError)
            console.table(info)
            console.groupEnd()
        }

        loggingService.error(info.message, originalError instanceof Error ? originalError : new Error(info.message), {
            ...info,
            code: info.code
        })
    }

    /**
     * Report to external services (Sentry)
     */
    private reportError(originalError: unknown, info: ErrorInfo): void {
        // Sentry Logic
        const windowWithSentry = window as any
        if (typeof window !== 'undefined' && windowWithSentry.Sentry) {
            try {
                windowWithSentry.Sentry.captureException(originalError instanceof Error ? originalError : new Error(info.message), {
                    contexts: {
                        react: { componentStack: info.componentStack }
                    },
                    tags: {
                        code: info.code,
                        url: info.url
                    },
                    extra: { details: info.details }
                })
            } catch (e) {
                console.warn('Sentry reporting failed', e)
            }
        }
    }

    /**
     * Show notification to user
     */
    private notifyUser(info: ErrorInfo): void {
        // Avoid notifying for 401 (Auth Interceptor handles redirects usually) or specific suppressed codes
        if (info.statusCode === 401) return;

        const { getState } = useNotificationStore
        // Use getState() to access store outside React component
        getState().addNotification({
            type: 'error',
            title: 'خطأ',
            message: info.message,
            duration: 5000
        })
    }

    // Helpers
    private isAxiosError(error: any): error is any {
        return error && typeof error === 'object' && error.isAxiosError === true
    }
}

export const sovereignErrorService = SovereignErrorService.getInstance()
