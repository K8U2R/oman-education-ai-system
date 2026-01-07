/**
 * Tooltip Component - مكون التلميح
 *
 * مكون تلميح قابلة لإعادة الاستخدام
 */

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../utils/classNames'
import './Tooltip.scss'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const scrollY = window.scrollY
      const scrollX = window.scrollX

      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = triggerRect.top + scrollY - tooltipRect.height - 8
          left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + scrollY + 8
          left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.left + scrollX - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.right + scrollX + 8
          break
      }

      // Adjust if tooltip goes off screen
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left < 8) left = 8
      if (left + tooltipRect.width > viewportWidth - 8) {
        left = viewportWidth - tooltipRect.width - 8
      }
      if (top < scrollY + 8) top = scrollY + 8
      if (top + tooltipRect.height > scrollY + viewportHeight - 8) {
        top = scrollY + viewportHeight - tooltipRect.height - 8
      }

      setTooltipPosition({ top, left })
    }
  }, [isVisible, position])

  const handleMouseEnter = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const handleFocus = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
      })}
      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          className={cn('tooltip', `tooltip--${position}`, className)}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </>
  )
}
