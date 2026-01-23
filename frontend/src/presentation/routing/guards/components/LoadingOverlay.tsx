import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/user-authentication-management'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Loader2, LogOut } from 'lucide-react'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'

interface LoadingOverlayProps {
  message?: string
  context?: string
  debugInfo?: Record<string, unknown>
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'جاري التحميل...',
  context = 'General',
  debugInfo = {},
}) => {
  const navigate = useNavigate()
  const { reset, user, isAuthenticated, isInitialized } = useAuthStore()
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const isDev = import.meta.env.DEV

  // Watchdog Timer: 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeoutWarning(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleForceLogout = () => {
    try {
      // Attempt to use AuthStore reset
      reset()
    } catch (error) {
      console.error('[LoadingOverlay] AuthStore reset failed, using emergency fallback:', error)
    } finally {
      // Emergency fallback: clear localStorage directly
      localStorage.clear()
      // Force navigation and reload
      navigate(ROUTES.LOGIN, { replace: true })
      window.location.reload()
    }
  }

  // Debug Data Collection
  const allDebugInfo = {
    ...debugInfo,
    context,
    isInitialized,
    isAuthenticated,
    hasUser: !!user,
    timestamp: new Date().toLocaleTimeString(),
  }

  // Timeout Warning -> Professional Error Panel
  if (showTimeoutWarning) {
    const timeoutError = {
      code: 'LOADING_TIMEOUT',
      message: 'تجاوزت عملية التحميل الزمن المسموح (5 ثوانٍ).',
      technicalDetails: {
        service: 'Frontend/LoadingOverlay',
        file: 'guards/components/LoadingOverlay.tsx',
        line: 25,
        functionName: 'WatchdogTimer',
        context: {
          ...allDebugInfo,
          reason: 'Server not responding or Auth state stuck',
        },
      },
    }

    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <ProfessionalErrorPanel
            error={timeoutError}
            onRetry={handleForceLogout}
          // Override render logic to show specific actions if needed,
          // but standard panel has retry. We might want "Force Logout" specifically.
          />
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleForceLogout}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-destructive/90"
            >
              <LogOut className="h-4 w-4" />
              فرض تسجيل الخروج (Emergency Logout)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center p-4">
      {/* Main Loading UI */}
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground font-medium animate-pulse">{message}</p>
      </div>

      {/* Developer Debug Overlay (Persistent X-Ray in DEV) */}
      {isDev && !showTimeoutWarning && (
        <div className="fixed bottom-4 left-4">
          <ProfessionalErrorPanel
            error={{
              code: 'DEBUG_MONITOR',
              message: 'System Integrity Check',
              technicalDetails: {
                service: context,
                file: 'Runtime State',
                context: allDebugInfo,
              },
            }}
            className="scale-75 origin-bottom-left opacity-80 hover:opacity-100 transition-all w-[400px]"
          />
        </div>
      )}
    </div>
  )
}
