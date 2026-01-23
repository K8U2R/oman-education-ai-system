import React from 'react'
import { User as UserIcon, Calendar } from 'lucide-react'
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
  return (
    <Card className="profile-page__card">
      <h3 className="profile-page__card-title">المعلومات الشخصية</h3>
      <div className="profile-page__info-grid">
        {firstName && (
          <div className="profile-page__info-item">
            <div className="profile-page__info-icon">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="profile-page__info-content">
              <label className="profile-page__info-label">الاسم الأول</label>
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
              <label className="profile-page__info-label">اسم العائلة</label>
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
              <label className="profile-page__info-label">اسم المستخدم</label>
              <p className="profile-page__info-value">{username}</p>
            </div>
          </div>
        )}

        <div className="profile-page__info-item">
          <div className="profile-page__info-icon">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="profile-page__info-content">
            <label className="profile-page__info-label">تاريخ الإنشاء</label>
            <p className="profile-page__info-value">{formattedCreatedAt}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
