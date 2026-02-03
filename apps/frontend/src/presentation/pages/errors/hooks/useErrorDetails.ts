/**
 * useErrorDetails Hook - Hook لتفاصيل الخطأ
 *
 * Custom Hook لاستخراج ومعالجة تفاصيل الخطأ من location.state
 */

import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import type { APIErrorInfo, ErrorDetails } from '../core/types'

interface UseErrorDetailsReturn {
  /** معلومات الخطأ من API */
  apiError: APIErrorInfo | null
  /** تفاصيل الخطأ */
  errorDetails: ErrorDetails | null
  /** المسار الذي حاول المستخدم الوصول إليه */
  attemptedPath: string
  /** المسار الحالي */
  currentPath: string
}

/**
 * Hook لاستخراج تفاصيل الخطأ من location.state
 */
export function useErrorDetails(): UseErrorDetailsReturn {
  const location = useLocation()

  return useMemo(() => {
    const state = location.state as {
      from?: string
      error?: {
        message?: string
        code?: string
        status?: number
        details?: Record<string, unknown>
        [key: string]: unknown
      }
    } | null

    const attemptedPath = state?.from || location.pathname
    const currentPath = location.pathname

    const apiError: APIErrorInfo | null = state?.error
      ? {
          message: state.error.message,
          code: state.error.code,
          status: state.error.status,
          details: state.error.details,
        }
      : null

    const errorDetails: ErrorDetails | null = state?.error?.details
      ? (state.error.details as ErrorDetails)
      : null

    return {
      apiError,
      errorDetails,
      attemptedPath,
      currentPath,
    }
  }, [location.state, location.pathname])
}
