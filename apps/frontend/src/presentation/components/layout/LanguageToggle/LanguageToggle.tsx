import React from 'react'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useI18n } from '@/application'
import styles from './LanguageToggle.module.scss'

const LanguageToggle: React.FC = () => {
  const { t } = useTranslation('common')
  const { language, changeLanguage } = useI18n()

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    changeLanguage(newLang)
  }

  return (
    <button
      className={styles.toggle}
      onClick={toggleLanguage}
      aria-label={t('language.toggle')}
      title={t('language.current', { lang: language === 'ar' ? 'العربية' : 'English' })}
    >
      <Globe className={styles.toggle__icon} />
      <span className={styles.toggle__text}>{language === 'ar' ? 'AR' : 'EN'}</span>
    </button>
  )
}

export default LanguageToggle
