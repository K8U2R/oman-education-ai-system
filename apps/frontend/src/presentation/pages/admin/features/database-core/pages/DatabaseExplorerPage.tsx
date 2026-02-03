/**
 * Database Explorer Page - صفحة استكشاف قاعدة البيانات
 *
 * صفحة شاملة لاستكشاف الجداول والبيانات
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { Database } from 'lucide-react'
import { DatabaseExplorer } from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState } from '../../../shared/components'
import { useDatabaseExplorerPage } from '../hooks'


const DatabaseExplorerPage: React.FC = () => {
  const { canAccess, loading } = useDatabaseExplorerPage()

  if (loading) {
    return <AdminLoadingState message="جاري تحميل Database Explorer..." fullScreen />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="Database Explorer"
      description="استكشف الجداول والبيانات في قاعدة البيانات"
      icon={<Database size={28} />}
    >
      <div className="database-explorer-page">
        <DatabaseExplorer />
      </div>
    </AdminPageLayout>
  )
}

export default DatabaseExplorerPage
