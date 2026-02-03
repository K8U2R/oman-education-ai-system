/**
 * useErrorPageSetup - Hook موحد لإعداد صفحات الأخطاء
 *
 * Hook يقلل التكرار في جميع صفحات الأخطاء من خلال:
 * - إدارة state للتفاصيل
 * - الحصول على معلومات المستخدم والمسار
 * - إعداد ErrorDetailsPanel
 * - تحديد إعدادات البيئة
 */

import { useState } from 'react'
import { useAuth, useRole } from '@/features/user-authentication-management'
import { findRouteByPath } from '../../../routing/utils/route-utils'
import { allRoutes } from '../../../routing'
import { ENV as envConfig } from '@/config/env'
import { useErrorDetails } from './useErrorDetails'
import { formatSecondaryMessage } from '../utils/error-formatter'
import type { RouteMetadata } from '@/presentation/routing/types'

interface UseErrorPageSetupOptions {
  /** Route للصفحة الحالية (للتأكد من عدم البحث عن metadata لصفحة الخطأ نفسها) */
  currentErrorRoute?: string
  /** استخدام formatSecondaryMessage لتحديد الرسالة الثانوية */
  useFormattedMessage?: boolean
}

interface UseErrorPageSetupReturn {
  /** معلومات المستخدم */
  user: ReturnType<typeof useAuth>['user']
  /** دور المستخدم */
  userRole: ReturnType<typeof useRole>['userRole']
  /** صلاحيات المستخدم */
  userPermissions: ReturnType<typeof useRole>['userPermissions']
  /** State لعرض/إخفاء التفاصيل */
  showDetails: boolean
  /** Toggle function للتفاصيل */
  setShowDetails: (show: boolean) => void
  /** معلومات الخطأ من API */
  apiError: ReturnType<typeof useErrorDetails>['apiError']
  /** تفاصيل الخطأ */
  errorDetails: ReturnType<typeof useErrorDetails>['errorDetails']
  /** المسار المطلوب */
  attemptedPath: ReturnType<typeof useErrorDetails>['attemptedPath']
  /** المسار الحالي */
  currentPath: ReturnType<typeof useErrorDetails>['currentPath']
  /** Route metadata */
  routeMetadata: RouteMetadata | null | undefined
  /** إعدادات البيئة */
  isDevelopment: boolean
  /** عرض تفاصيل الخطأ */
  showErrorDetails: boolean
  /** الرسالة الثانوية المنسقة */
  formattedSecondaryMessage?: string
}

/**
 * Hook موحد لإعداد صفحات الأخطاء
 */
export function useErrorPageSetup(options: UseErrorPageSetupOptions = {}): UseErrorPageSetupReturn {
  const { currentErrorRoute, useFormattedMessage = false } = options

  const { user } = useAuth()
  const { userRole, userPermissions } = useRole()
  const [showDetails, setShowDetails] = useState(false)
  const { apiError, errorDetails, attemptedPath, currentPath } = useErrorDetails()

  // استخدام إعدادات البيئة المركزية للتحكم في عرض معلومات التطوير
  const isDevelopment = envConfig.IS_DEV
  const showErrorDetails = !envConfig.IS_PROD // Fallback logic as original file had specific flags

  // الحصول على معلومات المسار - استخدام المسار الأصلي وليس صفحة الخطأ
  // إذا كان attemptedPath هو صفحة الخطأ نفسها، لا نحاول العثور على route metadata
  const isErrorPage =
    currentErrorRoute && (attemptedPath === currentPath || attemptedPath === currentErrorRoute)
  const route = !isErrorPage ? findRouteByPath(attemptedPath, allRoutes) : null
  const routeMetadata = route?.metadata

  // تحديد الرسالة الثانوية المنسقة إذا طُلب
  const formattedSecondaryMessage = useFormattedMessage
    ? formatSecondaryMessage(apiError || null, errorDetails || null)
    : undefined

  return {
    user,
    userRole,
    userPermissions,
    showDetails,
    setShowDetails,
    apiError,
    errorDetails,
    attemptedPath,
    currentPath,
    routeMetadata,
    isDevelopment,
    showErrorDetails,
    formattedSecondaryMessage,
  }
}
