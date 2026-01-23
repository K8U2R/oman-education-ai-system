import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { themeService, ThemeMode, AgeTheme, ThemeConfig } from '@/application'
import { colors } from '@/presentation/design-system/theme/colors'

interface ThemeContextType {
  theme: ThemeConfig
  setMode: (mode: ThemeMode) => void
  setAgeTheme: (ageTheme: AgeTheme) => void
  effectiveMode: 'light' | 'dark'
  // New: Design System colors
  colors: typeof colors.light | typeof colors.dark
  isDark: boolean
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * ThemeProvider - مزود سياق الثيم للتطبيق
 *
 * يقوم بإدارة حالة الثيم (light/dark/system) وثيم العمر (kids/teens/...)
 * ويطبق الكلاسات والمتغيرات CSS المناسبة على <html> بناءً على الإعدادات.
 *
 * Enhanced with Design System:
 * - Color tokens (160+ values)
 * - CSS variable injection
 * - Perfect dark mode support
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(themeService.getTheme())
  const [effectiveMode, setEffectiveMode] = useState<'light' | 'dark'>(
    themeService.getEffectiveMode()
  )

  /**
   * Inject Design System CSS variables into document
   */
  const injectCSSVariables = useCallback((mode: 'light' | 'dark') => {
    const root = document.documentElement
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

    // Shadows
    Object.entries(colors.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })
  }, [])

  /**
   * تطبيق كلاسات الثيم على عنصر document.documentElement
   */
  const applyThemeClasses = useCallback(() => {
    const mode = themeService.getEffectiveMode()
    const ageTheme = theme.ageTheme || 'default'

    // إزالة كلاسات الوضع (light/dark)
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'light', 'dark')
    document.documentElement.classList.add(`theme-${mode}`, mode)

    // إزالة كلاسات ثيم العمر
    document.documentElement.classList.remove(
      'theme-kids',
      'theme-teens',
      'theme-adults',
      'theme-university'
    )

    // إضافة كلاس ثيم العمر
    if (ageTheme) {
      document.documentElement.classList.add(`theme-${ageTheme}`)
    }

    // Inject Design System CSS variables
    injectCSSVariables(mode)
  }, [theme.ageTheme, injectCSSVariables])

  /**
   * تحديث الوضع الفعال وتطبيق الكلاسات عند تغيير الثيم
   */
  const updateThemeState = useCallback(() => {
    const newEffectiveMode = themeService.getEffectiveMode()
    setEffectiveMode(newEffectiveMode)
    applyThemeClasses()
  }, [applyThemeClasses])

  // تأثير جانبي لتطبيق الثيم عند التحميل الأولي ومتابعة التغييرات
  useEffect(() => {
    // تطبيق الثيم فوراً عند التركيب
    applyThemeClasses()

    // إذا كان الوضع system، نستمع لتغييرات تفضيلات النظام
    if (theme.mode === 'system') {
      updateThemeState()
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = () => {
      if (theme.mode === 'system') {
        updateThemeState()
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange)
    }
  }, [theme.mode, theme.ageTheme, applyThemeClasses, updateThemeState])

  /**
   * تغيير وضع الثيم (light | dark | system)
   */
  const setMode = (mode: ThemeMode) => {
    themeService.setMode(mode)
    setTheme(themeService.getTheme())
    // في حالة system سيتم التحديث تلقائياً عبر الـ effect
    if (mode !== 'system') {
      setEffectiveMode(themeService.getEffectiveMode())
    }
  }

  /**
   * Toggle between light and dark modes
   */
  const toggleMode = () => {
    const newMode: ThemeMode = effectiveMode === 'light' ? 'dark' : 'light'
    setMode(newMode)
  }

  /**
   * تغيير ثيم العمر
   */
  const setAgeTheme = (ageTheme: AgeTheme) => {
    themeService.setAgeTheme(ageTheme)
    setTheme(themeService.getTheme())
  }

  const contextValue: ThemeContextType = {
    theme,
    setMode,
    setAgeTheme,
    effectiveMode,
    // New Design System additions
    colors: colors[effectiveMode],
    isDark: effectiveMode === 'dark',
    toggleMode,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}
