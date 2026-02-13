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
import { SidebarGroup } from './Sidebar.types'

/**
 * جميع مجموعات Sidebar
 */
export const SIDEBAR_GROUPS: SidebarGroup[] = [
  // 📚 التعلم والمحتوى
  {
    id: 'learning',
    label: 'sidebar.learning',
    icon: BookOpen,
    defaultOpen: true,
    collapsible: true,
    items: [
      {
        path: ROUTES.DASHBOARD,
        label: 'sidebar.dashboard',
        icon: LayoutDashboard,
        requiresAuth: true,
      },
      {
        path: ROUTES.LESSONS,
        label: 'sidebar.lessons',
        icon: BookOpen,
        requiresAuth: true,
        requiredPermissions: ['lessons.view'],
      },
      {
        path: ROUTES.ASSESSMENTS,
        label: 'sidebar.assessments',
        icon: ClipboardList,
        requiresAuth: true,
        requiredPermissions: ['lessons.view'],
      },
      {
        path: ROUTES.PROJECTS,
        label: 'sidebar.projects',
        icon: FolderKanban,
        requiresAuth: true,
        requiredPermissions: ['lessons.view'],
      },
    ],
  },

  // 🗄️ التخزين
  {
    id: 'storage',
    label: 'sidebar.storage',
    icon: Cloud,
    defaultOpen: false,
    collapsible: true,
    requiredRole: ['admin', 'developer'],
    items: [
      {
        path: ROUTES.STORAGE,
        label: 'sidebar.storage',
        icon: Cloud,
        requiresAuth: true,
        requiredPermissions: ['storage.view'],
      },
    ],
  },

  // 🛠️ أدوات المحتوى (للمعلمين)
  {
    id: 'content-tools',
    label: 'sidebar.content_tools',
    icon: FileText,
    defaultOpen: false,
    collapsible: true,
    requiredPermissions: ['lessons.manage'],
    items: [
      {
        path: ROUTES.LESSONS_MANAGEMENT,
        label: 'sidebar.lessons_mgmt',
        icon: FileText,
        requiresAuth: true,
        requiredPermissions: ['lessons.manage'],
      },
      {
        path: ROUTES.LEARNING_PATHS_MANAGEMENT,
        label: 'sidebar.paths_mgmt',
        icon: Network,
        requiresAuth: true,
        requiredPermissions: ['lessons.manage'],
      },
      {
        path: ROUTES.CODE_GENERATOR,
        label: 'sidebar.code_gen',
        icon: Code,
        requiresAuth: true,
        requiredPermissions: ['lessons.create', 'lessons.manage'],
      },
      {
        path: ROUTES.OFFICE_GENERATOR,
        label: 'sidebar.office_gen',
        icon: FileText,
        requiresAuth: true,
        requiredPermissions: ['lessons.create', 'lessons.manage'],
      },
    ],
  },

  // 👥 إدارة المستخدمين (للمسؤولين)
  {
    id: 'admin',
    label: 'sidebar.admin',
    icon: Shield,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'admin',
    items: [
      // ملاحظة: لوحة المسؤول موجودة في ProfileMenu في Header
      {
        path: ROUTES.ADMIN_USERS,
        label: 'sidebar.users_mgmt',
        icon: User,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_WHITELIST,
        label: 'sidebar.whitelist',
        icon: Shield,
        requiresAuth: true,
        requiredRole: 'admin',
        requiredPermissions: ['whitelist.manage'],
      },
      {
        path: ROUTES.ADMIN_KNOWLEDGE,
        label: 'sidebar.knowledge',
        icon: BookOpen,
        requiresAuth: true,
        requiredRole: 'admin',
      },
    ],
  },

  // 🔒 الأمان (للمسؤولين)
  {
    id: 'admin-security',
    label: 'sidebar.security',
    icon: Shield,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'admin',
    items: [
      // ملاحظة: لوحة أمان النظام موجودة في ProfileMenu في Header
      {
        path: ROUTES.ADMIN_SECURITY_SESSIONS,
        label: 'sidebar.sessions',
        icon: Shield,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_SECURITY_LOGS,
        label: 'sidebar.security_logs',
        icon: FileText,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_SECURITY_SETTINGS,
        label: 'sidebar.security_settings',
        icon: Settings,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_SECURITY_ROUTES,
        label: 'sidebar.route_protection',
        icon: Shield,
        requiresAuth: true,
        requiredRole: 'admin',
      },
    ],
  },

  // 📊 التحليلات (للمسؤولين)
  {
    id: 'admin-analytics',
    label: 'sidebar.analytics',
    icon: BarChart3,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'admin',
    items: [
      {
        path: ROUTES.ADMIN_ANALYTICS_ERRORS,
        label: 'sidebar.error_dashboard',
        icon: BarChart3,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_ANALYTICS_PERFORMANCE,
        label: 'sidebar.perf_dashboard',
        icon: Activity,
        requiresAuth: true,
        requiredRole: 'admin',
      },
    ],
  },

  // 🗄️ قاعدة البيانات (للمطورين)
  {
    id: 'database-core',
    label: 'sidebar.database',
    icon: Database,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'developer',
    items: [
      {
        path: ROUTES.ADMIN_DATABASE_CORE_DASHBOARD,
        label: 'sidebar.db_dashboard',
        icon: Database,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_PERFORMANCE,
        label: 'sidebar.db_perf',
        icon: Activity,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_CONNECTIONS,
        label: 'sidebar.db_conn',
        icon: Network,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_CACHE,
        label: 'sidebar.db_cache',
        icon: Zap,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_EXPLORER,
        label: 'sidebar.db_explorer',
        icon: Search,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_QUERY_BUILDER,
        label: 'sidebar.db_query',
        icon: Code,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_TRANSACTIONS,
        label: 'sidebar.db_trans',
        icon: FileText,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_AUDIT,
        label: 'sidebar.db_audit',
        icon: FileText,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_BACKUPS,
        label: 'sidebar.db_backup',
        icon: Database,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.ADMIN_DATABASE_CORE_MIGRATIONS,
        label: 'sidebar.db_migrations',
        icon: RefreshCw,
        requiresAuth: true,
        requiredRole: 'developer',
      },
    ],
  },

  // 👨‍💻 أدوات المطور (للمطورين)
  {
    id: 'developer',
    label: 'sidebar.dev_tools',
    icon: Code,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'developer',
    items: [
      // ملاحظة: لوحة المطور موجودة في ProfileMenu في Header
      {
        path: ROUTES.DEVELOPER_SECURITY_ANALYTICS,
        label: 'sidebar.sec_analytics',
        icon: BarChart3,
        requiresAuth: true,
        requiredRole: 'developer',
      },
      {
        path: ROUTES.DEVELOPER_SECURITY_MONITORING,
        label: 'sidebar.sec_monitor',
        icon: Activity,
        requiresAuth: true,
        requiredRole: 'developer',
      },
    ],
  },

  // ⚡ إجراءات سريعة (للمشرفين)
  {
    id: 'moderator',
    label: 'sidebar.quick_actions',
    icon: Zap,
    defaultOpen: false,
    collapsible: true,
    requiredRole: 'moderator',
    items: [
      {
        path: ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS,
        label: 'sidebar.quick_actions',
        icon: Zap,
        requiresAuth: true,
        requiredRole: 'moderator',
      },
    ],
  },
]
