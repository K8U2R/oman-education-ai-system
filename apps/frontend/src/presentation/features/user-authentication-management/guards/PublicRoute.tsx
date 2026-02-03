/**
 * PublicRoute - مكون المسار العام
 *
 * مكون للمسارات العامة (يوجه المستخدمين المصادق عليهم)
 */

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/user-authentication-management'
import { ROUTES } from '@/domain/constants/routes.constants'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { LoadingOverlay } from '@/presentation/routing/guards/components/LoadingOverlay'

interface PublicRouteProps {
  children: React.ReactElement
  allowAuthenticated?: boolean
  redirectTo?: string
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  allowAuthenticated = false,
  redirectTo = ROUTES.DASHBOARD,
}) => {
  const { isAuthenticated, isLoading, error } = useAuth()

  // ADS: Show precise error if auth check failed hard
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <ProfessionalErrorPanel
          error={{
            code: 'AUTH_INIT_ERROR',
            message: error,
            technicalDetails: {
              service: 'PublicRoute',
              file: 'guards/PublicRoute.tsx',
              context: { isAuthenticated, isLoading },
            },
          }}
          className="max-w-xl w-full mx-4"
        />
      </div>
    )
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <LoadingOverlay
        message="جارٍ التحقق..."
        context="Public Route Auth Check"
        debugInfo={{ component: 'PublicRoute', isAuthenticated }}
      />
    )
  }

  // Redirect authenticated users if not allowed
  if (isAuthenticated && !allowAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
