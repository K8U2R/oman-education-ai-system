/**
 * PublicRoute - مكون المسار العام
 *
 * مكون للمسارات العامة (يوجه المستخدمين المصادق عليهم)
 */

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'

interface PublicRouteProps {
  children: React.ReactElement
  redirectTo?: string
  allowAuthenticated?: boolean
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = ROUTES.DASHBOARD,
  allowAuthenticated = false,
}) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    )
  }

  // Redirect authenticated users if not allowed
  if (isAuthenticated && !allowAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
