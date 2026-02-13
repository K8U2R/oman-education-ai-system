/**
 * LoadingState Component - مكون حالة التحميل
 * Reusable loading state with spinner and message
 */

import React from 'react'
import { motion } from 'framer-motion'

export interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  className?: string
}

import { DevDiagnosticsOverlay } from '../DevDiagnosticsOverlay/DevDiagnosticsOverlay'

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'جاري التحميل...',
  size = 'md',
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'loading-state--sm',
    md: 'loading-state--md',
    lg: 'loading-state--lg',
  }



  return (
    <div
      className={`loading-state ${fullScreen ? 'loading-state--fullscreen' : ''} ${sizeClasses[size]} ${className}`}
    >
      <motion.div
        className="loading-state__spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {message && <p className="loading-state__message">{message}</p>}

      <DevDiagnosticsOverlay />
    </div>
  )
}
