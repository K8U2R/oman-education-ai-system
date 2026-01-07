# Presentation Layer - طبقة العرض (Frontend)

## 📋 الوصف

طبقة العرض في Frontend تحتوي على جميع مكونات واجهة المستخدم (UI Components)، الصفحات (Pages)، التخطيطات (Layouts)، التوجيه (Routing)، والأنماط (Styles). هذه الطبقة مسؤولة عن عرض البيانات والتفاعل مع المستخدم.

## 🏗️ الهيكل

```
presentation/
├── components/        # المكونات (منظمة حسب المجال)
│   ├── common/       # مكونات مشتركة
│   ├── layout/       # مكونات التخطيط
│   ├── forms/        # نماذج
│   ├── charts/       # الرسوم البيانية
│   ├── ai/           # مكونات الذكاء الاصطناعي (جاهز للمستقبل)
│   ├── office/       # مكونات Office (جاهز للمستقبل)
│   └── ...
├── pages/            # الصفحات (منظمة حسب النوع)
│   ├── admin/        # صفحات الإدارة
│   │   ├── AdminDashboardPage.tsx
│   │   └── DeveloperDashboardPage.tsx
│   ├── user/         # صفحات المستخدم
│   │   ├── DashboardPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── ...
│   ├── learning/     # صفحات التعلم
│   │   ├── LessonsPage.tsx
│   │   ├── LessonDetailPage.tsx
│   │   ├── AssessmentsPage.tsx
│   │   ├── AssessmentDetailPage.tsx
│   │   ├── AssessmentFormPage.tsx
│   │   ├── AssessmentTakePage.tsx
│   │   └── AssessmentResultsPage.tsx
│   ├── tools/        # صفحات الأدوات
│   │   ├── StoragePage.tsx
│   │   ├── StorageBrowserPage.tsx
│   │   └── OfficeGeneratorPage.tsx
│   ├── projects/     # صفحات المشاريع
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   └── ProjectFormPage.tsx
│   ├── HomePage.tsx  # الصفحة الرئيسية
│   ├── LoginPage.tsx # صفحات المصادقة
│   └── ...
├── layouts/          # التخطيطات
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
├── routing/          # التوجيه
│   ├── routes.config.tsx
│   ├── guards/
│   └── ...
├── providers/        # Providers
│   ├── ThemeProvider.tsx
│   └── ToastProvider.tsx
└── utils/            # أدوات العرض
    └── animations.ts
```

## 📦 المكونات

### 1. Components - المكونات

**الموقع:** `components/`

**الوظيفة:**

- مكونات UI قابلة لإعادة الاستخدام
- مكونات تفاعلية
- مكونات عرض البيانات

**الأقسام:**

#### `components/common/`

- مكونات مشتركة
- **Button.tsx**: زر
- **Input.tsx**: حقل إدخال
- **Card.tsx**: بطاقة
- **Modal.tsx**: نافذة منبثقة
- **Toast.tsx**: إشعار
- **LoadingSpinner.tsx**: مؤشر التحميل
- **Badge.tsx**: شارة
- **Avatar.tsx**: صورة المستخدم
- **Dropdown.tsx**: قائمة منسدلة
- **Tooltip.tsx**: تلميح
- **Tabs.tsx**: علامات التبويب
- **Accordion.tsx**: قائمة قابلة للطي
- **ProgressBar.tsx**: شريط التقدم

#### `components/layout/`

- مكونات التخطيط
- **Header.tsx**: رأس الصفحة
- **Footer.tsx**: تذييل الصفحة
- **Sidebar.tsx**: الشريط الجانبي
- **Navigation.tsx**: التنقل
- **Notifications.tsx**: الإشعارات
- **ProfileMenu.tsx**: قائمة الملف الشخصي
- **SearchBar.tsx**: شريط البحث
- **ThemeToggle.tsx**: تبديل الثيم
- **LanguageToggle.tsx**: تبديل اللغة

#### `components/forms/`

- نماذج
- Form Components
- Form Validation
- Form State Management

#### `components/charts/`

- الرسوم البيانية
- **LineChart.tsx**: مخطط خطي
- **BarChart.tsx**: مخطط شريطي
- **PieChart.tsx**: مخطط دائري
- **AreaChart.tsx**: مخطط مساحي

#### `components/data/`

- عرض البيانات
- **DataTable.tsx**: جدول بيانات
- Sorting & Filtering
- Pagination

#### `components/storage/`

- مكونات Storage
- File Browser
- File Upload
- File Management

#### `components/settings/`

- مكونات الإعدادات
- Settings Forms
- Settings Panels

#### `components/ai/`

- مكونات الذكاء الاصطناعي (جاهز للمستقبل)
- AIChatComponent
- CodeGeneratorComponent
- LessonGeneratorComponent

#### `components/office/`

- مكونات Office (جاهز للمستقبل)
- ExcelViewer
- WordViewer
- PowerPointViewer
- OfficeExportDialog

### 2. Pages - الصفحات

**الموقع:** `pages/`

**الوظيفة:**

- صفحات التطبيق الرئيسية
- تجميع المكونات
- إدارة حالة الصفحة

**الأقسام:**

#### `pages/admin/` - صفحات الإدارة

- **AdminDashboardPage.tsx**: لوحة تحكم المدير
  - Admin Statistics
  - User Management
  - System Settings
- **DeveloperDashboardPage.tsx**: لوحة تحكم المطور
  - Developer Tools
  - API Testing
  - Debugging Tools

#### `pages/user/` - صفحات المستخدم

- **DashboardPage.tsx**: لوحة التحكم
  - Statistics
  - Quick Actions
  - Recent Activity
- **ProfilePage.tsx**: صفحة الملف الشخصي
  - User Info
  - Profile Settings
  - Account Management
- **SettingsPage.tsx**: صفحة الإعدادات
  - Application Settings
  - User Preferences
  - Theme & Language
- **SubscriptionPage.tsx**: صفحة الاشتراك
  - Subscription Management
  - Plans & Pricing

#### `pages/learning/` - صفحات التعلم

- **LessonsPage.tsx**: صفحة الدروس
  - Lessons List
  - Filtering & Search
  - Progress Tracking
- **LessonDetailPage.tsx**: تفاصيل الدرس
  - Lesson Content
  - Interactive Elements
  - Progress Updates
- **AssessmentsPage.tsx**: صفحة التقييمات
  - Assessments List
  - Filtering & Search
  - Create/Edit/Delete Assessments
- **AssessmentDetailPage.tsx**: تفاصيل التقييم
  - Assessment Info
  - Questions Preview
  - Start Assessment
- **AssessmentFormPage.tsx**: نموذج التقييم
  - Create/Edit Assessment
  - Manage Questions (Multiple Choice, True/False, Short Answer, Essay, Code)
  - Auto-calculate Total Points
- **AssessmentTakePage.tsx**: حل التقييم
  - Question-by-Question Navigation
  - Timer Support
  - Answer Submission
- **AssessmentResultsPage.tsx**: نتائج التقييم
  - Score Display
  - Question Review
  - Correct/Incorrect Answers

#### `pages/tools/` - صفحات الأدوات

- **StoragePage.tsx**: صفحة Storage
  - Storage Connections
  - Storage Management
- **StorageBrowserPage.tsx**: متصفح Storage
  - File Browser
  - File Operations
- **OfficeGeneratorPage.tsx**: صفحة توليد ملفات Office
  - Generate Excel, Word, PowerPoint, PDF
  - Template Selection
  - AI-Powered Generation
  - File Preview & Export

#### `pages/projects/` - صفحات المشاريع

- **ProjectsPage.tsx**: صفحة المشاريع
  - Projects List
  - Filtering & Search
  - Create/Edit/Delete Projects
- **ProjectDetailPage.tsx**: تفاصيل المشروع
  - Project Info
  - Progress Tracking
  - Milestones
  - Related Lessons
- **ProjectFormPage.tsx**: نموذج المشروع
  - Create/Edit Project
  - Project Requirements
  - Due Date Management

#### `pages/` - صفحات عامة

- **HomePage.tsx**: الصفحة الرئيسية
  - Hero Section
  - Features Section
  - Call to Action
- **LoginPage.tsx**: صفحة تسجيل الدخول
  - Login Form
  - OAuth Buttons
  - Error Handling
- **RegisterPage.tsx**: صفحة التسجيل
  - Registration Form
  - Validation
  - Terms Acceptance

#### `pages/UnauthorizedPage.tsx`

- صفحة غير مصرح
- 401 Error
- Redirect to Login

#### `pages/ForbiddenPage.tsx`

- صفحة محظور
- 403 Error
- Permission Denied

### 3. Layouts - التخطيطات

**الموقع:** `layouts/`

**الوظيفة:**

- تخطيطات الصفحات
- تجميع المكونات المشتركة
- إدارة Structure

**الأقسام:**

#### `layouts/MainLayout.tsx`

- التخطيط الرئيسي
- Header
- Sidebar
- Footer
- Content Area

#### `layouts/AuthLayout.tsx`

- تخطيط المصادقة
- Login/Register Layout
- Centered Content
- Minimal Design

### 4. Routing - التوجيه

**الموقع:** `routing/`

**الوظيفة:**

- إدارة المسارات
- Route Guards
- Route Transitions
- Route Analytics

**الأقسام:**

#### `routing/routes.config.tsx`

- إعدادات المسارات
- Route Definitions
- Route Metadata
- Lazy Loading

#### `routing/guards/`

- Route Guards
- **ProtectedRoute.tsx**: Route محمي
- **PublicRoute.tsx**: Route عام
- Authentication Checks
- Permission Checks

#### `routing/hooks/`

- Routing Hooks
- **useRouteGuard.ts**: Hook للـ Route Guard
- **useNavigation.ts**: Hook للتنقل
- Route State Management

#### `routing/middleware/`

- Route Middleware
- Route Analytics
- Route Preloading

#### `routing/transitions/`

- Route Transitions
- Page Transitions
- Animation Effects

### 5. Providers - Providers

**الموقع:** `providers/`

**الوظيفة:**

- React Context Providers
- Global State Providers
- Theme Management
- Toast Management

**الأقسام:**

#### `providers/ThemeProvider.tsx`

- Theme Provider
- Theme State
- Theme Switching
- Theme Persistence

#### `providers/ToastProvider.tsx`

- Toast Provider
- Toast State
- Toast Display
- Toast Management

### 6. Utils - أدوات العرض

**الموقع:** `utils/`

**الوظيفة:**

- أدوات مساعدة للعرض
- Animations
- UI Utilities

**الأقسام:**

#### `utils/animations.ts`

- Animations
- Animation Helpers
- Transition Effects

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. UI Components

- React Components
- Component Logic
- Component State
- Component Props

### 2. Styling

- CSS/SCSS Files
- Component Styles
- Theme Styles
- Responsive Design

### 3. User Interaction

- Event Handlers
- Form Handling
- User Input Processing
- User Feedback

### 4. Routing

- Route Definitions
- Route Guards
- Navigation Logic
- Route Transitions

### 5. Layout Management

- Page Layouts
- Component Structure
- Responsive Layouts

### 6. Presentation Logic

- Data Formatting for Display
- UI State Management
- Component Communication

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Business Logic

- ❌ لا يجب وجود Business Logic
- ✅ يجب أن يكون في Application Layer

### 2. API Calls

- ❌ لا يجب استدعاء APIs مباشرة
- ✅ يجب استخدام Services من Application Layer

### 3. Domain Models

- ❌ لا يجب استخدام Domain Entities مباشرة
- ✅ يجب استخدام DTOs أو View Models

### 4. Database Access

- ❌ لا يجب الوصول إلى قاعدة البيانات
- ✅ يجب استخدام Services

### 5. Complex Data Processing

- ❌ لا يجب معالجة بيانات معقدة
- ✅ يجب أن تكون في Application Layer

### 6. External Integrations

- ❌ لا يجب التكامل مع External Services مباشرة
- ✅ يجب استخدام Infrastructure Layer

## 🔄 التدفق (Flow)

```
User Interaction
    ↓
Presentation Layer (Components, Pages)
    ↓
Application Layer (Services, Hooks)
    ↓
Infrastructure Layer (API Client)
    ↓
Backend API
```

## 📝 أمثلة الاستخدام

### Component Example

```typescript
// Button.tsx
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button
      className={`button button--${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### Page Example

```typescript
// DashboardPage.tsx
export const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { stats } = useDashboardStats()

  return (
    <MainLayout>
      <div className="dashboard">
        <h1>مرحباً {user.name}</h1>
        <StatsCards stats={stats} />
      </div>
    </MainLayout>
  )
}
```

### Route Example

```typescript
// routes.config.tsx
export const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: <DashboardPage />,
    requiresAuth: true,
    permissions: ['user']
  }
]
```

## 🧪 الاختبار

- كل Component يجب أن يكون له Unit Tests
- كل Page يجب أن يكون له Integration Tests
- استخدام React Testing Library
- اختبار User Interactions
- اختبار Accessibility

## 📚 المراجع

- React Best Practices
- Component Design Patterns
- UI/UX Best Practices
- Accessibility Guidelines
