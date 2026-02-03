/**
 * Header Configuration - تكوين Header
 *
 * جميع الإعدادات والثوابت المستخدمة في Header
 */

/**
 * Header Configuration
 */
export const HEADER_CONFIG = {
  /**
   * ارتفاعات Header حسب الشاشة
   */
  heights: {
    desktop: '5rem',
    tablet: '4.5rem',
    mobile: '4rem',
  },

  /**
   * Breakpoints للشاشات
   */
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },

  /**
   * إعدادات Animations
   */
  animations: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  /**
   * إعدادات SearchBar
   */
  search: {
    maxWidth: {
      desktop: '600px',
      tablet: '400px',
      mobile: '100%',
    },
    minWidth: {
      desktop: '200px',
      tablet: '150px',
      mobile: '0px',
    },
  },
} as const

/**
 * Header Actions Constants
 */
export const HEADER_ACTIONS = {
  SEARCH: 'search',
  NOTIFICATIONS: 'notifications',
  AI_STATUS: 'ai-status',
  PROFILE: 'profile',
} as const

/**
 * Header Variants
 */
export const HEADER_VARIANTS = {
  DEFAULT: 'default',
  COMPACT: 'compact',
  MINIMAL: 'minimal',
} as const

/**
 * Header Sizes
 */
export const HEADER_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const
