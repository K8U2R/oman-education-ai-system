/**
 * Security Settings Page - صفحة إعدادات الأمان
 *
 * صفحة لتكوين سياسات الأمان والمصادقة (للمسؤولين فقط)
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Key, Shield, Clock, AlertTriangle, Save, RotateCcw } from 'lucide-react'
import { Card, Button, Input, Switch } from '../../../components/common'
import { useSecurity } from '@/application/features/security'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState } from '../../components'
import type { SecuritySettings } from '@/application/features/security/types'
import './SecuritySettingsPage.scss'

const SecuritySettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { isAdmin } = useRole()
  const { settings, loading, error, updateSettings } = useSecurity()
  const [formData, setFormData] = useState<Partial<SecuritySettings>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN)
    } else if (!authLoading && !isAdmin) {
      navigate(ROUTES.FORBIDDEN)
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate])

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleChange = (
    field: keyof SecuritySettings,
    value: string | number | boolean | undefined
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaveError(null)
      setSaveSuccess(false)
      await updateSettings(formData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في حفظ الإعدادات'
      setSaveError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (settings) {
      setFormData(settings)
    }
  }

  if (authLoading || loading) {
    return <LoadingState fullScreen message="جاري تحميل إعدادات الأمان..." />
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="security-settings-page">
      <PageHeader
        title="إعدادات الأمان"
        description="تكوين سياسات الأمان والمصادقة"
        icon={<Settings className="security-settings-page__header-icon" />}
        actions={
          <div className="security-settings-page__header-actions">
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw />}>
              إعادة تعيين
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Save />}
              disabled={saving}
            >
              حفظ التغييرات
            </Button>
          </div>
        }
      />

      {error && (
        <div className="security-settings-page__error">
          <AlertTriangle className="security-settings-page__error-icon" />
          <span>{error}</span>
        </div>
      )}

      {saveError && (
        <div className="security-settings-page__error">
          <AlertTriangle className="security-settings-page__error-icon" />
          <span>{saveError}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="security-settings-page__success">
          <Shield className="security-settings-page__success-icon" />
          <span>تم حفظ الإعدادات بنجاح</span>
        </div>
      )}

      <div className="security-settings-page__content">
        {/* Authentication Settings */}
        <Card className="security-settings-page__card">
          <div className="security-settings-page__card-header">
            <Key className="security-settings-page__card-icon" />
            <div>
              <h3 className="security-settings-page__card-title">إعدادات المصادقة</h3>
              <p className="security-settings-page__card-description">
                تكوين سياسات تسجيل الدخول وكلمات المرور
              </p>
            </div>
          </div>
          <div className="security-settings-page__card-content">
            <div className="security-settings-page__form-grid">
              <div className="security-settings-page__form-field">
                <label className="security-settings-page__label">الحد الأقصى لمحاولات الدخول</label>
                <Input
                  type="number"
                  value={formData.maxLoginAttempts || 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange('maxLoginAttempts', parseInt(e.target.value, 10))
                  }
                  min={1}
                  max={10}
                />
                <p className="security-settings-page__helper">عدد المحاولات قبل قفل الحساب</p>
              </div>
              <div className="security-settings-page__form-field">
                <label className="security-settings-page__label">مدة القفل (دقائق)</label>
                <Input
                  type="number"
                  value={formData.lockoutDuration || 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange('lockoutDuration', parseInt(e.target.value, 10))
                  }
                  min={5}
                  max={1440}
                />
                <p className="security-settings-page__helper">مدة قفل الحساب بعد تجاوز المحاولات</p>
              </div>
            </div>

            <div className="security-settings-page__form-divider" />

            <div className="security-settings-page__form-field">
              <div className="security-settings-page__switch-field">
                <div>
                  <label className="security-settings-page__label">كلمة مرور قوية إجبارية</label>
                  <p className="security-settings-page__helper">
                    يتطلب أحرف كبيرة وصغيرة وأرقام ورموز
                  </p>
                </div>
                <Switch
                  checked={formData.requirePasswordComplexity ?? false}
                  onChange={(checked: boolean) =>
                    handleChange('requirePasswordComplexity', checked)
                  }
                />
              </div>
            </div>

            <div className="security-settings-page__form-field">
              <div className="security-settings-page__switch-field">
                <div>
                  <label className="security-settings-page__label">التحقق الثنائي إجباري</label>
                  <p className="security-settings-page__helper">يتطلب تفعيل 2FA لجميع المستخدمين</p>
                </div>
                <Switch
                  checked={formData.twoFactorEnabled ?? false}
                  onChange={(checked: boolean) => handleChange('twoFactorEnabled', checked)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Session Settings */}
        <Card className="security-settings-page__card">
          <div className="security-settings-page__card-header">
            <Clock className="security-settings-page__card-icon" />
            <div>
              <h3 className="security-settings-page__card-title">إعدادات الجلسات</h3>
              <p className="security-settings-page__card-description">تكوين سياسات إدارة الجلسات</p>
            </div>
          </div>
          <div className="security-settings-page__card-content">
            <div className="security-settings-page__form-grid">
              <div className="security-settings-page__form-field">
                <label className="security-settings-page__label">مهلة الجلسة (دقائق)</label>
                <Input
                  type="number"
                  value={formData.sessionTimeout || 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange('sessionTimeout', parseInt(e.target.value, 10))
                  }
                  min={15}
                  max={1440}
                />
                <p className="security-settings-page__helper">مدة الخمول قبل انتهاء الجلسة</p>
              </div>
              <div className="security-settings-page__form-field">
                <label className="security-settings-page__label">
                  الحد الأقصى للجلسات المتزامنة
                </label>
                <Input
                  type="number"
                  value={formData.maxConcurrentSessions || 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange('maxConcurrentSessions', parseInt(e.target.value, 10))
                  }
                  min={1}
                  max={20}
                />
                <p className="security-settings-page__helper">عدد الأجهزة المسموح بها لكل مستخدم</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Rate Limiting */}
        <Card className="security-settings-page__card">
          <div className="security-settings-page__card-header">
            <Shield className="security-settings-page__card-icon" />
            <div>
              <h3 className="security-settings-page__card-title">تحديد معدل الطلبات</h3>
              <p className="security-settings-page__card-description">
                حماية ضد هجمات الإغراق والتخمين
              </p>
            </div>
          </div>
          <div className="security-settings-page__card-content">
            <div className="security-settings-page__form-field">
              <div className="security-settings-page__switch-field">
                <div>
                  <label className="security-settings-page__label">تفعيل تحديد المعدل</label>
                  <p className="security-settings-page__helper">تحديد عدد الطلبات لكل IP</p>
                </div>
                <Switch
                  checked={formData.rateLimitEnabled ?? false}
                  onChange={(checked: boolean) => handleChange('rateLimitEnabled', checked)}
                />
              </div>
            </div>

            {formData.rateLimitEnabled && (
              <>
                <div className="security-settings-page__form-divider" />
                <div className="security-settings-page__form-grid">
                  <div className="security-settings-page__form-field">
                    <label className="security-settings-page__label">الحد الأقصى للطلبات</label>
                    <Input
                      type="number"
                      value={formData.rateLimitRequests || 0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange('rateLimitRequests', parseInt(e.target.value, 10))
                      }
                      min={10}
                      max={1000}
                    />
                    <p className="security-settings-page__helper">عدد الطلبات المسموحة في الفترة</p>
                  </div>
                  <div className="security-settings-page__form-field">
                    <label className="security-settings-page__label">فترة القياس (ثانية)</label>
                    <Input
                      type="number"
                      value={formData.rateLimitWindow || 0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange('rateLimitWindow', parseInt(e.target.value, 10))
                      }
                      min={10}
                      max={3600}
                    />
                    <p className="security-settings-page__helper">الفترة الزمنية لحساب المعدل</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Alerts Settings */}
        <Card className="security-settings-page__card">
          <div className="security-settings-page__card-header">
            <AlertTriangle className="security-settings-page__card-icon" />
            <div>
              <h3 className="security-settings-page__card-title">إعدادات التنبيهات</h3>
              <p className="security-settings-page__card-description">
                تكوين متى وكيف يتم إرسال التنبيهات الأمنية
              </p>
            </div>
          </div>
          <div className="security-settings-page__card-content">
            <div className="security-settings-page__form-field">
              <div className="security-settings-page__switch-field">
                <div>
                  <label className="security-settings-page__label">
                    تنبيه محاولات الدخول الفاشلة
                  </label>
                  <p className="security-settings-page__helper">إرسال تنبيه بعد 3 محاولات فاشلة</p>
                </div>
                <Switch
                  checked={formData.notifyOnFailedLogin ?? false}
                  onChange={(checked: boolean) => handleChange('notifyOnFailedLogin', checked)}
                />
              </div>
            </div>
            <div className="security-settings-page__form-field">
              <div className="security-settings-page__switch-field">
                <div>
                  <label className="security-settings-page__label">
                    تنبيه تسجيل الدخول من موقع جديد
                  </label>
                  <p className="security-settings-page__helper">
                    إرسال تنبيه عند الدخول من IP جديد
                  </p>
                </div>
                <Switch
                  checked={formData.notifyOnNewDevice ?? false}
                  onChange={(checked: boolean) => handleChange('notifyOnNewDevice', checked)}
                />
              </div>
            </div>
            <div className="security-settings-page__form-field">
              <div className="security-settings-page__switch-field">
                <div>
                  <label className="security-settings-page__label">تنبيه النشاط المشبوه</label>
                  <p className="security-settings-page__helper">
                    إرسال تنبيه عند اكتشاف نشاط مشبوه
                  </p>
                </div>
                <Switch
                  checked={formData.notifyOnSuspiciousActivity ?? false}
                  onChange={(checked: boolean) =>
                    handleChange('notifyOnSuspiciousActivity', checked)
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SecuritySettingsPage
