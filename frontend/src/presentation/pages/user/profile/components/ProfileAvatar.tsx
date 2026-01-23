import React from 'react'
import { Card, OptimizedImage } from '@/presentation/components/common'

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
    <Card className="profile-page__card profile-page__card--avatar">
      <div className="profile-page__avatar-section">
        {avatarUrl ? (
          <OptimizedImage
            src={avatarUrl}
            alt={displayName}
            className="profile-page__avatar"
            loading="lazy"
            width={120}
            height={120}
            objectFit="cover"
            fallback="/logo.png"
          />
        ) : (
          <div className="profile-page__avatar-placeholder">{initials}</div>
        )}
        <div className="profile-page__avatar-info">
          <h2 className="profile-page__avatar-name">{displayName}</h2>
          <p className="profile-page__avatar-email">{email}</p>
        </div>
      </div>
    </Card>
  )
}
