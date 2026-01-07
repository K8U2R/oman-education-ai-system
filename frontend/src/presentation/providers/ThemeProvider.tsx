import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { themeService, ThemeMode, AgeTheme, ThemeConfig } from '@/application'

interface ThemeContextType {
  theme: ThemeConfig
  setMode: (mode: ThemeMode) => void
  setAgeTheme: (ageTheme: AgeTheme) => void
  effectiveMode: 'light' | 'dark'
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
 * ويطبق الكلاسات المناسبة على <html> بناءً على الإعدادات والتفضيلات النظامية.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(themeService.getTheme())
  const [effectiveMode, setEffectiveMode] = useState<'light' | 'dark'>(
    themeService.getEffectiveMode()
  )

  /**
   * تطبيق كلاسات الثيم على عنصر document.documentElement
   */
  const applyThemeClasses = useCallback(() => {
    const mode = themeService.getEffectiveMode()
    const ageTheme = theme.ageTheme || 'default'

    // إزالة كلاسات الوضع (light/dark)
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    document.documentElement.classList.add(`theme-${mode}`)

    // إزالة كلاسات ثيم العمر
    document.documentElement.classList.remove(
      'theme-kids',
      'theme-teens',
      'theme-adults',
      'theme-university'
    )

    // إضافة كلاس ثيم العمر (ageTheme هو AgeTheme type وليس 'default')
    if (ageTheme) {
      document.documentElement.classList.add(`theme-${ageTheme}`)
    }
  }, [theme.ageTheme])

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
   * تغيير ثيم العمر
   */
  const setAgeTheme = (ageTheme: AgeTheme) => {
    themeService.setAgeTheme(ageTheme)
    setTheme(themeService.getTheme())
    // الكلاسات ستُحدَّث تلقائياً عبر الـ effect بسبب تبعية theme.ageTheme
  }

  const contextValue: ThemeContextType = {
    theme,
    setMode,
    setAgeTheme,
    effectiveMode,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}
