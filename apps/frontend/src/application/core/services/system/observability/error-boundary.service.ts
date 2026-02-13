/**
 * Error Boundary Service - Proxy to SovereignErrorService
 */
import React from 'react'
import { sovereignErrorService } from './sovereign-error.service'

export interface ErrorBoundaryInfo {
  message: string
  stack?: string
  componentStack?: string
  timestamp: string
  userAgent?: string
  url?: string
}

export class ErrorBoundaryService {
  /**
   * تسجيل خطأ
   */
  static logError(error: Error, errorInfo?: React.ErrorInfo): void {
    sovereignErrorService.handleError(error, { componentStack: errorInfo?.componentStack ?? undefined })
  }

  /**
   * معالجة خطأ غير متوقع
   */
  static handleUnexpectedError(error: unknown): ErrorBoundaryInfo {
    const info = sovereignErrorService.handleError(error)
    return {
      message: info.message,
      stack: info.stack,
      componentStack: info.componentStack,
      timestamp: info.timestamp,
      url: info.url,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    }
  }

  /**
   * معالجة خطأ API  -- Kept for util compatibility if used statically
   */
  static handleApiError(error: unknown): string {
    const info = sovereignErrorService.handleError(error, { silent: true }) // Silent check to just get message
    return info.message
  }

  /**
   * معالجة خطأ الشبكة -- Kept for util compatibility
   */
  static handleNetworkError(error: unknown): string {
    const info = sovereignErrorService.handleError(error, { silent: true })
    return info.message
  }
}
