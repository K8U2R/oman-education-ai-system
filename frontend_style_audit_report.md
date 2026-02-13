# Frontend Styling Audit Report
**Date**: 2026-02-04
**Auditor**: Antigravity (Constitution Enforcer)

## 🚨 Critical Violations found in Frontend Architecture

### 1. Broken Global Variable Chain (The "Disconnected Page" Issue)
The user reported that pages cannot read variables. This is technically accurate because the SCSS variables injected into every page are pointing to **undefined** or **invalid** CSS Custom Properties.

-   **Source**: `apps/frontend/src/styles/abstracts/_variables.scss`
-   **Violation**:
    ```scss
    $primary-500: var(--color-primary); // ❌ Undefined variable
    ```
-   **Reality**: `main.scss` (via `_tokens.scss`) defines `--primary` (no "color-" prefix) and `--color-primary-500`. It does **not** define `--color-primary`.
-   **Consequence**: Any component using `$primary-500` gets nothing.

### 2. Invalid CSS Values (The "Channel vs Color" Bug)
Even if the variable names matched, the values are incompatible.

-   **Definition** (`_tokens.scss`):
    ```css
    --primary: 263 70% 50%; /* Just numbers (Channels) */
    ```
-   **Usage** (`_variables.scss`):
    ```scss
    $primary-500: var(--color-primary); /* = 263 70% 50% */
    ```
-   **Result**: `color: var(--color-primary)` renders as INVALID CSS. It needs to be wrapped: `hsl(var(--color-primary))`.

### 3. "Schizophrenic" Root Definitions (The "Double Truth" Issue)
The project maintains two conflicting sources of truth for CSS variables, violating the "Single Source of Truth" principle.

-   **Source A**: `index.css` (Tailwind/Shadcn defaults) -> Defines `--background`, `--primary` manually.
-   **Source B**: `main.scss` (Custom Tokens) -> Defines `--background`, `--primary` inside a mixin.
-   **Conflict**: Both are imported in `main.tsx`. The order of import determines the winner, leading to unpredictable UI states (Plan Sovereignty failure).

### 4. OKLCH Specification Violation
The `_tokens.scss` file defines high-fidelity **OKLCH** colors in `$palette-sovereign`, but the `generate-themes` mixin **hardcodes HSL values** similar to `index.css`.
-   **Impact**: The "Sovereign" Omani identity colors (Deep Blue, Honor Red) defined in the map are **ignored entirely** by the CSS output.

## Recommended Remediation Plan

1.  **Unify Tokens**: Delete the hardcoded `:root` block in `_tokens.scss`. Use a SASS loop to generate CSS variables directly from the `$palette-sovereign` OKLCH maps.
2.  **Fix Variables**: Update `_variables.scss` to map to the *computed* CSS variables (e.g., `var(--color-primary-500)`), not the raw channel variables.
3.  **Clean Up**: Remove the duplicate `:root` definitions from `index.css` and rely solely on `main.scss` (or vice versa, but `main.scss` is more powerful for sovereignty).
