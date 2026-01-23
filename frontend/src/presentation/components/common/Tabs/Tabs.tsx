/**
 * Tabs Component - مكون التبويبات
 *
 * مكون تبويبات قابلة لإعادة الاستخدام
 */

import React, { useState, createContext, useContext } from 'react'
import { cn } from '../utils/classNames'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

interface TabsProps {
  defaultValue: string
  value?: string
  onChange?: (value: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onChange,
  variant = 'default',
  size = 'md',
  className = '',
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const activeTab = controlledValue ?? internalValue

  const setActiveTab = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, size }}>
      <div className={cn('tabs', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

export const TabsList: React.FC<TabsListProps> = ({ className = '', children }) => {
  const { variant, size } = useTabsContext()
  return (
    <div
      className={cn('tabs__list', `tabs__list--${variant}`, `tabs__list--${size}`, className)}
      role="tablist"
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  className?: string
  disabled?: boolean
  children: React.ReactNode
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className = '',
  disabled = false,
  children,
}) => {
  const { activeTab, setActiveTab, variant } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      type="button"
      className={cn(
        'tabs__trigger',
        `tabs__trigger--${variant}`,
        isActive && 'tabs__trigger--active',
        disabled && 'tabs__trigger--disabled',
        className
      )}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-content-${value}`}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, className = '', children }) => {
  const { activeTab } = useTabsContext()
  const isActive = activeTab === value

  if (!isActive) return null

  return (
    <div
      className={cn('tabs__content', className)}
      role="tabpanel"
      id={`tab-content-${value}`}
      aria-labelledby={`tab-trigger-${value}`}
    >
      {children}
    </div>
  )
}
