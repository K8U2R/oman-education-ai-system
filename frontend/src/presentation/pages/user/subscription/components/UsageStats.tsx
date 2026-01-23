import React from 'react'
import { CreditCard } from 'lucide-react'
import { Card } from '@/presentation/components/common'

/**
 * UsageStats - المكون المسؤول عن عرض إحصائيات استهلاك الموارد (الدروس والتخزين)
 */
export const UsageStats: React.FC = () => {
  return (
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
  )
}
