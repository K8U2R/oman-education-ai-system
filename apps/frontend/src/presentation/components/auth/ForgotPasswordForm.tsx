import React, { useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service'
import { Button, Input } from '../common'
import { useModalStore } from '@/stores/useModalStore'
import { ValidationService } from '@/application'

interface ForgotPasswordFormProps {
    onSuccess?: () => void
    isModal?: boolean
    onBackToLogin?: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess, isModal = false, onBackToLogin }) => {
    const openModal = useModalStore(state => state.open)
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!email) {
            setError('البريد الإلكتروني مطلوب')
            return
        }

        if (!ValidationService.validateEmail(email)) {
            setError('البريد الإلكتروني غير صحيح')
            return
        }

        setIsLoading(true)

        try {
            await authService.forgotPassword(email)
            setSuccess(true)
            if (onSuccess) onSuccess()
        } catch (err: unknown) {
            // Handle error gracefully
            setError('فشل إرسال رابط إعادة التعيين. يرجى التحقق من البريد الإلكتروني والمحاولة مرة أخرى.')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-gray-600 mb-6">
                    لقد أرسلنا تعليمات إعادة تعيين كلمة المرور إلى <strong>{email}</strong>
                </p>
                <div className="flex flex-col gap-3">
                    <Button variant="outline" onClick={() => window.open('https://mail.google.com', '_blank')}>
                        فتح البريد الإلكتروني
                    </Button>
                    {onBackToLogin && (
                        <button onClick={onBackToLogin} className="text-sm text-gray-500 hover:text-gray-900">
                            العودة لتسجيل الدخول
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={!isModal ? "w-full max-w-md mx-auto" : ""}>
            {!isModal && (
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">نسيت كلمة المرور؟</h1>
                    <p className="text-gray-600 mt-2">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة حسابك</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <Input
                    label="البريد الإلكتروني"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                />

                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
                    إرسال رابط إعادة التعيين
                </Button>

                <div className="text-center">
                    {onBackToLogin ? (
                        <button type="button" onClick={onBackToLogin} className="text-sm text-gray-600 hover:text-primary-600 flex items-center justify-center gap-1 mx-auto">
                            <ArrowRight className="w-4 h-4" />
                            العودة لتسجيل الدخول
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => openModal('login')}
                            className="text-sm text-gray-600 hover:text-primary-600 flex items-center justify-center gap-1"
                        >
                            <ArrowRight className="w-4 h-4" />
                            العودة لتسجيل الدخول
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
