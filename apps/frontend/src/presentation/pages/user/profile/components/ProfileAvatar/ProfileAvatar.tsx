import React from 'react'
import { Card, OptimizedImage } from '@/presentation/components/common'

import styles from './ProfileAvatar.module.scss'

interface ProfileAvatarProps {
  avatarUrl?: string
  displayName: string
  initials: string
  email: string
}

/**
 * ProfileAvatar - المكون المسؤول عن عرض الصورة الشخصية ومعلومات التعريف الأساسية
 */
export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  displayName,
  initials,
  email,
}) => {
  return (
    <Card className={styles.card}>
      <div className={styles.avatarSection}>
        <div className={styles.imageWrapper}>
          {avatarUrl ? (
            <OptimizedImage
              src={avatarUrl}
              alt={displayName}
              className={styles.avatar}
              loading="lazy"
              width={120}
              height={120}
              objectFit="cover"
              fallback="/logo.png"
            />
          ) : (
            <div className={styles.avatarPlaceholder}>{initials}</div>
          )}
        </div>

        <div className={styles.info}>
          <h2 className={styles.name}>{displayName}</h2>
          <p className={styles.email}>{email}</p>
        </div>
      </div>
    </Card>
  )
}
