# 049 - Sovereign Governance Compliance Initiative

## 🎯 Objective
Enforce the "Sovereign Rules of Design" and "Language Sovereignty" protocols across the entire `apps/frontend` codebase. This initiative aims to eliminate architectural entropy, ensure full Arabization/Localization support, and standardize the styling architecture.

## 📜 Governing Laws (Reference: `.ai_governance/SOVEREIGN_RULES.md`)
1.  **Encapsulation Law:** Every `.tsx` component MUST have a corresponding `.scss` (or `.module.scss`) file in the same directory.
2.  **Liquid Standards:** NO static pixels (`px`). Use `rem` and `clamp()` via `_liquid-variables.scss`.
3.  **Binding Protocol:** Explicit import of styles in logic files.
4.  **Language Sovereignty:** NO hardcoded strings. Use `t()` and centralized JSON dictionaries.
5.  **Translation Pathing:** Arabic/English JSON files must be mirrored.
6.  **Directional Flow:** Logical properties (`padding-inline-start`) instead of physical ones (`padding-left`).

## 🚫 Current Violations Detected (Summary)
- **Missing Styling Files:** Many components (e.g., `AIAssistantPanel`, `QuizInterface`) rely on global Tailwind or mixed styles without a dedicated SCSS file.
- **Hardcoded Units:** Widespread use of `px` in existing SCSS and potential Tailwind arbitrary values.
- **Physical Layouts:** Use of `left`/`right`, `ml-`, `mr-` limiting RTL support.
- **Hardcoded Text:** UI strings are directly embedded in `.tsx` files rather than using i18n.

## 🛠️ Execution Strategy
The work will be executed in **Phases** to ensure stability while refactoring.
Refactoring will target the `apps/frontend/src/presentation` directory, specifically `components`, `layouts`, and `pages`.
