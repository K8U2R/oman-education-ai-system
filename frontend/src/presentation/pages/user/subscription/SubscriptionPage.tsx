import React, { useState } from 'react'
import { Crown, Zap, Infinity } from 'lucide-react'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { LoadingState } from '@/presentation/pages/components'
import { PricingPlans, UsageStats } from './components'


/**
 * SubscriptionPage - صفحة الاشتراكات - النسخة المطورة
 */
const SubscriptionPage: React.FC = () => {
  const { canAccess, loadingState } = usePageAuth({
    requireAuth: true,
    autoRedirect: true,
  })

  const { isLoading } = usePageLoading({
    isLoading: !canAccess,
    message: 'جاري تحميل باقات الاشتراك...',
  })

  const [currentPlan] = useState<string>('free')

  const plans = [
    {
      id: 'free',
      name: 'المجاني',
      price: 0,
      currency: 'ر.ع',
      period: 'شهري',
      features: [
        'وصول إلى الدروس الأساسية',
        '5 دروس شهرياً',
        'دعم المجتمع',
        'تخزين سحابي محدود (1GB)',
      ],
      icon: <Zap className="w-6 h-6" />,
      color: 'gray',
    },
    {
      id: 'premium',
      name: 'بريميوم',
      price: 9.99,
      currency: 'ر.ع',
      period: 'شهري',
      features: [
        'وصول غير محدود إلى جميع الدروس',
        'دروس غير محدودة',
        'دعم فني مخصص',
        'تخزين سحابي (50GB)',
        'ميزات الذكاء الاصطناعي المتقدمة',
        'إحصائيات تفصيلية',
      ],
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      color: 'primary',
    },
    {
      id: 'unlimited',
      name: 'غير محدود',
      price: 19.99,
      currency: 'ر.ع',
      period: 'شهري',
      features: [
        'كل ميزات بريميوم',
        'تخزين سحابي غير محدود',
        'دعم أولوية 24/7',
        'وصول مبكر للميزات الجديدة',
        'حسابات متعددة',
        'API مخصص',
      ],
      icon: <Infinity className="w-6 h-6" />,
      color: 'success',
    },
  ]

  if (isLoading || !canAccess || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={loadingState.loadingMessage} />
  }

  return (
    <div className="subscription-page">
      <div className="subscription-page__header">
        <h1 className="subscription-page__title">الاشتراكات والباقات</h1>
        <p className="subscription-page__subtitle">
          اختر الباقة المناسبة لك وابدأ رحلة التعلم الذكي
        </p>
      </div>

      <PricingPlans plans={plans} currentPlanId={currentPlan} />

      <UsageStats />
    </div>
  )
}

export default SubscriptionPage
