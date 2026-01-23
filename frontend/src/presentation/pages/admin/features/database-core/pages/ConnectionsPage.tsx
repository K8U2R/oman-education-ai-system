/**
 * Connections Page - صفحة إدارة الاتصالات
 *
 * صفحة لإدارة ومراقبة اتصالات قاعدة البيانات
 * تم نقلها إلى الهيكل الجديد
 */

import React, { useState } from 'react'
import { Database, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/presentation/components/common'
import { BaseCard, HealthStatusBadge } from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useConnectionsPage } from '../hooks'



const ConnectionsPage: React.FC = () => {
  const { canAccess, loading, error, connections, poolStats, refresh } = useConnectionsPage()
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)

  if (loading) {
    return <AdminLoadingState message="جاري تحميل الاتصالات..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="إدارة الاتصالات"
      description="إدارة ومراقبة اتصالات قاعدة البيانات"
      icon={<Database size={28} />}
      actions={
        <div className="connections-page__header-actions">
          <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
            تحديث
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              // TODO: Open Add Connection Dialog
            }}
            leftIcon={<Plus size={16} />}
          >
            إضافة اتصال
          </Button>
        </div>
      }
    >
      <div className="connections-page">
        {/* Pool Statistics */}
        {poolStats && (
          <BaseCard title="Connection Pool Statistics" icon={<Database />} loading={loading}>
            <div className="connections-page__pool-stats">
              <div className="connections-page__stat-item">
                <span className="connections-page__stat-label">Active Connections:</span>
                <span className="connections-page__stat-value">{poolStats.active}</span>
              </div>
              <div className="connections-page__stat-item">
                <span className="connections-page__stat-label">Idle Connections:</span>
                <span className="connections-page__stat-value">{poolStats.idle}</span>
              </div>
              <div className="connections-page__stat-item">
                <span className="connections-page__stat-label">Total Connections:</span>
                <span className="connections-page__stat-value">{poolStats.total}</span>
              </div>
              <div className="connections-page__stat-item">
                <span className="connections-page__stat-label">Max Connections:</span>
                <span className="connections-page__stat-value">{poolStats.max}</span>
              </div>
            </div>
          </BaseCard>
        )}

        {/* Connections List */}
        <BaseCard title="الاتصالات" icon={<Database />} loading={loading}>
          <div className="connections-page__connections-list">
            {connections.length > 0 ? (
              connections.map(connection => (
                <div
                  key={connection.id}
                  className={`connections-page__connection-item ${selectedConnection === connection.id ? 'selected' : ''
                    }`}
                  onClick={() => setSelectedConnection(connection.id)}
                >
                  <div className="connections-page__connection-info">
                    <h4>{connection.name}</h4>
                    <p>{connection.provider}</p>
                  </div>
                  <HealthStatusBadge status={connection.status} />
                </div>
              ))
            ) : (
              <p className="connections-page__empty">لا توجد اتصالات</p>
            )}
          </div>
        </BaseCard>
      </div>
    </AdminPageLayout>
  )
}

export default ConnectionsPage
