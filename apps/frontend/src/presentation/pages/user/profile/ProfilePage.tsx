import React from 'react'
import { User as UserIcon } from 'lucide-react'
import { LoadingState } from '@/presentation/pages/components'
import { PageHeader } from '../../components'
import { useProfile } from './hooks/useProfile'
import { ProfileAvatar, PersonalInfo, AccountInfo } from './components'


/**
 * ProfilePage - صفحة الملف الشخصي - النسخة المطورة
 */
const ProfilePage: React.FC = () => {
  const { user, canAccess, loadingState, initials, displayName, formattedCreatedAt } = useProfile()

  if (!canAccess || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={loadingState.loadingMessage} />
  }

  if (!user) return null

  return (
    <div className="profile-page">
      <PageHeader
        title="الملف الشخصي"
        description="إدارة معلوماتك الشخصية وإعدادات الحساب"
        icon={<UserIcon />}
      />

      <div className="profile-page__content">
        <ProfileAvatar
          avatarUrl={user.avatarUrl}
          displayName={displayName}
          initials={initials}
          email={user.email}
        />

        <PersonalInfo
          firstName={user.firstName}
          lastName={user.lastName}
          username={user.username}
          formattedCreatedAt={formattedCreatedAt}
        />

        <AccountInfo
          email={user.email}
          role={user.role}
          isActive={user.isActive}
          isVerified={user.isVerified}
        />
      </div>
    </div>
  )
}

export default ProfilePage
