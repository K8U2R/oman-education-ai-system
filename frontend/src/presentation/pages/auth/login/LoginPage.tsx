import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { LogIn, AlertTriangle } from 'lucide-react'
import { Card } from '../../../components/common'
import { LoginForm } from '../../../components/auth/LoginForm'

/**
 * LoginPage - صفحة تسجيل الدخول
 * 
 * Standard page view for user authentication.
 */
const LoginPage: React.FC = () => {
    // Law 08: Visual Error Handling
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');
    const reason = searchParams.get('reason');

    return (
        <Card className="w-full max-w-md mx-auto">
            {error && (
                <div
                    className="mb-6 p-4 rounded-xl border flex items-start gap-3 shadow-sm transition-all duration-300 bg-surface border-error text-text-primary"
                    dir="rtl"
                >
                    <div className="p-1 rounded-full bg-error/10">
                        <AlertTriangle className="w-5 h-5 text-error" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-error">
                            فشل تسجيل الدخول
                        </h3>
                        <p className="text-xs mt-1 text-text-secondary">
                            {error === 'oauth_failed' ? 'تعذر إتمام المصادقة مع Google. يرجى المحاولة لاحقاً.' : 'حدث خطأ غير متوقع أثناء الدخول.'}
                        </p>
                        {reason && (
                            <code className="block mt-2 text-[10px] px-2 py-1 rounded font-mono border bg-error/5 border-error/10 text-error">
                                {reason}
                            </code>
                        )}
                    </div>
                </div>
            )}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">تسجيل الدخول</h1>
                <p className="text-text-secondary">مرحباً بعودتك! سجل دخولك للوصول إلى حسابك</p>
            </div>

            <LoginForm />
        </Card>
    )
}

export default LoginPage
