# Plan: Sovereign Compliance Execution

## Strategy
We will tackle components in "Clusters" to maintain build stability.

### 1. The Foundation Cluster (Layouts) [HIGH PRIORITY]
*Focus: Shell, Sidebar, Header.*
These components frame the application. Ensuring they are Fluid and RTL-ready is critical for the overall effect.
- **Action:** Audit `Sidebar` and `Header` modules. Replace any `px` with liquid variables. Ensure `margin-inline-start` etc. are used.

### 2. The Critical Features Cluster (Auth & AI)
*Focus: Login, Register, AI Chat.*
These are high-traffic areas.
- **Action:** Create missing `.module.scss` files. Move logic-bound styles to these files. Extract text to i18n.

### 3. The Data Cluster (Dashboard & Tables)
*Focus: Charts, Tables, Cards.*
- **Action:** Standardize card padding and gaps using Fluid Gaps (`$gap-fluid-*`).

### 4. The Global Scrub
- **Action:** Run a final regex pass for `\d+px` and `>[^<]+<` (hardcoded text) to catch remainders.

## Definition of Done
- NO `.tsx` file exists without a `.scss` partner (unless it's a pure logic wrapper).
- NO `px` values in source code (except 1px borders or external libs).
- NO hardcoded UI text.
- Full RTL/LTR switching support without layout breakage.
