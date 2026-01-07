/**
 * SSE Service - خدمة Server-Sent Events
 *
 * خدمة للاتصال بـ SSE للإشعارات في الوقت الفعلي
 */

export type SSEEventType = 'notification' | 'message' | 'error' | 'connected' | 'disconnected'

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

    try {
      const sseUrl = token ? `${this.url}?token=${token}` : this.url
      this.eventSource = new EventSource(sseUrl)

      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0
        this.emit('connected', { type: 'connected', timestamp: new Date().toISOString() })
      }

      this.eventSource.onerror = error => {
        // استخدام logging service بدلاً من console.error مباشرة
        // loggingService.error('SSE error:', error)

        this.emit('error', {
          type: 'error',
          data: { error },
          timestamp: new Date().toISOString(),
        })

        // Attempt to reconnect if connection was closed
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
      import('./logging.service').then(({ loggingService }) => {
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
    const maxAttempts = this.maxReconnectAttempts

    if (this.reconnectAttempts >= maxAttempts) {
      // استخدام logging service
      // loggingService.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = 3000 * this.reconnectAttempts

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
