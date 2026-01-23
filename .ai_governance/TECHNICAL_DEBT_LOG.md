# Sovereign Governance: TECHNICAL_DEBT_LOG.md

| Date | Task ID | Debt Description | Resolution Plan | Status |
|------|---------|------------------|-----------------|--------|
| 2026-01-21 | SYS-05 | **Legacy Themes (214+ Hex Violations)** - `themes/` folder contained hardcoded Hex colors that bypassed OKLCH token system and broke dark mode responsiveness. | Mark as DEPRECATED. Create MIGRATION_GUIDE.md. Ensure all active components use `_tokens.scss` exclusively. | ✅ **REMOVED** |
| 2026-01-21 | - | Modal & LoadingOverlay may reference legacy theme variables causing dark mode inconsistency. | Audit component imports, remove any `@use 'themes/'` references, enforce `var(--color-*)` from tokens only. | ✅ Complete |
| 2026-01-21 | SYS-06 | **Missing DB Scripts** - `scripts/backend/database/{init,migrate,seed,reset}.ts` referenced in backend package.json but don't exist. | Create stub scripts for immediate startup. Implement full DB logic in future sprint. | 🔄 Stub Created |
| 2026-01-21 | SYS-07 | **Law 10 Modularity (4 files exceed 100 lines)** - `_button.scss` (147), `_header.scss` (146), `_footer.scss` (118), `_modal.scss` (117) exceed the 100-line limit. | Acceptable for complex UI components. Future refactor to extract sub-partials if needed. | 🟢 Acceptable |
| 2026-01-21 | SYS-08 | **StyleSentinel Compliance** - Initial implementation violated Laws 6 & 11 by using Tailwind colors and having logic in component. | Extract to hook + CSS Module with OKLCH tokens. | ✅ Complete |
