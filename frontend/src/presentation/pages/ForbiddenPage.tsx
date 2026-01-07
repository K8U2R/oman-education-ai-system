/**
 * Forbidden Page - صفحة محظورة
 *
 * صفحة تظهر عندما لا يملك المستخدم الصلاحيات للوصول
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/common'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader } from './components/PageHeader'
import './ForbiddenPage.scss'

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="forbidden-page">
      <PageHeader title="محظور" description="ليس لديك الصلاحيات للوصول إلى هذا المورد" />

      <div className="forbidden-page__content">
        <div className="forbidden-page__icon">
          <ShieldX className="w-24 h-24 text-error-500" />
        </div>

        <h1 className="forbidden-page__title">الوصول محظور</h1>
        <p className="forbidden-page__message">
          عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذا المورد. يرجى التواصل مع المسؤول إذا كنت
          تعتقد أن هذا خطأ.
        </p>

        <div className="forbidden-page__actions">
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            leftIcon={<Home className="w-5 h-5" />}
          >
            العودة للوحة التحكم
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            العودة للخلف
          </Button>
        </div>
      </div>
    </div>
  )
}
