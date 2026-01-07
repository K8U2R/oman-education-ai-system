import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/presentation/providers/ThemeProvider'
import './ThemeToggle.scss'

const ThemeToggle: React.FC = () => {
  const { theme, setMode, effectiveMode } = useTheme()

  const toggleMode = () => {
    if (theme.mode === 'system') {
      setMode('light')
    } else if (theme.mode === 'light') {
      setMode('dark')
    } else {
      setMode('system')
    }
  }

  const getIcon = () => {
    if (theme.mode === 'system') {
      return <Monitor className="w-5 h-5" />
    }
    return effectiveMode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleMode}
      aria-label="تبديل الوضع"
      title={`الوضع الحالي: ${theme.mode === 'system' ? 'نظام' : theme.mode === 'dark' ? 'داكن' : 'فاتح'}`}
    >
      {getIcon()}
    </button>
  )
}

export default ThemeToggle
