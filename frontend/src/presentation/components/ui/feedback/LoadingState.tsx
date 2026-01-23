/**
 * LoadingState Component - مكون حالة التحميل
 *
 * مكون مشترك لعرض حالة التحميل
 */

import React from 'react'
import { Loader2 } from 'lucide-react'
import { Card } from '@/presentation/components/common'

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/user-authentication-management'
import { ROUTES } from '@/domain/constants/routes.constants'

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'جاري التحميل...',
  fullScreen = false,
  className = '',
}) => {
  // Developer Mode Logic
  const isDev = import.meta.env.DEV
  const { error, reset } = useAuthStore()
  const navigate = useNavigate()

  const handleForceLogin = () => {
    reset()
    navigate(ROUTES.LOGIN, { replace: true })
    window.location.reload()
  }

  const debugOverlay = isDev && (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '24px',
        background: '#1a1b1e',
        color: '#e2e8f0',
        borderRadius: '12px',
        fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        minWidth: '600px',
        maxWidth: '90vw',
        textAlign: 'left',
        border: '1px solid #334155',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
        zIndex: 999999,
        pointerEvents: 'auto',
        direction: 'ltr',
      }}
    >
      <div
        style={{
          marginBottom: '16px',
          borderBottom: '1px solid #334155',
          paddingBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa' }}>
          🛠️ DEV DEBUGGER
        </span>
        <span
          style={{
            fontSize: '12px',
            background: '#334155',
            padding: '4px 8px',
            borderRadius: '4px',
            color: '#94a3b8',
          }}
        >
          Pages/LoadingState
        </span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4
          style={{
            margin: '0 0 8px 0',
            color: '#94a3b8',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Current Status
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            background: '#0f172a',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #1e293b',
          }}
        >
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>Auth Init</div>
            <div
              style={{
                color: useAuthStore.getState().isInitialized ? '#4ade80' : '#f87171',
                fontWeight: 'bold',
              }}
            >
              {useAuthStore.getState().isInitialized ? '✅ INITIALIZED' : '❌ PENDING'}
            </div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
              Authenticated
            </div>
            <div
              style={{
                color: useAuthStore.getState().isAuthenticated ? '#4ade80' : '#fbbf24',
                fontWeight: 'bold',
              }}
            >
              {useAuthStore.getState().isAuthenticated ? '✅ YES' : '⚠️ NO'}
            </div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
              Has User Data
            </div>
            <div
              style={{
                color: useAuthStore.getState().user ? '#4ade80' : '#fbbf24',
                fontWeight: 'bold',
              }}
            >
              {useAuthStore.getState().user ? '✅ YES' : '⚠️ NO'}
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div style={{ marginBottom: '20px' }}>
          <h4
            style={{
              margin: '0 0 8px 0',
              color: '#f87171',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Active Error
          </h4>
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <div
              style={{
                color: '#fca5a5',
                fontWeight: 'bold',
                fontSize: '16px',
                marginBottom: '8px',
              }}
            >
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
            <div
              style={{ fontSize: '12px', color: '#fecaca', marginTop: '8px', fontStyle: 'italic' }}
            >
              💡 Hint: Check backend logs or network tab for 500/401 details.
            </div>
            {error.includes('500') && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#fbbf24' }}>
                👉 Server Error: Likely an issue with JIT User Creation or Database Connection.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px',
            background: 'rgba(74, 222, 128, 0.1)',
            border: '1px solid #22c55e',
            borderRadius: '8px',
            color: '#4ade80',
            fontSize: '13px',
          }}
        >
          ✅ No active errors detected in auth store.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button
          onClick={handleForceLogin}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'background 0.2s',
            boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#dc2626')}
          onMouseOut={e => (e.currentTarget.style.background = '#ef4444')}
        >
          🚨 FORCE RESET & LOGIN
        </button>
        <button
          onClick={() => (window.location.href = ROUTES.LOGIN)}
          style={{
            background: '#334155',
            color: 'white',
            border: '1px solid #475569',
            padding: '12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'background 0.2s',
            boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.3)',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#475569')}
          onMouseOut={e => (e.currentTarget.style.background = '#334155')}
        >
          🔄 Jump back to Login
        </button>
      </div>
    </div>
  )

  const content = (
    <div className={`loading-state ${className}`}>
      <Loader2 className="loading-state__spinner" />
      {message && <p className="loading-state__message">{message}</p>}
      {debugOverlay}
    </div>
  )

  if (fullScreen) {
    return <div className="loading-state--fullscreen">{content}</div>
  }

  return <Card padding="lg">{content}</Card>
}
