/**
 * Accordion Component - مكون القائمة المنبثقة
 *
 * مكون قائمة منبثقة قابلة لإعادة الاستخدام
 */

import React, { useState, createContext, useContext } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../utils/classNames'
import './Accordion.scss'

interface AccordionContextValue {
  openItems: Set<string>
  toggleItem: (value: string) => void
  allowMultiple?: boolean
  variant?: 'default' | 'bordered' | 'separated'
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

const useAccordionContext = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within Accordion')
  }
  return context
}

interface AccordionProps {
  defaultValue?: string | string[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  allowMultiple?: boolean
  variant?: 'default' | 'bordered' | 'separated'
  className?: string
  children: React.ReactNode
}

export const Accordion: React.FC<AccordionProps> = ({
  defaultValue,
  value: controlledValue,
  onChange,
  allowMultiple = false,
  variant = 'default',
  className = '',
  children,
}) => {
  const getInitialValue = (): Set<string> => {
    if (controlledValue !== undefined) {
      return new Set(Array.isArray(controlledValue) ? controlledValue : [controlledValue])
    }
    if (defaultValue !== undefined) {
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue])
    }
    return new Set()
  }

  const [internalValue, setInternalValue] = useState<Set<string>>(getInitialValue)
  const openItems =
    controlledValue !== undefined
      ? new Set(Array.isArray(controlledValue) ? controlledValue : [controlledValue])
      : internalValue

  const toggleItem = (itemValue: string) => {
    const newOpenItems = new Set(openItems)

    if (newOpenItems.has(itemValue)) {
      newOpenItems.delete(itemValue)
    } else {
      if (!allowMultiple) {
        newOpenItems.clear()
      }
      newOpenItems.add(itemValue)
    }

    if (controlledValue === undefined) {
      setInternalValue(newOpenItems)
    }

    const valueToReturn = allowMultiple
      ? Array.from(newOpenItems)
      : Array.from(newOpenItems)[0] || ''

    onChange?.(valueToReturn)
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple, variant }}>
      <div className={cn('accordion', `accordion--${variant}`, className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

// Internal context for AccordionItem
interface AccordionItemContextValue {
  value: string
  isOpen: boolean
}

const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined)

export const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  className = '',
  children,
}) => {
  const { openItems, variant } = useAccordionContext()
  const isOpen = openItems.has(value)

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        className={cn(
          'accordion__item',
          `accordion__item--${variant}`,
          isOpen && 'accordion__item--open',
          className
        )}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

interface AccordionTriggerProps {
  className?: string
  children: React.ReactNode
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ className = '', children }) => {
  const { toggleItem, variant } = useAccordionContext()
  const itemContext = useContext(AccordionItemContext)
  if (!itemContext) {
    throw new Error('AccordionTrigger must be used within AccordionItem')
  }
  const { value, isOpen } = itemContext

  return (
    <button
      type="button"
      className={cn(
        'accordion__trigger',
        `accordion__trigger--${variant}`,
        isOpen && 'accordion__trigger--open',
        className
      )}
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
    >
      <span className="accordion__trigger-content">{children}</span>
      <ChevronDown
        className={cn('accordion__trigger-icon', isOpen && 'accordion__trigger-icon--open')}
      />
    </button>
  )
}

interface AccordionContentProps {
  className?: string
  children: React.ReactNode
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ className = '', children }) => {
  const itemContext = useContext(AccordionItemContext)
  if (!itemContext) {
    throw new Error('AccordionContent must be used within AccordionItem')
  }
  const { isOpen } = itemContext

  return (
    <div className={cn('accordion__content', isOpen && 'accordion__content--open', className)}>
      <div className="accordion__content-inner">{children}</div>
    </div>
  )
}
