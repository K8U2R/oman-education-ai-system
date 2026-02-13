/**
 * LoadingState Component
 * 
 * Display loading indicators with optional full-screen overlay.
 * Includes DevDiagnosticsOverlay for development mode.
 */

import React from 'react'
import { Loader2 } from 'lucide-react'
import { Card } from '@/presentation/components/common'
import { DevDiagnosticsOverlay } from '../DevDiagnosticsOverlay'
import './_loading-state.scss'

interface LoadingStateProps {
    message?: string
    fullScreen?: boolean
    className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    message = 'جاري التحميل...',
    fullScreen = false,
    className = '',
}) => {
    const content = (
        <div className={`loading-state ${className}`}>
            <Loader2 className="loading-state__spinner" />
            {message && <p className="loading-state__message">{message}</p>}
            <DevDiagnosticsOverlay />
        </div>
    )

    if (fullScreen) {
        return <div className="loading-state--fullscreen">{content}</div>
    }

    return <Card padding="lg">{content}</Card>
}
