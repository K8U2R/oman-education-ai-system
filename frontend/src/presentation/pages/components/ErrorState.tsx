/**
 * ErrorState Component - مكون حالة الخطأ
 *
 * مكون مشترك لعرض حالة الخطأ
 */

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'
import './ErrorState.scss'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ',
  message = 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
  onRetry,
  className = '',
}) => {
  return (
    <Card padding="lg" className={`error-state ${className}`}>
      <div className="error-state__content">
        <AlertCircle className="error-state__icon" />
        <h3 className="error-state__title">{title}</h3>
        <p className="error-state__message">{message}</p>
        {onRetry && (
          <Button variant="primary" onClick={onRetry} leftIcon={<RefreshCw />}>
            إعادة المحاولة
          </Button>
        )}
      </div>
    </Card>
  )
}
