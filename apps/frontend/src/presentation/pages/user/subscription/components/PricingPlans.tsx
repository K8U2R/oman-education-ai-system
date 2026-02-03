import React from 'react'
import { Check } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'

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

interface PricingPlansProps {
  plans: SubscriptionPlan[]
  currentPlanId: string
}

/**
 * PricingPlans - المكون المسؤول عن عرض باقات الاشتراك المتاحة
 */
export const PricingPlans: React.FC<PricingPlansProps> = ({ plans, currentPlanId }) => {
  return (
    <div className="subscription-page__plans">
      {plans.map(plan => (
        <Card
          key={plan.id}
          className={`subscription-page__plan ${plan.popular ? 'subscription-page__plan--popular' : ''} ${currentPlanId === plan.id ? 'subscription-page__plan--active' : ''}`}
        >
          {plan.popular && <div className="subscription-page__popular-badge">الأكثر شعبية</div>}
          {currentPlanId === plan.id && (
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
            disabled={currentPlanId === plan.id}
          >
            {currentPlanId === plan.id
              ? 'الباقة الحالية'
              : plan.price === 0
                ? 'ابدأ الآن'
                : 'اشترك الآن'}
          </Button>
        </Card>
      ))}
    </div>
  )
}
