/**
 * Request Queue - قائمة انتظار الطلبات
 *
 * قائمة انتظار لإدارة الطلبات المتعددة
 */

import { AxiosRequestConfig } from 'axios'

export interface QueuedRequest {
  id: string
  config: AxiosRequestConfig
  priority: number
  timestamp: number
  retries: number
  maxRetries: number
}

export interface RequestQueueOptions {
  maxConcurrent: number
  retryDelay: number
  maxRetries: number
}

class RequestQueue {
  private queue: QueuedRequest[] = []
  private processing: Set<string> = new Set()
  private options: RequestQueueOptions = {
    maxConcurrent: 5,
    retryDelay: 1000,
    maxRetries: 3,
  }

  constructor(options?: Partial<RequestQueueOptions>) {
    if (options) {
      this.options = { ...this.options, ...options }
    }
  }

  /**
   * إضافة طلب إلى القائمة
   */
  enqueue(config: AxiosRequestConfig, priority: number = 0): string {
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const request: QueuedRequest = {
      id,
      config,
      priority,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: this.options.maxRetries,
    }

    this.queue.push(request)
    this.queue.sort((a, b) => b.priority - a.priority) // Higher priority first

    return id
  }

  /**
   * إزالة طلب من القائمة
   */
  dequeue(): QueuedRequest | null {
    if (this.queue.length === 0) {
      return null
    }

    // Check if we can process more requests
    if (this.processing.size >= this.options.maxConcurrent) {
      return null
    }

    const request = this.queue.shift()
    if (request) {
      this.processing.add(request.id)
    }

    return request || null
  }

  /**
   * إكمال معالجة طلب
   */
  complete(id: string): void {
    this.processing.delete(id)
  }

  /**
   * إعادة محاولة طلب
   */
  retry(id: string): void {
    const request = this.queue.find(r => r.id === id)
    if (request && request.retries < request.maxRetries) {
      request.retries++
      request.timestamp = Date.now()
      // Re-insert with lower priority
      request.priority -= 1
      this.queue.push(request)
      this.queue.sort((a, b) => b.priority - a.priority)
    }
  }

  /**
   * الحصول على حجم القائمة
   */
  size(): number {
    return this.queue.length
  }

  /**
   * الحصول على عدد الطلبات قيد المعالجة
   */
  processingCount(): number {
    return this.processing.size
  }

  /**
   * التحقق من وجود طلبات في القائمة
   */
  isEmpty(): boolean {
    return this.queue.length === 0 && this.processing.size === 0
  }

  /**
   * مسح القائمة
   */
  clear(): void {
    this.queue = []
    this.processing.clear()
  }

  /**
   * الحصول على جميع الطلبات
   */
  getAll(): QueuedRequest[] {
    return [...this.queue]
  }

  /**
   * الحصول على الطلبات قيد المعالجة
   */
  getProcessing(): string[] {
    return Array.from(this.processing)
  }
}

export const requestQueue = new RequestQueue()
