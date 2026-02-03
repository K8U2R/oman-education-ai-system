/**
 * LoadingState Component - مكون حالة التحميل
 * Reusable loading state with spinner and message
 */

import React from 'react'
import { motion } from 'framer-motion'

export interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  className?: string
}

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/user-authentication-management'
import { ROUTES } from '@/domain/constants/routes.constants'

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'جاري التحميل...',
  size = 'md',
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'loading-state--sm',
    md: 'loading-state--md',
    lg: 'loading-state--lg',
  }

  // Developer Mode Logic
  const isDev = import.meta.env.DEV
  const { error, reset } = useAuthStore()
  const navigate = useNavigate()

  const handleForceLogin = () => {
    reset()
    navigate(ROUTES.LOGIN, { replace: true })
    window.location.reload() // Force reload to clear any memory states
  }

  return (
    <div
      className={`loading-state ${fullScreen ? 'loading-state--fullscreen' : ''} ${sizeClasses[size]} ${className}`}
    >
      <motion.div
        className="loading-state__spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {message && <p className="loading-state__message">{message}</p>}

      {/* Developer Mode Overlay */}
      {isDev && (error || fullScreen) && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#00ff00',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxWidth: '80%',
            textAlign: 'left',
            border: error ? '1px solid #ff4444' : '1px solid #444',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              marginBottom: '8px',
              borderBottom: '1px solid #333',
              paddingBottom: '4px',
              fontWeight: 'bold',
            }}
          >
            🛠️ Developer Mode
          </div>

          {error && (
            <div style={{ color: '#ff4444', marginBottom: '10px' }}>
              <strong>Last Error:</strong> {error}
            </div>
          )}

          <div style={{ color: '#aaa', marginBottom: '10px' }}>
            <div>Mode: {import.meta.env.MODE}</div>
            <div>Auth Initialized: {useAuthStore.getState().isInitialized ? 'Yes' : 'No'}</div>
            <div>Authenticated: {useAuthStore.getState().isAuthenticated ? 'Yes' : 'No'}</div>
          </div>

          <button
            onClick={handleForceLogin}
            style={{
              background: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold',
            }}
          >
            Force Login & Reset (Fix Loop)
          </button>
        </div>
      )}
    </div>
  )
}
