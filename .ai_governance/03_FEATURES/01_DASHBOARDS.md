# 📊 FEATURE SPEC: Dynamic Dashboard Engine v1.0

## 🎯 Objective

To transition from static, monolithic dashboards to a **Configuration-Driven UI**. The dashboard layout and contents must be defined by a JSON configuration file, allowing for easy updates and role-based customization without altering the core rendering logic.

## 🏗️ Architecture

### 1. The Widget Registry (`WidgetRegistry.tsx`)

A central catalog mapping string keys to React Components. This enforces the **Atomic Design** principle by decoupling the definition of a widget from its placement.

```typescript
export const WIDGET_REGISTRY: Record<string, React.FC<any>> = {
  'stat_users': UserStatsWidget,
  'stat_revenue': RevenueStatsWidget,
  'welcome_card': WelcomeWidget,
  'activity_feed': ActivityFeedWidget,
  // ...
};
```

### 2. The Layout Configuration (`dashboard.config.ts`)

A strict JSON schema defining the grid layout for each user role.

```typescript
export interface DashboardWidgetConfig {
  id: string;             // Unique ID for the instance
  widgetKey: string;      // Key from WIDGET_REGISTRY
  colSpan?: number;       // Grid column span (1-12)
  props?: Record<string, any>; // Static props to pass
  permission?: string;    // Required permission to view
}

export const DASHBOARD_LAYOUTS: Record<UserRole, DashboardWidgetConfig[]> = {
  admin: [
    { id: 'w1', widgetKey: 'welcome_card', colSpan: 12 },
    { id: 's1', widgetKey: 'stat_users', colSpan: 3, permission: 'view:users' },
    // ...
  ],
  student: [
    // ...
  ]
};
```

### 3. The Smart Renderer (`DashboardPage.tsx`)

The view layer responsible for:

1. **Resolution**: Identifying the user's role.
2. **Selection**: Picking the correct config array.
3. **Filtration**: Removing widgets the user lacks permissions for.
4. **Rendering**: Mapping config entries to Registry components inside a generic Grid layout.

## 🛡️ Governance & Security

* **Permission Awareness**: Every widget entry in the config implicitly supports a `permission` field. The renderer MUST skip widgets if the user lacks the required scope.
* **Fail-Safe**: If a `widgetKey` is missing from the registry, the renderer must **fail silently** (or log to console in Dev) rather than crashing the entire dashboard.
* **Design Tokens**: usage of `grid-cols-12` and standard spacing tokens is mandatory.

## 🚀 Implementation Phase

1. **Registry**: Build `src/presentation/features/dashboard/WidgetRegistry.tsx`.
2. **Config**: Build `src/presentation/features/dashboard/dashboard.config.ts`.
3. **Refactor**: Update `DashboardPage.tsx` to use the engine.
