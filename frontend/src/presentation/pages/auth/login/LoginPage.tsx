import React from 'react'
import { LogIn } from 'lucide-react'
import { Card } from '../../../components/common'
import { LoginForm } from '../../../components/auth/LoginForm'

/**
 * LoginPage - صفحة تسجيل الدخول
 * 
 * Standard page view for user authentication.
 */
const LoginPage: React.FC = () => {
    return (
        <Card className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
                <p className="text-gray-600">مرحباً بعودتك! سجل دخولك للوصول إلى حسابك</p>
            </div>

            <LoginForm />
        </Card>
    )
}

export default LoginPage
