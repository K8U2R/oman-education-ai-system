/**
 * API Constants - ثوابت API
 *
 * جميع الثوابت المتعلقة بـ API
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const PREFIX = ''

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${PREFIX}/auth/login`,
    REGISTER: `${PREFIX}/auth/register`,
    LOGOUT: `${PREFIX}/auth/logout`,
    ME: `${PREFIX}/auth/me`,
    REFRESH: `${PREFIX}/auth/refresh`,
    UPDATE_PASSWORD: `${PREFIX}/auth/update-password`,
    UPDATE_USER: `${PREFIX}/auth/me`,
    FORGOT_PASSWORD: `${PREFIX}/auth/forgot-password`,
    RESET_PASSWORD: `${PREFIX}/auth/reset-password`,
    OAUTH: (provider: string) => `${PREFIX}/auth/oauth/${provider}`,
    SEND_VERIFICATION_EMAIL: `${PREFIX}/auth/verify/send`,
    VERIFY_EMAIL: `${PREFIX}/auth/verify/confirm`,
  },
  // Learning
  LEARNING: {
    LESSONS: `${PREFIX}/learning/lessons`,
    LESSON: (id: string) => `${PREFIX}/learning/lessons/${id}`,
    EXPLANATION: (id: string) => `${PREFIX}/learning/lessons/${id}/explanation`,
    EXAMPLES: (id: string) => `${PREFIX}/learning/lessons/${id}/examples`,
    VIDEOS: (id: string) => `${PREFIX}/learning/lessons/${id}/videos`,
    MIND_MAP: (id: string) => `${PREFIX}/learning/lessons/${id}/mind-map`,
  },
  // Storage
  STORAGE: {
    PROVIDERS: `${PREFIX}/storage/providers`,
    PROVIDER: (id: string) => `${PREFIX}/storage/providers/${id}`,
    CONNECT: (id: string) => `${PREFIX}/storage/providers/${id}/connect`,
    CONNECTIONS: `${PREFIX}/storage/connections`,
    CONNECTION: (id: string) => `${PREFIX}/storage/connections/${id}`,
    DISCONNECT: (id: string) => `${PREFIX}/storage/connections/${id}/disconnect`,
    REFRESH: (id: string) => `${PREFIX}/storage/connections/${id}/refresh`,
    FILES: (id: string) => `${PREFIX}/storage/connections/${id}/files`,
    FILE: (connectionId: string, fileId: string) =>
      `${PREFIX}/storage/connections/${connectionId}/files/${fileId}`,
    UPLOAD: (id: string) => `${PREFIX}/storage/connections/${id}/files/upload`,
    DOWNLOAD: (connectionId: string, fileId: string) =>
      `${PREFIX}/storage/connections/${connectionId}/files/${fileId}/download`,
    EXPORT: (connectionId: string, fileId: string) =>
      `${PREFIX}/storage/connections/${connectionId}/files/${fileId}/export`,
    FOLDERS: (id: string) => `${PREFIX}/storage/connections/${id}/folders`,
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: `${PREFIX}/notifications`,
    BY_ID: (id: string) => `${PREFIX}/notifications/${id}`,
    MARK_READ: (id: string) => `${PREFIX}/notifications/${id}/read`,
    MARK_ALL_READ: `${PREFIX}/notifications/mark-all-read`,
    STATS: `${PREFIX}/notifications/stats`,
    SUBSCRIBE: `${PREFIX}/notifications/subscribe`,
  },
  // Search
  SEARCH: {
    SEARCH: `${PREFIX}/search`,
  },
  // Code Generation
  CODE_GENERATION: {
    GENERATE: `${PREFIX}/code-generation/generate`,
    IMPROVE: `${PREFIX}/code-generation/improve`,
    EXPLAIN: `${PREFIX}/code-generation/explain`,
  },
  // AI Mastermind
  AI: {
    STREAM: `${PREFIX}/ai/stream`,
    INTERACT: `${PREFIX}/ai/interact`,
  },
  // Office Generation
  OFFICE: {
    GENERATE: `${PREFIX}/office/generate`,
    TEMPLATES: `${PREFIX}/office/templates`,
  },
  // Content Management
  CONTENT: {
    SUBJECTS: `${PREFIX}/content/subjects`,
    GRADE_LEVELS: `${PREFIX}/content/grade-levels`,
    LESSONS: `${PREFIX}/content/lessons`,
    LESSON: (id: string) => `${PREFIX}/content/lessons/${id}`,
    LEARNING_PATHS: `${PREFIX}/content/learning-paths`,
    LEARNING_PATH: (id: string) => `${PREFIX}/content/learning-paths/${id}`,
  },
  // Admin
  ADMIN: {
    STATS: `${PREFIX}/admin/stats/system`,
    USERS: `${PREFIX}/admin/users`,
    USER: (id: string) => `${PREFIX}/admin/users/${id}`,
    USER_ACTIVITIES: (id: string) => `${PREFIX}/admin/users/${id}/activities`,
  },
  // Developer
  DEVELOPER: {
    STATS: `${PREFIX}/developer/stats`,
    ENDPOINTS: `${PREFIX}/developer/endpoints`,
    SERVICES: `${PREFIX}/developer/services`,
    PERFORMANCE: `${PREFIX}/developer/performance`,
  },
  // Security
  SECURITY: {
    STATS: `${PREFIX}/security/stats`,
    LOGS: `${PREFIX}/security/logs`,
    EXPORT_LOGS: `${PREFIX}/security/logs/export`,
    SETTINGS: `${PREFIX}/security/settings`,
    ROUTES: `${PREFIX}/security/routes`,
    ROUTE: (id: string) => `${PREFIX}/security/routes/${id}`,
    ALERTS: `${PREFIX}/security/alerts`,
    ALERT_READ: (id: string) => `${PREFIX}/security/alerts/${id}/read`,
    ALERTS_READ_ALL: `${PREFIX}/security/alerts/read-all`,
    // Analytics (for Developers & Admins)
    ANALYTICS_REPORT: `${PREFIX}/security/analytics/report`,
    ANALYTICS_LOGIN_ATTEMPTS: `${PREFIX}/security/analytics/login-attempts`,
    ANALYTICS_USER_ACTIVITY: `${PREFIX}/security/analytics/user-activity`,
    ANALYTICS_GEOGRAPHIC: `${PREFIX}/security/analytics/geographic`,
    ANALYTICS_TOP_FAILED_LOGINS: `${PREFIX}/security/analytics/top-failed-logins`,
    ANALYTICS_EVENT_SUMMARY: `${PREFIX}/security/analytics/event-summary`,
    ANALYTICS_SESSION_DISTRIBUTION: `${PREFIX}/security/analytics/session-distribution`,
    ANALYTICS_USER_RISK_SCORES: `${PREFIX}/security/analytics/user-risk-scores`,
    ANALYTICS_METRICS: `${PREFIX}/security/analytics/metrics`,
    // Monitoring (for Developers)
    MONITORING_HEALTH: `${PREFIX}/security/monitoring/health`,
    MONITORING_REALTIME: `${PREFIX}/security/monitoring/realtime`,
    MONITORING_ALERT_THRESHOLDS: `${PREFIX}/security/monitoring/alert-thresholds`,
    MONITORING_CONFIG: `${PREFIX}/security/monitoring/config`,
  },
  // Sessions
  SESSIONS: {
    LIST: `${PREFIX}/security/sessions`,
    ALL: `${PREFIX}/security/sessions/all`,
    BY_ID: (id: string) => `${PREFIX}/security/sessions/${id}`,
    TERMINATE: (id: string) => `${PREFIX}/security/sessions/${id}`,
    TERMINATE_ALL: (userId: string) => `${PREFIX}/security/sessions/user/${userId}`,
    REFRESH: (id: string) => `${PREFIX}/security/sessions/${id}/refresh`,
  },
} as const
