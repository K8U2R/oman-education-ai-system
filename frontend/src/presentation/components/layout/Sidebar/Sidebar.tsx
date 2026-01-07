/**
 * Sidebar Navigation Component - شريط جانبي للتنقل
 *
 * شريط جانبي للتنقل مع القوائم
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Cloud,
  User,
  Settings,
  CreditCard,
  Shield,
  Code,
  FileText,
  Network,
  Activity,
  BarChart3,
  Zap,
  ClipboardList,
  FolderKanban,
} from 'lucide-react'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Permission, UserRole } from '@/domain/types/auth.types'
import { cn } from '../../common/utils/classNames'
import './Sidebar.scss'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  variant?: 'default' | 'collapsed'
  isCollapsed?: boolean
}

interface NavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
}

const navItems: NavItem[] = [
  { path: ROUTES.HOME, label: 'الرئيسية', icon: Home },
  { path: ROUTES.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard, requiresAuth: true },
  {
    path: ROUTES.LESSONS,
    label: 'الدروس',
    icon: BookOpen,
    requiresAuth: true,
    requiredPermissions: ['lessons.view'],
  },
  {
    path: ROUTES.ASSESSMENTS,
    label: 'التقييمات',
    icon: ClipboardList,
    requiresAuth: true,
    requiredPermissions: ['lessons.view'],
  },
  {
    path: ROUTES.PROJECTS,
    label: 'المشاريع',
    icon: FolderKanban,
    requiresAuth: true,
    requiredPermissions: ['lessons.view'],
  },
  {
    path: ROUTES.STORAGE,
    label: 'التخزين',
    icon: Cloud,
    requiresAuth: true,
    requiredPermissions: ['storage.view'],
  },
  { path: ROUTES.PROFILE, label: 'الملف الشخصي', icon: User, requiresAuth: true },
  { path: ROUTES.SETTINGS, label: 'الإعدادات', icon: Settings, requiresAuth: true },
  {
    path: ROUTES.USER_SECURITY_SETTINGS,
    label: 'إعدادات الأمان',
    icon: Shield,
    requiresAuth: true,
  },
  { path: ROUTES.SUBSCRIPTION, label: 'الاشتراك', icon: CreditCard, requiresAuth: true },
  // Admin & Developer routes
  {
    path: ROUTES.ADMIN_DASHBOARD,
    label: 'لوحة المسؤول',
    icon: Shield,
    requiresAuth: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN_SECURITY_DASHBOARD,
    label: 'أمان النظام',
    icon: Shield,
    requiresAuth: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.DEVELOPER_DASHBOARD,
    label: 'لوحة المطور',
    icon: Code,
    requiresAuth: true,
    requiredRole: 'developer',
  },
  {
    path: ROUTES.DEVELOPER_SECURITY_ANALYTICS,
    label: 'تحليلات الأمان',
    icon: BarChart3,
    requiresAuth: true,
    requiredRole: 'developer',
  },
  {
    path: ROUTES.DEVELOPER_SECURITY_MONITORING,
    label: 'مراقبة الأمان',
    icon: Activity,
    requiresAuth: true,
    requiredRole: 'developer',
  },
  {
    path: ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS,
    label: 'إجراءات سريعة',
    icon: Zap,
    requiresAuth: true,
    requiredRole: 'moderator',
  },
  // Content Management routes
  {
    path: ROUTES.LESSONS_MANAGEMENT,
    label: 'إدارة الدروس',
    icon: FileText,
    requiresAuth: true,
    requiredPermissions: ['lessons.manage'],
  },
  {
    path: ROUTES.LEARNING_PATHS_MANAGEMENT,
    label: 'إدارة المسارات',
    icon: Network,
    requiresAuth: true,
    requiredPermissions: ['lessons.manage'],
  },
  // Tools routes
  {
    path: ROUTES.CODE_GENERATOR,
    label: 'مولد الكود',
    icon: Code,
    requiresAuth: true,
    requiredPermissions: ['lessons.create', 'lessons.manage'],
  },
  {
    path: ROUTES.OFFICE_GENERATOR,
    label: 'مولد Office',
    icon: FileText,
    requiresAuth: true,
    requiredPermissions: ['lessons.create', 'lessons.manage'],
  },
]

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  variant = 'default',
  isCollapsed = false,
}) => {
  const { isAuthenticated } = useAuth()
  const { hasRole, hasAllPermissions } = useRole()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME
    }
    return location.pathname.startsWith(path)
  }

  const canAccessItem = (item: NavItem): boolean => {
    // Public items - لا تحتاج مصادقة
    if (!item.requiresAuth) {
      return true
    }

    // التحقق من المصادقة أولاً
    if (!isAuthenticated) {
      return false
    }

    // التحقق من الرتبة المطلوبة (إذا كانت محددة)
    // يستخدم hasRole الذي يتحقق من الهيمنة (hierarchy)
    if (item.requiredRole) {
      if (!hasRole(item.requiredRole)) {
        return false
      }
    }

    // التحقق من الصلاحيات المطلوبة (إذا كانت محددة)
    // يستخدم hasAllPermissions الذي يتطلب جميع الصلاحيات
    if (item.requiredPermissions && item.requiredPermissions.length > 0) {
      if (!hasAllPermissions(item.requiredPermissions)) {
        return false
      }
    }

    return true
  }

  const filteredNavItems = navItems.filter(canAccessItem)

  // Use isCollapsed prop if provided, otherwise use variant
  const shouldCollapse = isCollapsed || variant === 'collapsed'

  return (
    <aside
      className={cn(
        'sidebar',
        !isOpen && 'sidebar--closed',
        shouldCollapse && 'sidebar--collapsed'
      )}
    >
      <nav className="sidebar__nav">
        {filteredNavItems.map(item => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn('sidebar__item', isActive(item.path) && 'sidebar__item--active')}
              onClick={onClose}
            >
              <Icon className="sidebar__item-icon" />
              <span className="sidebar__item-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
