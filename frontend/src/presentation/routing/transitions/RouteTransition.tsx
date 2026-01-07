/**
 * Route Transition - انتقالات المسارات
 *
 * مكون لإضافة انتقالات سلسة بين المسارات
 */

import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { analyticsService } from '@/application'
import './RouteTransition.scss'

interface RouteTransitionProps {
  children: React.ReactNode
  transitionType?: 'fade' | 'slide' | 'scale' | 'none'
  duration?: number
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  transitionType = 'fade',
  duration = 300,
}) => {
  const location = useLocation()

  // Track page view on route change
  useEffect(() => {
    analyticsService.trackPageView(location.pathname, document.title)
  }, [location.pathname])

  // Disable transition for now to ensure content is visible
  // TODO: Re-enable transitions after fixing the visibility issue
  if (transitionType === 'none') {
    return <>{children}</>
  }

  // Always show content immediately without transition delays
  return (
    <div
      className={`route-transition route-transition--${transitionType} route-transition--entered`}
      style={{ '--transition-duration': `${duration}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
