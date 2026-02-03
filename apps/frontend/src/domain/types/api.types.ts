/**
 * API Types - أنواع API
 *
 * أنواع TypeScript المشتركة لـ API responses
 */

/**
 * API Response Structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  meta?: {
    page?: number
    per_page?: number
    total?: number
    total_pages?: number
  }
}
