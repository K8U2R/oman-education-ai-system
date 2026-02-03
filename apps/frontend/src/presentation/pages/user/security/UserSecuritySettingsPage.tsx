import React from 'react'
import { Shield } from 'lucide-react'
import { LoadingState } from '@/presentation/pages/components'
import { PageHeader } from '../../components'
import { useSecurity } from './hooks/useSecurity'
import { SessionManager, SecurityCards } from './components'


/**
 * UserSecuritySettingsPage - صفحة إعدادات الأمان - النسخة المطورة
 */
const UserSecuritySettingsPage: React.FC = () => {
  const {
    user,
    canAccess,
    activeSessions,
    terminating,
    isLoading,
    shouldShowLoading,
    loadingMessage,
    handleTerminateSession,
    handleTerminateAllOtherSessions,
  } = useSecurity()

  if (isLoading || !canAccess || shouldShowLoading) {
    return <LoadingState fullScreen message={loadingMessage} />
  }

  if (!user) return null

  return (
    <div className="user-security-settings-page">
      <PageHeader
        title="إعدادات الأمان"
        description="إدارة إعدادات الأمان الخاصة بحسابك"
        icon={<Shield className="user-security-settings-page__header-icon" />}
      />

      <div className="user-security-settings-page__content">
        <SessionManager
          sessions={activeSessions}
          terminating={terminating}
          onTerminate={handleTerminateSession}
          onTerminateAll={handleTerminateAllOtherSessions}
        />

        <SecurityCards
          userEmail={user.email || ''}
          isVerified={user.isVerified}
          createdAt={user.createdAt}
        />
      </div>
    </div>
  )
}

export default UserSecuritySettingsPage
