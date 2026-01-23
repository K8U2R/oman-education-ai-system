import React from 'react'
import { Shield, Smartphone, CheckCircle, Key, AlertTriangle } from 'lucide-react'
import { Card, Button, Switch } from '@/presentation/components/common'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/domain/constants/routes.constants'

interface SecurityCardsProps {
  userEmail: string
  isVerified: boolean
  createdAt?: string | Date
}

/**
 * SecurityCards - مجموعة من بطاقات عرض معلومات الأمان وإعدادات الخصوصية
 */
export const SecurityCards: React.FC<SecurityCardsProps> = ({
  userEmail,
  isVerified,
  createdAt,
}) => {
  const navigate = useNavigate()

  return (
    <>
      {/* تغيير كلمة المرور */}
      <Card className="user-security-settings-page__card">
        <div className="user-security-settings-page__card-header">
          <Key className="user-security-settings-page__card-icon" />
          <div>
            <h3 className="user-security-settings-page__card-title">كلمة المرور</h3>
            <p className="user-security-settings-page__card-description">
              قم بتحديث كلمة المرور لحسابك
            </p>
          </div>
        </div>
        <div className="user-security-settings-page__card-content">
          <Button variant="outline" onClick={() => navigate(ROUTES.SETTINGS)} leftIcon={<Key />}>
            تغيير كلمة المرور
          </Button>
        </div>
      </Card>

      {/* إعدادات الخصوصية */}
      <Card className="user-security-settings-page__card">
        <div className="user-security-settings-page__card-header">
          <Shield className="user-security-settings-page__card-icon" />
          <div>
            <h3 className="user-security-settings-page__card-title">الخصوصية</h3>
            <p className="user-security-settings-page__card-description">
              إدارة إعدادات الخصوصية والأمان
            </p>
          </div>
        </div>
        <div className="user-security-settings-page__card-content">
          <div className="user-security-settings-page__setting-item">
            <div>
              <label className="user-security-settings-page__setting-label">
                تنبيهات تسجيل الدخول
              </label>
              <p className="user-security-settings-page__setting-description">
                تنبيه عند تسجيل الدخول من جهاز جديد
              </p>
            </div>
            <Switch checked={true} onChange={() => {}} disabled />
          </div>
          <div className="user-security-settings-page__setting-item">
            <div>
              <label className="user-security-settings-page__setting-label">
                تنبيهات النشاط المشبوه
              </label>
              <p className="user-security-settings-page__setting-description">
                تنبيه عند اكتشاف نشاط غير معتاد
              </p>
            </div>
            <Switch checked={true} onChange={() => {}} disabled />
          </div>
        </div>
      </Card>

      {/* التحقق الثنائي (2FA) */}
      <Card className="user-security-settings-page__card">
        <div className="user-security-settings-page__card-header">
          <Smartphone className="user-security-settings-page__card-icon" />
          <div>
            <h3 className="user-security-settings-page__card-title">التحقق الثنائي</h3>
            <p className="user-security-settings-page__card-description">إضافة طبقة حماية إضافية</p>
          </div>
        </div>
        <div className="user-security-settings-page__card-content">
          <div className="user-security-settings-page__2fa-status">
            <AlertTriangle className="user-security-settings-page__2fa-icon" />
            <div>
              <p className="user-security-settings-page__2fa-message">التحقق الثنائي غير مفعّل</p>
              <p className="user-security-settings-page__2fa-description">
                قم بتفعيل الخاصية لحماية أفضل
              </p>
            </div>
          </div>
          <Button variant="outline" leftIcon={<Smartphone />} disabled>
            تفعيل (قريباً)
          </Button>
        </div>
      </Card>

      {/* معلومات الأمان */}
      <Card className="user-security-settings-page__card">
        <div className="user-security-settings-page__card-header">
          <CheckCircle className="user-security-settings-page__card-icon" />
          <div>
            <h3 className="user-security-settings-page__card-title">معلومات الأمان</h3>
            <p className="user-security-settings-page__card-description">
              تفاصيل حالة الأمان لحسابك
            </p>
          </div>
        </div>
        <div className="user-security-settings-page__card-content">
          <div className="user-security-settings-page__info-grid">
            <div className="user-security-settings-page__info-item">
              <span className="user-security-settings-page__info-label">البريد الإلكتروني:</span>
              <span className="user-security-settings-page__info-value">{userEmail}</span>
            </div>
            <div className="user-security-settings-page__info-item">
              <span className="user-security-settings-page__info-label">حالة الحساب:</span>
              <span
                className={`user-security-settings-page__info-value ${isVerified ? 'user-security-settings-page__verified' : 'user-security-settings-page__unverified'}`}
              >
                {isVerified ? '✓ مفعّل' : 'غير مفعّل'}
              </span>
            </div>
            {createdAt && (
              <div className="user-security-settings-page__info-item">
                <span className="user-security-settings-page__info-label">تاريخ التسجيل:</span>
                <span className="user-security-settings-page__info-value">
                  {new Date(createdAt).toLocaleDateString('ar-OM')}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}
