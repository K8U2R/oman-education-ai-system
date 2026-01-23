/**
 * Developer Dashboard Page - لوحة تحكم المطور
 *
 * صفحة مخصصة للمطورين توفر إحصائيات سريعة، أدوات إدارة النظام،
 * وإجراءات سريعة للوصول إلى الموارد التقنية المهمة.
 * تم نقلها إلى الهيكل الجديد مع استخدام Core Infrastructure
 */

import React from 'react'
import {
  Code,
  Terminal,
  GitBranch,
  Database,
  Server,
  FileCode,
  Bug,
  TestTube,
  Package,
} from 'lucide-react'
import { Button } from '@/presentation/components/common'
import { AdminPageLayout, AdminStatsCard } from '@/presentation/pages/admin/core/components'
import { AdminLoadingState, AdminErrorState } from '@/presentation/pages/admin/shared/components'
import { useDeveloperDashboard } from './hooks'
import { ADMIN_ROUTES } from '@/presentation/pages/admin/core/constants'


const DeveloperDashboardPage: React.FC = () => {
  const { canAccess, loading, error, stats, refresh } = useDeveloperDashboard()

  // قيم افتراضية في حالة الخطأ
  const defaultStats = {
    total_commits: 0,
    active_branches: 0,
    test_coverage: 0,
    build_status: 'pending' as const,
    api_endpoints_count: 0,
    services_count: 0,
    error_rate: 0,
  }

  const displayStats = stats || defaultStats

  // حالة التحميل
  if (loading) {
    return <AdminLoadingState message="جاري تحميل لوحة تحكم المطور..." fullScreen />
  }

  // حالة الخطأ
  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  // عدم الوصول
  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="لوحة تحكم المطور"
      description="أدوات وإحصائيات متخصصة لإدارة الكود، الخادم، وقاعدة البيانات"
      icon={<Code size={28} />}
      actions={
        <Button onClick={refresh} variant="outline" size="sm">
          تحديث
        </Button>
      }
    >
      <div className="developer-dashboard-page">
        {/* إحصائيات سريعة */}
        <section className="developer-dashboard-page__stats">
          <AdminStatsCard
            title="إجمالي الـ Commits"
            value={displayStats.total_commits.toLocaleString('ar-EG')}
            icon={<GitBranch />}
            variant="default"
          />

          <AdminStatsCard
            title="الفروع النشطة"
            value={displayStats.active_branches.toLocaleString('ar-EG')}
            icon={<GitBranch />}
            variant="default"
          />

          <AdminStatsCard
            title="تغطية الاختبارات"
            value={`${displayStats.test_coverage}%`}
            icon={<TestTube />}
            variant={displayStats.test_coverage >= 80 ? 'success' : 'warning'}
          />

          <AdminStatsCard
            title="حالة البناء"
            value={
              displayStats.build_status === 'success'
                ? 'نجح ✅'
                : displayStats.build_status === 'failed'
                  ? 'فشل ❌'
                  : 'قيد الانتظار...'
            }
            icon={<Package />}
            variant={
              displayStats.build_status === 'success'
                ? 'success'
                : displayStats.build_status === 'failed'
                  ? 'danger'
                  : 'warning'
            }
          />

          <AdminStatsCard
            title="API Endpoints"
            value={displayStats.api_endpoints_count.toLocaleString('ar-EG')}
            icon={<FileCode />}
            variant="default"
          />

          <AdminStatsCard
            title="Services"
            value={displayStats.services_count.toLocaleString('ar-EG')}
            icon={<Server />}
            variant="default"
          />
        </section>

        {/* أدوات المطور */}
        <section className="developer-dashboard-page__section">
          <h2 className="developer-dashboard-page__section-title">أدوات المطور</h2>
          <div className="developer-dashboard-page__tools">
            <div
              className="developer-dashboard-page__tool-card"
              role="button"
              tabIndex={0}
              onClick={() => window.open('http://localhost:9681/docs', '_blank')}
              onKeyDown={(e: React.KeyboardEvent) =>
                e.key === 'Enter' && window.open('http://localhost:9681/docs', '_blank')
              }
            >
              <FileCode size={36} className="developer-dashboard-page__tool-icon" />
              <h3 className="developer-dashboard-page__tool-title">وثائق API</h3>
              <p className="developer-dashboard-page__tool-description">
                عرض وتجربة واجهات برمجة التطبيقات (Swagger/Redoc)
              </p>
            </div>

            <div
              className="developer-dashboard-page__tool-card"
              role="button"
              tabIndex={0}
              onClick={() => {
                // Navigate to database core dashboard
                window.location.href = ADMIN_ROUTES.DATABASE_CORE.DASHBOARD
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  window.location.href = ADMIN_ROUTES.DATABASE_CORE.DASHBOARD
                }
              }}
            >
              <Database size={36} className="developer-dashboard-page__tool-icon" />
              <h3 className="developer-dashboard-page__tool-title">إدارة قاعدة البيانات</h3>
              <p className="developer-dashboard-page__tool-description">
                عرض وإدارة الجداول والبيانات
              </p>
            </div>

            <div
              className="developer-dashboard-page__tool-card"
              role="button"
              tabIndex={0}
              onClick={() => {
                // Navigate to security logs
                window.location.href = ADMIN_ROUTES.SECURITY.LOGS
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  window.location.href = ADMIN_ROUTES.SECURITY.LOGS
                }
              }}
            >
              <Terminal size={36} className="developer-dashboard-page__tool-icon" />
              <h3 className="developer-dashboard-page__tool-title">عارض السجلات</h3>
              <p className="developer-dashboard-page__tool-description">
                عرض وتحليل سجلات النظام والتطبيق
              </p>
            </div>

            <div
              className="developer-dashboard-page__tool-card"
              role="button"
              tabIndex={0}
              onClick={() => {
                // TODO: Open testing tools
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  // TODO: Open testing tools
                }
              }}
            >
              <TestTube size={36} className="developer-dashboard-page__tool-icon" />
              <h3 className="developer-dashboard-page__tool-title">أدوات الاختبار</h3>
              <p className="developer-dashboard-page__tool-description">
                تشغيل وإدارة الاختبارات الآلية
              </p>
            </div>

            <div
              className="developer-dashboard-page__tool-card"
              role="button"
              tabIndex={0}
              onClick={() => {
                // Navigate to error dashboard
                window.location.href = ADMIN_ROUTES.ANALYTICS.ERRORS
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  window.location.href = ADMIN_ROUTES.ANALYTICS.ERRORS
                }
              }}
            >
              <Bug size={36} className="developer-dashboard-page__tool-icon" />
              <h3 className="developer-dashboard-page__tool-title">تتبع الأخطاء</h3>
              <p className="developer-dashboard-page__tool-description">
                عرض وإدارة الأخطاء والمشاكل المبلغ عنها
              </p>
            </div>

            <div
              className="developer-dashboard-page__tool-card"
              role="button"
              tabIndex={0}
              onClick={() => {
                // Navigate to performance dashboard
                window.location.href = ADMIN_ROUTES.ANALYTICS.PERFORMANCE
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  window.location.href = ADMIN_ROUTES.ANALYTICS.PERFORMANCE
                }
              }}
            >
              <Server size={36} className="developer-dashboard-page__tool-icon" />
              <h3 className="developer-dashboard-page__tool-title">مراقبة الخادم</h3>
              <p className="developer-dashboard-page__tool-description">
                مراقبة الأداء، الذاكرة، والموارد
              </p>
            </div>
          </div>
        </section>

        {/* إجراءات سريعة */}
        <section className="developer-dashboard-page__section">
          <h2 className="developer-dashboard-page__section-title">إجراءات سريعة</h2>
          <div className="developer-dashboard-page__quick-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.open('http://localhost:9681/docs', '_blank')}
            >
              <FileCode size={20} className="mr-2" />
              فتح وثائق API
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                // TODO: Run tests
              }}
            >
              <TestTube size={20} className="mr-2" />
              تشغيل الاختبارات
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                window.location.href = ADMIN_ROUTES.SECURITY.LOGS
              }}
            >
              <Terminal size={20} className="mr-2" />
              عرض السجلات
            </Button>
          </div>
        </section>
      </div>
    </AdminPageLayout>
  )
}

export default DeveloperDashboardPage
