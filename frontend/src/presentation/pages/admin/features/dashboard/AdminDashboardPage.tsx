/**
 * Admin Dashboard Page - لوحة تحكم المسؤول
 *
 * لوحة تحكم شاملة للمسؤولين والمالكين لإدارة النظام
 * تم نقلها إلى الهيكل الجديد مع استخدام Core Infrastructure
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Shield, BarChart3, Activity, Server, FileText } from 'lucide-react'
import { AdminPageLayout, AdminStatsCard } from '../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../shared/components'
import { useAdminDashboard } from './hooks'
import { ADMIN_ROUTES } from '../../core/constants'


const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { canAccess, loading, error, stats, refresh } = useAdminDashboard()

  // حالة التحميل
  if (loading) {
    return <AdminLoadingState message="جاري تحميل لوحة التحكم..." fullScreen />
  }

  // حالة الخطأ
  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  // عدم الوصول
  if (!canAccess) {
    return null // سيتم إعادة التوجيه تلقائياً من useAdminPage
  }

  return (
    <AdminPageLayout
      title="لوحة تحكم المسؤول"
      description="إدارة شاملة للنظام والمستخدمين"
      icon={<Shield />}
      actions={
        <button onClick={refresh} className="admin-dashboard-page__refresh-btn">
          تحديث
        </button>
      }
    >
      <div className="admin-dashboard-page">
        {/* Statistics Cards */}
        <div className="admin-dashboard-page__stats">
          <AdminStatsCard
            title="إجمالي المستخدمين"
            value={stats?.totalUsers ?? 0}
            icon={<Users />}
            variant="default"
          />

          <AdminStatsCard
            title="المستخدمين النشطين"
            value={stats?.activeUsers ?? 0}
            icon={<Activity />}
            variant="success"
          />

          <AdminStatsCard
            title="إجمالي الدروس"
            value={stats?.totalLessons ?? 0}
            icon={<FileText />}
            variant="default"
          />

          <AdminStatsCard
            title="حالة النظام"
            value={
              stats?.systemHealth === 'healthy'
                ? 'سليم'
                : stats?.systemHealth === 'warning'
                  ? 'تحذير'
                  : 'خطأ'
            }
            icon={<Server />}
            variant={
              stats?.systemHealth === 'healthy'
                ? 'success'
                : stats?.systemHealth === 'warning'
                  ? 'warning'
                  : 'danger'
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="admin-dashboard-page__section">
          <h2 className="admin-dashboard-page__section-title">إجراءات سريعة</h2>
          <div className="admin-dashboard-page__quick-actions">
            <div
              className="admin-dashboard-page__action-card"
              onClick={() => navigate(ADMIN_ROUTES.USERS)}
            >
              <Users className="admin-dashboard-page__action-icon" />
              <h3 className="admin-dashboard-page__action-title">إدارة المستخدمين</h3>
              <p className="admin-dashboard-page__action-description">
                عرض وإدارة جميع المستخدمين و
              </p>
            </div>

            <div
              className="admin-dashboard-page__action-card"
              onClick={() => navigate('/content/lessons')}
            >
              <FileText className="admin-dashboard-page__action-icon" />
              <h3 className="admin-dashboard-page__action-title">إدارة المحتوى</h3>
              <p className="admin-dashboard-page__action-description">
                إدارة الدروس والمسارات التعليمية
              </p>
            </div>

            <div
              className="admin-dashboard-page__action-card"
              onClick={() => navigate(ADMIN_ROUTES.ANALYTICS.ERRORS)}
            >
              <BarChart3 className="admin-dashboard-page__action-icon" />
              <h3 className="admin-dashboard-page__action-title">التحليلات والإحصائيات</h3>
              <p className="admin-dashboard-page__action-description">
                عرض تقارير مفصلة عن استخدام النظام
              </p>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="admin-dashboard-page__section">
          <h2 className="admin-dashboard-page__section-title">صحة النظام</h2>
          <div className="admin-dashboard-page__health-card">
            <div className="admin-dashboard-page__health-status">
              <div
                className={`admin-dashboard-page__health-indicator admin-dashboard-page__health-indicator--${stats?.systemHealth || 'healthy'}`}
              />
              <span className="admin-dashboard-page__health-text">النظام يعمل بشكل طبيعي</span>
            </div>
            <div className="admin-dashboard-page__health-details">
              <div className="admin-dashboard-page__health-item">
                <span className="admin-dashboard-page__health-label">قاعدة البيانات:</span>
                <span className="admin-dashboard-page__health-value admin-dashboard-page__health-value--healthy">
                  متصل
                </span>
              </div>
              <div className="admin-dashboard-page__health-item">
                <span className="admin-dashboard-page__health-label">الخادم:</span>
                <span className="admin-dashboard-page__health-value admin-dashboard-page__health-value--healthy">
                  نشط
                </span>
              </div>
              {stats?.memoryUsage !== undefined && (
                <div className="admin-dashboard-page__health-item">
                  <span className="admin-dashboard-page__health-label">الذاكرة:</span>
                  <span className="admin-dashboard-page__health-value">{stats.memoryUsage}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  )
}

export default AdminDashboardPage
