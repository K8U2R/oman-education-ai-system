import { useRoutes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { allRoutes } from '@/presentation/routing'
import { useRouteGuard } from '@/presentation/routing/hooks/useRouteGuard'
import { RouteErrorBoundary } from '@/presentation/components/ui/feedback/RouteErrorBoundary/RouteErrorBoundary'
import { RouteTransition } from '@/presentation/routing/transitions/RouteTransition'
import { ModalManager } from '@/presentation/components/common/Modal/ModalManager'
import { createRouteObjects } from '@/presentation/routing/core/route-utils'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { useAuthStore } from '@/features/user-authentication-management'
import { useUserTier } from '@/presentation/hooks/useUserTier'
import { queryClient } from '@/application/shared/api'

import { useThemeStore } from '@/stores/useThemeStore'
import { useEffect } from 'react'

function AppContent() {
  // Apply route guard
  useRouteGuard()
  // Initialize theme
  useThemeStore()

  // Dynamic Plan Sovereignty (Fix for Critical Violation)
  const tier = useUserTier()

  useEffect(() => {
    const tierClass = `tier-${tier.toLowerCase()}`
    document.body.classList.add(tierClass)

    return () => {
      document.body.classList.remove(tierClass)
    }
  }, [tier])

  // Global error state from auth (X-Ray Layer)
  const authError = useAuthStore(state => state.error)

  const elements = useRoutes(createRouteObjects(allRoutes))

  return (
    <>
      {/* Global X-Ray Error Layer (Top Z-index for diagnostics) */}
      {authError && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
          <div className="max-w-2xl w-full pointer-events-auto">
            <ProfessionalErrorPanel
              error={{
                code: 'AUTH_ERROR',
                message: authError,
                technicalDetails: {
                  service: 'Authentication',
                  file: 'App.tsx',
                  line: 24,
                  context: {
                    layer: 'Global X-Ray',
                    zIndex: 9999,
                    visibility: 'Always on top'
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      <RouteErrorBoundary>
        <RouteTransition transitionType="none" duration={0}>
          {elements}
        </RouteTransition>
        <ModalManager />
      </RouteErrorBoundary>
    </>
  )
}

/**
 * App Component - التطبيق الرئيسي
 *
 * يوفر سياق TanStack Query للتطبيق بأكمله
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      {/* React Query DevTools - أدوات التطوير */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
