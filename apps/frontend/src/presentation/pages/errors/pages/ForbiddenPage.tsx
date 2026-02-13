/**
 * Forbidden Page - صفحة محظورة
 *
 * صفحة تظهر عندما لا يملك المستخدم  للوصول
 * تستخدم BaseErrorPage و useErrorPageSetup لتقليل التكرار
 */

import { useTranslation } from 'react-i18next'
import { ShieldX } from 'lucide-react'
import { BaseErrorPage } from '../BaseErrorPage'
import { ErrorDetailsPanel } from '../components/ErrorDetailsPanel'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useErrorPageSetup } from '../hooks/useErrorPageSetup'
import { formatSecondaryMessage } from '../utils/error-formatter'

export const ForbiddenPage: React.FC = () => {
  const { t } = useTranslation('common')
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
    currentErrorRoute: ROUTES.FORBIDDEN,
    useFormattedMessage: true,
  })

  // تحديد الرسالة الثانوية بناءً على تفاصيل الخطأ
  const secondaryMessage = formatSecondaryMessage(
    apiError || null,
    errorDetails || null,
    t('errors.forbidden.contact_admin')
  )

  return (
    <BaseErrorPage
      type="forbidden"
      title={t('errors.forbidden.title')}
      message={t('errors.forbidden.message')}
      secondaryMessage={secondaryMessage}
      icon={ShieldX}
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
