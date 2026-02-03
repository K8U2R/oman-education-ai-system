/**
 * Routes Constants - ثوابت المسارات
 *
 * جميع ثوابت المسارات في التطبيق
 */

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  TERMS: '/terms',
  PRIVACY: '/privacy',

  // Auth
  OAUTH_CALLBACK: '/auth/success',
  OAUTH_SUCCESS: '/auth/success',
  VERIFY_EMAIL: '/verify-email',
  RESEND_VERIFICATION: '/resend-verification',

  // Error Pages
  UNAUTHORIZED: '/unauthorized',
  FORBIDDEN: '/forbidden',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
  NETWORK_ERROR: '/network-error',
  MAINTENANCE: '/maintenance',

  // Protected
  DASHBOARD: '/dashboard',
  LEARN: '/learn',
  LESSONS: '/lessons',
  LESSON_DETAIL: (lessonId: string) => `/lessons/${lessonId}`,
  LESSON_DETAIL_PATTERN: '/lessons/:lessonId',
  STORAGE: '/storage',
  STORAGE_BROWSER: (connectionId: string) => `/storage/${connectionId}/browser`,
  STORAGE_BROWSER_PATTERN: '/storage/:connectionId/browser',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  SUBSCRIPTION: '/subscription',

  // Admin & Developer
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_WHITELIST: '/admin/whitelist',
  ADMIN_SECURITY: '/admin/security',
  ADMIN_SECURITY_DASHBOARD: '/admin/security/dashboard',
  ADMIN_SECURITY_SESSIONS: '/admin/security/sessions',
  ADMIN_SECURITY_LOGS: '/admin/security/logs',
  ADMIN_SECURITY_SETTINGS: '/admin/security/settings',
  ADMIN_SECURITY_ROUTES: '/admin/security/routes',
  ADMIN_ANALYTICS_ERRORS: '/admin/analytics/errors',
  ADMIN_ANALYTICS_PERFORMANCE: '/admin/analytics/performance',
  ADMIN_KNOWLEDGE: '/admin/knowledge',

  // Database Core
  ADMIN_DATABASE_CORE: '/admin/database-core',
  ADMIN_DATABASE_CORE_DASHBOARD: '/admin/database-core',
  ADMIN_DATABASE_CORE_PERFORMANCE: '/admin/database-core/performance',
  ADMIN_DATABASE_CORE_CONNECTIONS: '/admin/database-core/connections',
  ADMIN_DATABASE_CORE_CACHE: '/admin/database-core/cache',
  ADMIN_DATABASE_CORE_TRANSACTIONS: '/admin/database-core/transactions',
  ADMIN_DATABASE_CORE_AUDIT: '/admin/database-core/audit',
  ADMIN_DATABASE_CORE_BACKUPS: '/admin/database-core/backups',
  ADMIN_DATABASE_CORE_MIGRATIONS: '/admin/database-core/migrations',
  ADMIN_DATABASE_CORE_EXPLORER: '/admin/database-core/explorer',
  ADMIN_DATABASE_CORE_QUERY_BUILDER: '/admin/database-core/query-builder',
  ADMIN_DATABASE_CORE_TABLES: '/admin/database-core/tables',
  ADMIN_DATABASE_CORE_SECURITY: '/admin/database-core/security',

  DEVELOPER_DASHBOARD: '/developer',
  DEVELOPER_SECURITY_ANALYTICS: '/developer/security/analytics',
  DEVELOPER_SECURITY_MONITORING: '/developer/security/monitoring',

  // Support Security
  SUPPORT_SECURITY_QUICK_ACTIONS: '/support/security/quick-actions',
  SUPPORT_SECURITY_USER_SUPPORT: '/support/security/user/:userId',
  SUPPORT_SECURITY_USER_SUPPORT_PATTERN: '/support/security/user/:userId',

  // User Security
  USER_SECURITY: '/security',
  USER_SECURITY_SETTINGS: '/security/settings',
  USER_SECURITY_SESSIONS: '/security/sessions',
  USER_SECURITY_HISTORY: '/security/history',
  USER_SECURITY_ALERTS: '/security/alerts',

  // Tools
  CODE_GENERATOR: '/tools/code-generator',
  OFFICE_GENERATOR: '/tools/office-generator',

  // Content Management (Teachers & Admins)
  LESSONS_MANAGEMENT: '/content/lessons',
  LESSON_FORM: '/content/lessons/new',
  LESSON_EDIT: (lessonId: string) => `/content/lessons/${lessonId}/edit`,
  LESSON_EDIT_PATTERN: '/content/lessons/:lessonId/edit',
  LEARNING_PATHS_MANAGEMENT: '/content/learning-paths',
  LEARNING_PATH_FORM: '/content/learning-paths/new',
  LEARNING_PATH_EDIT: (pathId: string) => `/content/learning-paths/${pathId}/edit`,
  LEARNING_PATH_EDIT_PATTERN: '/content/learning-paths/:pathId/edit',

  // Assessments
  ASSESSMENTS: '/assessments',
  ASSESSMENT_DETAIL: (assessmentId: string) => `/assessments/${assessmentId}`,
  ASSESSMENT_DETAIL_PATTERN: '/assessments/:assessmentId',
  ASSESSMENT_TAKE: (assessmentId: string) => `/assessments/${assessmentId}/take`,
  ASSESSMENT_TAKE_PATTERN: '/assessments/:assessmentId/take',
  ASSESSMENT_RESULTS: (assessmentId: string) => `/assessments/${assessmentId}/results`,
  ASSESSMENT_RESULTS_PATTERN: '/assessments/:assessmentId/results',
  ASSESSMENT_NEW: '/assessments/new',
  ASSESSMENT_FORM: (assessmentId?: string) =>
    assessmentId ? `/assessments/${assessmentId}/edit` : '/assessments/new',
  ASSESSMENT_FORM_PATTERN: '/assessments/:assessmentId/edit',

  // Projects
  PROJECTS: '/projects',
  PROJECT_DETAIL: (projectId: string) => `/projects/${projectId}`,
  PROJECT_DETAIL_PATTERN: '/projects/:projectId',
  PROJECT_NEW: '/projects/new',
  PROJECT_FORM: (projectId?: string) =>
    projectId ? `/projects/${projectId}/edit` : '/projects/new',
  PROJECT_FORM_PATTERN: '/projects/:projectId/edit',
} as const
