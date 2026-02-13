
import React from 'react'
import { useAuthStore } from '@/features/user-authentication-management'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useNavigate } from 'react-router-dom'

export const DevDiagnosticsOverlay: React.FC = () => {
    const { error, reset } = useAuthStore()
    const navigate = useNavigate()

    const handleForceLogin = () => {
        reset()
        navigate(ROUTES.LOGIN, { replace: true })
        window.location.reload()
    }

    // Only render in DEV mode
    if (!import.meta.env.DEV) return null

    // Only render if there's an error or explicit need (for now, sticking to original logic: error or always if included)
    // The original logic was: isDev && (error || fullScreen). 
    // Since this component is now separate, we'll let the parent decide when to render it, 
    // or checks internal state. Here we assume it's rendered when appropriate.
    // Ideally, useAuthStore error is the main trigger.

    if (!error) return null;

    return (
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
                position: 'relative' // Ensure it stacks correctly
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
    )
}
