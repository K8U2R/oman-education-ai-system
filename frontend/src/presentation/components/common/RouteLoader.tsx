/**
 * Route Loader - مكون تحميل المسار
 *
 * مكون محسّن لعرض حالة التحميل أثناء lazy loading للمسارات
 */

import React from 'react'

interface RouteLoaderProps {
  /**
   * رسالة التحميل (اختياري)
   */
  message?: string

  /**
   * حجم الـ loader (صغير، متوسط، كبير)
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * نوع الـ loader (spinner, skeleton, dots)
   */
  type?: 'spinner' | 'skeleton' | 'dots'

  /**
   * عرض رسالة التحميل
   */
  showMessage?: boolean
}

/**
 * Route Loader Component
 */
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/user-authentication-management'
import { ROUTES } from '@/domain/constants/routes.constants'

/**
 * Route Loader Component
 */
export const RouteLoader: React.FC<RouteLoaderProps> = ({
  message = 'جاري التحميل...',
  size = 'medium',
  type = 'spinner',
  showMessage = true,
}) => {
  // Developer Mode Logic
  const isDev = import.meta.env.DEV
  const { error, reset } = useAuthStore()
  // Hooks might not work if RouteLoader is used outside Router context, but usually it is inside.
  // We'll wrap logic in a safe check or try-catch block if needed, but Router is almost always root.
  // However, RouteLoader is often used in basic Suspense, which is inside Router.

  // Note: We can't easily use hooks conditionally, but RouteLoader is a component.
  // useNavigate is safe to use here.
  const navigate = useNavigate()

  const handleForceLogin = () => {
    reset()
    navigate(ROUTES.LOGIN, { replace: true })
    window.location.reload()
  }

  return (
    <div
      className={`routeLoader route-loader-${size}`}
      role="status"
      aria-label="جاري التحميل"
    >
      {type === 'spinner' && (
        <div className="spinner">
          <div className="spinnerCircle"></div>
        </div>
      )}

      {type === 'dots' && (
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {type === 'skeleton' && (
        <div className="skeleton">
          <div className="skeletonHeader"></div>
          <div className="skeletonContent">
            <div className="skeletonLine"></div>
            <div className="skeletonLine"></div>
            <div className="skeletonLine"></div>
          </div>
        </div>
      )}

      {showMessage && message && <p className="message">{message}</p>}

      {/* Developer Mode Overlay */}
      {isDev && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#00ff00',
            borderRadius: '4px',
            fontSize: '11px',
            maxWidth: '300px',
            textAlign: 'left',
            border: '1px solid #00ff00',
            zIndex: 999999,
            pointerEvents: 'auto',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px', borderBottom: '1px solid #333' }}>
            🛠️ Route Loader Debug
          </div>
          {error && <div style={{ color: '#ff4444', marginBottom: '5px' }}>Error: {error}</div>}
          <div style={{ color: '#aaa', marginBottom: '5px' }}>
            Init: {useAuthStore.getState().isInitialized ? 'YES' : 'NO'} | Auth:{' '}
            {useAuthStore.getState().isAuthenticated ? 'YES' : 'NO'}
          </div>
          <button
            onClick={handleForceLogin}
            style={{
              background: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
              width: '100%',
              borderRadius: '3px',
              fontWeight: 'bold',
            }}
          >
            Force Login
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Default Route Loader (للـ Suspense fallback)
 */
export const DefaultRouteLoader: React.FC = () => {
  return <RouteLoader type="spinner" size="medium" />
}
