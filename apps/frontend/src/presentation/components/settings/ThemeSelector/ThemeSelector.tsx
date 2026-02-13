import React from 'react'
import { Moon, Sun, Monitor, Baby, Users, GraduationCap, School } from 'lucide-react'
import { useTheme } from '@/presentation/providers/ThemeProvider'
import type { ThemeMode, AgeTheme } from '@/application/core/services/ui/design/theme.service'

const ThemeSelector: React.FC = () => {
  const { theme, setMode, setAgeTheme, effectiveMode } = useTheme()

  const modeOptions: {
    value: ThemeMode
    label: string
    icon: React.ReactNode
    description: string
  }[] = [
      {
        value: 'system',
        label: 'نظام',
        icon: <Monitor className="w-5 h-5" />,
        description: 'يتبع إعدادات النظام',
      },
      {
        value: 'light',
        label: 'فاتح',
        icon: <Sun className="w-5 h-5" />,
        description: 'الوضع النهاري',
      },
      {
        value: 'dark',
        label: 'داكن',
        icon: <Moon className="w-5 h-5" />,
        description: 'الوضع الليلي',
      },
    ]

  const ageThemeOptions: {
    value: AgeTheme
    label: string
    icon: React.ReactNode
    description: string
  }[] = [
      {
        value: 'child',
        label: 'أطفال',
        icon: <Baby className="w-5 h-5" />,
        description: 'من الصف الأول إلى السادس',
      },
      {
        value: 'youth',
        label: 'مراهقين',
        icon: <Users className="w-5 h-5" />,
        description: 'من الصف السابع إلى الثاني عشر',
      },
      {
        value: 'adult',
        label: 'بالغين',
        icon: <GraduationCap className="w-5 h-5" />,
        description: 'للمعلمين والبالغين',
      },
      {
        value: 'adult',
        label: 'جامعات',
        icon: <School className="w-5 h-5" />,
        description: 'للتعليم العالي',
      },
    ]

  return (
    <div className="theme-selector">
      {/* Theme Mode Selection */}
      <div className="theme-selector__section">
        <h4 className="theme-selector__section-title">وضع العرض</h4>
        <p className="theme-selector__section-description">اختر الوضع المناسب لك</p>
        <div className="theme-selector__options">
          {modeOptions.map(option => (
            <button
              key={option.value}
              className={`theme-selector__option ${theme.mode === option.value ? 'theme-selector__option--active' : ''}`}
              onClick={() => setMode(option.value)}
            >
              <div className="theme-selector__option-icon">{option.icon}</div>
              <div className="theme-selector__option-content">
                <span className="theme-selector__option-label">{option.label}</span>
                <span className="theme-selector__option-description">{option.description}</span>
              </div>
              {theme.mode === option.value && (
                <div className="theme-selector__option-check">
                  <div className="theme-selector__option-check-inner" />
                </div>
              )}
            </button>
          ))}
        </div>
        {theme.mode === 'system' && (
          <div className="theme-selector__system-info">
            <p className="theme-selector__system-info-text">
              الوضع الحالي: <strong>{effectiveMode === 'dark' ? 'داكن' : 'فاتح'}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Age Theme Selection */}
      <div className="theme-selector__section">
        <h4 className="theme-selector__section-title">ثيم العمر</h4>
        <p className="theme-selector__section-description">اختر الثيم المناسب لعمرك</p>
        <div className="theme-selector__options theme-selector__options--grid">
          {ageThemeOptions.map(option => (
            <button
              key={option.value}
              className={`theme-selector__option theme-selector__option--age ${theme.ageTheme === option.value ? 'theme-selector__option--active' : ''}`}
              onClick={() => setAgeTheme(option.value)}
            >
              <div className="theme-selector__option-icon">{option.icon}</div>
              <div className="theme-selector__option-content">
                <span className="theme-selector__option-label">{option.label}</span>
                <span className="theme-selector__option-description">{option.description}</span>
              </div>
              {theme.ageTheme === option.value && (
                <div className="theme-selector__option-check">
                  <div className="theme-selector__option-check-inner" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
