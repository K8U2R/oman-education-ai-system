import { useMemo } from 'react'
import { usePageAuth } from '@/application/shared/hooks'

/**
 * useProfile - هوك مخصص لإدارة منطق ملف المستخدم الشخصي
 */
export const useProfile = () => {
  const { user, canAccess, loadingState } = usePageAuth({
    requireAuth: true,
    autoRedirect: true,
  })

  // استخراج الأحرف الأولى من الاسم
  const initials = useMemo(() => user?.initials || '', [user])

  // استخراج الاسم الكامل للعرض
  const displayName = useMemo(() => user?.fullName || '', [user])

  // تنسيق تاريخ الإنشاء
  const formattedCreatedAt = useMemo(() => {
    if (!user?.createdAt) return ''
    return new Date(user.createdAt).toLocaleDateString('ar-OM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [user])

  return {
    user,
    canAccess,
    loadingState,
    initials,
    displayName,
    formattedCreatedAt,
  }
}
