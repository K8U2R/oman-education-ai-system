/**
 * General Settings Component - إعدادات عامة
 *
 * مكون لإدارة الإعدادات العامة للحساب
 */

import React, { useState, useEffect } from 'react'
import { User, Mail, Save, Shield } from 'lucide-react'
import { useAuth } from '@/features/user-authentication-management'
import { Button, Input, Card } from '../common'

const GeneralSettings: React.FC = () => {
  const { user, updateUser, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateUser({
        full_name: formData.fullName,
      })
      await refreshUser()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  return (
    <Card className="general-settings">
      <div className="general-settings__header">
        <User className="general-settings__icon" />
        <h3 className="general-settings__title">معلومات الحساب</h3>
      </div>

      <div className="general-settings__content">
        <div className="general-settings__field">
          <label className="general-settings__label">
            <User className="general-settings__label-icon" />
            الاسم الكامل
          </label>
          {isEditing ? (
            <Input
              value={formData.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              placeholder="أدخل الاسم الكامل"
              fullWidth
            />
          ) : (
            <p className="general-settings__value">{user?.fullName || 'غير محدد'}</p>
          )}
        </div>

        <div className="general-settings__field">
          <label className="general-settings__label">
            <Mail className="general-settings__label-icon" />
            البريد الإلكتروني
          </label>
          <p className="general-settings__value">{user?.email || 'غير محدد'}</p>
          <p className="general-settings__hint">لا يمكن تغيير البريد الإلكتروني</p>
        </div>

        {user && (
          <>
            <div className="general-settings__field">
              <label className="general-settings__label">
                <Shield className="general-settings__label-icon" />
                الدور
              </label>
              <p className="general-settings__value">
                {user.role === 'admin'
                  ? 'مدير'
                  : user.role === 'developer'
                    ? 'مطور'
                    : user.role === 'teacher'
                      ? 'معلم'
                      : user.role === 'student'
                        ? 'طالب'
                        : user.role === 'parent'
                          ? 'ولي أمر'
                          : user.role === 'moderator'
                            ? 'مشرف'
                            : user.role}
              </p>
            </div>

            <div className="general-settings__field">
              <label className="general-settings__label">
                <Shield className="general-settings__label-icon" />
                حالة الحساب
              </label>
              <p className="general-settings__value">
                {user.isActive ? 'نشط' : 'غير نشط'}
                {user.isVerified ? ' • مُتحقق' : ' • غير مُتحقق'}
              </p>
            </div>
          </>
        )}

        <div className="general-settings__actions">
          {isEditing ? (
            <>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
                leftIcon={<Save />}
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                إلغاء
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              تعديل
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default GeneralSettings
