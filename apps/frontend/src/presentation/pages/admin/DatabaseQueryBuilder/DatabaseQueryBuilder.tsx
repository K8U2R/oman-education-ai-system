/**
 * Query Builder Page - صفحة بناء الاستعلامات
 *
 * صفحة شاملة لبناء وتنفيذ الاستعلامات SQL
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { Code } from 'lucide-react'
import { QueryBuilder } from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState } from '../../../shared/components'
import { useQueryBuilderPage } from '@/presentation/pages/admin/features/database-core/hooks'


const QueryBuilderPage: React.FC = () => {
  const { canAccess, loading } = useQueryBuilderPage()

  if (loading) {
    return <AdminLoadingState message="جاري تحميل Query Builder..." fullScreen />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="Query Builder"
      description="بناء وتنفيذ الاستعلامات SQL"
      icon={<Code size={28} />}
    >
      <div className="query-builder-page">
        <QueryBuilder />
      </div>
    </AdminPageLayout>
  )
}

export default QueryBuilderPage
