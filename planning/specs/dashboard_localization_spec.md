# Feature Spec: Dashboard Localization & Purification

## Goal
To enforce "Sovereign Law 10" (No global component styles) and "Sovereign Law 12" (Purge forbidden folders) on the Dashboard components. All styles must be localized to `module.scss` files using Sovereign Tokens.

## User Stories

### US1: Developer Dashboard & Recommended Lessons Localization
*   **As a** Developer
*   **I want** `RecommendedLessons` and `DeveloperDashboard` to use co-located `module.scss` files
*   **So that** I/O is isolated and legal.
*   **Priority:** P1 (In Progress)

### US2: Student Dashboard Localization
*   **As a** Student
*   **I want** my Dashboard styles (`_dashboard.scss`) to be moved to `StudentDashboard.module.scss`
*   **So that** the `pages/` styles folder can be deleted.
*   **Priority:** P2

### US3: Legacy Style Purge
*   **As a** System
*   **I want** `src/styles/components`, `src/styles/pages`, `src/styles/layouts` to be empty and deleted.
*   **So that** the Codebase is perfectly Sovereign.
*   **Priority:** P3
