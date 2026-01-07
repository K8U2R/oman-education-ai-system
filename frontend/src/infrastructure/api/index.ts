/**
 * API Module - وحدة API
 *
 * Export جميع مكونات API
 *
 * ✅ RECOMMENDED: استخدم apiClientRefactored
 * ⚠️ DEPRECATED: api-client.ts القديم سيتم إزالته قريباً
 */

// Export Refactored API Client (✅ RECOMMENDED)
export { apiClient as apiClientRefactored, createApiClient } from './api-client.refactored'

// Export Old API Client (⚠️ DEPRECATED - للتوافق فقط)
// ملاحظة: سيتم إزالته في المستقبل، استخدم apiClientRefactored
export { apiClient } from './api-client'

// Export Request Queue
export * from './request-queue'
