# 🎨 تصميم Sidebar محسّن - خطة التنفيذ

**تاريخ التصميم:** 2024  
**الحالة:** 📋 جاهز للتنفيذ

---

## 🏗️ المرحلة 3️⃣ - التصميم المتجاوب (Responsive Design)

### أ) Desktop (> 1024px):

#### النمط: Sidebar كامل مع مجموعات قابلة للطي

```
┌─────────────────────────────┐
│  📚 التعلم والمحتوى      ▼  │
│  ├── 🏠 الرئيسية           │
│  ├── 📊 لوحة التحكم         │
│  ├── 📖 الدروس              │
│  ├── 📝 التقييمات           │
│  └── 📁 المشاريع            │
├─────────────────────────────┤
│  ⚙️ الإعدادات           ▼  │
│  ├── 👤 الملف الشخصي        │
│  ├── ⚙️ الإعدادات           │
│  ├── 🔒 إعدادات الأمان      │
│  └── 💳 الاشتراك            │
├─────────────────────────────┤
│  🛠️ أدوات المحتوى      ▶  │
│  (مطوي - للمعلمين فقط)      │
└─────────────────────────────┘
```

**المميزات:**

- ✅ عرض كامل: 16rem (256px)
- ✅ مجموعات قابلة للطي/فتح
- ✅ Active State واضح
- ✅ Hover Effects
- ✅ Smooth Animations

---

### ب) Tablet (768px - 1024px):

#### النمط: Sidebar قابل للطي مع أيقونات

```
┌──────┐
│  🏠  │
│  📊  │
│  📖  │
│  📝  │
│  ⚙️  │
└──────┘
```

**المميزات:**

- ✅ عرض مضغوط: 4rem (64px)
- ✅ أيقونات فقط
- ✅ Tooltip عند Hover
- ✅ يمكن فتحه بالكامل عند النقر

---

### ج) Mobile (< 768px):

#### النمط: Sidebar مخفي افتراضياً (Drawer)

```
┌─────────────────────────────┐
│  [X]  القائمة الجانبية      │
├─────────────────────────────┤
│  📚 التعلم والمحتوى      ▼  │
│  ├── 🏠 الرئيسية           │
│  ├── 📊 لوحة التحكم         │
│  └── 📖 الدروس              │
├─────────────────────────────┤
│  ⚙️ الإعدادات           ▼  │
│  ├── 👤 الملف الشخصي        │
│  └── ⚙️ الإعدادات           │
└─────────────────────────────┘
```

**المميزات:**

- ✅ Fixed Position
- ✅ Overlay Background
- ✅ Slide-in Animation
- ✅ Close Button
- ✅ Click Outside to Close

---

## 📐 البنية المقترحة:

### 1. المكونات الجديدة:

```
Sidebar/
├── Sidebar.tsx                    # المكون الرئيسي
├── Sidebar.scss                   # الأنماط
├── components/
│   ├── SidebarGroup.tsx          # مجموعة قابلة للطي
│   ├── SidebarItem.tsx           # عنصر في القائمة
│   ├── SidebarSearch.tsx         # بحث في القائمة (اختياري)
│   └── SidebarFooter.tsx         # Footer (اختياري)
├── types/
│   └── sidebar.types.ts         # الأنواع
├── constants/
│   └── sidebar.config.ts        # التكوين
└── hooks/
    └── useSidebar.ts             # Hook مخصص
```

---

### 2. التكوين (Configuration):

```typescript
interface SidebarGroup {
  id: string
  label: string
  icon?: React.ComponentType
  items: SidebarItem[]
  defaultOpen?: boolean
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
  collapsible?: boolean
}

interface SidebarItem {
  path: string
  label: string
  icon: React.ComponentType
  requiresAuth?: boolean
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
  badge?: string | number
  external?: boolean
}
```

---

### 3. التجميع المقترح:

```typescript
const sidebarGroups: SidebarGroup[] = [
  {
    id: 'learning',
    label: 'التعلم والمحتوى',
    icon: BookOpen,
    defaultOpen: true,
    items: [
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
    ],
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    defaultOpen: false,
    items: [
      { path: ROUTES.PROFILE, label: 'الملف الشخصي', icon: User, requiresAuth: true },
      { path: ROUTES.SETTINGS, label: 'الإعدادات', icon: Settings, requiresAuth: true },
      {
        path: ROUTES.USER_SECURITY_SETTINGS,
        label: 'إعدادات الأمان',
        icon: Shield,
        requiresAuth: true,
      },
      { path: ROUTES.SUBSCRIPTION, label: 'الاشتراك', icon: CreditCard, requiresAuth: true },
    ],
  },
  {
    id: 'storage',
    label: 'التخزين',
    icon: Cloud,
    defaultOpen: false,
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
  {
    id: 'content-tools',
    label: 'أدوات المحتوى',
    icon: FileText,
    defaultOpen: false,
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
  {
    id: 'admin',
    label: 'إدارة النظام',
    icon: Shield,
    defaultOpen: false,
    requiredRole: 'admin',
    items: [
      {
        path: ROUTES.ADMIN_DASHBOARD,
        label: 'لوحة المسؤول',
        icon: Shield,
        requiresAuth: true,
        requiredRole: 'admin',
      },
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
    ],
  },
  {
    id: 'admin-security',
    label: 'الأمان',
    icon: Shield,
    defaultOpen: false,
    requiredRole: 'admin',
    items: [
      {
        path: ROUTES.ADMIN_SECURITY_DASHBOARD,
        label: 'لوحة أمان النظام',
        icon: Shield,
        requiresAuth: true,
        requiredRole: 'admin',
      },
      {
        path: ROUTES.ADMIN_SECURITY_SESSIONS,
        label: 'الجلسات',
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
  {
    id: 'admin-analytics',
    label: 'التحليلات',
    icon: BarChart3,
    defaultOpen: false,
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
  {
    id: 'database-core',
    label: 'قاعدة البيانات',
    icon: Database,
    defaultOpen: false,
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
  {
    id: 'developer',
    label: 'أدوات المطور',
    icon: Code,
    defaultOpen: false,
    requiredRole: 'developer',
    items: [
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
    ],
  },
  {
    id: 'moderator',
    label: 'إجراءات سريعة',
    icon: Zap,
    defaultOpen: false,
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
```

---

## 🎨 التصميم المرئي:

### 1. Sidebar Group (المجموعة):

```scss
.sidebar-group {
  margin-bottom: 0.5rem;

  &__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all 0.2s;

    &:hover {
      background: var(--background-secondary);
    }

    &--active {
      background: var(--primary-50);
      color: var(--primary-700);
    }
  }

  &__icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &__label {
    flex: 1;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__toggle {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__items {
    overflow: hidden;
    transition: max-height 0.3s ease;

    &--collapsed {
      max-height: 0;
    }

    &--expanded {
      max-height: 1000px;
    }
  }
}
```

### 2. Sidebar Item (العنصر):

```scss
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: var(--background-secondary);
    color: var(--text-primary);
  }

  &--active {
    background: var(--primary-50);
    color: var(--primary-700);
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      inset-inline-end: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: var(--primary-600);
      border-radius: 0 2px 2px 0;
    }
  }

  &__icon {
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
  }

  &__label {
    flex: 1;
    text-align: right;
  }

  &__badge {
    padding: 0.125rem 0.5rem;
    border-radius: var(--radius-full);
    background: var(--primary-100);
    color: var(--primary-700);
    font-size: 0.75rem;
    font-weight: 600;
  }
}
```

---

## 📱 Responsive Breakpoints:

```scss
// Desktop (> 1024px)
.sidebar {
  width: 16rem;
  // Full sidebar with groups
}

// Tablet (768px - 1024px)
@include respond-to(lg, max) {
  .sidebar {
    width: 4rem;

    .sidebar-group__label,
    .sidebar-item__label {
      display: none;
    }
  }
}

// Mobile (< 768px)
@include respond-to(md, max) {
  .sidebar {
    position: fixed;
    top: 0;
    inset-inline-end: 0;
    z-index: 100;
    width: 16rem;
    transform: translateX(100%);

    &--open {
      transform: translateX(0);
    }
  }
}
```

---

## 🚀 خطة التنفيذ:

### المرحلة 1: إعداد البنية

1. ✅ إنشاء الملفات الجديدة
2. ✅ إنشاء الأنواع (Types)
3. ✅ إنشاء التكوين (Configuration)

### المرحلة 2: المكونات الأساسية

1. ✅ `SidebarGroup` - مجموعة قابلة للطي
2. ✅ `SidebarItem` - عنصر في القائمة
3. ✅ تحديث `Sidebar` الرئيسي

### المرحلة 3: الأنماط

1. ✅ أنماط المجموعات
2. ✅ أنماط العناصر
3. ✅ Responsive Design

### المرحلة 4: التحسينات

1. ✅ Animations
2. ✅ Active States
3. ✅ Hover Effects
4. ✅ Collapsed Mode

---

**الخطوة التالية:** بدء التنفيذ
