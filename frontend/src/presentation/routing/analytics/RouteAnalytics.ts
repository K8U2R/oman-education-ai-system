/**
 * Route Analytics - تحليلات المسارات
 *
 * نظام تحليلات متقدم لتتبع استخدام المسارات
 */

import { RouteMetadata } from '../types'

export interface RouteAnalyticsEvent {
  path: string
  title?: string
  category?: string
  action?: string
  timestamp: number
  duration?: number
  referrer?: string
  userId?: string
}

class RouteAnalytics {
  private events: RouteAnalyticsEvent[] = []
  private startTimes: Map<string, number> = new Map()
  private maxEvents = 100 // Maximum events to keep in memory

  /**
   * Track route view
   */
  trackRouteView(path: string, metadata?: RouteMetadata, userId?: string): void {
    const startTime = this.startTimes.get(path)
    const duration = startTime ? Date.now() - startTime : undefined

    const event: RouteAnalyticsEvent = {
      path,
      title: metadata?.title,
      category: metadata?.analytics?.category || 'Navigation',
      action: metadata?.analytics?.action || 'View Page',
      timestamp: Date.now(),
      duration,
      referrer: document.referrer || undefined,
      userId,
    }

    this.events.push(event)

    // Keep only last N events
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }

    // Track start time for next navigation
    this.startTimes.set(path, Date.now())

    // Send to analytics service (if configured)
    this.sendToAnalytics(event)
  }

  /**
   * Track route navigation
   */
  trackNavigation(from: string, to: string, metadata?: RouteMetadata): void {
    const event: RouteAnalyticsEvent = {
      path: to,
      title: metadata?.title,
      category: metadata?.analytics?.category || 'Navigation',
      action: 'Navigate',
      timestamp: Date.now(),
      referrer: from,
    }

    this.events.push(event)

    // Keep only last N events
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }

    this.sendToAnalytics(event)
  }

  /**
   * Get analytics events
   */
  getEvents(): RouteAnalyticsEvent[] {
    return [...this.events]
  }

  /**
   * Get events for a specific path
   */
  getEventsForPath(path: string): RouteAnalyticsEvent[] {
    return this.events.filter(event => event.path === path)
  }

  /**
   * Get most visited routes
   */
  getMostVisitedRoutes(limit: number = 10): Array<{ path: string; count: number }> {
    const routeCounts = new Map<string, number>()

    this.events.forEach(event => {
      const count = routeCounts.get(event.path) || 0
      routeCounts.set(event.path, count + 1)
    })

    return Array.from(routeCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  /**
   * Get average time spent on route
   */
  getAverageTimeOnRoute(path: string): number | null {
    const routeEvents = this.getEventsForPath(path).filter(event => event.duration !== undefined)

    if (routeEvents.length === 0) {
      return null
    }

    const totalDuration = routeEvents.reduce((sum, event) => sum + (event.duration || 0), 0)

    return totalDuration / routeEvents.length
  }

  /**
   * Clear analytics events
   */
  clear(): void {
    this.events = []
    this.startTimes.clear()
  }

  /**
   * Send event to analytics service
   */
  private sendToAnalytics(event: RouteAnalyticsEvent): void {
    // Google Analytics
    interface WindowWithGtag extends Window {
      gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void
    }
    const windowWithGtag = window as WindowWithGtag
    if (typeof window !== 'undefined' && windowWithGtag.gtag) {
      windowWithGtag.gtag('event', event.action || 'page_view', {
        page_path: event.path,
        page_title: event.title,
        event_category: event.category,
      })
    }

    // Custom analytics endpoint (if configured)
    const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT
    if (analyticsEndpoint) {
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(error => {
        // Use logging service instead of console.error
        import('@/infrastructure/services/logging.service').then(({ loggingService }) => {
          loggingService.error('Failed to send analytics event', error as Error)
        })
      })
    }
  }
}

export const routeAnalytics = new RouteAnalytics()
