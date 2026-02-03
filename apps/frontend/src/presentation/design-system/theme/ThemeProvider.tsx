/**
 * Theme Provider - مزود الثيم
 * Centralized theme management with React Context
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ColorMode, colors, ColorPalette } from './colors'

interface ThemeContextType {
  mode: ColorMode
  toggleMode: () => void
  setMode: (mode: ColorMode) => void
  colors: ColorPalette
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultMode?: ColorMode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
}) => {
  const [mode, setModeState] = useState<ColorMode>(defaultMode)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ColorMode | null

    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setModeState(savedMode)
    } else {
      // Check system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      if (mediaQuery.matches) {
        setModeState('dark')
      }

      // Listen for system preference changes
      const handler = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme-mode')) {
          setModeState(e.matches ? 'dark' : 'light')
        }
      }

      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
    // Return undefined for the other code path
    return undefined
  }, [])

  // Update DOM and localStorage when mode changes
  useEffect(() => {
    const root = document.documentElement

    // Update class
    root.classList.remove('light', 'dark')
    root.classList.add(mode)

    // Save to localStorage
    localStorage.setItem('theme-mode', mode)

    // Update CSS variables
    const palette = colors[mode]

    // Background colors
    Object.entries(palette.background).forEach(([key, value]) => {
      root.style.setProperty(`--color-bg-${key}`, value)
    })

    // Text colors
    Object.entries(palette.text).forEach(([key, value]) => {
      root.style.setProperty(`--color-text-${key}`, value)
    })

    // Border colors
    Object.entries(palette.border).forEach(([key, value]) => {
      root.style.setProperty(`--color-border-${key}`, value)
    })

    // Primary colors
    Object.entries(palette.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value)
    })

    // Accent colors
    Object.entries(palette.accent).forEach(([key, value]) => {
      root.style.setProperty(`--color-accent-${key}`, value)
    })

    // State colors
    Object.entries(palette.success).forEach(([key, value]) => {
      root.style.setProperty(`--color-success-${key}`, value)
    })
    Object.entries(palette.error).forEach(([key, value]) => {
      root.style.setProperty(`--color-error-${key}`, value)
    })
    Object.entries(palette.warning).forEach(([key, value]) => {
      root.style.setProperty(`--color-warning-${key}`, value)
    })
    Object.entries(palette.info).forEach(([key, value]) => {
      root.style.setProperty(`--color-info-${key}`, value)
    })

    // Glass effect
    const glass = colors.glass[mode]
    Object.entries(glass).forEach(([key, value]) => {
      root.style.setProperty(`--glass-${key}`, value)
    })

    // Gradients (same for both modes)
    Object.entries(colors.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value)
    })
  }, [mode])

  const toggleMode = () => {
    setModeState(current => (current === 'light' ? 'dark' : 'light'))
  }

  const setMode = (newMode: ColorMode) => {
    setModeState(newMode)
  }

  const value: ThemeContextType = {
    mode,
    toggleMode,
    setMode,
    colors: colors[mode],
    isDark: mode === 'dark',
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Custom hook to use theme
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

// Export types
export type { ThemeContextType }
