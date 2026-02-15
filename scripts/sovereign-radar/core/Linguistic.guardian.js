/**
 * Linguistic.guardian.js
 * 
 * Enforces Rule 8: Sovereignty of Language.
 */

/**
 * Checks for hardcoded strings and useTranslation usage.
 * @param {string} filePath 
 * @param {string} content 
 * @returns {object[]} - Array of violations
 */
export function guard(filePath, content) {
    if (!filePath.endsWith('.tsx')) return [];

    const violations = [];
    const reportedLines = new Set();

    // Check 1: Must use useTranslation hook
    if (!content.includes('useTranslation')) {
        violations.push({
            rule: 'LinguisticGuardian',
            severity: 'WARNING',
            message: `Component does not import/use 'useTranslation'.`,
            suggestion: `Import useTranslation from 'react-i18next' and use it for text.`
        });
    }

    // Check 2: Hardcoded text in JSX (Arabic & Generic)
    const hardcodedRegex = />([^<>{}\n]+)</g;
    let match;
    while ((match = hardcodedRegex.exec(content)) !== null) {
        const text = match[1].trim();
        if (text.length > 1 && !/^\s*$/.test(text)) {
            if (/[\u0600-\u06FF]/.test(text)) {
                violations.push({
                    rule: 'LinguisticGuardian',
                    severity: 'CRITICAL',
                    message: `Hardcoded ARABIC text detected: "${text.substring(0, 20)}..."`,
                    suggestion: `Wrap text in t('key') function.`
                });
            } else {
                violations.push({
                    rule: 'LinguisticGuardian',
                    severity: 'CRITICAL',
                    message: `Potential hardcoded text detected: "${text.substring(0, 20)}..."`,
                    suggestion: `Wrap text in t('key') function.`
                });
            }
        }
    }

    // Check 3: Arabic in attributes/variables (outside JSX text nodes)
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        if (/[\u0600-\u06FF]/.test(line) && !reportedLines.has(i)) {
            reportedLines.add(i);
            if (!line.includes('t(') && !line.includes('<Trans')) {
                if (!line.includes('>') || !line.includes('<')) {
                    violations.push({
                        rule: 'LinguisticGuardian',
                        severity: 'CRITICAL',
                        message: `Arabic text detected on line ${i + 1}: "${line.trim().substring(0, 20)}..."`,
                        suggestion: `Move to translation file and use t().`
                    });
                }
            }
        }
    });

    return violations;
}