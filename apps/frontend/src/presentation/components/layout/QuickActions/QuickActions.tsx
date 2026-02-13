import React, { useState, useRef, useEffect, useMemo } from 'react'
import { FileText, BookOpen, Upload, Settings, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useUIStore } from '@/application/shared/store'
import { cn } from '../../common/utils/classNames'
import styles from './QuickActions.module.scss'

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
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { openSettings } = useUIStore()

  const actions: QuickAction[] = useMemo(
    () => [
      {
        id: 'new-lesson',
        label: t('quick_actions.new_lesson'),
        icon: BookOpen,
        action: () => {
          navigate(ROUTES.LESSONS)
          setIsOpen(false)
        },
        shortcut: 'N',
      },
      {
        id: 'upload-file',
        label: t('quick_actions.upload_file'),
        icon: Upload,
        action: () => {
          navigate(ROUTES.STORAGE)
          setIsOpen(false)
        },
        shortcut: 'U',
      },
      {
        id: 'new-document',
        label: t('quick_actions.new_document'),
        icon: FileText,
        action: () => {
          navigate(ROUTES.STORAGE)
          setIsOpen(false)
        },
        shortcut: 'D',
      },
      {
        id: 'settings',
        label: t('quick_actions.settings'),
        icon: Settings,
        action: () => {
          openSettings()
          setIsOpen(false)
        },
        shortcut: 'S',
      },
    ],
    [navigate, openSettings, t]
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
    <div ref={menuRef} className={cn(styles.container, className)}>
      <button
        className={cn(styles.trigger, isOpen && styles['trigger--open'])}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('quick_actions.trigger_label')}
        aria-expanded={isOpen}
      >
        <Zap size={20} />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {actions.map(action => {
            const Icon = action.icon
            return (
              <button key={action.id} className={styles.item} onClick={action.action}>
                <Icon className={styles.itemIcon} />
                <span className={styles.itemLabel}>{action.label}</span>
                {action.shortcut && (
                  <span className={styles.itemShortcut}>
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
