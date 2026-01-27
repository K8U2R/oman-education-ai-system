import React, { Suspense } from 'react'
import { useModalStore } from '@/stores/useModalStore'
import { ModalLayout } from './ModalLayout'
import { LoginForm } from '@/presentation/components/auth/LoginForm'
import { RegisterForm } from '@/presentation/components/auth/RegisterForm'

import { ForgotPasswordForm } from '@/presentation/components/auth/ForgotPasswordForm'
import { SettingsContent } from '@/presentation/components/layout/SettingsModal/SettingsModal'

// Lazy load heavy components
// const LoginPage = React.lazy(() => import('@/presentation/pages/auth/LoginPage').then(module => ({ default: module.LoginPage })))
// const RegisterPage = React.lazy(() => import('@/presentation/pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })))

export const ModalManager: React.FC = () => {
    const { isOpen, modalType, close, props } = useModalStore()
    const { open } = useModalStore()

    const handleLoginSuccess = () => {
        close()
        // Optional: Navigate to dashboard if not already there, or refresh state
        window.location.href = '/dashboard'
    }

    const handleRegisterSuccess = () => {
        // Maybe switch to login modal or show success message?
        // For now, let RegisterForm handle its own success state UI, then user closes.
    }

    const getModalContent = () => {
        switch (modalType) {
            case 'login':
                return (
                    <div className="p-1">
                        <LoginForm
                            onSuccess={handleLoginSuccess}
                            isModal={true}
                            onForgotPassword={() => open('forgot-password')}
                        />
                        <div className="mt-4 text-center text-sm text-text-secondary flex flex-col gap-2">
                            <div>
                                ليس لديك حساب؟{' '}
                                <button onClick={() => open('register')} className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                                    إنشاء حساب جديد
                                </button>
                            </div>
                        </div>
                    </div>
                )
            case 'register':
                return (
                    <div className="p-1">
                        <RegisterForm onSuccess={handleRegisterSuccess} isModal={true} />
                        <div className="mt-4 text-center text-sm text-text-secondary">
                            لديك حساب بالفعل؟{' '}
                            <button onClick={() => open('login')} className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                                تسجيل الدخول
                            </button>
                        </div>
                    </div>
                )
            case 'forgot-password':
                return (
                    <div className="p-1">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-text-primary">استعادة كلمة المرور</h2>
                        </div>
                        <ForgotPasswordForm isModal={true} onBackToLogin={() => open('login')} />
                    </div>
                )
            case 'settings':
                return (
                    <div className="h-[600px] w-full">
                        {/* Fixed height for settings to allow internal scrolling */}
                        <SettingsContent onClose={close} />
                    </div>
                )
            case 'confirmation':
                return (
                    <div className="text-center p-4">
                        <p className="mb-6 text-text-primary text-lg">{props.message || 'Are you sure?'}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => { props.onConfirm?.(); close(); }}
                                className="px-6 py-2 bg-error text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                تأكيد
                            </button>
                            <button
                                onClick={close}
                                className="px-6 py-2 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-tertiary/80 transition-colors"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    const getTitle = () => {
        switch (modalType) {
            case 'login': return 'تسجيل الدخول'
            case 'register': return 'إنشاء حساب جديد'
            case 'forgot-password': return 'استعادة الحساب'
            case 'settings': return 'الإعدادات'
            case 'confirmation': return 'تأكيد الإجراء'
            default: return 'Oman AI System'
        }
    }

    return (
        <ModalLayout isOpen={isOpen} onClose={close} title={getTitle()}>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">جاري التحميل...</div>}>
                {getModalContent()}
            </Suspense>
        </ModalLayout>
    )
}
