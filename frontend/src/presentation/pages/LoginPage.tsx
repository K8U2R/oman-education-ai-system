import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'
import { authService, ValidationService, ErrorBoundaryService } from '@/application'
import { Button, Card, Input } from '../components/common'
import './LoginPage.scss'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Debug: Log component render
  useEffect(() => {
    if (import.meta.env.DEV) {
      // Component render logging in development only
    }
  }, [])

  // Check for OAuth error from navigation state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const oauthError = urlParams.get('error_description')

    if (oauthError) {
      const decodedError = decodeURIComponent(oauthError.replace(/\+/g, ' '))
      setError(`فشل تسجيل الدخول عبر OAuth: ${decodedError}`)
      // Clean URL after a delay
      setTimeout(() => {
        window.history.replaceState({}, '', '/login')
      }, 100)
    }

    // Check for registration success message
    const state = location.state as { message?: string; requiresVerification?: boolean } | null
    if (state?.message) {
      setError('') // Clear any errors
      setSuccess(state.message)
      // Clear message after 5 seconds
      setTimeout(() => {
        setSuccess('')
        window.history.replaceState({}, '', '/login')
      }, 5000)
    }
  }, [location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    // Validation
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور')
      setIsLoading(false)
      return
    }

    if (!ValidationService.validateEmail(email)) {
      setError('البريد الإلكتروني غير صحيح')
      setIsLoading(false)
      return
    }

    try {
      await authService.login({ email, password })
      // Navigate to dashboard or return URL
      const returnUrl = (location.state as { from?: string } | null)?.from || '/dashboard'
      navigate(returnUrl, { replace: true })
    } catch (err: unknown) {
      const errorMessage = ErrorBoundaryService.handleApiError(err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Card className="login-page__card">
        <div className="login-page__header">
          <div className="login-page__icon-wrapper">
            <LogIn className="login-page__icon" />
          </div>
          <h1 className="login-page__title">تسجيل الدخول</h1>
          <p className="login-page__description">مرحباً بعودتك! سجل دخولك للوصول إلى حسابك</p>
        </div>

        {error && (
          <div className="login-page__error">
            <div className="login-page__error-content">
              <AlertCircle className="login-page__error-icon" />
              <div className="login-page__error-text">
                <p className="login-page__error-title">فشل تسجيل الدخول</p>
                <p className="login-page__error-message">{error}</p>
              </div>
            </div>
            {error.includes('Unable to exchange external code') && (
              <div className="login-page__oauth-help">
                <p className="login-page__oauth-help-title">💡 المشكلة في إعدادات OAuth0</p>
                <p className="login-page__oauth-help-text">
                  تحقق من Client Secret في Supabase و Redirect URI في Google Cloud Console
                </p>
                <p className="login-page__oauth-help-code">
                  Redirect URI المطلوب:{' '}
                  <code>https://arnudllmjhghxmnrfwik.supabase.co/auth/v1/callback</code>
                </p>
                <p className="login-page__oauth-help-link">
                  📖 راجع: <code>OAUTH_QUICK_FIX.md</code> للحل السريع
                </p>
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="login-page__success">
            <p className="login-page__success-message">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-page__form">
          <div className="login-page__field">
            <Input
              type="email"
              label="البريد الإلكتروني"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isLoading}
              error={error && !email ? 'البريد الإلكتروني مطلوب' : undefined}
            />
          </div>

          <div className="login-page__field">
            <Input
              type="password"
              label="كلمة المرور"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={isLoading}
              error={error && !password ? 'كلمة المرور مطلوبة' : undefined}
            />
          </div>

          <div className="login-page__options">
            <label className="login-page__remember">
              <input type="checkbox" className="login-page__checkbox" />
              <span className="login-page__remember-text">تذكرني</span>
            </label>
            <Link to="/forgot-password" className="login-page__forgot-link">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} fullWidth>
            تسجيل الدخول
          </Button>
        </form>

        <div className="login-page__oauth">
          <div className="login-page__divider">
            <div className="login-page__divider-line" />
            <span className="login-page__divider-text">أو</span>
            <div className="login-page__divider-line" />
          </div>

          <div className="login-page__oauth-buttons">
            <button
              type="button"
              onClick={() => {
                const oauthUrl = authService.getOAuthUrl(
                  'google',
                  `${window.location.origin}/auth/callback`
                )
                window.location.href = oauthUrl
              }}
              disabled={isLoading}
              className="login-page__oauth-button"
            >
              <svg className="login-page__oauth-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="login-page__oauth-text">Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const oauthUrl = authService.getOAuthUrl(
                  'github',
                  `${window.location.origin}/auth/callback`
                )
                window.location.href = oauthUrl
              }}
              disabled={isLoading}
              className="login-page__oauth-button"
            >
              <svg className="login-page__oauth-icon" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="login-page__oauth-text">GitHub</span>
            </button>
          </div>
        </div>

        <p className="login-page__register-link">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="login-page__register-link-text">
            إنشاء حساب جديد
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default LoginPage
