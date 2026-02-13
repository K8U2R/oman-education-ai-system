import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings as SettingsIcon, Bell, Shield, Palette } from 'lucide-react'

import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { LoadingState } from '@/presentation/pages/components'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Card } from '../../../components/common'
import { PageHeader } from '../../components'
import ThemeSelector from '../../../components/settings/ThemeSelector'
import GeneralSettings from '../../../components/settings/GeneralSettings'
import LanguageSettings from '../../../components/settings/LanguageSettings'
import ChangePassword from '../../../components/settings/ChangePassword'
import { NotificationPreferences } from '../../../components/layout/NotificationPreferences'


import styles from './SettingsPage.module.scss'

/**
 * SettingsPage - صفحة الإعدادات
 *
 * تتيح للمستخدم تخصيص إعدادات الحساب، المظهر، اللغة، الإشعارات،
 * وتغيير كلمة المرور، بالإضافة إلى عرض سياسة الخصوصية.
 */
const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { canAccess, loadingState } = usePageAuth({
    requireAuth: true,
    autoRedirect: true,
  })

  const { isLoading } = usePageLoading({
    isLoading: !canAccess,
    message: 'جاري تحميل الإعدادات...',
  })

  const [isNotificationPrefsOpen, setIsNotificationPrefsOpen] = useState(false)

  // حالة التحميل
  if (isLoading || !canAccess || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={loadingState.loadingMessage} />
  }

  return (
    <div className={styles.container}>
      {/* رأس الصفحة */}
      <PageHeader
        title="الإعدادات"
        description="إدارة حسابك، تفضيلاتك، والمظهر العام للنظام"
        icon={<SettingsIcon size={28} />}
      />

      {/* المحتوى الرئيسي */}
      <section className={styles.content}>
        {/* الإعدادات العامة */}
        <GeneralSettings />

        {/* تغيير كلمة المرور */}
        <ChangePassword />

        {/* الإشعارات */}
        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <Bell size={24} className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>الإشعارات</h3>
          </div>
          <div className={styles.cardContent}>
            <button
              className={styles.actionButton}
              onClick={() => setIsNotificationPrefsOpen(true)}
            >
              إدارة تفضيلات الإشعارات
            </button>
          </div>
        </Card>

        {/* الخصوصية */}
        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <Shield size={24} className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>الخصوصية</h3>
          </div>
          <div className={styles.cardContent}>
            <button
              className={styles.actionButton}
              onClick={() => navigate(ROUTES.PRIVACY ?? '/privacy')}
            >
              عرض سياسة الخصوصية
            </button>
          </div>
        </Card>

        {/* اللغة والمنطقة */}
        <LanguageSettings />

        {/* المظهر (الثيم) */}
        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <Palette size={24} className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>المظهر</h3>
          </div>
          <div className={styles.cardContent}>
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
