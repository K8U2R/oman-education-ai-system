import React from 'react'
import { Mail, Shield as ShieldIcon, User as UserIcon } from 'lucide-react'
import { Card } from '@/presentation/components/common'

interface AccountInfoProps {
  email: string
  role: string
  isActive: boolean
  isVerified: boolean
}

/**
 * AccountInfo - المكون المسؤول عن عرض معلومات الحساب التقنية و
 */
export const AccountInfo: React.FC<AccountInfoProps> = ({ email, role, isActive, isVerified }) => {
  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin: 'مدير',
      developer: 'مطور',
      teacher: 'معلم',
      student: 'طالب',
      parent: 'ولي أمر',
      moderator: 'مشرف',
    }
    return roles[role] || role
  }

  return (
    <Card className="profile-page__card">
      <h3 className="profile-page__card-title">معلومات الحساب</h3>
      <div className="profile-page__info-grid">
        <div className="profile-page__info-item">
          <div className="profile-page__info-icon">
            <Mail className="w-5 h-5" />
          </div>
          <div className="profile-page__info-content">
            <label className="profile-page__info-label">البريد الإلكتروني</label>
            <p className="profile-page__info-value">{email}</p>
          </div>
        </div>

        <div className="profile-page__info-item">
          <div className="profile-page__info-icon">
            <ShieldIcon className="w-5 h-5" />
          </div>
          <div className="profile-page__info-content">
            <label className="profile-page__info-label">الدور</label>
            <p className="profile-page__info-value">{getRoleLabel(role)}</p>
          </div>
        </div>

        <div className="profile-page__info-item">
          <div className="profile-page__info-icon">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="profile-page__info-content">
            <label className="profile-page__info-label">حالة الحساب</label>
            <p className="profile-page__info-value">
              {isActive ? 'نشط' : 'غير نشط'}
              {isVerified ? ' • مُتحقق' : ' • غير مُتحقق'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
