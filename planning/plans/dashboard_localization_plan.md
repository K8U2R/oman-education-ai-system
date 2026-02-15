# Implementation Plan: Dashboard Localization

## Technical Context
*   **Framework:** React (Vite)
*   **Styling:** SCSS Modules (`.module.scss`)
*   **Design System:** Sovereign Tokens (`apps/frontend/src/styles/abstracts/`)
    *   `_engine-fluid-metrics.scss`
    *   `_foundation-colors.scss`
    *   `_foundation-typography.scss`

## Constitution Check
*   ✅ **Law 10 (Component Localization):** All new styles are in `module.scss`.
*   ✅ **Law 12 (Folder Purge):** Plan explicitly targets deletion of `src/styles/{components,pages}`.
*   ✅ **Visual Engine Naming:** Modules use `snake-case` or `kebab-case` internally, mapped to `camelCase` in TSX.

## Phases

### Phase 1: US1 - Developer & Recommendations
*   **Status:** Partially Complete.
*   **Tasks:**
    *   Verify `RecommendedLessons.module.scss` (Created).
    *   Update `RecommendedLessons.tsx` (Pending).
    *   Verify `DeveloperDashboard.module.scss` (Created).
    *   Update `DeveloperDashboard.tsx` (Pending).

### Phase 2: US2 - Student Dashboard
*   **Source:** `apps/frontend/src/styles/pages/_dashboard.scss`
*   **Destination:** `apps/frontend/src/presentation/pages/student/StudentDashboard.module.scss` (Need to verify path).
*   **Action:** Copy styles, refactor to module syntax, update TSX.

### Phase 3: US3 - Final Purge
*   **Audit:** Check `src/styles/components` for any remaining files.
*   **Audit:** Check `src/styles/pages` for any remaining files.
*   **Action:** Delete `_auth.scss`, `_input.scss`, etc. that have been migrated.
*   **Action:** Remove imports from `main.scss`.
*   **Action:** Delete the directories.
