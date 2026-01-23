import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageAuth } from '@/application/shared/hooks'
import { useRole } from '@/features/user-authentication-management'
import { ROUTES } from '@/domain/constants/routes.constants'

/**
 * useDashboard - هوك مخصص لإدارة منطق لوحة التحكم
 *
 * يتولى التعامل مع:
 * - التحقق من
 * - التنقل بين الصفحات
 * - التحية الديناميكية بناءً على الوقت
 */
export const useDashboard = () => {
  const navigate = useNavigate()
  const { user, canAccess, loadingState } = usePageAuth({
    requireAuth: true,
    autoRedirect: true,
  })

  const { userRole } = useRole()
  const canAccessCloudStorage = userRole === 'admin' || userRole === 'developer'

  // التحية الديناميكية بناءً على الوقت الحالي
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'صباح الخير'
    if (hour < 17) return 'طاب يومك'
    if (hour < 21) return 'مساء الخير'
    return 'ليلة سعيدة'
  }, [])

  // وظائف التنقل
  const navigateToLessons = useCallback(() => {
    navigate(ROUTES.LESSONS)
  }, [navigate])

  const navigateToStorage = useCallback(() => {
    navigate(ROUTES.STORAGE)
  }, [navigate])

  // التعامل مع أحداث لوحة المفاتيح للتنقل بالضغط على Enter
  const handleShortcut = useCallback(
    (route: string) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        navigate(route)
      }
    },
    [navigate]
  )

  return {
    user,
    canAccess,
    loadingState,
    canAccessCloudStorage,
    greeting,
    navigateToLessons,
    navigateToStorage,
    handleShortcut,
  }
}
