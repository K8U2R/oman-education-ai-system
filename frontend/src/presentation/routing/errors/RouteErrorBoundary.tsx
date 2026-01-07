/**
 * RouteErrorBoundary - حدود أخطاء المسارات
 *
 * مكون React Class-based Error Boundary لالتقاط الأخطاء غير المتوقعة
 * أثناء الـ rendering في شجرة المكونات الفرعية (children).
 *
 * الميزات:
 * - عرض واجهة خطأ ودية للمستخدم
 * - إظهار تفاصيل الخطأ في وضع التطوير فقط
 * - إعادة المحاولة (reset) أو العودة للصفحة الرئيسية
 * - إرسال تقرير الخطأ تلقائياً إلى خدمة تتبع الأخطاء (مثل Sentry)
 */

import { Component, ErrorInfo, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

import { ROUTES } from '@/domain/constants/routes.constants'
import { isAppError } from '@/domain/exceptions'
import { errorHandlingService } from '@/application/core/services/system/error-handling.service'
import './RouteErrorBoundary.scss'

interface Props {
  /** المكونات الفرعية التي سيتم مراقبتها */
  children: ReactNode
  /** واجهة خطأ مخصصة (اختياري) */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  /** تحديث الحالة عند حدوث خطأ لإجبار إعادة الـ render */
  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  /** التقاط الخطأ وتسجيله وإرساله لخدمة التتبع */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // استخدام ErrorHandlingService لتسجيل الخطأ
    errorHandlingService.logError(error, 'RouteErrorBoundary')

    this.setState({
      error,
      errorInfo,
    })

    this.reportError(error, errorInfo)
  }

  /** إرسال تقرير الخطأ إلى خدمة خارجية (Sentry، LogRocket، إلخ) */
  private reportError(error: Error, errorInfo: ErrorInfo): void {
    const endpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT

    if (!endpoint) {
      return
    }

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    }).catch(fetchError => {
      // Use logging service instead of console.error
      import('@/infrastructure/services/logging.service').then(({ loggingService }) => {
        loggingService.error('فشل إرسال تقرير الخطأ', fetchError as Error)
      })
    })
  }

  /** إعادة تعيين حالة الخطأ لمحاولة إعادة الـ render */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  public override render(): ReactNode {
    const { hasError, error, errorInfo } = this.state
    const { fallback, children } = this.props

    if (hasError) {
      // إذا تم تمرير fallback مخصص، استخدمه
      if (fallback) {
        return fallback
      }

      // واجهة الخطأ الافتراضية
      return (
        <div className="route-error-boundary">
          <div className="route-error-boundary__container">
            <div className="route-error-boundary__icon">
              <AlertTriangle size={64} />
            </div>

            <h1 className="route-error-boundary__title">
              {error && isAppError(error) ? error.message : 'حدث خطأ غير متوقع'}
            </h1>
            <p className="route-error-boundary__message">
              {error
                ? errorHandlingService.getUserFriendlyMessage(error)
                : 'عذراً، حدث مشكلة أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.'}
            </p>

            {/* تفاصيل الخطأ في وضع التطوير فقط */}
            {import.meta.env.DEV && error && (
              <details className="route-error-boundary__details">
                <summary className="route-error-boundary__details-title">
                  تفاصيل الخطأ (وضع التطوير)
                </summary>
                <pre className="route-error-boundary__details-content">
                  <strong>{error.toString()}</strong>
                  {'\n\n'}
                  {errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* أزرار الإجراءات */}
            <div className="route-error-boundary__actions">
              <button
                onClick={this.handleReset}
                className="route-error-boundary__button route-error-boundary__button--primary"
              >
                <RefreshCw size={20} className="ml-2" />
                إعادة المحاولة
              </button>

              <Link
                to={ROUTES.HOME}
                className="route-error-boundary__button route-error-boundary__button--secondary"
              >
                <Home size={20} className="ml-2" />
                العودة إلى الرئيسية
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // إذا لم يكن هناك خطأ، اعرض المحتوى الطبيعي
    return children
  }
}
