/**
 * Unauthorized Page - صفحة غير مصرح
 *
 * صفحة تظهر عندما لا يملك المستخدم الصلاحيات للوصول
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/common'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader } from '../pages/components/PageHeader'
import './UnauthorizedPage.scss'

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="unauthorized-page">
      <PageHeader title="غير مصرح" description="ليس لديك الصلاحيات للوصول إلى هذه الصفحة" />

      <div className="unauthorized-page__content">
        <div className="unauthorized-page__icon">
          <AlertCircle className="w-24 h-24 text-error-500" />
        </div>

        <h1 className="unauthorized-page__title">غير مصرح بالوصول</h1>
        <p className="unauthorized-page__message">
          عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة. يرجى التواصل مع المسؤول إذا كنت
          تعتقد أن هذا خطأ.
        </p>

        <div className="unauthorized-page__actions">
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
