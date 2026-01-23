/**
 * Server Error Page - صفحة 500
 *
 * صفحة تظهر عند حدوث خطأ في الخادم
 */

import React from 'react'
import { ServerCrash } from 'lucide-react'
import { BaseErrorPage } from '../BaseErrorPage'
import { ErrorDetailsPanel } from '../components/ErrorDetailsPanel'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useErrorPageSetup } from '../hooks/useErrorPageSetup'
import { formatSecondaryMessage } from '../utils/error-formatter'

export const ServerErrorPage: React.FC = () => {
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
    currentErrorRoute: ROUTES.SERVER_ERROR,
    useFormattedMessage: true,
  })

  const secondaryMessage = formatSecondaryMessage(
    apiError || null,
    errorDetails || null,
    'يرجى المحاولة مرة أخرى لاحقاً أو التواصل مع الدعم الفني.'
  )

  return (
    <BaseErrorPage
      type="server-error"
      title="خطأ في الخادم"
      message="عذراً، حدث خطأ في الخادم. نحن نعمل على إصلاحه."
      secondaryMessage={secondaryMessage}
      icon={ServerCrash}
      iconColor="error"
      showRefreshButton={true}
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
