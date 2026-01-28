import React from 'react'
import { RouteConfig } from '../../types'
import { ProtectedRoute } from '@/features/user-authentication-management'
import DashboardLayout from '@/presentation/layouts/DashboardLayout'

// Mastermind Feature Import
import { MastermindRouter } from '@/features/ai-orchestration-mastermind'

export const mastermindRoutes: RouteConfig[] = [
  {
    path: '/mastermind/*', // Dynamic catch-all
    element: (
      <ProtectedRoute requiredRole="developer">
        <DashboardLayout>
          <React.Suspense fallback={<div>Loading Neural Interface...</div>}>
            <MastermindRouter />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: {
      title: 'Mastermind',
      description: 'AI Orchestration Center',
      requiresAuth: true,
    },
  },
]
