/**
 * ProtectedButton - زر محمي
 *
 * زر يظهر فقط للمستخدمين الذين لديهم  المطلوبة
 */

import React from 'react'
import { ProtectedComponent } from './ProtectedComponent'
import { Button } from '@/presentation/components/common'
import type { ButtonProps } from '@/presentation/components/ui/inputs/types'
import { UserRole, Permission } from '@/domain/types/auth.types'

interface ProtectedButtonProps extends Omit<ButtonProps, 'children'> {
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  children: React.ReactNode
  fallbackText?: string
}

/**
 * ProtectedButton - زر محمي
 *
 * زر يظهر فقط للمستخدمين الذين لديهم  المطلوبة
 *
 * @example
 * ```tsx
 * <ProtectedButton
 *   requiredPermission="lessons.create"
 *   onClick={handleCreate}
 *   variant="primary"
 * >
 *   إنشاء درس جديد
 * </ProtectedButton>
 * ```
 */
export const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  children,
  fallbackText,
  ...buttonProps
}) => {
  return (
    <ProtectedComponent
      requiredRole={requiredRole}
      requiredRoles={requiredRoles}
      requiredPermission={requiredPermission}
      requiredPermissions={requiredPermissions}
      fallback={fallbackText ? <span className="text-gray-400">{fallbackText}</span> : null}
      showFallback={!!fallbackText}
    >
      <Button {...buttonProps}>{children}</Button>
    </ProtectedComponent>
  )
}
