import React from 'react';
import { Crown, Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const SubscriptionInfo: React.FC = () => {
  const subscription = {
    plan: 'Free',
    features: [
      '5 مشاريع',
      '10GB تخزين',
      'دعم أساسي',
    ],
    limits: {
      projects: 5,
      storage: 10,
      aiRequests: 100,
    },
  };

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['5 مشاريع', '10GB تخزين', 'دعم أساسي'],
    },
    {
      name: 'Pro',
      price: 29,
      features: ['مشاريع غير محدودة', '100GB تخزين', 'دعم أولوية', 'AI متقدم'],
    },
    {
      name: 'Enterprise',
      price: 99,
      features: ['كل شيء في Pro', 'تخزين غير محدود', 'دعم 24/7', 'API مخصص'],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          الاشتراك الحالي
        </h3>
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-xl mb-1">{subscription.plan}</h4>
              <p className="text-sm text-ide-text-secondary">الخطة الحالية</p>
            </div>
            <Badge variant="info" size="lg">
              نشط
            </Badge>
          </div>
          <div className="space-y-2">
            {subscription.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">الخطط المتاحة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant={plan.name === 'Pro' ? 'elevated' : 'default'}
              className={plan.name === 'Pro' ? 'border-ide-accent' : ''}
            >
              <div className="text-center mb-4">
                <h4 className="font-semibold text-lg mb-1">{plan.name}</h4>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-sm text-ide-text-secondary">$/شهر</span>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.name === 'Pro' ? 'primary' : 'outline'}
                className="w-full"
              >
                {plan.name === subscription.plan ? 'الخطة الحالية' : 'ترقية'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionInfo;

