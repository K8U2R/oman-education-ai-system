/**
 * Error Boundary Service - خدمة معالجة الأخطاء
 *
 * خدمة لمعالجة الأخطاء وتسجيلها
 */

export interface ErrorBoundaryInfo {
  message: string
  stack?: string
  componentStack?: string
  timestamp: string
  userAgent?: string
  url?: string
}

export class ErrorBoundaryService {
  /**
   * تسجيل خطأ
   */
  static logError(error: Error, errorInfo?: React.ErrorInfo): void {
    const errorData: ErrorBoundaryInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack || undefined,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent || undefined,
      url: window.location.href,
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary:', errorData)
    }

    // Send to error tracking service (e.g., Sentry)
    this.sendToErrorTracking(error, errorData)
  }

  /**
   * معالجة خطأ غير متوقع
   */
  static handleUnexpectedError(error: unknown): ErrorBoundaryInfo {
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير متوقع'
    const errorStack = error instanceof Error ? error.stack : undefined

    const errorData: ErrorBoundaryInfo = {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent || undefined,
      url: window.location.href,
    }

    this.logError(error instanceof Error ? error : new Error(errorMessage))

    return errorData
  }

  /**
   * معالجة خطأ API
   */
  static handleApiError(error: unknown): string {
    if (error instanceof Error) {
      // Check if it's an API error with response
      interface ApiErrorWithResponse extends Error {
        response?: {
          data?: {
            detail?: string
            message?: string
          }
        }
      }
      const apiError = error as ApiErrorWithResponse
      if (apiError.response?.data?.detail) {
        return apiError.response.data.detail
      }
      if (apiError.response?.data?.message) {
        return apiError.response.data.message
      }
      return error.message
    }

    return 'حدث خطأ أثناء الاتصال بالخادم'
  }

  /**
   * معالجة خطأ الشبكة
   */
  static handleNetworkError(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        return 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.'
      }
    }

    return 'حدث خطأ في الشبكة'
  }

  /**
   * إرسال خطأ إلى خدمة تتبع الأخطاء
   */
  private static sendToErrorTracking(error: Error, errorInfo: ErrorBoundaryInfo): void {
    // Sentry integration
    interface WindowWithSentry extends Window {
      Sentry?: {
        captureException: (error: Error, context?: Record<string, unknown>) => void
      }
    }
    const windowWithSentry = window as WindowWithSentry
    if (typeof window !== 'undefined' && windowWithSentry.Sentry) {
      try {
        windowWithSentry.Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
          tags: {
            url: errorInfo.url,
            userAgent: errorInfo.userAgent,
          },
        })
      } catch (sentryError) {
        console.error('Failed to send to Sentry:', sentryError)
      }
    }

    // Custom error tracking endpoint
    if (import.meta.env.VITE_ERROR_TRACKING_ENDPOINT) {
      fetch(import.meta.env.VITE_ERROR_TRACKING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
          },
          errorInfo,
        }),
      }).catch(fetchError => {
        console.error('Failed to send error to tracking service:', fetchError)
      })
    }
  }
}
