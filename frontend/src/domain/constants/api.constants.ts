/**
 * API Constants - ثوابت API
 *
 * جميع الثوابت المتعلقة بـ API
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    UPDATE_PASSWORD: '/auth/update-password',
    UPDATE_USER: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    OAUTH: (provider: string) => `/auth/${provider}`,
    SEND_VERIFICATION_EMAIL: '/auth/verify/send',
    VERIFY_EMAIL: '/auth/verify/confirm',
  },
  // Learning
  LEARNING: {
    LESSONS: '/learning/lessons',
    LESSON: (id: string) => `/learning/lessons/${id}`,
    EXPLANATION: (id: string) => `/learning/lessons/${id}/explanation`,
    EXAMPLES: (id: string) => `/learning/lessons/${id}/examples`,
    VIDEOS: (id: string) => `/learning/lessons/${id}/videos`,
    MIND_MAP: (id: string) => `/learning/lessons/${id}/mind-map`,
  },
  // Storage
  STORAGE: {
    PROVIDERS: '/storage/providers',
    PROVIDER: (id: string) => `/storage/providers/${id}`,
    CONNECT: (id: string) => `/storage/providers/${id}/connect`,
    CONNECTIONS: '/storage/connections',
    CONNECTION: (id: string) => `/storage/connections/${id}`,
    DISCONNECT: (id: string) => `/storage/connections/${id}/disconnect`,
    REFRESH: (id: string) => `/storage/connections/${id}/refresh`,
    FILES: (id: string) => `/storage/connections/${id}/files`,
    FILE: (connectionId: string, fileId: string) =>
      `/storage/connections/${connectionId}/files/${fileId}`,
    UPLOAD: (id: string) => `/storage/connections/${id}/files/upload`,
    DOWNLOAD: (connectionId: string, fileId: string) =>
      `/storage/connections/${connectionId}/files/${fileId}/download`,
    EXPORT: (connectionId: string, fileId: string) =>
      `/storage/connections/${connectionId}/files/${fileId}/export`,
    FOLDERS: (id: string) => `/storage/connections/${id}/folders`,
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    STATS: '/notifications/stats',
    SUBSCRIBE: '/notifications/subscribe',
  },
  // Search
  SEARCH: {
    SEARCH: '/search',
  },
  // Code Generation
  CODE_GENERATION: {
    GENERATE: '/code-generation/generate',
    IMPROVE: '/code-generation/improve',
    EXPLAIN: '/code-generation/explain',
  },
  // AI Mastermind
  AI: {
    STREAM: '/ai/stream',
    INTERACT: '/ai/interact',
  },
  // Office Generation
  OFFICE: {
    GENERATE: '/office/generate',
    TEMPLATES: '/office/templates',
  },
  // Content Management
  CONTENT: {
    SUBJECTS: '/content/subjects',
    GRADE_LEVELS: '/content/grade-levels',
    LESSONS: '/content/lessons',
    LESSON: (id: string) => `/content/lessons/${id}`,
    LEARNING_PATHS: '/content/learning-paths',
    LEARNING_PATH: (id: string) => `/content/learning-paths/${id}`,
  },
  // Admin
  ADMIN: {
    STATS: '/admin/stats/system',
    USERS: '/admin/users',
    USER: (id: string) => `/admin/users/${id}`,
    USER_ACTIVITIES: (id: string) => `/admin/users/${id}/activities`,
  },
  // Developer
  DEVELOPER: {
    STATS: '/developer/stats',
    ENDPOINTS: '/developer/endpoints',
    SERVICES: '/developer/services',
    PERFORMANCE: '/developer/performance',
  },
  // Security
  SECURITY: {
    STATS: '/security/stats',
    LOGS: '/security/logs',
    EXPORT_LOGS: '/security/logs/export',
    SETTINGS: '/security/settings',
    ROUTES: '/security/routes',
    ROUTE: (id: string) => `/security/routes/${id}`,
    ALERTS: '/security/alerts',
    ALERT_READ: (id: string) => `/security/alerts/${id}/read`,
    ALERTS_READ_ALL: '/security/alerts/read-all',
    // Analytics (for Developers & Admins)
    ANALYTICS_REPORT: '/security/analytics/report',
    ANALYTICS_LOGIN_ATTEMPTS: '/security/analytics/login-attempts',
    ANALYTICS_USER_ACTIVITY: '/security/analytics/user-activity',
    ANALYTICS_GEOGRAPHIC: '/security/analytics/geographic',
    ANALYTICS_TOP_FAILED_LOGINS: '/security/analytics/top-failed-logins',
    ANALYTICS_EVENT_SUMMARY: '/security/analytics/event-summary',
    ANALYTICS_SESSION_DISTRIBUTION: '/security/analytics/session-distribution',
    ANALYTICS_USER_RISK_SCORES: '/security/analytics/user-risk-scores',
    ANALYTICS_METRICS: '/security/analytics/metrics',
    // Monitoring (for Developers)
    MONITORING_HEALTH: '/security/monitoring/health',
    MONITORING_REALTIME: '/security/monitoring/realtime',
    MONITORING_ALERT_THRESHOLDS: '/security/monitoring/alert-thresholds',
    MONITORING_CONFIG: '/security/monitoring/config',
  },
  // Sessions
  SESSIONS: {
    LIST: '/security/sessions',
    ALL: '/security/sessions/all',
    BY_ID: (id: string) => `/security/sessions/${id}`,
    TERMINATE: (id: string) => `/security/sessions/${id}`,
    TERMINATE_ALL: (userId: string) => `/security/sessions/user/${userId}`,
    REFRESH: (id: string) => `/security/sessions/${id}/refresh`,
  },
} as const
