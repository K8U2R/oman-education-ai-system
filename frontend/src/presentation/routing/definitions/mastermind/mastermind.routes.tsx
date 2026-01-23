import React from 'react'
import { RouteConfig } from '../../types'
import { ProtectedRoute } from '@/features/user-authentication-management'
import { AppShell } from '@/presentation/components/shell/AppShell'

// Mastermind Feature Import
import { MastermindRouter } from '@/features/ai-orchestration-mastermind'

export const mastermindRoutes: RouteConfig[] = [
  {
    path: '/mastermind/*', // Dynamic catch-all
    element: (
      <ProtectedRoute requiredRole="developer">
        <AppShell>
          <React.Suspense fallback={<div>Loading Neural Interface...</div>}>
            <MastermindRouter />
          </React.Suspense>
        </AppShell>
      </ProtectedRoute>
    ),
    metadata: {
      title: 'Mastermind',
      description: 'AI Orchestration Center',
      requiresAuth: true,
    },
  },
]
