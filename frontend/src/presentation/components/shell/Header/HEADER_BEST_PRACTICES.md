# 🏆 أفضل الممارسات لتطوير Header - نظام التعليم الذكي العماني

**تاريخ التحديث:** 2024  
**الحالة:** 📋 دليل التطوير

---

## 🎯 المبادئ الأساسية:

### 1. Clean Architecture:

- ✅ فصل المكونات حسب المسؤولية
- ✅ استخدام TypeScript Strict Mode
- ✅ تعريف Types و Interfaces
- ✅ فصل Logic عن Presentation

### 2. Component Organization:

```
Header/
├── types/           # TypeScript Types
├── constants/        # Configuration & Constants
├── hooks/           # Custom Hooks
├── components/      # Sub-components
└── utils/           # Utility Functions
```

### 3. Code Quality:

- ✅ No `any` types
- ✅ Explicit return types
- ✅ Proper error handling
- ✅ JSDoc comments

---

## 📐 البنية المقترحة:

### 1. Types (`types/header.types.ts`):

```typescript
export interface HeaderProps {
  onSidebarToggle?: () => void
  isSidebarCollapsed?: boolean
  variant?: 'default' | 'compact' | 'minimal'
}

export interface HeaderBrandProps {
  showText?: boolean
  showFlag?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export interface HeaderActionsProps {
  showSearch?: boolean
  showNotifications?: boolean
  showAIStatus?: boolean
  showProfile?: boolean
}

export interface HeaderNavigationProps {
  items: NavigationItem[]
  isAuthenticated: boolean
}

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: React.ReactNode
  roles?: UserRole[]
  permissions?: Permission[]
}
```

---

### 2. Constants (`constants/header.config.ts`):

```typescript
export const HEADER_CONFIG = {
  heights: {
    desktop: '5rem',
    tablet: '4.5rem',
    mobile: '4rem',
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
  animations: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

export const HEADER_ACTIONS = {
  SEARCH: 'search',
  NOTIFICATIONS: 'notifications',
  AI_STATUS: 'ai-status',
  PROFILE: 'profile',
} as const
```

---

### 3. Hooks (`hooks/useHeader.ts`):

```typescript
export const useHeader = (props: HeaderProps) => {
  const { isAuthenticated, user } = useAuth()
  const { isAdmin, isDeveloper } = useRole()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  const handleSidebarToggle = useCallback(() => {
    props.onSidebarToggle?.()
  }, [props.onSidebarToggle])

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const handleSearchToggle = useCallback(() => {
    setIsSearchExpanded(prev => !prev)
  }, [])

  return {
    isAuthenticated,
    user,
    isAdmin,
    isDeveloper,
    isMobileMenuOpen,
    isSearchExpanded,
    handleSidebarToggle,
    handleMobileMenuToggle,
    handleSearchToggle,
  }
}
```

---

### 4. Components Structure:

#### HeaderBrand Component:

```typescript
export interface HeaderBrandProps {
  showText?: boolean
  showFlag?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const HeaderBrand: React.FC<HeaderBrandProps> = ({
  showText = true,
  showFlag = true,
  size = 'md',
  className,
}) => {
  // Implementation
}
```

#### HeaderActions Component:

```typescript
export interface HeaderActionsProps {
  showSearch?: boolean
  showNotifications?: boolean
  showAIStatus?: boolean
  showProfile?: boolean
  className?: string
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  showSearch = true,
  showNotifications = true,
  showAIStatus = true,
  showProfile = true,
  className,
}) => {
  // Implementation
}
```

---

## 🎨 SCSS Standards:

### 1. استخدام المتغيرات:

```scss
@use '../../../../styles/_variables' as *;
@use '../../../../styles/_mixins' as *;

.header {
  background: $background-primary;
  padding: $spacing-4;
  border-bottom: 1px solid $border-color;

  @include respond-to(md) {
    padding: $spacing-6;
  }
}
```

### 2. BEM Methodology:

```scss
.header {
  &__container {
  }
  &__content {
  }
  &__brand {
  }
  &__actions {
  }

  &--compact {
  }
  &--minimal {
  }
}
```

### 3. Responsive Design:

```scss
.header {
  // Mobile First
  padding: $spacing-2;

  @include respond-to(md) {
    padding: $spacing-4;
  }

  @include respond-to(lg) {
    padding: $spacing-6;
  }
}
```

---

## 🔒 Security Best Practices:

### 1. Role-Based Access:

```typescript
const { isAdmin, isDeveloper } = useRole()

{isAdmin && (
  <HeaderAction
    icon={<Shield />}
    label="لوحة تحكم المسؤول"
    onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
  />
)}
```

### 2. Permission-Based Access:

```typescript
const { hasPermission } = usePermissions()

{hasPermission('admin:access') && (
  <HeaderAction ... />
)}
```

### 3. Protected Routes:

```typescript
<ProtectedRoute
  path={ROUTES.ADMIN_DASHBOARD}
  requiredRole="admin"
  component={AdminDashboard}
/>
```

---

## ⚡ Performance Optimization:

### 1. React.memo:

```typescript
export const HeaderBrand = React.memo<HeaderBrandProps>(({ ... }) => {
  // Implementation
})
```

### 2. useMemo & useCallback:

```typescript
const headerClasses = useMemo(() => cn('header', variant && `header--${variant}`), [variant])

const handleClick = useCallback(() => {
  // Handler
}, [dependencies])
```

### 3. Lazy Loading:

```typescript
const ProfileMenu = React.lazy(() => import('./ProfileMenu'))
```

---

## 🧪 Testing Standards:

### 1. Unit Tests:

```typescript
describe('Header', () => {
  it('should render logo', () => {
    render(<Header />)
    expect(screen.getByAltText('Oman Education AI Logo')).toBeInTheDocument()
  })

  it('should toggle sidebar', () => {
    const onToggle = jest.fn()
    render(<Header onSidebarToggle={onToggle} />)
    fireEvent.click(screen.getByLabelText('إظهار القائمة الجانبية'))
    expect(onToggle).toHaveBeenCalled()
  })
})
```

### 2. Integration Tests:

```typescript
describe('Header Integration', () => {
  it('should show profile menu when authenticated', () => {
    // Test
  })
})
```

---

## 📱 Accessibility:

### 1. ARIA Attributes:

```typescript
<button
  aria-label="فتح القائمة"
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
>
  <Menu />
</button>
```

### 2. Keyboard Navigation:

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    setIsOpen(false)
  }
}
```

### 3. Focus Management:

```typescript
useEffect(() => {
  if (isOpen) {
    firstMenuItemRef.current?.focus()
  }
}, [isOpen])
```

---

## 🌐 RTL Support:

### 1. CSS Logical Properties:

```scss
.header {
  padding-inline-start: $spacing-4;
  padding-inline-end: $spacing-4;
  margin-inline-start: auto;
}
```

### 2. Direction-Aware Classes:

```scss
.header {
  &__logo {
    [dir='rtl'] & {
      // RTL specific styles
    }
  }
}
```

---

## 📚 Documentation:

### 1. JSDoc Comments:

````typescript
/**
 * Header Component - مكون رأس الصفحة
 *
 * مكون رأس الصفحة الرئيسي مع التنقل والمصادقة
 *
 * @example
 * ```tsx
 * <Header
 *   onSidebarToggle={handleToggle}
 *   isSidebarCollapsed={isCollapsed}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({ ... }) => {
  // Implementation
}
````

### 2. README:

```markdown
# Header Component

## Overview

Header component for the application...

## Usage

\`\`\`tsx

<Header onSidebarToggle={handleToggle} />
\`\`\`

## Props

- `onSidebarToggle?: () => void`
- `isSidebarCollapsed?: boolean`
```

---

## 🎯 Checklist:

### قبل البدء:

- [ ] قراءة هذا الدليل
- [ ] فهم البنية الحالية
- [ ] فهم المتطلبات

### أثناء التطوير:

- [ ] اتباع Clean Architecture
- [ ] استخدام TypeScript Strict
- [ ] كتابة Types و Interfaces
- [ ] استخدام SCSS Variables
- [ ] إضافة JSDoc Comments
- [ ] اختبار Responsive Design
- [ ] اختبار Accessibility

### بعد الانتهاء:

- [ ] مراجعة الكود
- [ ] كتابة Tests
- [ ] تحديث Documentation
- [ ] اختبار Integration

---

**المرجع:** راجع `Sidebar/SIDEBAR_BEST_PRACTICES.md` للمزيد من التفاصيل
