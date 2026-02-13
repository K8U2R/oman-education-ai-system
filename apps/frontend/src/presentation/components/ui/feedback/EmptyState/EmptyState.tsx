/**
 * EmptyState Component
 * 
 * Standardized empty state feedback with sovereign styling.
 */

import React from 'react'
import { Card, Button } from '@/presentation/components/common'
import './_empty-state.scss'

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
        icon?: React.ReactNode
    }
    className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <Card padding="none" className={`empty-state ${className}`}>
            <div className="empty-state__content">
                {icon && <div className="empty-state__icon">{icon}</div>}
                <h3 className="empty-state__title">{title}</h3>
                {description && <p className="empty-state__description">{description}</p>}
                {action && (
                    <div className="empty-state__actions">
                        <Button variant="primary" onClick={action.onClick} leftIcon={action.icon}>
                            {action.label}
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}
