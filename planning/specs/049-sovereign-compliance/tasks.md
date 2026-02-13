# Tasks: Sovereign Compliance Initiative

## Phase 1: Infrastructure & Audit
- [ ] Create `planning/specs/specs.md` and `plan.md` [/]
- [ ] Run deep audit to list specific offending files (Generated below)

## Phase 2: Component Standardization (Encapsulation & Liquid)
Target: `apps/frontend/src/presentation/components`

### AI Components
- [x] `components/ai/AIAssistantPanel.tsx` -> Create SCSS, remove px, extract text.
- [x] `components/ai/AIChatComponent.tsx` -> Create SCSS, remove px, extract text.
- [x] `components/ai/CodeGeneratorComponent.tsx` -> Create SCSS, remove px, extract text.
- [x] `components/ai/CodePreviewComponent.tsx` -> Create SCSS, remove px, extract text.

### Auth Components
- [x] `components/auth/LoginForm.tsx` -> Create SCSS, fix styling/text.
- [x] `components/auth/RegisterForm.tsx` -> Create SCSS, fix styling/text.
- [x] `components/auth/ForgotPasswordForm.tsx` -> Create SCSS, fix styling/text.

### Common Components
- [x] `components/common/Modal/ModalLayout.tsx` -> Ensure SCSS compliance.
- [x] `components/common/Button` (if exists) -> Check liquid standards.
- [x] `components/common/Input` (if exists) -> Check liquid standards.

### Dashboard Components
- [x] `components/dashboard/StatCard.tsx` -> Create SCSS.
- [x] `components/dashboard/QuickActionCard.tsx` -> Create SCSS.
- [x] `components/dashboard/HealthCard.tsx` -> Create SCSS.

## Phase 3: Layouts & Shell
- [x] `components/shell/Sidebar/Sidebar.tsx` -> Verify `Sidebar.module.scss` liquid compliance.
- [x] `components/shell/Sidebar/components/SidebarItem.module.scss` -> Logical Props Refactor.
- [x] `components/shell/Header/Header.tsx` -> Verify `Header.module.scss` liquid compliance.
- [x] `layouts/BottomNav` -> Verify layout and RTL.
- [x] `components/ui/feedback` (`Toast`, `LoadingSpinner`) -> Refactor to SCSS.

## Phase 4: Language Sovereignty (Deep Scrub)
- [x] Extract all hardcoded strings from `src/presentation` to `locales/ar/common.json` & `locales/en/common.json`.
- [x] Replace strings with `t('key')` hook.

## Phase 5: Design System Cleanup
- [x] Remove unused Tailwind classes that conflict with Liquid Sovereignty.
- [x] Ensure all `z-index` values utilize the token map.

## Phase 6: Public Pages Sovereignty (Refactoring Sessions)
- [x] **Public Pages**
    - [x] `HomePage` (Refactored to SCSS & Liquid)
    - [x] `Legal` Pages (Strings extracted, SCSS applied)
    - [x] Build Verification (SCSS Variable Fixes Applied)

# 🎉 Sovereign Compliance Validation Complete
- All defined components audited and refactored.
- Language strings extracted.
- SCSS Modules standardized.
- Tokens enforced.

## Phase 7: Core & Layout Refactoring (Cleanup)
- [x] **Layout (T044)**: `BottomNav` uses `encryptRoute`. `AppShell` uses services.
- [x] **Core Debt (T045)**: `SovereignAuthInterceptor` encapsulated. `LoadingState` uses overlay. `OfflineService` uses `enhancedCacheService`.
- [x] **Visual (T046)**: `ProfileMenu` encryption and positioning verified.

## Phase 8: Layout Components Sovereignty (Correction)
- [x] `AIStatusIndicator` (Structure, Strings, Liquid)
- [x] `Breadcrumbs` (Structure, Strings, Liquid)
- [x] `LanguageToggle` (Structure, Strings, Liquid)
- [x] `NotificationPreferences` (Structure, Strings, Liquid)
- [x] `QuickActions` (Structure, Strings, Liquid)
- [x] `SearchBar` (Structure, Strings, Liquid)
- [x] `SettingsModal` (Structure, Strings, Liquid)
