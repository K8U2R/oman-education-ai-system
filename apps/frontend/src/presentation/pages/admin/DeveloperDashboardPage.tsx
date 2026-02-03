import React, { useState, useEffect } from 'react'
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

import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { LoadingState } from '@/presentation/pages/components'
import { loggingService } from '@/infrastructure/services'
import { Card, Button } from '../../components/common'
import { PageHeader } from '../components'
import { developerService } from '@/application'
import { DeveloperStats } from '@/domain/types/developer.types'

/**
 * DeveloperDashboardPage - لوحة تحكم المطور
 *
 * صفحة مخصصة للمطورين توفر إحصائيات سريعة، أدوات إدارة النظام،
 * وإجراءات سريعة للوصول إلى الموارد التقنية المهمة.
 *
 * الوصول مقيد بدور "Developer" فقط.
 */
const DeveloperDashboardPage: React.FC = () => {
  const { user, canAccess } = usePageAuth({
    requireAuth: true,
    requiredRole: 'developer',
    redirectTo: '/forbidden',
  })

  // إحصائيات المطور
  const [devStats, setDevStats] = useState<DeveloperStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // جلب إحصائيات المطور
  useEffect(() => {
    const fetchDeveloperStats = async () => {
      if (!canAccess) return

      try {
        setIsLoadingStats(true)
        const stats = await developerService.getDeveloperStats()
        setDevStats(stats)
      } catch (error) {
        loggingService.error('Failed to fetch developer stats', error as Error)
        // في حالة الخطأ، نستخدم قيم افتراضية
        setDevStats({
          total_commits: 0,
          active_branches: 0,
          test_coverage: 0,
          build_status: 'pending',
          api_endpoints_count: 0,
          services_count: 0,
          error_rate: 0,
        })
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (canAccess) {
      fetchDeveloperStats()
    }
  }, [canAccess])

  const { isLoading, shouldShowLoading, loadingMessage } = usePageLoading({
    isLoading: !canAccess || isLoadingStats || !devStats,
    message: 'جاري تحميل لوحة تحكم المطور...',
  })

  if (isLoading || !canAccess || shouldShowLoading) {
    return <LoadingState fullScreen message={loadingMessage} />
  }

  if (!user) {
    return null
  }

  if (!devStats) {
    return null
  }

  return (
    <div className="developer-dashboard-page">
      {/* رأس الصفحة */}
      <PageHeader
        title="لوحة تحكم المطور"
        description="أدوات وإحصائيات متخصصة لإدارة الكود، الخادم، وقاعدة البيانات"
        icon={<Code size={28} />}
      />

      {/* إحصائيات سريعة */}
      <section className="developer-dashboard-page__stats">
        <Card className="developer-dashboard-page__stat-card">
          <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--commits">
            <GitBranch size={32} />
          </div>
          <div className="developer-dashboard-page__stat-content">
            <h3 className="developer-dashboard-page__stat-label">إجمالي الـ Commits</h3>
            <p className="developer-dashboard-page__stat-value">
              {devStats.total_commits.toLocaleString('ar-EG')}
            </p>
          </div>
        </Card>

        <Card className="developer-dashboard-page__stat-card">
          <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--branches">
            <GitBranch size={32} />
          </div>
          <div className="developer-dashboard-page__stat-content">
            <h3 className="developer-dashboard-page__stat-label">الفروع النشطة</h3>
            <p className="developer-dashboard-page__stat-value">
              {devStats?.active_branches.toLocaleString('ar-EG') ?? 0}
            </p>
          </div>
        </Card>

        <Card className="developer-dashboard-page__stat-card">
          <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--coverage">
            <TestTube size={32} />
          </div>
          <div className="developer-dashboard-page__stat-content">
            <h3 className="developer-dashboard-page__stat-label">تغطية الاختبارات</h3>
            <p className="developer-dashboard-page__stat-value">{devStats?.test_coverage ?? 0}%</p>
          </div>
        </Card>

        <Card className="developer-dashboard-page__stat-card">
          <div
            className={`developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--build ${devStats?.build_status === 'success' ? 'success' : 'failed'}`}
          >
            <Package size={32} />
          </div>
          <div className="developer-dashboard-page__stat-content">
            <h3 className="developer-dashboard-page__stat-label">حالة البناء</h3>
            <p className="developer-dashboard-page__stat-value">
              {devStats.build_status === 'success'
                ? 'نجح ✅'
                : devStats.build_status === 'failed'
                  ? 'فشل ❌'
                  : 'قيد الانتظار...'}
            </p>
          </div>
        </Card>

        <Card className="developer-dashboard-page__stat-card">
          <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--endpoints">
            <FileCode size={32} />
          </div>
          <div className="developer-dashboard-page__stat-content">
            <h3 className="developer-dashboard-page__stat-label">API Endpoints</h3>
            <p className="developer-dashboard-page__stat-value">
              {devStats.api_endpoints_count.toLocaleString('ar-EG')}
            </p>
          </div>
        </Card>

        <Card className="developer-dashboard-page__stat-card">
          <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--services">
            <Server size={32} />
          </div>
          <div className="developer-dashboard-page__stat-content">
            <h3 className="developer-dashboard-page__stat-label">Services</h3>
            <p className="developer-dashboard-page__stat-value">
              {devStats.services_count.toLocaleString('ar-EG')}
            </p>
          </div>
        </Card>
      </section>

      {/* أدوات المطور */}
      <section className="developer-dashboard-page__section">
        <h2 className="developer-dashboard-page__section-title">أدوات المطور</h2>
        <div className="developer-dashboard-page__tools">
          <Card
            className="developer-dashboard-page__tool-card"
            role="button"
            tabIndex={0}
            onClick={() => window.open(`${window.location.origin}/api/v1/docs`, '_blank')}
            onKeyDown={(e: React.KeyboardEvent) =>
              e.key === 'Enter' && window.open(`${window.location.origin}/api/v1/docs`, '_blank')
            }
          >
            <FileCode size={36} className="developer-dashboard-page__tool-icon" />
            <h3 className="developer-dashboard-page__tool-title">وثائق API</h3>
            <p className="developer-dashboard-page__tool-description">
              عرض وتجربة واجهات برمجة التطبيقات (Swagger/Redoc)
            </p>
          </Card>

          <Card
            className="developer-dashboard-page__tool-card"
            role="button"
            tabIndex={0}
            onClick={() => {
              // TODO: Open database management
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                // TODO: Open database management
              }
            }}
          >
            <Database size={36} className="developer-dashboard-page__tool-icon" />
            <h3 className="developer-dashboard-page__tool-title">إدارة قاعدة البيانات</h3>
            <p className="developer-dashboard-page__tool-description">
              عرض وإدارة الجداول والبيانات
            </p>
          </Card>

          <Card
            className="developer-dashboard-page__tool-card"
            role="button"
            tabIndex={0}
            onClick={() => {
              // TODO: Open log viewer
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                // TODO: Open log viewer
              }
            }}
          >
            <Terminal size={36} className="developer-dashboard-page__tool-icon" />
            <h3 className="developer-dashboard-page__tool-title">عارض السجلات</h3>
            <p className="developer-dashboard-page__tool-description">
              عرض وتحليل سجلات النظام والتطبيق
            </p>
          </Card>

          <Card
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
          </Card>

          <Card
            className="developer-dashboard-page__tool-card"
            role="button"
            tabIndex={0}
            onClick={() => {
              // TODO: Open error tracking
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                // TODO: Open error tracking
              }
            }}
          >
            <Bug size={36} className="developer-dashboard-page__tool-icon" />
            <h3 className="developer-dashboard-page__tool-title">تتبع الأخطاء</h3>
            <p className="developer-dashboard-page__tool-description">
              عرض وإدارة الأخطاء والمشاكل المبلغ عنها
            </p>
          </Card>

          <Card
            className="developer-dashboard-page__tool-card"
            role="button"
            tabIndex={0}
            onClick={() => {
              // TODO: Open server monitoring
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                // TODO: Open server monitoring
              }
            }}
          >
            <Server size={36} className="developer-dashboard-page__tool-icon" />
            <h3 className="developer-dashboard-page__tool-title">مراقبة الخادم</h3>
            <p className="developer-dashboard-page__tool-description">
              مراقبة الأداء، الذاكرة، والموارد
            </p>
          </Card>
        </div>
      </section>

      {/* إجراءات سريعة */}
      <section className="developer-dashboard-page__section">
        <h2 className="developer-dashboard-page__section-title">إجراءات سريعة</h2>
        <div className="developer-dashboard-page__quick-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.open(`${window.location.origin}/api/v1/docs`, '_blank')}
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
              // TODO: View logs
            }}
          >
            <Terminal size={20} className="mr-2" />
            عرض السجلات
          </Button>
        </div>
      </section>
    </div>
  )
}

export default DeveloperDashboardPage
