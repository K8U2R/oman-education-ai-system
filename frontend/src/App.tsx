import { Routes, Route } from 'react-router-dom'
import { allRoutes } from '@/presentation/routing'
import { useRouteGuard } from '@/presentation/routing/hooks/useRouteGuard'
import { RouteErrorBoundary } from '@/presentation/components/ui/feedback/RouteErrorBoundary/RouteErrorBoundary'
import { RouteTransition } from '@/presentation/routing/transitions/RouteTransition'
import { ModalManager } from '@/presentation/components/common/Modal/ModalManager'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { useAuthStore } from '@/features/user-authentication-management'

import { useThemeStore } from '@/stores/useThemeStore'

function App() {
  // Apply route guard
  useRouteGuard()
  // Initialize theme
  useThemeStore()

  // Global error state from auth (X-Ray Layer)
  const authError = useAuthStore(state => state.error)

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
          <Routes>
            {allRoutes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </RouteTransition>
        <ModalManager />
      </RouteErrorBoundary>
    </>
  )
}

export default App
