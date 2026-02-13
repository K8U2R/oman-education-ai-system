/**
 * Dropdown Component - مكون القائمة المنسدلة
 *
 * مكون قائمة منسدلة قابلة لإعادة الاستخدام
 */

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import styles from './Dropdown.module.scss'

export interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  divider?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'filled'
  fullWidth?: boolean
  className?: string
  trigger?: React.ReactNode
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  size = 'md',
  variant = 'default', // Ignored for now or mapped if needed
  fullWidth = false,
  className = '',
  trigger,
  position = 'bottom-left',
}) => {
  const { t } = useTranslation()
  const displayPlaceholder = placeholder || t('common.choose')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled || option.divider) return
    onChange?.(option.value)
    setIsOpen(false)
  }

  const dropdownClass = useMemo(() => {
    return [
      styles.dropdown,
      styles[`dropdown--${size}`],
      styles[`dropdown--${variant}`],
      fullWidth ? styles['dropdown--full-width'] : '',
      disabled ? styles['dropdown--disabled'] : '',
      className
    ].filter(Boolean).join(' ')
  }, [size, variant, fullWidth, disabled, className])

  const menuClass = useMemo(() => {
    return [
      styles.menu,
      styles[`menu--${position}`]
    ].filter(Boolean).join(' ')
  }, [position])

  return (
    <div ref={dropdownRef} className={dropdownClass}>
      {trigger ? (
        <div onClick={() => !disabled && setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <button
          type="button"
          className={styles.trigger}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={styles.triggerContent}>
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <span className={styles.triggerIcon}>{selectedOption.icon}</span>
                )}
                <span className={styles.triggerLabel}>{selectedOption.label}</span>
              </>
            ) : (
              <span className={styles.triggerPlaceholder}>{displayPlaceholder}</span>
            )}
          </span>
          <ChevronDown
            className={`${styles.arrow} ${isOpen ? styles['arrow--open'] : ''}`}
          />
        </button>
      )}

      {isOpen && (
        <div className={menuClass} role="listbox">
          {options.map((option, index) => {
            if (option.divider) {
              return <div key={`divider-${index}`} className={styles.divider} />
            }

            return (
              <button
                key={option.value}
                type="button"
                className={`${styles.option} ${option.value === value ? styles['option--selected'] : ''} ${option.disabled ? styles['option--disabled'] : ''}`}
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                role="option"
                aria-selected={option.value === value}
              >
                {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
                <span className={styles.optionLabel}>{option.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
