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
import { ENV as envConfig } from '@/config/env'
import { loggingService } from '@/infrastructure/services'

import styles from './BaseErrorPage.module.scss'

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

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
  const isDevelopment = envConfig.IS_DEV
  const showErrorDetails = !envConfig.IS_PROD

  // تسجيل للتأكد من أن وضع التطوير يعمل (فقط في وضع التطوير)
  useEffect(() => {
    if (isDevelopment) {
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
        return styles.iconCircleWarning
      case 'info':
        return styles.iconCircleInfo
      default:
        return styles.iconCircleError
    }
  }

  return (
    <div className={styles.baseErrorPage} data-error-type={type}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Icon */}
          <div className={styles.iconWrapper}>
            <div className={cx(styles.iconCircle, getIconColorClass())}>
              <Icon className={styles.icon} />
            </div>
          </div>

          {/* Title */}
          <h1 className={styles.title}>{title}</h1>

          {/* Message */}
          <div className={styles.messageWrapper}>
            <p className={styles.message}>{message}</p>
            {secondaryMessage && <p className={styles.messageSecondary}>{secondaryMessage}</p>}
            {attemptedPath && attemptedPath !== location.pathname && (
              <div className={styles.attemptedPath}>
                <span>المسار المطلوب: {attemptedPath}</span>
              </div>
            )}
          </div>

          {/* Development Details */}
          {showErrorDetails && isDevelopment && showDevDetails && devDetailsContent && (
            <div className={styles.devDetails}>{devDetailsContent}</div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            {isAuthenticated && showRefreshButton ? (
              <>
                <Button
                  variant="primary"
                  onClick={handleRefreshUser}
                  leftIcon={<RefreshCw className={cx('w-5 h-5', isRefreshing && 'animate-spin')} />}
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
