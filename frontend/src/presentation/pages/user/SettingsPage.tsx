import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings as SettingsIcon, Bell, Shield, Palette } from 'lucide-react'

import { useAuth } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Card } from '../../components/common'
import { PageHeader, LoadingState } from '../components'
import ThemeSelector from '../../components/settings/ThemeSelector'
import GeneralSettings from '../../components/settings/GeneralSettings'
import LanguageSettings from '../../components/settings/LanguageSettings'
import ChangePassword from '../../components/settings/ChangePassword'
import { NotificationPreferences } from '../../components/layout/NotificationPreferences'
import './SettingsPage.scss'

/**
 * SettingsPage - صفحة الإعدادات
 *
 * تتيح للمستخدم تخصيص إعدادات الحساب، المظهر، اللغة، الإشعارات،
 * وتغيير كلمة المرور، بالإضافة إلى عرض سياسة الخصوصية.
 */
const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()
  const [isNotificationPrefsOpen, setIsNotificationPrefsOpen] = useState(false)

  // إعادة توجيه المستخدم غير المصادق عليه إلى صفحة تسجيل الدخول
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  // حالة التحميل
  if (isLoading) {
    return <LoadingState fullScreen message="جاري تحميل الإعدادات..." />
  }

  // في حالة عدم المصادقة (بعد إعادة التوجيه)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="settings-page">
      {/* رأس الصفحة */}
      <PageHeader
        title="الإعدادات"
        description="إدارة حسابك، تفضيلاتك، والمظهر العام للنظام"
        icon={<SettingsIcon size={28} />}
      />

      {/* المحتوى الرئيسي */}
      <section className="settings-page__content">
        {/* الإعدادات العامة */}
        <GeneralSettings />

        {/* تغيير كلمة المرور */}
        <ChangePassword />

        {/* الإشعارات */}
        <Card className="settings-page__card">
          <div className="settings-page__card-header">
            <Bell size={24} className="settings-page__card-icon" />
            <h3 className="settings-page__card-title">الإشعارات</h3>
          </div>
          <div className="settings-page__card-content">
            <button
              className="settings-page__action-button"
              onClick={() => setIsNotificationPrefsOpen(true)}
            >
              إدارة تفضيلات الإشعارات
            </button>
          </div>
        </Card>

        {/* الخصوصية */}
        <Card className="settings-page__card">
          <div className="settings-page__card-header">
            <Shield size={24} className="settings-page__card-icon" />
            <h3 className="settings-page__card-title">الخصوصية</h3>
          </div>
          <div className="settings-page__card-content">
            <button
              className="settings-page__action-button"
              onClick={() => navigate(ROUTES.PRIVACY ?? '/privacy')}
            >
              عرض سياسة الخصوصية
            </button>
          </div>
        </Card>

        {/* اللغة والمنطقة */}
        <LanguageSettings />

        {/* المظهر (الثيم) */}
        <Card className="settings-page__card">
          <div className="settings-page__card-header">
            <Palette size={24} className="settings-page__card-icon" />
            <h3 className="settings-page__card-title">المظهر</h3>
          </div>
          <div className="settings-page__card-content">
            <ThemeSelector />
          </div>
        </Card>
      </section>

      {/* نافذة تفضيلات الإشعارات (مودال/درج) */}
      <NotificationPreferences
        isOpen={isNotificationPrefsOpen}
        onClose={() => setIsNotificationPrefsOpen(false)}
      />
    </div>
  )
}

export default SettingsPage
