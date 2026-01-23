/**
 * HeaderActions Component - مكون Actions للـ Header
 *
 * مكون container للإجراءات (AIStatusIndicator, Notifications, ProfileMenu, QuickActionsMenu)
 */

import React from 'react'
import AIStatusIndicator from '@/presentation/components/layout/AIStatusIndicator/AIStatusIndicator'
import Notifications from '@/presentation/components/layout/Notifications/Notifications'
import ProfileMenu from '@/presentation/components/layout/ProfileMenu/ProfileMenu'
import { QuickActionsMenu } from '../QuickActionsMenu'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import type { HeaderActionsProps } from '../../types'
import { cn } from '@/presentation/components/ui/utils/classNames'

/**
 * HeaderActions Component
 *
 * @example
 * ```tsx
 * <HeaderActions
 *   showSearch
 *   showNotifications
 *   showAIStatus
 *   showProfile
 * />
 * ```
 */
export const HeaderActions: React.FC<HeaderActionsProps> = React.memo(
  ({ showNotifications = true, showAIStatus = true, showProfile = true, className }) => {
    const actionsClasses = React.useMemo(() => cn('header-actions', className), [className])

    return (
      <>
        <div className={actionsClasses}>
          {showAIStatus && <AIStatusIndicator />}
          <ThemeToggle />
          {showNotifications && <Notifications />}
          {showProfile && <ProfileMenu />}
        </div>
        <QuickActionsMenu />
      </>
    )
  }
)

HeaderActions.displayName = 'HeaderActions'
