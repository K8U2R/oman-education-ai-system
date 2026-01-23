import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { authService } from '@/features/user-authentication-management'
import { Button, Input } from '../common'
import { OAuthButtons } from '@/features/user-authentication-management/components/OAuthButtons'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useModalStore } from '@/stores/useModalStore'

interface RegisterFormProps {
    onSuccess?: () => void
    isModal?: boolean
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, isModal = false }) => {
    const navigate = useNavigate()
    const openModal = useModalStore(state => state.open)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        username: '',
        acceptTerms: false,
        acceptPrivacyPolicy: false,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح'

        if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة'
        else if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'

        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
        if (!formData.firstName) newErrors.firstName = 'الاسم الأول مطلوب'
        if (!formData.lastName) newErrors.lastName = 'اسم العائلة مطلوب'
        if (!formData.acceptTerms) newErrors.acceptTerms = 'يجب الموافقة على الشروط'
        if (!formData.acceptPrivacyPolicy) newErrors.acceptPrivacyPolicy = 'يجب الموافقة على السياسة'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        setIsLoading(true)

        try {
            await authService.register({
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                username: formData.username || undefined,
                accept_terms: formData.acceptTerms,
                accept_privacy_policy: formData.acceptPrivacyPolicy,
            })

            setSuccess(true)
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate('/login', {
                        state: {
                            message: 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.',
                            requiresVerification: true,
                        },
                    })
                }
            }, 3000)
        } catch (err: unknown) {
            const error = err as { response?: { data?: { detail?: string } } }
            setErrors({
                submit: error.response?.data?.detail || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }; delete newErrors[field]; return newErrors;
            })
        }
    }

    if (success) {
        return (
            <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إنشاء الحساب بنجاح! ✅</h2>
                <p className="text-sm text-gray-600 mb-4">يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.</p>
                {!isModal && (
                    <Button variant="outline" onClick={() => navigate(ROUTES.VERIFY_EMAIL)} className="w-full">
                        الانتقال إلى التحقق
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className={`space-y-6 ${!isModal ? 'w-full' : ''}`}>
            {errors.submit && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm flex gap-2">
                    <AlertCircle className="w-5 h-5" /> {errors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="الاسم الأول" value={formData.firstName} onChange={(e: any) => handleChange('firstName', e.target.value)} error={errors.firstName} required disabled={isLoading} />
                    <Input label="اسم العائلة" value={formData.lastName} onChange={(e: any) => handleChange('lastName', e.target.value)} error={errors.lastName} required disabled={isLoading} />
                </div>

                <Input label="البريد الإلكتروني" type="email" value={formData.email} onChange={(e: any) => handleChange('email', e.target.value)} error={errors.email} required disabled={isLoading} />

                <Input label="كلمة المرور" type="password" value={formData.password} onChange={(e: any) => handleChange('password', e.target.value)} error={errors.password} required disabled={isLoading} />
                <Input label="تأكيد كلمة المرور" type="password" value={formData.confirmPassword} onChange={(e: any) => handleChange('confirmPassword', e.target.value)} error={errors.confirmPassword} required disabled={isLoading} />

                <div className="space-y-2 text-sm text-gray-600">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => handleChange('acceptTerms', e.target.checked)} />
                        <span>أوافق على الشروط والأحكام</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.acceptPrivacyPolicy} onChange={(e) => handleChange('acceptPrivacyPolicy', e.target.checked)} />
                        <span>أوافق على سياسة الخصوصية</span>
                    </label>
                </div>
                {errors.acceptTerms && <p className="text-xs text-red-600">{errors.acceptTerms}</p>}

                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} fullWidth>
                    إنشاء حساب
                </Button>
            </form>

            <div className="mt-4">
                <OAuthButtons isLoading={isLoading} />
            </div>

            {!isModal && (
                <p className="mt-6 text-center text-sm text-gray-600">
                    لديك حساب بالفعل؟{' '}
                    <button
                        type="button"
                        onClick={() => openModal('login')}
                        className="text-primary-600 font-medium hover:underline"
                    >
                        تسجيل الدخول
                    </button>
                </p>
            )}
        </div>
    )
}
