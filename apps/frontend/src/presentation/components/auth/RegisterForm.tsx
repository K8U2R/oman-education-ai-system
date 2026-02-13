import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { authService } from '@/features/user-authentication-management'
import { Button, Input } from '../common'
import { OAuthButtons } from '@/features/user-authentication-management/components/OAuthButtons'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useModalStore } from '@/stores/useModalStore'
import { useTranslation } from 'react-i18next'
import styles from './RegisterForm.module.scss'

interface RegisterFormProps {
    onSuccess?: () => void
    isModal?: boolean
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, isModal = false }) => {
    const { t } = useTranslation()
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
        if (!formData.email) newErrors.email = t('auth.validation.email_required')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('auth.validation.email_invalid')

        if (!formData.password) newErrors.password = t('auth.validation.password_required')
        else if (formData.password.length < 8) newErrors.password = t('auth.validation.password_min')

        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('auth.validation.password_mismatch')
        if (!formData.firstName) newErrors.firstName = t('auth.validation.first_name_required')
        if (!formData.lastName) newErrors.lastName = t('auth.validation.last_name_required')
        if (!formData.acceptTerms) newErrors.acceptTerms = t('auth.validation.terms_required')
        if (!formData.acceptPrivacyPolicy) newErrors.acceptPrivacyPolicy = t('auth.validation.privacy_required')

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
                            message: t('auth.success.check_email'),
                            requiresVerification: true,
                        },
                    })
                }
            }, 3000)
        } catch (err: unknown) {
            const error = err as { response?: { data?: { detail?: string } } }
            setErrors({
                submit: error.response?.data?.detail || t('auth.unexpected_error'),
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
            <div className={styles.successWrapper}>
                <CheckCircle2 className={styles.successIcon} />
                <h2 className={styles.successTitle}>{t('auth.success.account_created')}</h2>
                <p className={styles.successMessage}>{t('auth.success.check_email')}</p>
                {!isModal && (
                    <Button variant="outline" onClick={() => navigate(ROUTES.VERIFY_EMAIL)} fullWidth>
                        {t('auth.success.go_to_verify')}
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className={!isModal ? styles.container : styles.form}>
            {errors.submit && (
                <div className={styles.error}>
                    <AlertCircle size={20} /> {errors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <Input label={t('auth.first_name_label')} value={formData.firstName} onChange={(e: any) => handleChange('firstName', e.target.value)} error={errors.firstName} required disabled={isLoading} />
                    <Input label={t('auth.last_name_label')} value={formData.lastName} onChange={(e: any) => handleChange('lastName', e.target.value)} error={errors.lastName} required disabled={isLoading} />
                </div>

                <Input label={t('auth.email_label')} type="email" value={formData.email} onChange={(e: any) => handleChange('email', e.target.value)} error={errors.email} required disabled={isLoading} />

                <Input label={t('auth.password_label')} type="password" value={formData.password} onChange={(e: any) => handleChange('password', e.target.value)} error={errors.password} required disabled={isLoading} />
                <Input label={t('auth.confirm_password_label')} type="password" value={formData.confirmPassword} onChange={(e: any) => handleChange('confirmPassword', e.target.value)} error={errors.confirmPassword} required disabled={isLoading} />

                <div className={styles.checkboxGroup}>
                    <label>
                        <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => handleChange('acceptTerms', e.target.checked)} />
                        <span>{t('auth.terms')}</span>
                    </label>
                    <label>
                        <input type="checkbox" checked={formData.acceptPrivacyPolicy} onChange={(e) => handleChange('acceptPrivacyPolicy', e.target.checked)} />
                        <span>{t('auth.privacy')}</span>
                    </label>
                </div>
                {errors.acceptTerms && <p className={styles.errorText}>{errors.acceptTerms}</p>}

                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} fullWidth>
                    {t('auth.register_btn')}
                </Button>
            </form>

            <div className={styles.oauth}>
                <OAuthButtons isLoading={isLoading} />
            </div>

            {!isModal && (
                <p className={styles.footer}>
                    {t('auth.have_account')}{' '}
                    <button
                        type="button"
                        onClick={() => openModal('login')}
                    >
                        {t('auth.sign_in')}
                    </button>
                </p>
            )}
        </div>
    )
}
