import React, { useMemo } from 'react'
import { LayoutDashboard, AlertTriangle } from 'lucide-react'
import { LoadingState } from '@/presentation/pages/components'
import { PageHeader } from '../../components'
import { useDashboard } from './hooks/useDashboard'
// Old imports removed
import { WIDGET_REGISTRY } from '@/presentation/features/dashboard/WidgetRegistry'
import { DASHBOARD_LAYOUTS, DashboardWidgetConfig } from '@/presentation/features/dashboard/dashboard.config'
import { UserRole } from '@/domain/types/auth.types'

/**
 * DashboardPage - الصفحة الرئيسية (لوحة التحكم) - النسخة الديناميكية (Dynamic Engine)
 *
 * @law Law-05 (Separation of Concerns): The view is now just a renderer.
 * @law Law-06 (Design Tokens): Uses grid system.
 * @desc Renders widgets based on user role configuration defined in dashboard.config.ts
 */
const DashboardPage: React.FC = () => {
  const dashboardState = useDashboard()
  const {
    user,
    canAccess,
    loadingState,
    greeting,
  } = dashboardState

  const pageHeaderIcon = useMemo(() => <LayoutDashboard size={28} />, [])

  // حالة التحميل والأمان
  if (!canAccess || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={loadingState.loadingMessage} />
  }

  if (!user) return null

  // 1. Determine Layout based on Role
  const role: UserRole = user.role || 'student';
  const layoutConfig: DashboardWidgetConfig[] = DASHBOARD_LAYOUTS[role] || DASHBOARD_LAYOUTS.default || [];

  return (
    <div className="dashboard-page space-y-8">
      <PageHeader
        title={`${greeting}، ${user.fullName || 'عزيزي المستخدم'}`}
        description="مرحباً بك في نظام التعليم الذكي - واجهتك الديناميكية للتعلم"
        icon={pageHeaderIcon}
      />

      {/* Dynamic Widget Grid - The Engine 🚂 */}
      <div className="dashboard-grid grid grid-cols-12 gap-6">
        {layoutConfig.map((widgetConfig) => {
          const WidgetComponent = WIDGET_REGISTRY[widgetConfig.widgetKey];

          if (!WidgetComponent) {
            // Development fallback for missing widgets
            if (import.meta.env.DEV) {
              return (
                <div key={widgetConfig.id} className={`col-span-${widgetConfig.colSpan || 12} p-4 border border-red-300 bg-red-50 rounded-lg flex items-center gap-2 text-red-600`}>
                  <AlertTriangle size={20} />
                  <span>Widget Not Found: <strong>{widgetConfig.widgetKey}</strong></span>
                </div>
              );
            }
            return null; // Silent fail in prod
          }

          // Check Permission (if field exists, simplistic check for now)
          // In a real scenario, use a PermissionGuard hook here.
          // if (widgetConfig.permission && !user.hasPermission(widgetConfig.permission)) return null;

          return (
            <div key={widgetConfig.id} className={`col-span-12 md:col-span-${widgetConfig.colSpan || 12}`}>
              <WidgetComponent
                {...dashboardState} // Pass all dashboard hooks/handlers (context)
                {...widgetConfig.props} // Pass static config props
              />
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default DashboardPage
