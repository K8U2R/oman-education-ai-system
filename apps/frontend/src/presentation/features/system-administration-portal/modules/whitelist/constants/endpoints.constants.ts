/**
 * Whitelist Endpoints - نقاط نهاية API للقائمة البيضاء
 */

export const WHITELIST_ENDPOINTS = {
  BASE: '/api/v1/admin/whitelist',
  LIST: '/api/v1/admin/whitelist',
  BY_ID: (id: string) => `/api/v1/admin/whitelist/${id}`,
  EXPIRED: '/api/v1/admin/whitelist/expired',
  ACTIVATE: (id: string) => `/api/v1/admin/whitelist/${id}/activate`,
  DEACTIVATE: (id: string) => `/api/v1/admin/whitelist/${id}/deactivate`,
} as const
