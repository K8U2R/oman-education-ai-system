import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'
import { ValidationService, ErrorBoundaryService } from '@/application'
import { authService } from '@/features/user-authentication-management'
import { Button, Input } from '../common'
import { OAuthButtons } from '@/features/user-authentication-management/components/OAuthButtons'

import { LoadingOverlay } from '@/presentation/routing/guards/components/LoadingOverlay'

interface LoginFormProps {
    onSuccess?: () => void
    isModal?: boolean
    onForgotPassword?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, isModal = false, onForgotPassword }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Handle OAuth errors from URL if present (mostly for Page view, but safe to keep)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const oauthError = urlParams.get('error_description')
        if (oauthError) {
            const decodedError = decodeURIComponent(oauthError.replace(/\+/g, ' '))
            setError(`فشل تسجيل الدخول عبر OAuth: ${decodedError}`)
        }

        const state = location.state as { message?: string } | null
        if (state?.message) {
            setSuccess(state.message)
        }
    }, [location])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

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
            if (onSuccess) {
                onSuccess()
            } else {
                const returnUrl = (location.state as { from?: string } | null)?.from || '/dashboard'
                navigate(returnUrl, { replace: true })
            }
        } catch (err: unknown) {
            const errorMessage = ErrorBoundaryService.handleApiError(err)
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={!isModal ? "login-page__form-container" : ""}>
            {isLoading && <LoadingOverlay message="جاري تسجيل الدخول..." context="Auth" />}
            {!isModal && (
                <div className="login-page__header">
                    <div className="login-page__icon-wrapper">
                        <LogIn className="login-page__icon" />
                    </div>
                    <h1 className="login-page__title">تسجيل الدخول</h1>
                    <p className="login-page__description">مرحباً بعودتك! سجل دخولك للوصول إلى حسابك</p>
                </div>
            )}

            {error && (
                <div className="login-page__error mb-4">
                    <div className="login-page__error-content flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {success && (
                <div className="login-page__success mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="login-page__form space-y-4">
                <Input
                    type="email"
                    label="البريد الإلكتروني"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={isLoading}
                />

                <Input
                    type="password"
                    label="كلمة المرور"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                />

                <div className="login-page__options flex justify-between items-center">
                    <label className="login-page__remember flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-border-primary text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-text-secondary">تذكرني</span>
                    </label>
                    {onForgotPassword ? (
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="text-sm text-primary-600 hover:text-primary-500 hover:underline"
                        >
                            نسيت كلمة المرور؟
                        </button>
                    ) : (
                        <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500 hover:underline">
                            نسيت كلمة المرور؟
                        </Link>
                    )}
                </div>

                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} fullWidth>
                    تسجيل الدخول
                </Button>
            </form>

            <div className="login-page__oauth mt-6">
                <div className="relative flex justify-center text-sm mb-4">
                    <span className="bg-bg-surface px-2 text-text-secondary">أو</span>
                </div>
                <OAuthButtons isLoading={isLoading} />
            </div>

            {!isModal && (
                <p className="mt-6 text-center text-sm text-text-secondary">
                    ليس لديك حساب؟{' '}
                    <Link to="/register" className="text-primary-600 font-medium hover:text-primary-500 hover:underline">
                        إنشاء حساب جديد
                    </Link>
                </p>
            )}
        </div>
    )
}
