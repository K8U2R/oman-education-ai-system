import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Check, Crown, Zap, Infinity } from 'lucide-react'
import { authService } from '@/application'
import { Card, Button } from '../../components/common'
import './SubscriptionPage.scss'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  period: string
  features: string[]
  popular?: boolean
  icon: React.ReactNode
  color: string
}

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPlan] = useState<string>('free')

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login')
        return
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [navigate])

  const plans: SubscriptionPlan[] = [
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="subscription-page">
      <div className="subscription-page__header">
        <h1 className="subscription-page__title">الاشتراكات والباقات</h1>
        <p className="subscription-page__subtitle">اختر الباقة المناسبة لك</p>
      </div>

      <div className="subscription-page__plans">
        {plans.map(plan => (
          <Card
            key={plan.id}
            className={`subscription-page__plan ${plan.popular ? 'subscription-page__plan--popular' : ''} ${currentPlan === plan.id ? 'subscription-page__plan--active' : ''}`}
          >
            {plan.popular && <div className="subscription-page__popular-badge">الأكثر شعبية</div>}
            {currentPlan === plan.id && (
              <div className="subscription-page__active-badge">الباقة الحالية</div>
            )}

            <div
              className={`subscription-page__plan-icon subscription-page__plan-icon--${plan.color}`}
            >
              {plan.icon}
            </div>

            <h3 className="subscription-page__plan-name">{plan.name}</h3>

            <div className="subscription-page__plan-price">
              <span className="subscription-page__plan-amount">
                {plan.price === 0 ? 'مجاني' : `${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="subscription-page__plan-period">/ {plan.period}</span>
              )}
            </div>

            <ul className="subscription-page__plan-features">
              {plan.features.map((feature, index) => (
                <li key={index} className="subscription-page__plan-feature">
                  <Check className="subscription-page__plan-feature-icon" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? 'primary' : 'outline'}
              size="md"
              className="subscription-page__plan-button"
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id
                ? 'الباقة الحالية'
                : plan.price === 0
                  ? 'ابدأ الآن'
                  : 'اشترك الآن'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Usage Stats */}
      <Card className="subscription-page__usage">
        <div className="subscription-page__usage-header">
          <CreditCard className="subscription-page__usage-icon" />
          <h3 className="subscription-page__usage-title">استخدامك الحالي</h3>
        </div>
        <div className="subscription-page__usage-content">
          <div className="subscription-page__usage-item">
            <p className="subscription-page__usage-label">الدروس المستخدمة</p>
            <p className="subscription-page__usage-value">2 / 5</p>
            <div className="subscription-page__usage-bar">
              <div className="subscription-page__usage-bar-fill" style={{ width: '40%' }} />
            </div>
          </div>
          <div className="subscription-page__usage-item">
            <p className="subscription-page__usage-label">التخزين المستخدم</p>
            <p className="subscription-page__usage-value">250 MB / 1 GB</p>
            <div className="subscription-page__usage-bar">
              <div className="subscription-page__usage-bar-fill" style={{ width: '25%' }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SubscriptionPage
