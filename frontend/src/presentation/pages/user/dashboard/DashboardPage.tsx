import React, { useMemo } from 'react'
import { LayoutDashboard } from 'lucide-react'
import { LoadingState } from '@/presentation/pages/components'
import { PageHeader } from '../../components'
import { useDashboard } from './hooks/useDashboard'
import { MainActions, QuickAccess, UserTypes } from './components'


/**
 * DashboardPage - الصفحة الرئيسية (لوحة التحكم) - النسخة المطورة
 *
 * تم إعادة هيكلة هذه الصفحة لتكون نموذجاً للاحترافية والقابلية للتوسع:
 * - فُصل المنطق عن الواجهة باستخدام useDashboard hook.
 * - قُسمت الواجهة إلى مكونات صغيرة (MainActions, QuickAccess, UserTypes).
 * - تحسين الأداء باستخدام React.memo و useMemo.
 */
const DashboardPage: React.FC = () => {
  const {
    user,
    canAccess,
    loadingState,
    canAccessCloudStorage,
    greeting,
    navigateToLessons,
    navigateToStorage,
    handleShortcut,
  } = useDashboard()

  const pageHeaderIcon = useMemo(() => <LayoutDashboard size={28} />, [])

  // حالة التحميل والأمان
  if (!canAccess || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={loadingState.loadingMessage} />
  }

  if (!user) return null

  return (
    <div className="dashboard-page">
      <PageHeader
        title={`${greeting}، ${user.fullName || 'عزيزي المستخدم'}`}
        description="مرحباً بك في نظام التعليم الذكي - مساعدك الشخصي للتعلم والفهم"
        icon={pageHeaderIcon}
      />

      <MainActions
        canAccessCloudStorage={canAccessCloudStorage}
        onNavigateToLessons={navigateToLessons}
        onNavigateToStorage={navigateToStorage}
        onShortcut={handleShortcut}
      />

      <QuickAccess
        canAccessCloudStorage={canAccessCloudStorage}
        onNavigateToLessons={navigateToLessons}
        onNavigateToStorage={navigateToStorage}
        onShortcut={handleShortcut}
      />

      <UserTypes />
    </div>
  )
}

export default DashboardPage
