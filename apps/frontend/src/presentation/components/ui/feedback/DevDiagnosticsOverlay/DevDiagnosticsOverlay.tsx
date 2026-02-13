import React from 'react'
import { useAuthStore } from '@/features/user-authentication-management'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/domain/constants/routes.constants'
import './_dev-diagnostics.scss'

export const DevDiagnosticsOverlay: React.FC = () => {
    const isDev = import.meta.env.DEV
    const { error, reset, isInitialized, isAuthenticated, user } = useAuthStore()
    const navigate = useNavigate()

    if (!isDev) return null

    const handleForceLogin = () => {
        reset()
        navigate(ROUTES.LOGIN, { replace: true })
        window.location.reload()
    }

    const getMetricClass = (condition: boolean) =>
        `dev-diagnostics-overlay__metric-item-value dev-diagnostics-overlay__metric-item-value--${condition ? 'success' : 'warning'}`

    return (
        <div className="dev-diagnostics-overlay">
            <div className="dev-diagnostics-overlay__header">
                <span className="dev-diagnostics-overlay__title">
                    🛠️ DEV DEBUGGER
                </span>
                <span className="dev-diagnostics-overlay__badge">
                    Pages/LoadingState
                </span>
            </div>

            <h4 className="dev-diagnostics-overlay__section-title">
                Current Status
            </h4>

            <div className="dev-diagnostics-overlay__metrics">
                <div className="dev-diagnostics-overlay__metric-item">
                    <div className="dev-diagnostics-overlay__metric-item-label">Auth Init</div>
                    <div className={getMetricClass(isInitialized)}>
                        {isInitialized ? '✅ READY' : '❌ WAIT'}
                    </div>
                </div>

                <div className="dev-diagnostics-overlay__metric-item">
                    <div className="dev-diagnostics-overlay__metric-item-label">Authenticated</div>
                    <div className={getMetricClass(isAuthenticated)}>
                        {isAuthenticated ? '✅ YES' : '⚠️ NO'}
                    </div>
                </div>

                <div className="dev-diagnostics-overlay__metric-item">
                    <div className="dev-diagnostics-overlay__metric-item-label">User Data</div>
                    <div className={getMetricClass(!!user)}>
                        {user ? '✅ YES' : '⚠️ NO'}
                    </div>
                </div>
            </div>

            {error ? (
                <div className="dev-diagnostics-overlay__error-box">
                    <div className="dev-diagnostics-overlay__error-box-title">
                        Active Error
                    </div>
                    <div className="dev-diagnostics-overlay__error-box-message">
                        {typeof error === 'string' ? error : JSON.stringify(error)}
                    </div>
                    <div className="dev-diagnostics-overlay__error-box-hint">
                        💡 Hint: Check backend logs or network tab for 500/401 details.
                    </div>
                    {typeof error === 'string' && error.includes('500') && (
                        <div className="dev-diagnostics-overlay__error-box-hint" style={{ color: 'var(--color-warning)' }}>
                            👉 Server Error: Likely an issue with JIT User Creation or Database Connection.
                        </div>
                    )}
                </div>
            ) : (
                <div className="dev-diagnostics-overlay__success-box">
                    ✅ No active errors detected in auth store.
                </div>
            )}

            <div className="dev-diagnostics-overlay__actions">
                <button
                    onClick={handleForceLogin}
                    className="dev-diagnostics-overlay__btn dev-diagnostics-overlay__btn--danger"
                >
                    🚨 FORCE RESET
                </button>
                <button
                    onClick={() => (window.location.href = ROUTES.LOGIN)}
                    className="dev-diagnostics-overlay__btn dev-diagnostics-overlay__btn--secondary"
                >
                    🔄 LOGIN PAGE
                </button>
            </div>
        </div>
    )
}
