/**
 * Quick Actions Menu - قائمة الإجراءات السريعة
 *
 * قائمة إجراءات سريعة مع اختصارات
 */

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { FileText, BookOpen, Upload, Settings, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/domain/constants/routes.constants'
import { cn } from '../../common/utils/classNames'
import './QuickActions.scss'

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  shortcut?: string
}

interface QuickActionsProps {
  className?: string
}

export const QuickActions: React.FC<QuickActionsProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const actions: QuickAction[] = useMemo(
    () => [
      {
        id: 'new-lesson',
        label: 'درس جديد',
        icon: BookOpen,
        action: () => {
          navigate(ROUTES.LESSONS)
          setIsOpen(false)
        },
        shortcut: 'N',
      },
      {
        id: 'upload-file',
        label: 'رفع ملف',
        icon: Upload,
        action: () => {
          navigate(ROUTES.STORAGE)
          setIsOpen(false)
        },
        shortcut: 'U',
      },
      {
        id: 'new-document',
        label: 'مستند جديد',
        icon: FileText,
        action: () => {
          navigate(ROUTES.STORAGE)
          setIsOpen(false)
        },
        shortcut: 'D',
      },
      {
        id: 'settings',
        label: 'الإعدادات',
        icon: Settings,
        action: () => {
          navigate(ROUTES.SETTINGS)
          setIsOpen(false)
        },
        shortcut: 'S',
      },
    ],
    [navigate]
  )

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        const action = actions.find(a => a.shortcut === event.key.toUpperCase())
        if (action) {
          event.preventDefault()
          action.action()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [actions])

  return (
    <div ref={menuRef} className={cn('quick-actions', className)}>
      <button
        className={cn('quick-actions__trigger', isOpen && 'quick-actions__trigger--open')}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="الإجراءات السريعة"
        aria-expanded={isOpen}
      >
        <Zap className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="quick-actions__menu">
          {actions.map(action => {
            const Icon = action.icon
            return (
              <button key={action.id} className="quick-actions__item" onClick={action.action}>
                <Icon className="quick-actions__item-icon" />
                <span className="quick-actions__item-label">{action.label}</span>
                {action.shortcut && (
                  <span className="quick-actions__item-shortcut">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+{action.shortcut}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
