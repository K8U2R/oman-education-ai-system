import React from 'react'
import { Code } from 'lucide-react'
import { LoadingState } from '@/presentation/pages/components'
import { PageHeader } from '@/presentation/pages/admin/components'
import { useDeveloperDashboard } from './core/DeveloperDashboard.hooks'
import DeveloperStatsCards from './components/DeveloperStatsCards/DeveloperStatsCards'
import { DeveloperToolsCards, DeveloperQuickActions } from './components/DeveloperToolsCards/DeveloperToolsCards'

/**
 * DeveloperDashboardPage - لوحة تحكم المطور
 *
 * Sovereign container component following Rule 13 (Functional Decomposition).
 * < 100 lines.
 */
const DeveloperDashboardPage: React.FC = () => {
  const { user, canAccess, devStats, isLoading, shouldShowLoading, loadingMessage } = useDeveloperDashboard()

  if (isLoading || !canAccess || shouldShowLoading) {
    return <LoadingState fullScreen message={loadingMessage} />
  }

  if (!user || !devStats) {
    return null
  }

  return (
    <div className="developer-dashboard-page">
      <PageHeader
        title="لوحة تحكم المطور"
        description="أدوات وإحصائيات متخصصة لإدارة الكود، الخادم، وقاعدة البيانات"
        icon={<Code size={28} />}
      />

      <DeveloperStatsCards stats={devStats} />
      <DeveloperToolsCards />
      <DeveloperQuickActions />
    </div>
  )
}

export default DeveloperDashboardPage
