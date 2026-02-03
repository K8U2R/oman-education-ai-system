# 🚫 BLACKLIST / INTEGRITY CHECKS

This registry lists files, patterns, or directories that vary from the **Truth** defined in `README.md`.

## Integrity Check Standard
1. **Pattern/File:** What is forbidden?
2. **Violation Type:** Why is it bad?
3. **Reference Law:** Which Law supports this ban?
4. **Technical Explanation:** Engineering context.

## 🛑 Prohibited Patterns
| Pattern | Violation Type | Reference Law | Technical Explanation |
|---|---|---|---|
| `role === 'teacher'` | Architectural | `LAW-10` | The 'teacher' role is deprecated. AI is the sole educator (See README). |
| `document.body.classList.add` | Architecture | `LAW-14` | Direct DOM manipulation for Tiers violates Plan Sovereignty. Use State. |
| `console.log` (in production) | Security | `LAW-08` | Information Leakage. |
| `any` (in routing) | Type Safety | `LAW-02` | Bypasses Type Safety checks. |
