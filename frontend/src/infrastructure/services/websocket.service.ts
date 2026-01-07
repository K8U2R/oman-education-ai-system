/**
 * WebSocket Service - خدمة WebSocket
 *
 * خدمة للاتصال بـ WebSocket للإشعارات في الوقت الفعلي
 */

export type WebSocketEventType = 'notification' | 'message' | 'error' | 'connected' | 'disconnected'

export interface WebSocketEvent {
  type: WebSocketEventType
  data?: unknown
  timestamp: string
}

export type WebSocketEventHandler = (event: WebSocketEvent) => void

export class WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private reconnectTimer: NodeJS.Timeout | null = null
  private eventHandlers: Map<WebSocketEventType, Set<WebSocketEventHandler>> = new Map()
  private isConnecting = false

  constructor(url: string) {
    this.url = url
  }

  /**
   * الاتصال بـ WebSocket
   */
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'))
        return
      }

      this.isConnecting = true

      try {
        const wsUrl = token ? `${this.url}?token=${token}` : this.url
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.emit('connected', { type: 'connected', timestamp: new Date().toISOString() })
          resolve()
        }

        this.ws.onmessage = event => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            // Use logging service instead of console.error
            import('@/infrastructure/services/logging.service').then(({ loggingService }) => {
              loggingService.error('Failed to parse WebSocket message', error as Error)
            })
            this.emit('error', {
              type: 'error',
              data: { error: 'Failed to parse message', originalError: error },
              timestamp: new Date().toISOString(),
            })
          }
        }

        this.ws.onerror = error => {
          this.isConnecting = false
          // في development mode، لا نعرض أخطاء للاتصالات الفاشلة
          // ولا نرفض الـ promise لتجنب console errors
          if (!import.meta.env.DEV) {
            this.emit('error', {
              type: 'error',
              data: { error },
              timestamp: new Date().toISOString(),
            })
          }
          // في development، نرفض بهدوء بدون error
          if (import.meta.env.DEV) {
            reject(new Error('WebSocket connection failed (dev mode)'))
          } else {
            reject(error)
          }
        }

        this.ws.onclose = event => {
          this.isConnecting = false
          // في development mode، لا نعرض events
          if (!import.meta.env.DEV) {
            this.emit('disconnected', { type: 'disconnected', timestamp: new Date().toISOString() })
          }
          // فقط حاول إعادة الاتصال إذا لم يكن إغلاق طبيعي (code 1000)
          // وفي development mode، لا نحاول إعادة الاتصال على الإطلاق
          if (event.code !== 1000 && !import.meta.env.DEV) {
            this.attemptReconnect(token)
          }
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  /**
   * محاولة إعادة الاتصال
   */
  private attemptReconnect(token?: string): void {
    const maxAttempts = this.maxReconnectAttempts

    if (this.reconnectAttempts >= maxAttempts) {
      // استخدام logging service بدلاً من console.error مباشرة
      // loggingService.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts

    this.reconnectTimer = setTimeout(() => {
      // استخدام logging service
      // loggingService.info(`Attempting to reconnect (${this.reconnectAttempts}/${maxAttempts})...`)
      this.connect(token).catch(_error => {
        // استخدام logging service
        // loggingService.error('Reconnection failed:', _error)
      })
    }, delay)
  }

  /**
   * معالجة الرسائل الواردة
   */
  private handleMessage(data: unknown): void {
    if (
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      typeof (data as { type: unknown }).type === 'string'
    ) {
      const messageData = data as { type: string; data?: unknown; timestamp?: string }
      const eventType = messageData.type as WebSocketEventType

      if (this.eventHandlers.has(eventType)) {
        const event: WebSocketEvent = {
          type: eventType,
          data: messageData.data,
          timestamp: messageData.timestamp || new Date().toISOString(),
        }
        this.emit(eventType, event)
        return
      }
    }

    // Default to notification if no type specified
    this.emit('notification', {
      type: 'notification',
      data,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * إرسال رسالة
   */
  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      // Use logging service instead of console.warn
      import('@/infrastructure/services/logging.service').then(({ loggingService }) => {
        loggingService.warn('WebSocket is not connected')
      })
    }
  }

  /**
   * إضافة معالج حدث
   */
  on(eventType: WebSocketEventType, handler: WebSocketEventHandler): () => void {
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
  off(eventType: WebSocketEventType, handler: WebSocketEventHandler): void {
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
  private emit(eventType: WebSocketEventType, event: WebSocketEvent): void {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event)
        } catch (error) {
          // Use logging service instead of console.error
          import('@/infrastructure/services/logging.service').then(({ loggingService }) => {
            loggingService.error(`Error in event handler for ${eventType}`, error as Error)
          })
        }
      })
    }
  }

  /**
   * قطع الاتصال
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.eventHandlers.clear()
    this.reconnectAttempts = 0
  }

  /**
   * التحقق من حالة الاتصال
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  /**
   * الحصول على حالة الاتصال
   */
  get readyState(): number | null {
    return this.ws?.readyState ?? null
  }
}
