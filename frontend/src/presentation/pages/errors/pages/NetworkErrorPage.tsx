/**
 * Network Error Page - صفحة أخطاء الشبكة
 *
 * صفحة تظهر عند حدوث مشكلة في الاتصال بالخادم
 */

import React from 'react'
import { WifiOff } from 'lucide-react'
import { BaseErrorPage } from '../BaseErrorPage'
import { ErrorDetailsPanel } from '../components/ErrorDetailsPanel'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useErrorPageSetup } from '../hooks/useErrorPageSetup'
import { formatSecondaryMessage } from '../utils/error-formatter'

export const NetworkErrorPage: React.FC = () => {
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
    currentErrorRoute: ROUTES.NETWORK_ERROR,
    useFormattedMessage: true,
  })

  const secondaryMessage = formatSecondaryMessage(
    apiError || null,
    errorDetails || null,
    'بعد التحقق من الاتصال، يمكنك المحاولة مرة أخرى.'
  )

  return (
    <BaseErrorPage
      type="network-error"
      title="مشكلة في الاتصال"
      message="عذراً، لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت."
      secondaryMessage={secondaryMessage}
      icon={WifiOff}
      iconColor="warning"
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
