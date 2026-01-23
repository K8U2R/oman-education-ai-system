import React from 'react'
import { Card } from '../../../components/common'
import { ForgotPasswordForm } from '../../../components/auth/ForgotPasswordForm'

const ForgotPasswordPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <ForgotPasswordForm />
            </Card>
        </div>
    )
}

export default ForgotPasswordPage
