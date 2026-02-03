/**
 * Accessibility Utilities - أدوات إمكانية الوصول
 *
 * أدوات مساعدة لتحسين إمكانية الوصول (A11y)
 */

import React from 'react'

/**
 * ARIA Attributes Helper
 */
export const aria = {
  /**
   * إنشاء ARIA label
   */
  label: (text: string): { 'aria-label': string } => ({
    'aria-label': text,
  }),

  /**
   * إنشاء ARIA labelledby
   */
  labelledBy: (id: string): { 'aria-labelledby': string } => ({
    'aria-labelledby': id,
  }),

  /**
   * إنشاء ARIA describedby
   */
  describedBy: (id: string): { 'aria-describedby': string } => ({
    'aria-describedby': id,
  }),

  /**
   * إنشاء ARIA live region
   */
  live: (polite: boolean = true): { 'aria-live': 'polite' | 'assertive' } => ({
    'aria-live': polite ? 'polite' : 'assertive',
  }),

  /**
   * إنشاء ARIA busy state
   */
  busy: (isBusy: boolean): { 'aria-busy': boolean } => ({
    'aria-busy': isBusy,
  }),

  /**
   * إنشاء ARIA expanded state
   */
  expanded: (isExpanded: boolean): { 'aria-expanded': boolean } => ({
    'aria-expanded': isExpanded,
  }),

  /**
   * إنشاء ARIA hidden
   */
  hidden: (isHidden: boolean): { 'aria-hidden': boolean } => ({
    'aria-hidden': isHidden,
  }),

  /**
   * إنشاء ARIA current
   */
  current: (
    isCurrent: boolean | 'page' | 'step' | 'location' | 'date' | 'time'
  ): {
    'aria-current': boolean | 'page' | 'step' | 'location' | 'date' | 'time'
  } => ({
    'aria-current': isCurrent,
  }),

  /**
   * إنشاء ARIA role
   */
  role: (role: string): { role: string } => ({
    role,
  }),
}

/**
 * Keyboard Navigation Helper
 */
export const keyboard = {
  /**
   * Handle Enter key
   */
  onEnter: (handler: () => void) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handler()
      }
    },
  }),

  /**
   * Handle Escape key
   */
  onEscape: (handler: () => void) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handler()
      }
    },
  }),

  /**
   * Handle Arrow keys
   */
  onArrow: (handlers: {
    up?: () => void
    down?: () => void
    left?: () => void
    right?: () => void
  }) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          handlers.up?.()
          break
        case 'ArrowDown':
          e.preventDefault()
          handlers.down?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handlers.left?.()
          break
        case 'ArrowRight':
          e.preventDefault()
          handlers.right?.()
          break
      }
    },
  }),

  /**
   * Handle Tab navigation
   */
  onTab: (handler: (direction: 'forward' | 'backward') => void) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Tab') {
        handler(e.shiftKey ? 'backward' : 'forward')
      }
    },
  }),

  /**
   * Make element focusable
   */
  focusable: (tabIndex: number = 0): { tabIndex: number } => ({
    tabIndex,
  }),

  /**
   * Make element not focusable
   */
  notFocusable: (): { tabIndex: number } => ({
    tabIndex: -1,
  }),
}

/**
 * Focus Management Helper
 */
export const focus = {
  /**
   * Focus element by ID
   */
  byId: (id: string): void => {
    const element = document.getElementById(id)
    if (element) {
      element.focus()
    }
  },

  /**
   * Focus first focusable element in container
   */
  first: (container: HTMLElement | null): void => {
    if (!container) return

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )

    if (focusable.length > 0) {
      focusable[0]?.focus()
    }
  },

  /**
   * Focus last focusable element in container
   */
  last: (container: HTMLElement | null): void => {
    if (!container) return

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )

    if (focusable.length > 0) {
      const lastElement = focusable[focusable.length - 1]
      if (lastElement) {
        lastElement.focus()
      }
    }
  },

  /**
   * Trap focus within container
   */
  trap: (container: HTMLElement | null): (() => void) => {
    if (!container) return () => {}

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const handleTab = (e: KeyboardEvent): void => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTab)

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTab)
    }
  },
}

/**
 * Screen Reader Helper
 */
export const screenReader = {
  /**
   * Announce message to screen reader
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },

  /**
   * Create screen reader only text
   */
  only: (text: string): React.ReactElement => {
    return React.createElement('span', { className: 'sr-only', 'aria-live': 'polite' }, text)
  },
}

/**
 * Color Contrast Helper
 */
export const contrast = {
  /**
   * Calculate relative luminance
   */
  getLuminance: (r: number, g: number, b: number): number => {
    const normalize = (val: number): number => {
      const normalized = val / 255
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4)
    }

    const rs = normalize(r)
    const gs = normalize(g)
    const bs = normalize(b)

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  },

  /**
   * Calculate contrast ratio
   */
  getContrastRatio: (
    color1: [number, number, number],
    color2: [number, number, number]
  ): number => {
    const lum1 = contrast.getLuminance(...color1)
    const lum2 = contrast.getLuminance(...color2)
    const lighter = Math.max(lum1, lum2)
    const darker = Math.min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)
  },

  /**
   * Check if contrast meets WCAG AA standard (4.5:1 for normal text)
   */
  meetsWCAGAA: (color1: [number, number, number], color2: [number, number, number]): boolean => {
    return contrast.getContrastRatio(color1, color2) >= 4.5
  },

  /**
   * Check if contrast meets WCAG AAA standard (7:1 for normal text)
   */
  meetsWCAGAAA: (color1: [number, number, number], color2: [number, number, number]): boolean => {
    return contrast.getContrastRatio(color1, color2) >= 7
  },
}
