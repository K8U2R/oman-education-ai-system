import React from 'react'
import { User as UserIcon, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/presentation/components/common'

interface PersonalInfoProps {
  firstName?: string
  lastName?: string
  username?: string
  formattedCreatedAt: string
}

/**
 * PersonalInfo - المكون المسؤول عن عرض المعلومات الشخصية للمستخدم
 */
export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  firstName,
  lastName,
  username,
  formattedCreatedAt,
}) => {
  const { t } = useTranslation()

  return (
    <Card className="profile-page__card">
      <h3 className="profile-page__card-title">{t('profile.personal_info')}</h3>
      <div className="profile-page__info-grid">
        {firstName && (
          <div className="profile-page__info-item">
            <div className="profile-page__info-icon">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="profile-page__info-content">
              <label className="profile-page__info-label">{t('auth.first_name_label')}</label>
              <p className="profile-page__info-value">{firstName}</p>
            </div>
          </div>
        )}

        {lastName && (
          <div className="profile-page__info-item">
            <div className="profile-page__info-icon">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="profile-page__info-content">
              <label className="profile-page__info-label">{t('auth.last_name_label')}</label>
              <p className="profile-page__info-value">{lastName}</p>
            </div>
          </div>
        )}

        {username && (
          <div className="profile-page__info-item">
            <div className="profile-page__info-icon">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="profile-page__info-content">
              <label className="profile-page__info-label">{t('auth.username_label')}</label>
              <p className="profile-page__info-value">{username}</p>
            </div>
          </div>
        )}

        <div className="profile-page__info-item">
          <div className="profile-page__info-icon">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="profile-page__info-content">
            <label className="profile-page__info-label">{t('profile.member_since')}</label>
            <p className="profile-page__info-value">{formattedCreatedAt}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
