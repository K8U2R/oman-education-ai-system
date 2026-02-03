/**
 * ErrorState Component - مكون حالة الخطأ
 * Reusable error state with icon, message, and actions
 */

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, Button } from '../../common'

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  onGoBack?: () => void
  retryLabel?: string
  goBackLabel?: string
  fullScreen?: boolean
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'خطأ',
  message,
  onRetry,
  onGoBack,
  retryLabel = 'إعادة المحاولة',
  goBackLabel = 'العودة',
  fullScreen = false,
  className = '',
}) => {
  return (
    <div className={`error-state ${fullScreen ? 'error-state--fullscreen' : ''} ${className}`}>
      <Card className="error-state__card">
        <AlertTriangle className="error-state__icon" />
        <h2 className="error-state__title">{title}</h2>
        <p className="error-state__message">{message}</p>

        {(onRetry || onGoBack) && (
          <div className="error-state__actions">
            {onRetry && (
              <Button onClick={onRetry} variant="primary">
                {retryLabel}
              </Button>
            )}
            {onGoBack && (
              <Button onClick={onGoBack} variant="outline">
                {goBackLabel}
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
