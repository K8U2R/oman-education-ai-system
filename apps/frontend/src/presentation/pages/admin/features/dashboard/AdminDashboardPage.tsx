import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  BarChart3,
  Activity,
  Server,
  FileText,
  Database,
  Cpu
} from 'lucide-react';

import { AdminPageLayout } from '../../core/components';
import { AdminLoadingState, AdminErrorState } from '../../shared/components';
import { useAdminDashboard } from './hooks';
import { ADMIN_ROUTES } from '../../core/constants';
import { StatCard, QuickActionCard, HealthCard } from '@/presentation/components/dashboard';

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
    return null
  }

  const systemStatus = stats?.systemHealth || 'healthy';

  return (
    <AdminPageLayout
      title="لوحة تحكم المسؤول"
      description="إدارة شاملة للنظام والمستخدمين"
      icon={<Shield />}
      actions={
        <button onClick={refresh} className="px-4 py-2 bg-primary-500/10 text-primary-500 rounded-lg text-sm font-medium hover:bg-primary-500/20 transition-colors">
          تحديث البيانات
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-6 p-1">

        {/* Row 1: Key Statistics */}
        <div className="col-span-12 lg:col-span-3">
          <StatCard
            title="إجمالي المستخدمين"
            value={stats?.totalUsers ?? 0}
            icon={<Users />}
            variant="default"
          />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <StatCard
            title="المستخدمين النشطين"
            value={stats?.activeUsers ?? 0}
            icon={<Activity />}
            variant="success"
            trend={{ value: 12, label: 'مقارنة بالأسبوع الماضي', isPositive: true }}
          />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <StatCard
            title="إجمالي الدروس"
            value={stats?.totalLessons ?? 0}
            icon={<FileText />}
            variant="info"
          />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <StatCard
            title="حالة الخوادم"
            value={systemStatus === 'healthy' ? 'مستقرة' : 'تنبيه'}
            icon={<Server />}
            variant={systemStatus === 'healthy' ? 'success' : 'warning'}
          />
        </div>

        {/* Row 2: Actions & Health */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-bg-secondary/50 rounded-2xl p-6 border border-border-primary/50">
            <h2 className="text-xl font-bold text-text-primary mb-6">الإجراءات السريعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickActionCard
                title="إدارة المستخدمين"
                description="إدارة الصلاحيات، الحسابات، وتفعيل الاشتراكات."
                icon={<Users />}
                onClick={() => navigate(ADMIN_ROUTES.USERS)}
              />
              <QuickActionCard
                title="مكتبة المحتوى"
                description="إضافة وتعديل المسارات التعليمية والدروس."
                icon={<FileText />}
                onClick={() => navigate('/content/lessons')}
              />
              <QuickActionCard
                title="مركز التحليلات"
                description="مراقبة الأداء، الأخطاء، وسلوك المستخدمين."
                icon={<BarChart3 />}
                onClick={() => navigate(ADMIN_ROUTES.ANALYTICS.ERRORS)}
              />
              <QuickActionCard
                title="قائمة السماح"
                description="إدارة التصاريح الاستثنائية للوصول المبكر."
                icon={<Shield />}
                onClick={() => navigate('/admin/whitelist')}
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <HealthCard
            overallStatus={systemStatus === 'error' ? 'critical' : (systemStatus === 'healthy' ? 'healthy' : 'warning')}
            lastUpdated={new Date().toLocaleTimeString('ar-SA')}
            metrics={[
              {
                label: 'قاعدة البيانات',
                value: 'Connected',
                status: 'healthy',
                icon: <Database />
              },
              {
                label: 'وحدة المعالجة (CPU)',
                value: '12%',
                status: 'healthy',
                icon: <Cpu />
              },
              {
                label: 'الذاكرة (RAM)',
                value: `${stats?.memoryUsage ?? 0}%`,
                status: parseInt(String(stats?.memoryUsage || 0)) > 80 ? 'warning' : 'healthy',
                icon: <Activity />
              }
            ]}
          />
        </div>

      </div>
    </AdminPageLayout>
  )
}

export default AdminDashboardPage
