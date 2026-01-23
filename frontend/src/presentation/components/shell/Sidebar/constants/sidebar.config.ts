/**
 * Sidebar Configuration - تكوين Sidebar
 *
 * جميع مجموعات وعناصر Sidebar منظمة حسب الفئات
 */

import {
  LayoutDashboard,
  BookOpen,
  Cloud,
  User,
  Settings,
  Shield,
  Code,
  FileText,
  Network,
  Activity,
  BarChart3,
  Zap,
  ClipboardList,
  FolderKanban,
  Database,
  Search,
  RefreshCw,
} from 'lucide-react'
import { ROUTES } from '@/domain/constants/routes.constants'
import type { SidebarGroup } from '../types/sidebar.types'

/**
 * جميع مجموعات Sidebar
 */
export const SIDEBAR_GROUPS: SidebarGroup[] = [
  // 📚 التعلم والمحتوى
  {
    id: 'learning',
    label: 'التعلم والمحتوى',
    icon: BookOpen,
    defaultOpen: true,
    collapsible: true,
    items: [
      {
        path: ROUTES.DASHBOARD,
        label: 'لوحة التحكم',
        icon: LayoutDashboard,
        requiresAuth: true,
      },
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
    ],
  },

  // 🗄️ التخزين
  {
    id: 'storage',
    label: 'التخزين',
    icon: Cloud,
    defaultOpen: false,
    collapsible: true,
    requiredRole: ['admin', 'developer'],
    items: [
      {
        path: ROUTES.STORAGE,
        label: 'التخزين',
        icon: Cloud,
        requiresAuth: true,
        requiredPermissions: ['storage.view'],
      },
    ],
  },

  // 🛠️ أدوات المحتوى (للمعلمين)
  {
    id: 'content-tools',
    label: 'أدوات المحتوى',
    icon: FileText,
    defaultOpen: false,
    collapsible: true,
    requiredPermissions: ['lessons.manage'],
    items: [
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
    ],
  },

  // 👥 إدارة المستخدمين (للمسؤولين)
  {
    id: 'admin',
    label: 'إدارة النظام',
    icon: Shield,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'admin',
    items: [
      // ملاحظة: لوحة المسؤول موجودة في ProfileMenu في Header
      {
        path: ROUTES.ADMIN_USERS,
        label: 'إدارة المستخدمين',
        icon: User,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_WHITELIST,
        label: 'القائمة البيضاء',
        icon: Shield,
        requiresAuth: true,
        requiredRole: 'admin',
        requiredPermissions: ['whitelist.manage'],
      },
      {
        path: ROUTES.ADMIN_KNOWLEDGE,
        label: 'إدارة المعرفة',
        icon: BookOpen,
        requiresAuth: true,
        requiredRole: 'admin',
      },
    ],
  },

  // 🔒 الأمان (للمسؤولين)
  {
    id: 'admin-security',
    label: 'الأمان',
    icon: Shield,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'admin',
    items: [
      // ملاحظة: لوحة أمان النظام موجودة في ProfileMenu في Header
      {
        path: ROUTES.ADMIN_SECURITY_SESSIONS,
        label: 'إدارة الجلسات',
        icon: Shield,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_SECURITY_LOGS,
        label: 'السجلات الأمنية',
        icon: FileText,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_SECURITY_SETTINGS,
        label: 'إعدادات الأمان',
        icon: Settings,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_SECURITY_ROUTES,
        label: 'حماية المسارات',
        icon: Shield,
        requiresAuth: true,
        requiredRole: 'admin',
      },
    ],
  },

  // 📊 التحليلات (للمسؤولين)
  {
    id: 'admin-analytics',
    label: 'التحليلات',
    icon: BarChart3,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'admin',
    items: [
      {
        path: ROUTES.ADMIN_ANALYTICS_ERRORS,
        label: 'لوحة تحكم الأخطاء',
        icon: BarChart3,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_ANALYTICS_PERFORMANCE,
        label: 'لوحة تحكم الأداء',
        icon: Activity,
        requiresAuth: true,
        requiredRole: 'admin',
      },
    ],
  },

  // 🗄️ قاعدة البيانات (للمطورين)
  {
    id: 'database-core',
    label: 'قاعدة البيانات',
    icon: Database,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'developer',
    items: [
      {
        path: ROUTES.ADMIN_DATABASE_CORE_DASHBOARD,
        label: 'لوحة التحكم',
        icon: Database,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_PERFORMANCE,
        label: 'الأداء',
        icon: Activity,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_CONNECTIONS,
        label: 'الاتصالات',
        icon: Network,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_CACHE,
        label: 'Cache',
        icon: Zap,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_EXPLORER,
        label: 'Explorer',
        icon: Search,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_QUERY_BUILDER,
        label: 'Query Builder',
        icon: Code,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_TRANSACTIONS,
        label: 'المعاملات',
        icon: FileText,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_AUDIT,
        label: 'Audit Logs',
        icon: FileText,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_BACKUPS,
        label: 'النسخ الاحتياطي',
        icon: Database,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_MIGRATIONS,
        label: 'Migrations',
        icon: RefreshCw,
        requiresAuth: true,
        requiredRole: 'developer',
      },
    ],
  },

  // 👨‍💻 أدوات المطور (للمطورين)
  {
    id: 'developer',
    label: 'أدوات المطور',
    icon: Code,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'developer',
    items: [
      // ملاحظة: لوحة المطور موجودة في ProfileMenu في Header
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
    ],
  },

  // ⚡ إجراءات سريعة (للمشرفين)
  {
    id: 'moderator',
    label: 'إجراءات سريعة',
    icon: Zap,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'moderator',
    items: [
      {
        path: ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS,
        label: 'إجراءات سريعة',
        icon: Zap,
        requiresAuth: true,
        requiredRole: 'moderator',
      },
    ],
  },
]
