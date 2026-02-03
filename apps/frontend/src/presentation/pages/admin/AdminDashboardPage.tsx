/**
 * Admin Dashboard Page - لوحة تحكم المسؤول
 *
 * لوحة تحكم شاملة للمسؤولين والمالكين لإدارة النظام
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Shield, BarChart3, Activity, Server, FileText } from 'lucide-react'
import { useRole } from '@/features/user-authentication-management'
import { adminService } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { handleError } from '@/utils/errorHandler'
import { AdminPageWrapper } from '../../components/admin'
import { LoadingWrapper, Card } from '../../components/common'
import { PageHeader } from '../components'
import type { DashboardStats } from '@/application/types/admin.types'

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAdmin } = useRole()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalLessons: 0,
    systemHealth: 'healthy',
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const fetchAdminStats = async () => {
      if (!isAdmin) return

      try {
        setLoadingStats(true)
        const [systemStats, contentStats] = await Promise.all([
          adminService.getSystemStats(),
          adminService.getContentStats(),
        ])

        setStats({
          totalUsers: systemStats.total_users,
          activeUsers: systemStats.active_users,
          totalLessons: contentStats.total_lessons,
          systemHealth: systemStats.system_health,
        })
      } catch (error) {
        handleError(error, {
          message: 'فشل تحميل إحصائيات لوحة التحكم',
          context: 'AdminDashboardPage',
        })
      } finally {
        setLoadingStats(false)
      }
    }

    fetchAdminStats()
  }, [isAdmin])

  return (
    <AdminPageWrapper requiredRole="admin" loadingMessage="جاري تحميل لوحة التحكم...">
      <LoadingWrapper isLoading={loadingStats} message="جاري تحميل الإحصائيات...">
        <div className="admin-dashboard-page">
          <PageHeader
            title="لوحة تحكم المسؤول"
            description="إدارة شاملة للنظام والمستخدمين"
            icon={<Shield />}
          />

          {/* Statistics Cards */}
          <div className="admin-dashboard-page__stats">
            <Card className="admin-dashboard-page__stat-card">
              <div className="admin-dashboard-page__stat-icon admin-dashboard-page__stat-icon--users">
                <Users className="w-8 h-8" />
              </div>
              <div className="admin-dashboard-page__stat-content">
                <h3 className="admin-dashboard-page__stat-label">إجمالي المستخدمين</h3>
                <p className="admin-dashboard-page__stat-value">{stats.totalUsers}</p>
              </div>
            </Card>

            <Card className="admin-dashboard-page__stat-card">
              <div className="admin-dashboard-page__stat-icon admin-dashboard-page__stat-icon--active">
                <Activity className="w-8 h-8" />
              </div>
              <div className="admin-dashboard-page__stat-content">
                <h3 className="admin-dashboard-page__stat-label">المستخدمين النشطين</h3>
                <p className="admin-dashboard-page__stat-value">{stats.activeUsers}</p>
              </div>
            </Card>

            <Card className="admin-dashboard-page__stat-card">
              <div className="admin-dashboard-page__stat-icon admin-dashboard-page__stat-icon--lessons">
                <FileText className="w-8 h-8" />
              </div>
              <div className="admin-dashboard-page__stat-content">
                <h3 className="admin-dashboard-page__stat-label">إجمالي الدروس</h3>
                <p className="admin-dashboard-page__stat-value">{stats.totalLessons}</p>
              </div>
            </Card>

            <Card className="admin-dashboard-page__stat-card">
              <div className="admin-dashboard-page__stat-icon admin-dashboard-page__stat-icon--health">
                <Server className="w-8 h-8" />
              </div>
              <div className="admin-dashboard-page__stat-content">
                <h3 className="admin-dashboard-page__stat-label">حالة النظام</h3>
                <p className="admin-dashboard-page__stat-value">
                  {stats.systemHealth === 'healthy'
                    ? 'سليم'
                    : stats.systemHealth === 'warning'
                      ? 'تحذير'
                      : 'خطأ'}
                </p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="admin-dashboard-page__section">
            <h2 className="admin-dashboard-page__section-title">إجراءات سريعة</h2>
            <div className="admin-dashboard-page__quick-actions">
              <Card
                className="admin-dashboard-page__action-card"
                onClick={() => navigate(ROUTES.ADMIN_USERS)}
                hoverable
              >
                <Users className="admin-dashboard-page__action-icon" />
                <h3 className="admin-dashboard-page__action-title">إدارة المستخدمين</h3>
                <p className="admin-dashboard-page__action-description">
                  عرض وإدارة جميع المستخدمين و
                </p>
              </Card>

              <Card
                className="admin-dashboard-page__action-card"
                onClick={() => navigate('/content/lessons')}
                hoverable
              >
                <FileText className="admin-dashboard-page__action-icon" />
                <h3 className="admin-dashboard-page__action-title">إدارة المحتوى</h3>
                <p className="admin-dashboard-page__action-description">
                  إدارة الدروس والمسارات التعليمية
                </p>
              </Card>

              <Card
                className="admin-dashboard-page__action-card"
                onClick={() => {
                  // Analytics - يمكن إضافة صفحة لاحقاً
                  // TODO: Navigate to analytics page
                }}
                hoverable
              >
                <BarChart3 className="admin-dashboard-page__action-icon" />
                <h3 className="admin-dashboard-page__action-title">التحليلات والإحصائيات</h3>
                <p className="admin-dashboard-page__action-description">
                  عرض تقارير مفصلة عن استخدام النظام
                </p>
              </Card>
            </div>
          </div>

          {/* System Health */}
          <div className="admin-dashboard-page__section">
            <h2 className="admin-dashboard-page__section-title">صحة النظام</h2>
            <Card className="admin-dashboard-page__health-card">
              <div className="admin-dashboard-page__health-status">
                <div className="admin-dashboard-page__health-indicator admin-dashboard-page__health-indicator--healthy"></div>
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
                <div className="admin-dashboard-page__health-item">
                  <span className="admin-dashboard-page__health-label">الذاكرة:</span>
                  <span className="admin-dashboard-page__health-value">75%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </LoadingWrapper>
    </AdminPageWrapper>
  )
}

export default AdminDashboardPage
