/**
 * Security Settings Page - صفحة إعدادات الأمان
 *
 * صفحة لإعدادات الأمان العامة
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { Shield } from 'lucide-react'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState } from '../../../shared/components'
import { useSecurityPage } from '@/presentation/pages/admin/features/security/hooks'


const SecuritySettingsPage: React.FC = () => {
  const { canAccess, loading } = useSecurityPage('system.settings')

  if (loading) {
    return <AdminLoadingState message="جاري تحميل إعدادات الأمان..." fullScreen />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="إعدادات الأمان"
      description="إعدادات الأمان العامة للنظام"
      icon={<Shield size={28} />}
    >
      <div className="security-settings-page">
        <p>صفحة إعدادات الأمان - قيد التطوير</p>
      </div>
    </AdminPageLayout>
  )
}

export default SecuritySettingsPage
