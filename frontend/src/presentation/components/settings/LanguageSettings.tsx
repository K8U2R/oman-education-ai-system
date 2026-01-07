/**
 * Language Settings Component - إعدادات اللغة
 *
 * مكون لإدارة إعدادات اللغة والمنطقة
 */

import React, { useState, useEffect } from 'react'
import { Globe, Clock, Calendar } from 'lucide-react'
import { useI18n } from '@/application'
import { Button, Dropdown, Card } from '../common'
import './LanguageSettings.scss'

const LanguageSettings: React.FC = () => {
  const { language, changeLanguage } = useI18n()
  const [timezone, setTimezone] = useState(() => {
    const saved = localStorage.getItem('user_timezone')
    return saved || Intl.DateTimeFormat().resolvedOptions().timeZone
  })
  const [dateFormat, setDateFormat] = useState<'short' | 'medium' | 'long'>(() => {
    const saved = localStorage.getItem('user_date_format')
    return (saved as 'short' | 'medium' | 'long') || 'medium'
  })

  useEffect(() => {
    const savedTimezone = localStorage.getItem('user_timezone')
    if (savedTimezone) {
      setTimezone(savedTimezone)
    }
  }, [])

  useEffect(() => {
    const savedDateFormat = localStorage.getItem('user_date_format')
    if (savedDateFormat) {
      setDateFormat(savedDateFormat as 'short' | 'medium' | 'long')
    }
  }, [])

  const languages = [
    { value: 'ar' as const, label: 'العربية', flag: '🇴🇲' },
    { value: 'en' as const, label: 'English', flag: '🇬🇧' },
  ]

  const timezones = [
    { value: 'Asia/Muscat', label: 'مسقط (GMT+4)' },
    { value: 'UTC', label: 'UTC (GMT+0)' },
    { value: 'America/New_York', label: 'نيويورك (GMT-5)' },
    { value: 'Europe/London', label: 'لندن (GMT+0)' },
  ]

  const dateFormats = [
    { value: 'short' as const, label: 'قصير (12/25/2024)' },
    { value: 'medium' as const, label: 'متوسط (25 ديسمبر 2024)' },
    { value: 'long' as const, label: 'طويل (25 ديسمبر 2024)' },
  ]

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    changeLanguage(lang)
  }

  const handleTimezoneChange = (tz: string) => {
    setTimezone(tz)
    // Save to storage
    localStorage.setItem('user_timezone', tz)
  }

  const handleDateFormatChange = (format: 'short' | 'medium' | 'long') => {
    setDateFormat(format)
    // Save to storage
    localStorage.setItem('user_date_format', format)
  }

  const previewDate = new Date()
  const previewOptions: Intl.DateTimeFormatOptions = {
    dateStyle: dateFormat,
    timeStyle: 'short',
    timeZone: timezone,
  }

  return (
    <Card className="language-settings">
      <div className="language-settings__header">
        <Globe className="language-settings__icon" />
        <h3 className="language-settings__title">اللغة والمنطقة</h3>
      </div>

      <div className="language-settings__content">
        {/* Language Selection */}
        <div className="language-settings__field">
          <label className="language-settings__label">
            <Globe className="language-settings__label-icon" />
            اللغة
          </label>
          <div className="language-settings__options">
            {languages.map(lang => (
              <Button
                key={lang.value}
                variant={language === lang.value ? 'primary' : 'outline'}
                onClick={() => handleLanguageChange(lang.value)}
                className="language-settings__option"
              >
                <span className="language-settings__flag">{lang.flag}</span>
                {lang.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Timezone Selection */}
        <div className="language-settings__field">
          <label className="language-settings__label">
            <Clock className="language-settings__label-icon" />
            المنطقة الزمنية
          </label>
          <Dropdown
            options={timezones.map(tz => ({
              value: tz.value,
              label: tz.label,
            }))}
            value={timezone}
            onChange={handleTimezoneChange}
            placeholder="اختر المنطقة الزمنية"
            trigger={
              <Button variant="outline" className="language-settings__dropdown-trigger">
                {timezones.find(tz => tz.value === timezone)?.label || timezone}
              </Button>
            }
          />
        </div>

        {/* Date Format Selection */}
        <div className="language-settings__field">
          <label className="language-settings__label">
            <Calendar className="language-settings__label-icon" />
            تنسيق التاريخ والوقت
          </label>
          <div className="language-settings__options">
            {dateFormats.map(format => (
              <Button
                key={format.value}
                variant={dateFormat === format.value ? 'primary' : 'outline'}
                onClick={() => handleDateFormatChange(format.value)}
                className="language-settings__option"
              >
                {format.label}
              </Button>
            ))}
          </div>
          <div className="language-settings__preview">
            <p className="language-settings__preview-label">معاينة:</p>
            <p className="language-settings__preview-value">
              {previewDate.toLocaleString(language === 'ar' ? 'ar-OM' : 'en-US', previewOptions)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default LanguageSettings
