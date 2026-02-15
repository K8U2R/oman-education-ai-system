# Sovereign Radar (Audit Tool)

The **Sovereign Radar** is an automated audit tool designed to enforce the "Sovereign Governance Laws" (The Constitution) of the Oman Education AI System project. It acts as a static analysis tool to detect architectural, linguistic, and code quality violations.

## 🛡️ The Constitution (Enforced Rules)

The tool enforces the following 4 core rules:

1.  **StructureScanner** (Rule: Sovereign Structure)
    *   Ensures every component folder contains:
        *   `[Module].tsx`
        *   `[Module].module.scss`
        *   `[Module].index.ts`

2.  **AccumulationDetector** (Rule 13: Complexity Limit)
    *   Flags any `.tsx` file exceeding **100 lines** of code (proxy for JSX accumulation).
    *   Severity: **CRITICAL**

3.  **LinguisticGuardian** (Rule 8: Sovereignty of Language)
    *   Ensures `useTranslation` hook is used.
    *   Detects hardcoded text strings in JSX that are not wrapped in `t()`.
    *   **Strict Arabic Detection**: Any Arabic text found outside `t()` is flagged as **CRITICAL**.
    *   Severity: **CRITICAL** / **WARNING**

4.  **DirectionalValidator** (Rule 6 & 11: RTL Support)
    *   Scans `.scss` files for banned physical directional words (`left`, `right`).
    *   **Strict Mode**: Flags these words anywhere in the file (including comments) to ensure absolute purity.
    *   Suggests logical property replacements (`inline-start`, `inline-end`, etc.).
    *   Severity: **CRITICAL**

## 🚀 Usage

### Run strict audit on default path (`apps/frontend/src/presentation/pages`)
```bash
npm run audit:sovereign
```

### Run audit on a specific directory
```bash
node scripts/sovereign-radar/SovereignRadar.index.js <path-to-directory>
```

## 📊 Output

The tool outputs a table of violations with the following columns:
*   **File**: Path to the violating file.
*   **Rule**: The specific rule violated.
*   **Severity**: Criticality of the violation.
*   **Message**: Description of the issue.
*   **Fix**: Suggested corrective action.

If violations are found, the script exits with code 1.

## 🛠️ Development

Valdiators are located in `scripts/sovereign-radar/core/`:
- `Structure.scanner.js`
- `Accumulation.detector.js`
- `Linguistic.guardian.js`
- `Directional.validator.js`

To add new rules, create a new validator in `core/` and register it in `SovereignRadar.index.js`.
