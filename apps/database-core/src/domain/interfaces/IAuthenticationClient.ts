/**
 * IAuthenticationClient - واجهة عميل المصادقة
 *
 * واجهة للاتصال بـ Authentication Service للحصول على معلومات المستخدم و
 */

/**
 * معلومات المستخدم
 */
export interface UserInfo {
  id: string
  email: string
  role: string
  permissions: string[]
  isActive: boolean
  isVerified: boolean
}

/**
 * معلومات 
 */
export interface PermissionInfo {
  userId: string
  role: string
  permissions: string[]
  grantedAt?: Date
  expiresAt?: Date
}

/**
 * واجهة عميل المصادقة
 */
export interface IAuthenticationClient {
  /**
   * الحصول على معلومات المستخدم
   */
  getUserInfo(userId: string): Promise<UserInfo | null>

  /**
   * الحصول على صلاحيات المستخدم
   */
  getUserPermissions(userId: string): Promise<PermissionInfo | null>

  /**
   * التحقق من صلاحية معينة
   */
  hasPermission(userId: string, permission: string): Promise<boolean>

  /**
   * التحقق من دور معين
   */
  hasRole(userId: string, role: string): Promise<boolean>

  /**
   * التحقق من صحة Token
   */
  validateToken(token: string): Promise<UserInfo | null>
}
