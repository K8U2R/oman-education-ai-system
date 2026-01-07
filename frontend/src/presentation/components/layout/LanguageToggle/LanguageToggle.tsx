import React from 'react'
import { Globe } from 'lucide-react'
import { useI18n } from '@/application'
import './LanguageToggle.scss'

const LanguageToggle: React.FC = () => {
  const { language, changeLanguage } = useI18n()

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    changeLanguage(newLang)
  }

  return (
    <button
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label="تبديل اللغة"
      title={`اللغة الحالية: ${language === 'ar' ? 'العربية' : 'English'}`}
    >
      <Globe className="language-toggle__icon" />
      <span className="language-toggle__text">{language === 'ar' ? 'AR' : 'EN'}</span>
    </button>
  )
}

export default LanguageToggle
