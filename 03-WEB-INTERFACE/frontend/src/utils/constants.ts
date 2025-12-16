/**
 * Application Constants
 */

export const APP_NAME = 'FlowForge IDE';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'Modern Web IDE for Education';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
export const OS_API_URL = import.meta.env.VITE_OS_API_URL || 'http://localhost:8001';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  PROJECTS: 'projects-storage',
  UI: 'ui-storage',
  CACHE: 'cache-storage',
  SETTINGS: 'settings-storage',
} as const;

// Theme
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

// Editor Settings
export const EDITOR_THEMES = {
  VS_DARK: 'vs-dark',
  VS: 'vs',
  HC_BLACK: 'hc-black',
  HC_LIGHT: 'hc-light',
} as const;

// File Types
export const FILE_TYPES = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  PYTHON: 'python',
  HTML: 'html',
  CSS: 'css',
  JSON: 'json',
  MARKDOWN: 'markdown',
  TEXT: 'text',
} as const;

// Project Types
export const PROJECT_TYPES = {
  REACT: 'react',
  NODE: 'node',
  PYTHON: 'python',
  OTHER: 'other',
} as const;

// Error Types
export const ERROR_TYPES = {
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  VALIDATION: 'validation',
  SERVER: 'server',
  UNKNOWN: 'unknown',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  DOCS: '/docs',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Debounce Delays
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 250,
} as const;

