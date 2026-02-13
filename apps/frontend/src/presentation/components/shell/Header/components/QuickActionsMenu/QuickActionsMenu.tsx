/**
 * QuickActionsMenu Component - قائمة الإجراءات السريعة
 *
 * قائمة منسدلة للإجراءات السريعة مع Keyboard Shortcuts
 * T047: Refactored to use CSS Modules for secure overlay handling
 */

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, FileText, BookOpen, Users, Settings, Search, X, ChevronRight } from 'lucide-react'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useRole } from '@/features/user-authentication-management'
import { useUIStore } from '@/application/shared/store'
import type { QuickAction } from '../../types'

import styles from './QuickActionsMenu.module.scss'

/**
 * Quick Actions Configuration
 */
const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'search',
    label: 'بحث سريع',
    icon: Search,
    shortcut: 'Ctrl+K',
    onClick: () => {
      // Focus search input
      const searchInput = document.querySelector<HTMLInputElement>('.search-bar__input')
      searchInput?.focus()
    },
  },
  {
    id: 'new-lesson',
    label: 'درس جديد',
    icon: BookOpen,
    shortcut: 'Ctrl+N',
    path: ROUTES.LESSONS,
    requiredRole: 'teacher',
  },
  {
    id: 'new-document',
    label: 'مستند جديد',
    icon: FileText,
    shortcut: 'Ctrl+D',
    path: ROUTES.LESSONS,
  },
  {
    id: 'new-user',
    label: 'مستخدم جديد',
    icon: Users,
    shortcut: 'Ctrl+U',
    path: ROUTES.ADMIN_USERS,
    requiredRole: 'admin',
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    shortcut: 'Ctrl+,',
    path: ROUTES.SETTINGS,
  },
]

/**
 * QuickActionsMenu Component
 *
 * @example
 * ```tsx
 * <QuickActionsMenu />
 * ```
 */
export const QuickActionsMenu: React.FC = () => {
  const navigate = useNavigate()
  const { userRole } = useRole()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  // Filter actions by role
  const filteredActions = React.useMemo(() => {
    return QUICK_ACTIONS.filter(action => {
      if (!action.requiredRole) return true
      return userRole === action.requiredRole
    })
  }, [userRole])

  // Filter by search query
  const visibleActions = React.useMemo(() => {
    if (!searchQuery.trim()) return filteredActions
    const query = searchQuery.toLowerCase()
    return filteredActions.filter(action => action.label.toLowerCase().includes(query))
  }, [filteredActions, searchQuery])

  // Keyboard Shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open quick actions
      if ((event.ctrlKey || event.metaKey) && event.key === 'k' && !event.shiftKey) {
        // Check if search input is not focused
        const activeElement = document.activeElement
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          event.preventDefault()
          setIsOpen(true)
        }
      }

      // Escape to close
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const { openSettings } = useUIStore()

  const handleActionClick = (action: QuickAction) => {
    if (action.id === 'settings') {
      openSettings()
      setIsOpen(false)
      setSearchQuery('')
      return
    }

    if (action.onClick) {
      action.onClick()
    } else if (action.path) {
      navigate(action.path)
    }
    setIsOpen(false)
    setSearchQuery('')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={styles.overlay}
        onClick={() => {
          setIsOpen(false)
          setSearchQuery('')
        }}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        className={styles.menu}
        ref={menuRef}
        role="dialog"
        aria-label="الإجراءات السريعة"
      >
        <div className={styles['menu__header']}>
          <div className={styles['menu__search']}>
            <Search className={styles['menu__search-icon']} />
            <input
              type="text"
              className={styles['menu__search-input']}
              placeholder="ابحث عن إجراء..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                className={styles['menu__search-clear']}
                onClick={() => setSearchQuery('')}
                aria-label="مسح البحث"
              >
                <X className={styles['menu__search-clear-icon']} />
              </button>
            )}
          </div>
        </div>

        <div className={styles['menu__divider']} />

        <div className={styles['menu__content']}>
          {visibleActions.length === 0 ? (
            <div className={styles['menu__empty']}>
              <Zap className={styles['menu__empty-icon']} />
              <p className={styles['menu__empty-text']}>لا توجد إجراءات</p>
            </div>
          ) : (
            <div className={styles['menu__list']}>
              {visibleActions.map(action => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    className={styles['menu__item']}
                    onClick={() => handleActionClick(action)}
                    role="menuitem"
                  >
                    <Icon className={styles['menu__item-icon']} />
                    <span className={styles['menu__item-label']}>{action.label}</span>
                    {action.shortcut && (
                      <span className={styles['menu__item-shortcut']}>{action.shortcut}</span>
                    )}
                    <ChevronRight className={styles['menu__item-chevron']} />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles['menu__footer']}>
          <p className={styles['menu__footer-hint']}>
            اضغط <kbd>Esc</kbd> للإغلاق
          </p>
        </div>
      </div>
    </>
  )
}
