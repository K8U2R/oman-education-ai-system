import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User as UserIcon, Mail, Calendar, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Card, OptimizedImage } from '../../components/common'
import { PageHeader, LoadingState } from '../components'
import './ProfilePage.scss'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoading, isAuthenticated } = useAuth()

  React.useEffect(() => {
    // Only redirect if we're sure user is not authenticated (not loading and not authenticated)
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]) // Remove navigate from dependencies to avoid re-runs

  if (isLoading) {
    return <LoadingState fullScreen message="جاري تحميل الملف الشخصي..." />
  }

  if (!user) {
    return null
  }

  // استخدام User Entity methods
  const getUserInitials = () => user.initials
  const getUserDisplayName = () => user.fullName

  return (
    <div className="profile-page">
      <PageHeader
        title="الملف الشخصي"
        description="إدارة معلوماتك الشخصية وإعدادات الحساب"
        icon={<UserIcon />}
      />

      <div className="profile-page__content">
        {/* Profile Picture Section */}
        <Card className="profile-page__card profile-page__card--avatar">
          <div className="profile-page__avatar-section">
            {user.avatarUrl ? (
              <OptimizedImage
                src={user.avatarUrl}
                alt={getUserDisplayName()}
                className="profile-page__avatar"
                loading="lazy"
                width={120}
                height={120}
                objectFit="cover"
                fallback="/logo.png"
              />
            ) : (
              <div className="profile-page__avatar-placeholder">{getUserInitials()}</div>
            )}
            <div className="profile-page__avatar-info">
              <h2 className="profile-page__avatar-name">{getUserDisplayName()}</h2>
              <p className="profile-page__avatar-email">{user.email}</p>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="profile-page__card">
          <h3 className="profile-page__card-title">المعلومات الشخصية</h3>
          <div className="profile-page__info-grid">
            <div className="profile-page__info-item">
              <div className="profile-page__info-icon">
                <Mail className="w-5 h-5" />
              </div>
              <div className="profile-page__info-content">
                <label className="profile-page__info-label">البريد الإلكتروني</label>
                <p className="profile-page__info-value">{user.email}</p>
              </div>
            </div>

            {user.firstName && (
              <div className="profile-page__info-item">
                <div className="profile-page__info-icon">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="profile-page__info-content">
                  <label className="profile-page__info-label">الاسم الأول</label>
                  <p className="profile-page__info-value">{user.firstName}</p>
                </div>
              </div>
            )}

            {user.lastName && (
              <div className="profile-page__info-item">
                <div className="profile-page__info-icon">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="profile-page__info-content">
                  <label className="profile-page__info-label">اسم العائلة</label>
                  <p className="profile-page__info-value">{user.lastName}</p>
                </div>
              </div>
            )}

            {user.username && (
              <div className="profile-page__info-item">
                <div className="profile-page__info-icon">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="profile-page__info-content">
                  <label className="profile-page__info-label">اسم المستخدم</label>
                  <p className="profile-page__info-value">{user.username}</p>
                </div>
              </div>
            )}

            <div className="profile-page__info-item">
              <div className="profile-page__info-icon">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="profile-page__info-content">
                <label className="profile-page__info-label">تاريخ الإنشاء</label>
                <p className="profile-page__info-value">
                  {new Date(user.createdAt).toLocaleDateString('ar-OM', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Status */}
        <Card className="profile-page__card">
          <h3 className="profile-page__card-title">حالة الحساب</h3>
          <div className="profile-page__status">
            <div className="profile-page__status-item">
              <div className="profile-page__status-icon profile-page__status-icon--verified">
                {user.isVerified ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Clock className="w-6 h-6" />
                )}
              </div>
              <div className="profile-page__status-content">
                <p className="profile-page__status-label">حالة التحقق</p>
                <p
                  className={`profile-page__status-value ${user.isVerified ? 'profile-page__status-value--verified' : 'profile-page__status-value--pending'}`}
                >
                  {user.isVerified ? 'مفعل' : 'في انتظار التفعيل'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage
