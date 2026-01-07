/**
 * Session Types - أنواع الجلسات
 *
 * جميع الأنواع المتعلقة بإدارة الجلسات
 */

/**
 * Session - جلسة
 */
export interface Session {
  id: string
  userId: string
  userEmail?: string
  userName?: string
  userRole?: string
  userAvatar?: string
  deviceInfo: DeviceInfo
  ipAddress?: string
  userAgent?: string
  location?: SessionLocation
  isActive: boolean
  isCurrent: boolean
  status: 'active' | 'idle' | 'expired' | 'frozen'
  riskLevel: 'low' | 'medium' | 'high'
  loginMethod: 'password' | 'oauth_google' | 'oauth_github' | 'oauth_other'
  loginAt: string
  createdAt: string
  lastActivityAt: string
  expiresAt: string
  tokenExpiresAt?: string
  refreshTokenExpiresAt?: string
  metadata?: Record<string, unknown>
}

/**
 * Session Details - تفاصيل الجلسة
 */
export interface SessionDetails extends Session {
  tokenExpiresAt?: string
  refreshTokenExpiresAt?: string
  loginMethod: 'password' | 'oauth_google' | 'oauth_github'
  loginAt: string
}

/**
 * Device Info - معلومات الجهاز
 */
export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  os: string
  browser: string
  deviceName?: string
  deviceId?: string
}

/**
 * Session Location - موقع الجلسة
 */
export interface SessionLocation {
  country?: string
  city?: string
  region?: string
  latitude?: number
  longitude?: number
  timezone?: string
}

/**
 * Session Filter - فلتر الجلسات
 */
export interface SessionFilter {
  userId?: string
  isActive?: boolean
  deviceType?: string
  startDate?: string
  endDate?: string
}
