/**
 * BuildSafety.validator.js
 * Rule-BUILD: Detects errors that break npm run build
 */

export function validate(filePath, content) {
    const violations = [];

    if (filePath.endsWith('.json')) {
        try {
            JSON.parse(content);
        } catch (e) {
            const lineMatch = e.message.match(/line (\d+)/i);
            const line = lineMatch ? lineMatch[1] : '?';
            violations.push({
                rule: 'BuildSafety (Rule-BUILD)',
                severity: 'CRITICAL',
                message: `JSON syntax error on line ${line}: ${e.message}`,
                suggestion: 'Fix JSON syntax. Common cause: trailing comma before } or ]'
            });
        }
        return violations;
    }

    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
        return violations;
    }

    const open = (content.match(/\{/g) || []).length;
    const close = (content.match(/\}/g) || []).length;

    if (open !== close) {
        violations.push({
            rule: 'BuildSafety (Rule-BUILD)',
            severity: 'CRITICAL',
            message: `Unbalanced braces: ${open} opening vs ${close} closing. File will not compile.`,
            suggestion: `Find and close the missing }. Check the last function in the file.`
        });
    }

    const lines = content.split('\n');
    lines.forEach((line, i) => {
        if (/,\s*[\}\]]/.test(line)) {
            violations.push({
                rule: 'BuildSafety (Rule-BUILD)',
                severity: 'WARNING',
                message: `Trailing comma on line ${i + 1}: "${line.trim().substring(0, 40)}"`,
                suggestion: `Remove trailing comma before } or ]`
            });
        }
    });

    return violations;
}
