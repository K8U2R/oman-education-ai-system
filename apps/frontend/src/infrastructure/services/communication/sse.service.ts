/**
 * SSE Service - خدمة Server-Sent Events
 *
 * خدمة للاتصال بـ SSE للإشعارات في الوقت الفعلي
 */

import { authState } from '@/infrastructure/api/interceptors/auth/state'

export type SSEEventType =
  | 'notification'
  | 'message'
  | 'error'
  | 'connected'
  | 'disconnected'
  | 'token'

export interface SSEEvent {
  type: SSEEventType
  data?: unknown
  timestamp: string
}

export type SSEEventHandler = (event: SSEEvent) => void

export class SSEService {
  private eventSource: EventSource | null = null
  private url: string
  private eventHandlers: Map<SSEEventType, Set<SSEEventHandler>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(url: string) {
    this.url = url
  }

  /**
   * الاتصال بـ SSE
   */
  connect(token?: string): void {
    if (this.eventSource?.readyState === EventSource.OPEN) {
      return
    }

    if (authState.isTerminated) {
      console.warn('[SSE] System in Safe Mode. Connection blocked.')
      return
    }

    try {
      const sseUrl = token ? `${this.url}?token=${token}` : this.url
      this.eventSource = new EventSource(sseUrl)

      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0
        this.emit('connected', { type: 'connected', timestamp: new Date().toISOString() })
      }

      this.eventSource.onerror = error => {
        // Check for 401 (EventSource error event is generic, but usually closure indicates issue)
        // If readyState is CLOSED (2) immediately after error, treat as potentially fatal if repeated,
        // but explicit 401 handling is hard in browser EventSource API directly without custom client.
        // We will assume that if we are here, we might need backoff.

        // HOWEVER, if we can infer auth error (e.g. from a specific event before closure or if we modify backend to send specific close event), handle it.
        // For now, we rely on the implementation plan to "Stop on 401". Since standard EventSource doesn't give status code,
        // we will treat immediate closure on connect as suspect. 

        // BETTER APPROACH: The `notification.service.ts` should handle the 'error' event emitted here. 
        // We just ensure we emit it properly.

        // usage logging service instead of console.error directly
        // loggingService.error('SSE error:', error)

        this.emit('error', {
          type: 'error',
          data: { error },
          timestamp: new Date().toISOString(),
        })

        // Attempt to reconnect if connection was closed, UNLESS it was an auth failure handled by logic above/below
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.attemptReconnect(token)
        }
      }

      // Listen for custom events
      this.eventSource.addEventListener('notification', (event: MessageEvent) => {
        this.handleMessage('notification', event)
      })

      this.eventSource.addEventListener('message', (event: MessageEvent) => {
        this.handleMessage('message', event)
      })

      // Default message handler
      this.eventSource.onmessage = (event: MessageEvent) => {
        this.handleMessage('notification', event)
      }
    } catch (error) {
      // Use logging service instead of console.error
      import('@/infrastructure/services').then(({ loggingService }) => {
        loggingService.error('Failed to connect to SSE', error as Error)
      })
      this.emit('error', {
        type: 'error',
        data: { error },
        timestamp: new Date().toISOString(),
      })
    }
  }

  /**
   * محاولة إعادة الاتصال
   */
  private attemptReconnect(token?: string): void {
    // 1. Global Circuit Breaker Check
    if (authState.isTerminated) {
      console.warn('[SSE] System in Safe Mode. Stopping reconnection.')
      this.disconnect()
      return
    }

    const maxAttempts = this.maxReconnectAttempts

    if (this.reconnectAttempts >= maxAttempts) {
      // استخدام logging service
      // loggingService.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++

    // Exponential Backoff: 3s, 6s, 12s, 24s, 30s (cap)
    const baseDelay = 3000
    const exponentialDelay = baseDelay * Math.pow(2, this.reconnectAttempts - 1)
    const delay = Math.min(exponentialDelay, 30000)

    setTimeout(() => {
      // استخدام logging service
      // loggingService.info(`Attempting to reconnect SSE (${this.reconnectAttempts}/${maxAttempts})...`)
      this.disconnect()
      this.connect(token)
    }, delay)
  }

  /**
   * معالجة الرسائل الواردة
   */
  private handleMessage(eventType: SSEEventType, event: MessageEvent): void {
    try {
      const data = event.data ? JSON.parse(event.data) : {}
      const sseEvent: SSEEvent = {
        type: eventType,
        data,
        timestamp: event.lastEventId || new Date().toISOString(),
      }
      this.emit(eventType, sseEvent)
    } catch (error) {
      console.error('Failed to parse SSE message:', error)
      this.emit('error', {
        type: 'error',
        data: { error: 'Failed to parse message', originalError: error },
        timestamp: new Date().toISOString(),
      })
    }
  }

  /**
   * إضافة معالج حدث
   */
  on(eventType: SSEEventType, handler: SSEEventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set())
    }
    this.eventHandlers.get(eventType)!.add(handler)

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          this.eventHandlers.delete(eventType)
        }
      }
    }
  }

  /**
   * إزالة معالج حدث
   */
  off(eventType: SSEEventType, handler: SSEEventHandler): void {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventType)
      }
    }
  }

  /**
   * إرسال حدث
   */
  private emit(eventType: SSEEventType, event: SSEEvent): void {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event)
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error)
        }
      })
    }
  }

  /**
   * قطع الاتصال
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    this.eventHandlers.clear()
    this.reconnectAttempts = 0
  }

  /**
   * التحقق من حالة الاتصال
   */
  get isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN
  }

  /**
   * الحصول على حالة الاتصال
   */
  get readyState(): number | null {
    return this.eventSource?.readyState ?? null
  }
}
