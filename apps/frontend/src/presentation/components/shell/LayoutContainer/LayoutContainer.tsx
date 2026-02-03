/**
 * LayoutContainer Component - مكون حاوية التخطيط
 *
 * مكون مشترك لحاوية المحتوى في Layouts
 */

import React from 'react'

interface LayoutContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
}

export const LayoutContainer: React.FC<LayoutContainerProps> = ({
  children,
  className = '',
  maxWidth = 'full', // Default to full width to prevent centering
  padding = true,
}) => {
  const maxWidthClass = `layout-container--max-width-${maxWidth}`
  const paddingClass = padding ? 'layout-container--padding' : ''

  return (
    <div className={`layout-container ${maxWidthClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  )
}
