/**
 * Color System - نظام الألوان
 * Centralized color tokens for light and dark modes
 */

export type ColorMode = 'light' | 'dark'

export const colors = {
  // Light Mode Colors
  light: {
    // Primary brand colors
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },

    // Accent colors for gradients
    accent: {
      purple: '#667eea',
      violet: '#764ba2',
      pink: '#f093fb',
      rose: '#f5576c',
      cyan: '#4facfe',
      blue: '#00f2fe',
    },

    // Background colors
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      elevated: '#ffffff',
    },

    // Text colors
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      disabled: '#94a3b8',
      inverse: '#ffffff',
      link: '#7c3aed',
    },

    // Border colors
    border: {
      light: 'rgba(0, 0, 0, 0.05)',
      default: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.15)',
      heavy: 'rgba(0, 0, 0, 0.2)',
    },

    // State colors
    success: {
      bg: '#dcfce7',
      text: '#166534',
      border: '#86efac',
    },
    error: {
      bg: '#fee2e2',
      text: '#991b1b',
      border: '#fca5a5',
    },
    warning: {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#fde047',
    },
    info: {
      bg: '#dbeafe',
      text: '#1e40af',
      border: '#93c5fd',
    },
  },

  // Dark Mode Colors
  dark: {
    primary: {
      50: '#4c1d95',
      100: '#5b21b6',
      200: '#6d28d9',
      300: '#7c3aed',
      400: '#8b5cf6',
      500: '#a78bfa',
      600: '#c4b5fd',
      700: '#ddd6fe',
      800: '#ede9fe',
      900: '#f5f3ff',
    },

    accent: {
      purple: '#8b7bd8',
      violet: '#9d7bc6',
      pink: '#f5a9ff',
      rose: '#ff7a94',
      cyan: '#6fbfff',
      blue: '#33f0ff',
    },

    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      elevated: '#1e293b',
    },

    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      disabled: '#64748b',
      inverse: '#0f172a',
      link: '#c4b5fd',
    },

    border: {
      light: 'rgba(255, 255, 255, 0.05)',
      default: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.15)',
      heavy: 'rgba(255, 255, 255, 0.2)',
    },

    success: {
      bg: '#064e3b',
      text: '#6ee7b7',
      border: '#10b981',
    },
    error: {
      bg: '#7f1d1d',
      text: '#fca5a5',
      border: '#ef4444',
    },
    warning: {
      bg: '#78350f',
      text: '#fcd34d',
      border: '#f59e0b',
    },
    info: {
      bg: '#1e3a8a',
      text: '#93c5fd',
      border: '#3b82f6',
    },
  },

  // Gradients (work in both modes)
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    heroAlt: 'linear-gradient(to right, #667eea 0%, #764ba2 100%)',
  },

  // Glass effect colors
  glass: {
    light: {
      bg: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      shadow: 'rgba(31, 38, 135, 0.37)',
    },
    dark: {
      bg: 'rgba(0, 0, 0, 0.2)',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(124, 58, 237, 0.3)',
  },
}

export type ColorPalette = typeof colors.light
