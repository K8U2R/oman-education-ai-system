/**
 * Not Found Page - صفحة 404
 *
 * صفحة تظهر عندما لا يتم العثور على الصفحة المطلوبة
 */

import React from 'react'
import { FileX } from 'lucide-react'
import { BaseErrorPage } from '../BaseErrorPage'
import { ErrorDetailsPanel } from '../components/ErrorDetailsPanel'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useErrorPageSetup } from '../hooks/useErrorPageSetup'
import { formatSecondaryMessage } from '../utils/error-formatter'

export const NotFoundPage: React.FC = () => {
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
    currentErrorRoute: ROUTES.NOT_FOUND,
    useFormattedMessage: true,
  })

  const secondaryMessage = formatSecondaryMessage(
    apiError || null,
    errorDetails || null,
    'يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.'
  )

  return (
    <BaseErrorPage
      type="not-found"
      title="الصفحة غير موجودة"
      message="عذراً، الصفحة التي تبحث عنها غير موجودة."
      secondaryMessage={secondaryMessage}
      icon={FileX}
      iconColor="info"
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
