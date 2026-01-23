import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '@/domain/constants/routes.constants'
import { LoadingOverlay } from '@/presentation/routing/guards/components/LoadingOverlay'

export const GuestRoute = () => {
  const { isAuthenticated, isLoading: loading } = useAuth()

  if (loading) {
    return <LoadingOverlay message="جاري التحقق من الجلسة..." context="Guest Route" />
  }

  // If authenticated, redirect to home/dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  // If guest, allow access
  return <Outlet />
}
