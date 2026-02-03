/**
 * Unauthorized Page - صفحة غير مصرح
 *
 * صفحة تظهر عندما لا يملك المستخدم  للوصول
 * تستخدم BaseErrorPage و useErrorPageSetup لتقليل التكرار
 */

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { BaseErrorPage } from '../BaseErrorPage'
import { ErrorDetailsPanel } from '../components/ErrorDetailsPanel'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useErrorPageSetup } from '../hooks/useErrorPageSetup'
import { formatSecondaryMessage } from '../utils/error-formatter'

export const UnauthorizedPage: React.FC = () => {
  const {
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
  } = useErrorPageSetup({
    currentErrorRoute: ROUTES.UNAUTHORIZED,
    useFormattedMessage: true,
  })

  // تحديد الرسالة الثانوية بناءً على تفاصيل الخطأ
  const secondaryMessage = formatSecondaryMessage(
    apiError || null,
    errorDetails || null,
    'يرجى تسجيل الدخول أو التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.'
  )

  // تحديد رسالة رئيسية أكثر تحديداً بناءً على السبب
  let message = 'عذراً، ليس لديك  اللازمة للوصول إلى هذه الصفحة.'
  if (errorDetails) {
    if (!errorDetails.isVerified) {
      message = 'حسابك غير موثق. يرجى التحقق من بريدك الإلكتروني للوصول إلى هذه الصفحة.'
    } else if (!errorDetails.isActive) {
      message = 'حسابك غير نشط. يرجى التواصل مع المسؤول للوصول إلى هذه الصفحة.'
    }
  } else if (apiError?.message) {
    message = apiError.message
  }

  return (
    <BaseErrorPage
      type="unauthorized"
      title="غير مصرح بالوصول"
      message={message}
      secondaryMessage={secondaryMessage}
      icon={AlertCircle}
      iconColor="warning"
      showRefreshButton={false}
      showDevDetails={showErrorDetails && isDevelopment}
      devDetailsContent={
        showErrorDetails && isDevelopment ? (
          <ErrorDetailsPanel
            isOpen={showDetails}
            onToggle={() => setShowDetails(!showDetails)}
            user={user}
            userRole={userRole}
            userPermissions={userPermissions}
            routeMetadata={routeMetadata}
            attemptedPath={attemptedPath}
            currentPath={currentPath}
            apiError={apiError || undefined}
            errorDetails={errorDetails || undefined}
          />
        ) : undefined
      }
    />
  )
}
