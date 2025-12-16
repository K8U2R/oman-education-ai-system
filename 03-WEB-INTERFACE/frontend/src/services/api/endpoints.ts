/**
 * API Endpoints Configuration
 */

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    oauth: {
      google: {
        initiate: '/auth/oauth/google/initiate',
        callback: '/auth/oauth/google/callback',
      },
      github: {
        initiate: '/auth/oauth/github/initiate',
        callback: '/auth/oauth/github/callback',
      },
    },
  },

  // User (Basic)
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    changePassword: '/user/change-password',
    apiKeys: '/user/api-keys',
    settings: '/user/settings',
    // User Personalization endpoints
    personalization: {
      preferences: {
        get: '/user/preferences',
        update: '/user/preferences',
      },
      settings: {
        get: '/user/settings',
        update: '/user/settings',
      },
      profile: {
        get: '/user/profile',
        update: '/user/profile',
      },
    },
  },

  // Projects
  projects: {
    list: '/projects',
    create: '/projects',
    detail: '/projects',
    get: (id: string) => `/projects/${id}`,
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
    build: (id: string) => `/projects/${id}/build`,
    run: (id: string) => `/projects/${id}/run`,
    stop: (id: string) => `/projects/${id}/stop`,
  },

  // Files
  files: {
    list: (projectId: string, path?: string) => 
      `/projects/${projectId}/files${path ? `?path=${encodeURIComponent(path)}` : ''}`,
    get: (projectId: string, filePath: string) => `/projects/${projectId}/files/${encodeURIComponent(filePath)}`,
    read: (projectId: string, filePath: string) => `/projects/${projectId}/files/${encodeURIComponent(filePath)}/content`,
    create: (projectId: string) => `/projects/${projectId}/files`,
    update: (projectId: string, filePath: string) => `/projects/${projectId}/files/${encodeURIComponent(filePath)}`,
    delete: (projectId: string, filePath: string) => `/projects/${projectId}/files/${encodeURIComponent(filePath)}`,
  },

  // AI
  ai: {
    chat: '/ai/chat',
    intentChat: '/ai/intent-chat',
    generate: '/ai/generate',
    explain: '/ai/explain',
    refactor: '/ai/refactor',
    fix: '/ai/fix',
  },

  // Git
  git: {
    status: (projectId: string) => `/projects/${projectId}/git/status`,
    commit: (projectId: string) => `/projects/${projectId}/git/commit`,
    branch: (projectId: string) => `/projects/${projectId}/git/branch`,
    history: (projectId: string) => `/projects/${projectId}/git/history`,
  },

  // Analytics
  analytics: {
    dashboard: '/analytics/dashboard',
    usage: '/analytics/usage',
    performance: '/analytics/performance',
  },

  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    delete: (id: string) => `/notifications/${id}`,
  },

  // Dashboard
  dashboard: {
    stats: '/dashboard/stats',
    recentProjects: '/dashboard/recent-projects',
    activityFeed: '/dashboard/activity-feed',
  },

  // Profile
  profile: {
    get: '/profile',
    update: '/profile',
    changePassword: '/profile/change-password',
    uploadAvatar: '/profile/avatar',
  },

  // Sync
  sync: '/sync',

  // Office Assistant
  office: {
    analyze: '/office/analyze',
    generate: '/office/generate',
    edit: '/office/edit',
    createTest: '/office/create-test',
    analyzeShared: '/office/analyze-shared',
    analytics: '/office/analytics',
  },
} as const;

