/**
 * Route Protection Page - صفحة حماية المسارات
 *
 * صفحة لإدارة حماية المسارات
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { Lock } from 'lucide-react'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState } from '../../../shared/components'
import { useSecurityPage } from '../hooks'


const RouteProtectionPage: React.FC = () => {
  const { canAccess, loading } = useSecurityPage('system.view')

  if (loading) {
    return <AdminLoadingState message="جاري تحميل صفحة حماية المسارات..." fullScreen />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="حماية المسارات"
      description="إدارة حماية المسارات و"
      icon={<Lock size={28} />}
    >
      <div className="route-protection-page">
        <p>صفحة حماية المسارات - قيد التطوير</p>
      </div>
    </AdminPageLayout>
  )
}

export default RouteProtectionPage
