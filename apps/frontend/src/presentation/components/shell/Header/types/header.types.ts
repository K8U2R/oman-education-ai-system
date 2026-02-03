/**
 * Header Types - أنواع Header
 *
 * جميع الأنواع المستخدمة في Header
 */

import type { UserRole, Permission } from '@/domain/types/auth.types'

/**
 * Header Props - خصائص Header
 */
export interface HeaderProps {
  /**
   * هل تظهر عناصر التحكم (Sidebar/MobileMenu)؟
   */
  showControls?: boolean

  /**
   * دالة تبديل Sidebar
   */
  onSidebarToggle?: () => void

  /**
   * دالة النقر على القائمة
   */
  onMenuClick?: () => void

  /**
   * هل Sidebar مطوي؟
   */
  isSidebarCollapsed?: boolean

  /**
   * نوع Header
   */
  variant?: 'default' | 'compact' | 'minimal'

  /**
   * ClassName إضافي
   */
  className?: string
}

/**
 * Header Brand Props - خصائص HeaderBrand
 */
export interface HeaderBrandProps {
  /**
   * هل يظهر النص؟
   */
  showText?: boolean

  /**
   * هل يظهر العلم؟
   */
  showFlag?: boolean

  /**
   * حجم Brand
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * ClassName إضافي
   */
  className?: string
}

/**
 * Header Navigation Props - خصائص HeaderNavigation
 */
export interface HeaderNavigationProps {
  /**
   * عناصر التنقل
   */
  items: NavigationItem[]

  /**
   * هل المستخدم مسجل دخول؟
   */
  isAuthenticated: boolean

  /**
   * ClassName إضافي
   */
  className?: string
}

/**
 * Navigation Item - عنصر التنقل
 */
export interface NavigationItem {
  /**
   * معرف العنصر
   */
  id: string

  /**
   * نص العنصر
   */
  label: string

  /**
   * مسار الصفحة
   */
  path: string

  /**
   * أيقونة العنصر
   */
  icon?: React.ComponentType<{ className?: string }>

  /**
   * الدور المطلوب
   */
  roles?: UserRole[]

  /**
   *  المطلوبة
   */
  permissions?: Permission[]

  /**
   * هل الرابط خارجي؟
   */
  external?: boolean
}

/**
 * Header Actions Props - خصائص HeaderActions
 */
export interface HeaderActionsProps {
  /**
   * هل يظهر SearchBar؟
   */
  showSearch?: boolean

  /**
   * هل يظهر Notifications؟
   */
  showNotifications?: boolean

  /**
   * هل يظهر AIStatusIndicator؟
   */
  showAIStatus?: boolean

  /**
   * هل يظهر ProfileMenu؟
   */
  showProfile?: boolean

  /**
   * ClassName إضافي
   */
  className?: string
}

/**
 * Header Controls Props - خصائص HeaderControls
 */
export interface HeaderControlsProps {
  /**
   * دالة تبديل Sidebar
   */
  onSidebarToggle?: () => void

  /**
   * هل Sidebar مطوي؟
   */
  isSidebarCollapsed?: boolean

  /**
   * دالة فتح Mobile Menu
   */
  onMobileMenuOpen?: () => void

  /**
   * ClassName إضافي
   */
  className?: string
}

/**
 * Header Search Props - خصائص HeaderSearch
 */
export interface HeaderSearchProps {
  /**
   * هل SearchBar قابل للتوسع؟
   */
  expandable?: boolean

  /**
   * هل SearchBar مفتوح؟
   */
  isExpanded?: boolean

  /**
   * دالة تبديل SearchBar
   */
  onToggle?: () => void

  /**
   * ClassName إضافي
   */
  className?: string
}

/**
 * UseHeader Options - خيارات useHeader Hook
 */
export interface UseHeaderOptions {
  /**
   * هل تظهر عناصر التحكم؟
   */
  showControls?: boolean

  /**
   * دالة تبديل Sidebar
   */
  onSidebarToggle?: () => void

  /**
   * هل Sidebar مطوي؟
   */
  isSidebarCollapsed?: boolean
}

/**
 * UseHeader Return - قيمة إرجاع useHeader Hook
 */
export interface UseHeaderReturn {
  /**
   * هل المستخدم مسجل دخول؟
   */
  isAuthenticated: boolean

  /**
   * المستخدم الحالي
   */
  user: ReturnType<typeof import('@/features/user-authentication-management').useAuth>['user']

  /**
   * هل المستخدم مسؤول؟
   */
  isAdmin: boolean

  /**
   * هل المستخدم مطور؟
   */
  isDeveloper: boolean

  /**
   * هل Mobile Menu مفتوح؟
   */
  isMobileMenuOpen: boolean

  /**
   * هل SearchBar مفتوح؟
   */
  isSearchExpanded: boolean

  /**
   * دالة تبديل Sidebar
   */
  handleSidebarToggle: () => void

  /**
   * دالة تبديل Mobile Menu
   */
  handleMobileMenuToggle: () => void

  /**
   * دالة تبديل SearchBar
   */
  handleSearchToggle: () => void
}

/**
 * Quick Action - إجراء سريع
 */
export interface QuickAction {
  /**
   * معرف الإجراء
   */
  id: string

  /**
   * نص الإجراء
   */
  label: string

  /**
   * أيقونة الإجراء
   */
  icon: React.ComponentType<{ className?: string }>

  /**
   * Keyboard Shortcut
   */
  shortcut?: string

  /**
   * مسار الصفحة
   */
  path?: string

  /**
   * الدور المطلوب
   */
  requiredRole?: string

  /**
   * دالة التنقل المخصصة
   */
  onClick?: () => void
}
