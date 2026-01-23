/**
 * Whitelist Types - أنواع القائمة البيضاء
 *
 * Types للقائمة البيضاء في Frontend
 */

/**
 * Permission Level - مستوى
 */
export type PermissionLevel = 'developer' | 'admin' | 'super_admin'

/**
 * Whitelist Entry - إدخال القائمة البيضاء
 */
export interface WhitelistEntry {
  id: string
  email: string
  permission_level: PermissionLevel
  permissions: string[]
  granted_by: string | null
  granted_at: string
  expires_at: string | null
  is_active: boolean
  is_permanent: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

/**
 * Create Whitelist Entry Request - طلب إنشاء إدخال جديد
 */
export interface CreateWhitelistEntryRequest {
  email: string
  permission_level: PermissionLevel
  permissions: string[]
  granted_by?: string | null
  expires_at?: string | null
  is_permanent?: boolean
  notes?: string | null
}

/**
 * Update Whitelist Entry Request - طلب تحديث إدخال
 */
export interface UpdateWhitelistEntryRequest {
  permission_level?: PermissionLevel
  permissions?: string[]
  expires_at?: string | null
  is_active?: boolean
  notes?: string | null
}

/**
 * Whitelist List Query - استعلام قائمة القائمة البيضاء
 */
export interface WhitelistListQuery {
  is_active?: boolean
  permission_level?: PermissionLevel
  include_expired?: boolean
}

/**
 * Whitelist List Response - استجابة قائمة القائمة البيضاء
 */
export interface WhitelistListResponse {
  entries: WhitelistEntry[]
  total: number
  page?: number
  limit?: number
}

/**
 * Whitelist Entry Form Data - بيانات نموذج إدخال القائمة البيضاء
 */
export interface WhitelistEntryFormData {
  email: string
  permission_level: PermissionLevel
  permissions: string[]
  expires_at: string | null
  is_permanent: boolean
  notes: string | null
}
