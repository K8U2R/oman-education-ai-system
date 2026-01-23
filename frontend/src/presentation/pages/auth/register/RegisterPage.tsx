import React from 'react'
import { UserPlus } from 'lucide-react'
import { Card } from '../../../components/common'
import { RegisterForm } from '../../../components/auth/RegisterForm'

const RegisterPage: React.FC = () => {
  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h1>
        <p className="text-gray-600">انضم إلينا وابدأ رحلتك التعليمية اليوم</p>
      </div>

      <RegisterForm />
    </Card>
  )
}

export default RegisterPage
