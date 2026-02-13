/**
 * ErrorState Component
 * 
 * Standardized error feedback component with built-in styling.
 */

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'
import './_error-state.scss'

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
        <Card padding="none" className={`error-state ${className}`}>
            <div className="error-state__content">
                <AlertCircle className="error-state__icon" />
                <h3 className="error-state__title">{title}</h3>
                <p className="error-state__message">{message}</p>
                {onRetry && (
                    <div className="error-state__actions">
                        <Button variant="primary" onClick={onRetry} leftIcon={<RefreshCw />}>
                            إعادة المحاولة
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}
