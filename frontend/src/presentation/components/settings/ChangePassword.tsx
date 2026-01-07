/**
 * Change Password Component - تغيير كلمة المرور
 *
 * مكون لتغيير كلمة المرور
 */

import React, { useState } from 'react'
import { Lock, Eye, EyeOff, Save } from 'lucide-react'
import { useAuth } from '@/application'
import { ValidationService } from '@/application'
import { Button, Input, Card } from '../common'
import './ChangePassword.scss'

const ChangePassword: React.FC = () => {
  const { updatePassword } = useAuth()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setSuccess(false)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'كلمة المرور الحالية مطلوبة'
    }

    const passwordValidation = ValidationService.validatePassword(formData.newPassword)
    if (!passwordValidation.isValid) {
      newErrors.newPassword = passwordValidation.errors.join(', ')
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSaving(true)
    try {
      await updatePassword(formData.currentPassword, formData.newPassword)
      setSuccess(true)
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setErrors({
        currentPassword: error instanceof Error ? error.message : 'فشل تغيير كلمة المرور',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="change-password">
      <div className="change-password__header">
        <Lock className="change-password__icon" />
        <h3 className="change-password__title">تغيير كلمة المرور</h3>
      </div>

      <form onSubmit={handleSubmit} className="change-password__form">
        <div className="change-password__field">
          <label className="change-password__label">كلمة المرور الحالية</label>
          <Input
            type={showPasswords.current ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={e => handleChange('currentPassword', e.target.value)}
            placeholder="أدخل كلمة المرور الحالية"
            error={errors.currentPassword}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="change-password__toggle"
              >
                {showPasswords.current ? <EyeOff /> : <Eye />}
              </button>
            }
            fullWidth
          />
        </div>

        <div className="change-password__field">
          <label className="change-password__label">كلمة المرور الجديدة</label>
          <Input
            type={showPasswords.new ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={e => handleChange('newPassword', e.target.value)}
            placeholder="أدخل كلمة المرور الجديدة"
            error={errors.newPassword}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="change-password__toggle"
              >
                {showPasswords.new ? <EyeOff /> : <Eye />}
              </button>
            }
            fullWidth
          />
        </div>

        <div className="change-password__field">
          <label className="change-password__label">تأكيد كلمة المرور</label>
          <Input
            type={showPasswords.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={e => handleChange('confirmPassword', e.target.value)}
            placeholder="أعد إدخال كلمة المرور الجديدة"
            error={errors.confirmPassword}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="change-password__toggle"
              >
                {showPasswords.confirm ? <EyeOff /> : <Eye />}
              </button>
            }
            fullWidth
          />
        </div>

        {success && <div className="change-password__success">تم تغيير كلمة المرور بنجاح</div>}

        <div className="change-password__actions">
          <Button type="submit" variant="primary" disabled={isSaving} leftIcon={<Save />} fullWidth>
            {isSaving ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ChangePassword
