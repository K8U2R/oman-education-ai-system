/**
 * Error Actions - أزرار الإجراءات
 *
 * مكون لإظهار أزرار الإجراءات في صفحات الأخطاء
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, RefreshCw, LogIn } from 'lucide-react'
import { Button } from '../../../components/common'
import { ROUTES } from '@/domain/constants/routes.constants'


interface ErrorActionsProps {
  /** عرض زر تحديث  */
  showRefreshButton?: boolean
  /** عرض زر تسجيل الدخول */
  showLoginButton?: boolean
  /** عرض زر العودة */
  showBackButton?: boolean
  /** عرض زر الصفحة الرئيسية */
  showHomeButton?: boolean
  /** حالة التحديث */
  isRefreshing?: boolean
  /** دالة تحديث  */
  onRefresh?: () => void | Promise<void>
  /** المسار الذي حاول المستخدم الوصول إليه */
  attemptedPath?: string
  /** className إضافي */
  className?: string
}

export const ErrorActions: React.FC<ErrorActionsProps> = ({
  showRefreshButton = false,
  showLoginButton = false,
  showBackButton = true,
  showHomeButton = true,
  isRefreshing = false,
  onRefresh,
  attemptedPath,
  className = '',
}) => {
  const navigate = useNavigate()

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh()
      if (attemptedPath && attemptedPath !== window.location.pathname) {
        navigate(attemptedPath, { replace: true })
      }
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleGoHome = () => {
    navigate(ROUTES.HOME, { replace: true })
  }

  const handleLogin = () => {
    navigate(ROUTES.LOGIN, { state: { from: attemptedPath || window.location.pathname } })
  }

  return (
    <div className={`error-actions ${className}`}>
      {showRefreshButton && (
        <Button
          variant="primary"
          onClick={handleRefresh}
          leftIcon={<RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          size="lg"
          disabled={isRefreshing}
        >
          {isRefreshing ? 'جارٍ التحديث...' : 'تحديث '}
        </Button>
      )}

      {showLoginButton && (
        <Button
          variant="primary"
          onClick={handleLogin}
          leftIcon={<LogIn className="w-5 h-5" />}
          size="lg"
        >
          تسجيل الدخول
        </Button>
      )}

      {showBackButton && (
        <Button
          variant="secondary"
          onClick={handleGoBack}
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          size="lg"
        >
          العودة للخلف
        </Button>
      )}

      {showHomeButton && (
        <Button
          variant="primary"
          onClick={handleGoHome}
          leftIcon={<Home className="w-5 h-5" />}
          size="lg"
        >
          العودة للوحة التحكم
        </Button>
      )}
    </div>
  )
}
