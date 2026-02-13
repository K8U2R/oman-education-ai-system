/**
 * HeaderSearch Component - مكون Search للـ Header
 *
 * مكون wrapper لـ SearchBar مع Keyboard Shortcuts
 */

import React, { useEffect, useRef } from 'react'
import SearchBar from '@/presentation/components/layout/SearchBar/SearchBar'
import type { HeaderSearchProps } from '../../types'
import { cn } from '@/presentation/components/ui/utils/classNames'
import styles from './HeaderSearch.module.scss'

/**
 * HeaderSearch Component
 *
 * @example
 * ```tsx
 * <HeaderSearch expandable isExpanded={isExpanded} onToggle={handleToggle} />
 * ```
 */
export const HeaderSearch: React.FC<HeaderSearchProps> = React.memo(
  ({ expandable = true, isExpanded = false, onToggle, className }) => {
    const searchRef = useRef<HTMLDivElement>(null)

    // Keyboard Shortcut: Ctrl+K / Cmd+K to focus search
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault()
          // Focus search input if available
          const searchInput = searchRef.current?.querySelector('input')
          if (searchInput) {
            searchInput.focus()
            onToggle?.()
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [onToggle])

    return (
      <div
        ref={searchRef}
        className={cn(
          styles.search,
          expandable && styles['search--expandable'],
          isExpanded && styles['search--expanded'],
          className
        )}
      >
        <SearchBar />
      </div>
    )
  }
)

HeaderSearch.displayName = 'HeaderSearch'
