/**
 * AdminStatsCard Component - Stats Card موحد
 *
 * Component موحد لعرض الإحصائيات في صفحات Admin
 */

import React from 'react'
import { Card } from '@/presentation/components/common'
import { TrendingUp, TrendingDown } from 'lucide-react'



export interface AdminStatsCardProps {
  /**
   * العنوان
   */
  title: string

  /**
   * القيمة
   */
  value: string | number

  /**
   * الرمز
   */
  icon?: React.ReactNode

  /**
   * النوع (للألوان)
   */
  variant?: 'default' | 'success' | 'warning' | 'danger'

  /**
   * الاتجاه (للاتجاهات)
   */
  trend?: {
    value: number
    direction: 'up' | 'down'
  }

  /**
   * حالة التحميل
   */
  loading?: boolean

  /**
   * دالة النقر (اختياري)
   */
  onClick?: () => void

  /**
   * className إضافي
   */
  className?: string
}

/**
 * AdminStatsCard Component
 *
 * Component موحد لعرض الإحصائيات
 *
 * @example
 * ```tsx
 * <AdminStatsCard
 *   title="إجمالي المستخدمين"
 *   value={1000}
 *   icon={<Users />}
 *   variant="success"
 *   trend={{ value: 10, direction: 'up' }}
 * />
 * ```
 */
export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  icon,
  variant = 'default',
  trend,
  loading = false,
  onClick,
  className = '',
}) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('ar-EG') : value

  const trendIcon = trend?.direction === 'up' ? <TrendingUp /> : <TrendingDown />
  const trendClass =
    trend?.direction === 'up' ? 'admin-stats-card__trend--up' : 'admin-stats-card__trend--down'

  return (
    <Card
      className={`admin-stats-card admin-stats-card--${variant} ${className}`}
      onClick={onClick}
      hoverable={!!onClick}
      padding="lg"
    >
      <div className="admin-stats-card__content">
        {icon && <div className="admin-stats-card__icon">{icon}</div>}
        <div className="admin-stats-card__info">
          <h3 className="admin-stats-card__title">{title}</h3>
          {loading ? (
            <div className="admin-stats-card__skeleton" />
          ) : (
            <p className="admin-stats-card__value">{formattedValue}</p>
          )}
          {trend && (
            <div className={`admin-stats-card__trend ${trendClass}`}>
              {trendIcon}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
