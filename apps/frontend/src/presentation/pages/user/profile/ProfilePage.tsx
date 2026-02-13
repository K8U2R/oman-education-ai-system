import React from 'react'
import { User as UserIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LoadingState } from '@/presentation/pages/components'
import { PageHeader } from '../../components'
import { useProfile } from './hooks/useProfile'
import { ProfileAvatar, PersonalInfo, AccountInfo } from './components'


import styles from './ProfilePage.module.scss'

/**
 * ProfilePage - صفحة الملف الشخصي - النسخة المطورة
 */
const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const { user, canAccess, loadingState, initials, displayName, formattedCreatedAt } = useProfile()

  if (!canAccess || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={loadingState.loadingMessage} />
  }

  if (!user) return null

  return (
    <div className={styles.container}>
      <PageHeader
        title={t('profile.title')}
        description={t('profile.description')}
        icon={<UserIcon />}
      />

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <ProfileAvatar
            avatarUrl={user.avatarUrl}
            displayName={displayName}
            initials={initials}
            email={user.email}
          />
        </div>

        <div className={styles.main}>
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
    </div>
  )
}

export default ProfilePage
