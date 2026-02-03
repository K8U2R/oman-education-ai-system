/**
 * Offline Service - خدمة العمل دون اتصال
 *
 * خدمة لإدارة العمل دون اتصال بالإنترنت
 */

import { cacheService } from './cache.service'

export interface OfflineRequest {
  id: string
  url: string
  method: string
  data?: unknown
  headers?: Record<string, string>
  timestamp: number
  retries: number
}

class OfflineService {
  private isOnline: boolean = navigator.onLine
  private pendingRequests: OfflineRequest[] = []
  private maxRetries = 3
  private retryDelay = 5000 // 5 seconds
  private listeners: Set<(isOnline: boolean) => void> = new Set()

  constructor() {
    this.init()
  }

  /**
   * تهيئة الخدمة
   */
  private init(): void {
    // Load pending requests from storage
    this.loadPendingRequests()

    // Listen to online/offline events
    window.addEventListener('online', () => {
      this.handleOnline()
    })

    window.addEventListener('offline', () => {
      this.handleOffline()
    })

    // Start processing queue if online
    if (this.isOnline) {
      this.processQueue()
    }
  }

  /**
   * التحقق من حالة الاتصال
   */
  getOnlineStatus(): boolean {
    return this.isOnline
  }

  /**
   * إضافة مستمع لتغيير حالة الاتصال
   */
  onStatusChange(callback: (isOnline: boolean) => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * إضافة طلب إلى قائمة الانتظار
   */
  queueRequest(request: Omit<OfflineRequest, 'id' | 'timestamp' | 'retries'>): string {
    const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const offlineRequest: OfflineRequest = {
      id,
      ...request,
      timestamp: Date.now(),
      retries: 0,
    }

    this.pendingRequests.push(offlineRequest)
    this.savePendingRequests()

    // Try to process immediately if online
    if (this.isOnline) {
      this.processRequest(offlineRequest)
    }

    return id
  }

  /**
   * معالجة طلب واحد
   */
  private async processRequest(request: OfflineRequest): Promise<void> {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers,
        },
        body: request.data ? JSON.stringify(request.data) : undefined,
      })

      if (response.ok) {
        // Request successful, remove from queue
        this.removeRequest(request.id)
      } else {
        // Request failed, retry if possible
        this.handleRequestFailure(request)
      }
    } catch (_error) {
      // Network error, retry if possible
      this.handleRequestFailure(request)
    }
  }

  /**
   * معالجة فشل الطلب
   */
  private handleRequestFailure(request: OfflineRequest): void {
    if (request.retries < this.maxRetries) {
      request.retries++
      this.savePendingRequests()

      // Retry after delay
      setTimeout(() => {
        if (this.isOnline) {
          this.processRequest(request)
        }
      }, this.retryDelay * request.retries)
    } else {
      // Max retries reached, remove from queue
      console.error('Request failed after max retries:', request)
      this.removeRequest(request.id)
    }
  }

  /**
   * معالجة قائمة الانتظار
   */
  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.pendingRequests.length === 0) {
      return
    }

    // Process requests in order
    for (const request of [...this.pendingRequests]) {
      await this.processRequest(request)
    }
  }

  /**
   * إزالة طلب من القائمة
   */
  private removeRequest(id: string): void {
    this.pendingRequests = this.pendingRequests.filter(r => r.id !== id)
    this.savePendingRequests()
  }

  /**
   * معالجة الاتصال بالإنترنت
   */
  private handleOnline(): void {
    this.isOnline = true
    this.notifyListeners(true)
    this.processQueue()
  }

  /**
   * معالجة انقطاع الاتصال
   */
  private handleOffline(): void {
    this.isOnline = false
    this.notifyListeners(false)
  }

  /**
   * إشعار المستمعين
   */
  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach(callback => {
      try {
        callback(isOnline)
      } catch (error) {
        console.error('Error in offline status listener:', error)
      }
    })
  }

  /**
   * حفظ الطلبات المعلقة
   */
  private savePendingRequests(): void {
    try {
      cacheService.set('offline_requests', this.pendingRequests, {
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        keyPrefix: 'offline_',
      })
    } catch (error) {
      console.error('Failed to save pending requests:', error)
    }
  }

  /**
   * تحميل الطلبات المعلقة
   */
  private loadPendingRequests(): void {
    try {
      const stored = cacheService.get<OfflineRequest[]>('offline_requests', true)
      if (stored && Array.isArray(stored)) {
        this.pendingRequests = stored
      }
    } catch (error) {
      console.error('Failed to load pending requests:', error)
    }
  }

  /**
   * الحصول على الطلبات المعلقة
   */
  getPendingRequests(): OfflineRequest[] {
    return [...this.pendingRequests]
  }

  /**
   * مسح الطلبات المعلقة
   */
  clearPendingRequests(): void {
    this.pendingRequests = []
    this.savePendingRequests()
  }
}

export const offlineService = new OfflineService()
