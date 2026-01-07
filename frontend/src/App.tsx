import { Routes, Route } from 'react-router-dom'
import { allRoutes } from '@/presentation/routing'
import { useRouteGuard } from '@/presentation/routing/hooks/useRouteGuard'
import { RouteErrorBoundary } from '@/presentation/routing/errors/RouteErrorBoundary'
import { RouteTransition } from '@/presentation/routing/transitions/RouteTransition'

function App() {
  // Apply route guard
  useRouteGuard()

  return (
    <RouteErrorBoundary>
      <RouteTransition transitionType="none" duration={0}>
        <Routes>
          {allRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </RouteTransition>
    </RouteErrorBoundary>
  )
}

export default App
