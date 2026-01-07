/**
 * Dropdown Component - مكون القائمة المنسدلة
 *
 * مكون قائمة منسدلة قابلة لإعادة الاستخدام
 */

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../utils/classNames'
import './Dropdown.scss'

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
  placeholder = 'اختر...',
  disabled = false,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className = '',
  trigger,
  position = 'bottom-left',
}) => {
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

  const positionClass = `dropdown__menu--${position}`

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'dropdown',
        `dropdown--${size}`,
        `dropdown--${variant}`,
        fullWidth && 'dropdown--full-width',
        disabled && 'dropdown--disabled',
        className
      )}
    >
      {trigger ? (
        <div onClick={() => !disabled && setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <button
          type="button"
          className="dropdown__trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="dropdown__trigger-content">
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <span className="dropdown__trigger-icon">{selectedOption.icon}</span>
                )}
                <span className="dropdown__trigger-label">{selectedOption.label}</span>
              </>
            ) : (
              <span className="dropdown__trigger-placeholder">{placeholder}</span>
            )}
          </span>
          <ChevronDown
            className={cn('dropdown__trigger-arrow', isOpen && 'dropdown__trigger-arrow--open')}
          />
        </button>
      )}

      {isOpen && (
        <div className={cn('dropdown__menu', positionClass)} role="listbox">
          {options.map((option, index) => {
            if (option.divider) {
              return <div key={`divider-${index}`} className="dropdown__divider" />
            }

            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  'dropdown__option',
                  option.value === value && 'dropdown__option--selected',
                  option.disabled && 'dropdown__option--disabled'
                )}
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                role="option"
                aria-selected={option.value === value}
              >
                {option.icon && <span className="dropdown__option-icon">{option.icon}</span>}
                <span className="dropdown__option-label">{option.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
