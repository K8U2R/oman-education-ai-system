/**
 * Users Management Types - أنواع إدارة المستخدمين
 *
 * أنواع TypeScript خاصة بـ Users Management Feature
 */

import type {
  AdminUserInfo,
  UpdateUserRequest,
} from '@/application/features/admin/services/admin.service'

/**
 * Re-export types من Service
 */
export type { AdminUserInfo, UpdateUserRequest }

/**
 * User Form Data - بيانات نموذج المستخدم
 */
export interface UserFormData extends UpdateUserRequest {
  id?: string
  email?: string
}
