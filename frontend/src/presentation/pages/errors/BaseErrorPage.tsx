/**
 * Base Error Page - صفحة الخطأ الأساسية
 *
 * مكون أساسي قابل لإعادة الاستخدام لصفحات الأخطاء
 * يقلل التكرار بين ForbiddenPage و UnauthorizedPage
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LucideIcon, Home, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '../../components/common'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useAuth } from '@/features/user-authentication-management'
import { envConfig } from '@/infrastructure/config/env.config'
import { loggingService } from '@/infrastructure/services'


export interface BaseErrorPageProps {
  /** نوع الخطأ */
  type:
  | 'forbidden'
  | 'unauthorized'
  | 'not-found'
  | 'server-error'
  | 'network-error'
  | 'maintenance'
  /** العنوان الرئيسي */
  title: string
  /** الرسالة الأساسية */
  message: string
  /** الرسالة الثانوية */
  secondaryMessage?: string
  /** الأيقونة */
  icon: LucideIcon
  /** لون الأيقونة */
  iconColor?: 'error' | 'warning' | 'info' | 'success'
  /** عرض زر تحديث  */
  showRefreshButton?: boolean
  /** عرض معلومات تفصيلية (في وضع التطوير) */
  showDevDetails?: boolean
  /** محتوى إضافي (مثل معلومات التطوير) */
  devDetailsContent?: React.ReactNode
}

export const BaseErrorPage: React.FC<BaseErrorPageProps> = ({
  type,
  title,
  message,
  secondaryMessage,
  icon: Icon,
  iconColor = 'error',
  showRefreshButton = false,
  showDevDetails = false,
  devDetailsContent,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, refreshUser } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // استخدام إعدادات البيئة المركزية للتحكم في عرض معلومات التطوير
  const isDevelopment = envConfig.isDevelopment
  const showErrorDetails = envConfig.showErrorDetails

  // تسجيل للتأكد من أن وضع التطوير يعمل (فقط في وضع التطوير)
  useEffect(() => {
    if (isDevelopment && envConfig.enableDevLogging) {
      loggingService.debug('[BaseErrorPage] Development mode detected', {
        MODE: import.meta.env.MODE,
        DEV: import.meta.env.DEV,
        showDevDetails,
        hasDevDetailsContent: !!devDetailsContent,
        showErrorDetails,
      })
    }
  }, [isDevelopment, showDevDetails, devDetailsContent, showErrorDetails])

  // الحصول على المسار الذي حاول المستخدم الوصول إليه
  const attemptedPath = (location.state as { from?: string })?.from || location.pathname

  // محاولة تحديث بيانات المستخدم تلقائياً عند تحميل الصفحة
  // تم تعطيل التحديث التلقائي - المستخدم يجب أن يضغط على زر "تحديث " يدوياً
  // useEffect(() => {
  //   if (!isAuthenticated || !showRefreshButton) {
  //     return
  //   }

  //   const timer = setTimeout(async () => {
  //     try {
  //       setIsRefreshing(true)
  //       await refreshUser()
  //       if (attemptedPath && attemptedPath !== location.pathname) {
  //         navigate(attemptedPath, { replace: true })
  //       }
  //     } catch (error) {
  //       loggingService.error('Failed to refresh user', error as Error)
  //     } finally {
  //       setIsRefreshing(false)
  //     }
  //   }, 1000)

  //   return () => clearTimeout(timer)
  // }, [isAuthenticated, showRefreshButton, refreshUser, navigate, attemptedPath, location.pathname])

  const handleRefreshUser = async () => {
    try {
      setIsRefreshing(true)
      await refreshUser()
      if (attemptedPath && attemptedPath !== location.pathname) {
        navigate(attemptedPath, { replace: true })
      } else {
        navigate(ROUTES.DASHBOARD, { replace: true })
      }
    } catch (error) {
      loggingService.error('Failed to refresh user', error as Error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getIconColorClass = () => {
    switch (iconColor) {
      case 'warning':
        return 'base-error-page__icon-circle--warning'
      case 'info':
        return 'base-error-page__icon-circle--info'
      default:
        return 'base-error-page__icon-circle--error'
    }
  }

  return (
    <div className={`base-error-page base-error-page--${type}`}>
      <div className="base-error-page__container">
        <div className="base-error-page__content">
          {/* Icon */}
          <div className="base-error-page__icon-wrapper">
            <div className={`base-error-page__icon-circle ${getIconColorClass()}`}>
              <Icon className="base-error-page__icon" />
            </div>
          </div>

          {/* Title */}
          <h1 className="base-error-page__title">{title}</h1>

          {/* Message */}
          <div className="base-error-page__message-wrapper">
            <p className="base-error-page__message">{message}</p>
            {secondaryMessage && (
              <p className="base-error-page__message-secondary">{secondaryMessage}</p>
            )}
            {attemptedPath && attemptedPath !== location.pathname && (
              <div className="base-error-page__attempted-path">
                <span>المسار المطلوب: {attemptedPath}</span>
              </div>
            )}
          </div>

          {/* Development Details */}
          {/* عرض معلومات التطوير فقط إذا كان مسموحاً عبر إعدادات البيئة */}
          {showErrorDetails && isDevelopment && showDevDetails && devDetailsContent && (
            <div className="base-error-page__dev-details">{devDetailsContent}</div>
          )}

          {/* Actions */}
          <div className="base-error-page__actions">
            {isAuthenticated && showRefreshButton ? (
              <>
                <Button
                  variant="primary"
                  onClick={handleRefreshUser}
                  leftIcon={
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  }
                  size="lg"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? 'جاري التحديث...' : 'تحديث '}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  leftIcon={<Home className="w-5 h-5" />}
                  size="lg"
                  disabled={isRefreshing}
                >
                  العودة للوحة التحكم
                </Button>
              </>
            ) : isAuthenticated ? (
              <Button
                variant="primary"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                leftIcon={<Home className="w-5 h-5" />}
                size="lg"
              >
                العودة للوحة التحكم
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate(ROUTES.LOGIN)}
                leftIcon={<Home className="w-5 h-5" />}
                size="lg"
              >
                تسجيل الدخول
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              size="lg"
              disabled={isRefreshing}
            >
              العودة للخلف
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
